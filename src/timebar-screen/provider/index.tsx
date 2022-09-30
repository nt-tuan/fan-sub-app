import {
  useSubtitleEditor,
  useSubtitleEditorStore,
} from "@/video-sub/components/provider";

import { SubtitleBlock } from "@/store";

export const useTimelineEditor = () => {
  const [editingBlock, setEditingBlock] = useSubtitleEditorStore((state) => [
    state.editingBlock,
    state.setEditingBlock,
  ]);
  const { editingSubtitles = [], focus, unfocus } = useSubtitleEditor();

  const isActiveSubtitle = (block: SubtitleBlock) => {
    if (editingBlock) return editingBlock.from === block.from;
    return false;
  };

  return { isActiveSubtitle, editingSubtitles, focus, unfocus };
};
