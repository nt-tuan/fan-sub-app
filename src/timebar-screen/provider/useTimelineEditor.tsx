import {
  useSubtitleEditor,
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "@/video-sub/components/provider";
import { SubtitleBlock } from "@/store";

const useTimelineEditor = () => {
  const [editingSubtitles, setEditingSubtitles] = useSubtitleEditorStore(
    (state) => [state.editingSubtitles, state.setSubtitles]
  );

  const { unfocus } = useSubtitleEditor();
  const { goTo } = useVideoPlayerStore();

  const focus = (segment: SubtitleBlock) => {
    goTo(segment.from);
  };

  const updateSubtitle = (index: number, segment: SubtitleBlock) => {
    const subtitlesTemp = editingSubtitles;
    if (subtitlesTemp == null) return;
    const newSubtitles = [...subtitlesTemp.map((item) => ({ ...item }))];
    newSubtitles[index].from = segment.from;
    newSubtitles[index].to = segment.to;
    setEditingSubtitles(newSubtitles);
  };

  return { editingSubtitles, updateSubtitle, focus, unfocus };
};

export default useTimelineEditor;
