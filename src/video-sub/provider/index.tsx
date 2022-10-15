import React from "react";
import { StoreApi, createStore, useStore } from "zustand";

import {
  AppStoreInterface,
  SubtitleBlock,
  SubtitleEditorStore,
  VideoPlayerStore,
  createAppStore,
  createSubtitleEditorStore,
  createVideoStore,
  videoStoreService,
} from "@/store";
import { createVideoPlayerSlice } from "@/store/video-player-store";
import { replaceText } from "@/utils/format";

const SubtitleEditorContext = React.createContext<{
  store: StoreApi<SubtitleEditorStore>;
  videoStoreService: StoreApi<videoStoreService>;
  videoPlayerStore: StoreApi<VideoPlayerStore>;
  appStore: StoreApi<AppStoreInterface>;
}>({} as never);

const VIDEO_URL = "/video/data.json";

const VideoSubProvider = ({ children }: { children: React.ReactNode }) => {
  const [appStore] = React.useState(createStore(createAppStore));
  const [videoStoreService] = React.useState(createStore(createVideoStore));
  const [videoPlayerStore] = React.useState(
    createStore(createVideoPlayerSlice)
  );

  const { loadData, subtitleData, subtitleStore } = useStore(videoStoreService);

  const store = React.useMemo(() => {
    if (subtitleData == null || subtitleStore == null) return null;
    return createSubtitleEditorStore(subtitleData, subtitleStore);
  }, [subtitleData, subtitleStore]);

  React.useEffect(() => {
    loadData(VIDEO_URL);
  }, [loadData]);

  if (store == null) return null;
  return (
    <SubtitleEditorContext.Provider
      value={{ appStore, store, videoStoreService, videoPlayerStore }}
    >
      {children}
    </SubtitleEditorContext.Provider>
  );
};

export const useAppStoreService = () => {
  const { appStore } = React.useContext(SubtitleEditorContext);
  return useStore(appStore);
};

export const useVideoStoreService = () => {
  const { videoStoreService } = React.useContext(SubtitleEditorContext);
  return useStore(videoStoreService);
};

export const useVideoPlayerStore = () => {
  const { videoPlayerStore, store } = React.useContext(SubtitleEditorContext);
  const editingBlock = useStore(store, (state) => state.editingBlock);
  const shouldPauseAtEditingBlock = useStore(
    store,
    (state) => state.shouldPauseAtEditingBlock
  );
  const videoPlayer = useStore(videoPlayerStore);
  const enhanceSetCurrentTime = (miliseconds: number) => {
    const nextMiliseconds = miliseconds + 250;
    if (
      editingBlock &&
      editingBlock.to < nextMiliseconds &&
      shouldPauseAtEditingBlock
    ) {
      videoPlayer.videoRef?.current?.pause();
      return;
    }
    videoPlayer.setCurrentTime(miliseconds);
  };
  return {
    ...videoPlayer,
    setCurrentTime: enhanceSetCurrentTime,
  };
};

export const useSubtitleEditorStore = <U extends unknown>(
  selector: (state: SubtitleEditorStore) => U
) => {
  const { store } = React.useContext(SubtitleEditorContext);
  return useStore(store, selector);
};

const isCurrentSubtitleBlock = (sub: SubtitleBlock, currentTime: number) => {
  return sub.from <= currentTime && currentTime < sub.to;
};

