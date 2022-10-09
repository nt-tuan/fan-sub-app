import React from "react";
import { StoreApi, createStore, useStore } from "zustand";

import {
  SubtitleBlock,
  SubtitleEditorStore,
  VideoPlayerStore,
  createSubtitleEditorStore,
  createVideoStore,
  videoStoreService,
} from "@/store";
import { createVideoPlayerSlice } from "@/store/video-player-store";

const SubtitleEditorContext = React.createContext<{
  store: StoreApi<SubtitleEditorStore>;
  videoStoreService: StoreApi<videoStoreService>;
  videoPlayerStore: StoreApi<VideoPlayerStore>;
}>({} as never);

const VIDEO_URL = "/video/data.json";

const VideoSubProvider = ({ children }: { children: React.ReactNode }) => {
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
      value={{ store, videoStoreService, videoPlayerStore }}
    >
      {children}
    </SubtitleEditorContext.Provider>
  );
};

export const useVideoStoreService = () => {
  const { videoStoreService } = React.useContext(SubtitleEditorContext);
  return useStore(videoStoreService);
};

export const useVideoPlayerStore = () => {
  const { videoPlayerStore, store } = React.useContext(SubtitleEditorContext);
  const editingBlock = useStore(store, (state) => state.editingBlock);
  const videoPlayer = useStore(videoPlayerStore);
  const enhanceSetCurrentTime = (miliseconds: number) => {
    const nextMiliseconds = miliseconds + 250;
    if (editingBlock && editingBlock.to < nextMiliseconds) {
      videoPlayer.videoRef?.current?.pause();
      return;
    }
    videoPlayer.setCurrentTime(miliseconds);
  };
  return { ...videoPlayer, setCurrentTime: enhanceSetCurrentTime };
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
    console.log("begin save", position);
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

  const findBlankIndex = () => {
    if (editingSubtitles == null) return;
    const index = editingSubtitles?.findIndex((sub) => !sub.text);
    if (index != null && index >= 0) {
      setEditingBlock(editingSubtitles[index]);
      goTo((editingSubtitles[index].from + editingSubtitles[index].to) / 2);
    }
    return index;
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
    setEditingBlock,
    saveSubtitle,
    saveCurrentSubtitlePosition,
    saveSubtitles,
    cancelSubtitle,
    findBlankIndex,
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
