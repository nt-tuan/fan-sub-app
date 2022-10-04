import React from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { createVideoPlayerSlice } from "@/store/video-player-store";

import {
  SubtitleBlock,
  createSubtitleEditorStore,
  SubtitleEditorStore,
  createVideoStore,
  VideoStore,
  VideoPlayerStore,
} from "@/store";

const SubtitleEditorContext = React.createContext<{
  store: StoreApi<SubtitleEditorStore>;
  videoStore: StoreApi<VideoStore>;
  videoPlayerStore: StoreApi<VideoPlayerStore>;
}>({} as never);

const VIDEO_URL = "/video/data.json";

const VideoSubProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoStore] = React.useState(createStore(createVideoStore));
  const [videoPlayerStore] = React.useState(
    createStore(createVideoPlayerSlice)
  );
  const { loadData, subtitleData, subtitleStore } = useStore(videoStore);

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
      value={{ store, videoStore, videoPlayerStore }}
    >
      {children}
    </SubtitleEditorContext.Provider>
  );
};

export const useVideoStore = () => {
  const { videoStore } = React.useContext(SubtitleEditorContext);
  return useStore(videoStore);
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
      if (sub.from <= currentTime && currentTime < sub.to) {
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
    await subtitleStore.save(dstLang, nextSubtitles);
    const nextData = await subtitleStore.get();
    setSubtitleData(nextData);
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

  return {
    changeSubtitleText,
    isActiveSubtitle,
    focus,
    unfocus,
    refSubtitles,
    editingSubtitles,
    getCurrentSubtitleByTime,
    getDefaultSubtitleText,
    saveSubtitle,
    cancelSubtitle,
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
