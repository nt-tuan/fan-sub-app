import {
  useSubtitleEditor,
  useSubtitleEditorStore,
} from "@/video-sub/components/provider";
// import { useState } from "react";
// import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import { useVideoPlayerStore } from "@/store/video-player-store";

import { SubtitleBlock } from "@/store";

const useTimelineEditor = () => {
  const [srcLang, dstLang] = useSubtitleEditorStore((state) => [
    state.srcLang,
    state.dstLang,
  ]);
  const [editingSubtitles, setEditingSubtitles] = useSubtitleEditorStore(
    (state) => [state.editingSubtitles, state.setSubtitles]
  );

  const { unfocus } = useSubtitleEditor();
  const goTo = useVideoPlayerStore((state) => state.goTo);
  // const videoRef = useVideoPlayerStore((state) => state.videoRef);

  const focus = (segment: SubtitleBlock) => {
    goTo(segment.from);
  };

  const updateSubtitle = (index: number, segment: SubtitleBlock) => {
    const subtitles = editingSubtitles;
    if (subtitles == null) return;
    const newSubtitles = [...subtitles.map((item) => ({ ...item }))];
    newSubtitles[index].from = segment.from;
    newSubtitles[index].to = segment.to;
    // console.log("newSubtitles  :", index, segment);
    setEditingSubtitles(newSubtitles);
  };

  return { editingSubtitles, updateSubtitle, focus, unfocus };
};

export default useTimelineEditor;