export const useSubtitleEditor = () => {
  const { isModalOpen, setOpenModal } = useAppStoreService();
  const subtitleStore = useSubtitleEditorStore((state) => state.subtitleStore);
  const [subtitleData, setSubtitleData] = useSubtitleEditorStore((state) => [
    state.subtitleData,
    state.setSubtitleData,
  ]);

  const { currentTime, videoRef, goTo } = useVideoPlayerStore();
  const [srcLang, dstLang] = useSubtitleEditorStore((state) => [
    state.srcLang,
    state.dstLang,
  ]);

  const [editingBlock, setEditingBlock] = useSubtitleEditorStore((state) => [
    state.editingBlock,
    state.setEditingBlock,
  ]);

  const setShouldPauseAtEditingBlock = useSubtitleEditorStore(
    (state) => state.setShouldPauseAtEditingBlock
  );

  const findBlockIndex = (block: SubtitleBlock) => {
    if (editingSubtitles == null) return;
    for (let i = 0; i < editingSubtitles.length; i++) {
      if (block.from === editingSubtitles[i].from) return i;
      if (block.to < editingSubtitles[i].from) return undefined;
    }
  };

  const setSubtitles = useSubtitleEditorStore((state) => state.setSubtitles);
  const [editingSubtitles, setEditingSubtitles] = useSubtitleEditorStore(
    (state) => [state.editingSubtitles, state.setSubtitles]
  );

  const refSubtitles = React.useMemo(() => {
    if (subtitleData == null || srcLang == null) return undefined;
    return subtitleData[srcLang];
  }, [subtitleData, srcLang]);

  const getCurrentSubtitleByTime = React.useCallback(() => {
    if (editingSubtitles == null) return null;
    for (const sub of editingSubtitles) {
      if (isCurrentSubtitleBlock(sub, currentTime)) {
        return sub;
      }
      if (currentTime < sub.to) {
        return null;
      }
    }
    return null;
  }, [editingSubtitles, currentTime]);

  const isActiveSubtitle = (block: SubtitleBlock) => {
    if (editingBlock) {
      return editingBlock.from === block.from;
    }
    const blockAtCurrentTime = getCurrentSubtitleByTime();
    return blockAtCurrentTime?.from === block.from;
  };

  const focus = (segment: SubtitleBlock) => {
    setEditingBlock(segment);
    goTo(segment.from);
    if (segment.from > currentTime || segment.to < currentTime)
      videoRef?.current?.play();
  };

  const changeSubtitleText = (index: number, value: string) => {
    const subtitles = editingSubtitles;
    if (subtitles == null) return;
    const newSubtitles = [...subtitles.map((item) => ({ ...item }))];
    newSubtitles[index].text = value;
    setSubtitles(newSubtitles);
  };

  const getDefaultSubtitleText = (index: number) => {
    if (subtitleData == null || dstLang == null) return "";
    return subtitleData[dstLang]?.[index]?.text ?? "";
  };

  const saveCurrentSubtitlePosition = async (position: {
    x: number;
    y: number;
  }) => {
    if (dstLang == null || editingSubtitles == null) return;
    const nextSubtitles = editingSubtitles.map((prev) => {
      if (!isCurrentSubtitleBlock(prev, currentTime)) {
        return prev;
      }
      return {
        ...prev,
        position,
      };
    });
    await saveSubtitles(nextSubtitles);
  };

  const saveSubtitles = async (nextSubtitles: SubtitleBlock[]) => {
    if (dstLang == null || nextSubtitles == null) return;
    await subtitleStore.save(dstLang, nextSubtitles);
    const nextData = await subtitleStore.get();
    setSubtitleData(nextData);
  };

  const saveSubtitle = async (index: number) => {
    const editingBlock = editingSubtitles?.[index];

    if (editingBlock == null || dstLang == null || editingSubtitles == null)
      return;

    const nextSubtitles = editingSubtitles.map((prev) => {
      if (prev.to !== editingBlock.to) {
        return prev;
      }
      return {
        ...prev,
        text: editingBlock.text,
      };
    });
    await saveSubtitles(nextSubtitles);
  };

  const cancelSubtitle = async (index: number) => {
    const editingBlock = editingSubtitles?.[index];

    if (
      editingBlock == null ||
      dstLang == null ||
      editingSubtitles == null ||
      subtitleData == null
    )
      return;

    const previousText = subtitleData[dstLang][index]?.text;
    const nextSubtitles = editingSubtitles.map((prev, currentIndex) => {
      if (currentIndex !== index) {
        return prev;
      }
      return {
        ...prev,
        text: previousText,
      };
    });

    setEditingSubtitles(nextSubtitles);
    focus(nextSubtitles[index]);
  };

  const unfocus = React.useCallback(
    () => setEditingBlock(undefined),
    [setEditingBlock]
  );

  const getIndexFromCurrentTime = () => {
    if (editingSubtitles == null) return null;
    for (let i = 0; i < editingSubtitles.length; i++) {
      if (
        editingSubtitles[i].from <= currentTime &&
        editingSubtitles[i].to > currentTime
      ) {
        return i;
      }

      if (currentTime <= editingSubtitles[i].from) {
        return i;
      }
    }
    return null;
  };

  const findBlankIndex = () => {
    const beginIndex = getIndexFromCurrentTime();
    if (beginIndex == null || editingSubtitles == null) return;
    if (beginIndex && beginIndex >= 1) {
      for (let i = beginIndex - 1; 0 <= i; i--) {
        const sub = editingSubtitles[i];
        if (!sub.text) {
          return i;
        }
      }
    }
    if (beginIndex && beginIndex <= editingSubtitles.length - 1) {
      for (let j = beginIndex + 1; j < editingSubtitles.length; j++) {
        const sub = editingSubtitles[j];
        if (!sub.text) {
          return j;
        }
      }
    }
  };

  const findSubIndexByWords = React.useCallback(
    (searchInput: string, matchCase: boolean) => {
      if (editingSubtitles == null) return [];

      const keyWord = matchCase ? searchInput : searchInput.toLowerCase();
      const rex = new RegExp(keyWord);
      // const rex = new RegExp(`\b${keyWord}\b`); // TODO
      let findOutwordsIndex: number[] = [];

      editingSubtitles.forEach((sub, index) => {
        if (sub.text) {
          const testMatch = rex.test(
            matchCase ? sub.text : sub.text?.toLowerCase()
          );
          if (testMatch) findOutwordsIndex.push(index);
        }
      });

      return findOutwordsIndex;
    },
    [editingSubtitles]
  );

  const replaceSubtitleContent = async (
    index: number,
    searchText: string,
    alternativeText: string,
    callback?: () => void
  ) => {
    const subtitles = editingSubtitles;
    if (subtitles == null) return;
    const newSubtitles = [...subtitles.map((item) => ({ ...item }))];
    newSubtitles[index].text = replaceText(
      searchText,
      alternativeText,
      newSubtitles[index].text ?? ""
    );
    setEditingSubtitles(newSubtitles);
    await saveSubtitles(newSubtitles);
    if (callback) callback();
  };

  const replaceAllSubtitleContent = async (
    subIndexFoundOut: number[],
    searchText: string,
    alternativeText: string,
    callback?: () => void
  ) => {
    if (editingSubtitles == null) return;
    const subtitles = editingSubtitles;
    const newSubtitles = [...subtitles.map((item) => ({ ...item }))];
    subIndexFoundOut.forEach((foundIndex) => {
      newSubtitles[foundIndex].text = replaceText(
        searchText,
        alternativeText,
        newSubtitles[foundIndex].text ?? ""
      );
    });
    setEditingSubtitles(newSubtitles);
    await saveSubtitles(newSubtitles);
    if (callback) callback();
  };

  const enhanceSetEditingBlock = (
    editingBlock?: SubtitleBlock,
    shouldPauseAtTheEnd: boolean = true
  ) => {
    setEditingBlock(editingBlock);
    setShouldPauseAtEditingBlock(shouldPauseAtTheEnd);
  };

  return {
    findBlockIndex,
    changeSubtitleText,
    isActiveSubtitle,
    focus,
    unfocus,
    refSubtitles,
    editingSubtitles,
    setEditingSubtitles,
    getCurrentSubtitleByTime,
    getDefaultSubtitleText,
    editingBlock,
    setEditingBlock: enhanceSetEditingBlock,
    saveSubtitle,
    saveCurrentSubtitlePosition,
    saveSubtitles,
    cancelSubtitle,
    findBlankIndex,
    findSubIndexByWords,
    replaceSubtitleContent,
    replaceAllSubtitleContent,
    setOpenModal,
    isModalOpen,
  };
};

export const useSubtitleLanguages = () => {
  return useSubtitleEditorStore((state) => ({
    srcLang: state.srcLang,
    setSrcLang: state.setSrcLang,
    dstLang: state.dstLang,
    setDstLang: state.setDstLang,
  }));
};

export default VideoSubProvider;
