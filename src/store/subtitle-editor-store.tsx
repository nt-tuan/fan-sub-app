import { MINIMUM_BLOCK_SIZE } from "@/timebar-screen/constant";
import { createStore, StateCreator } from "zustand";
import { SubtitleBlock, SubtitleEditorStore, SubtitleStore } from "./model";

const defaultDstLang = "vi";
const getDefaultEditingSubtitle = (
  subtitleData: Record<string, SubtitleBlock[]>
) => {
  return Object.values(subtitleData)?.[0]?.map(({ from, to }) => ({
    from,
    to,
    text: "",
  }));
};

const findCreatableSubtitle = (
  currentTime: number,
  subtitles: SubtitleBlock[]
) => {
  if (subtitles.length === 0) return 0;
  if (subtitles[0].from > currentTime) return 0;
  for (let i = 1; i < subtitles.length; i++) {
    const prv = subtitles[i - 1];
    const nxt = subtitles[i];
    if (prv.to < currentTime && nxt.from > currentTime) return i;
  }
  return -1;
};

export const createSubtitleEditorCreator = (
  subtitleData: Record<string, SubtitleBlock[]>,
  subtitleStore: SubtitleStore
) => {
  const stateCreator: StateCreator<SubtitleEditorStore> = (set, get) => ({
    srcLang: Object.keys(subtitleData)?.[0],
    subtitleStore,
    dstLang: defaultDstLang,
    subtitleData,
    editingSubtitles:
      subtitleData[defaultDstLang] ?? getDefaultEditingSubtitle(subtitleData),
    setSubtitleData: (subtitleData: Record<string, SubtitleBlock[]>) => {
      set({ subtitleData });
    },
    setSrcLang: (srcLang) => {
      set({ srcLang });
    },
    setDstLang: (dstLang) => {
      const subtitleData = get().subtitleData;
      if (subtitleData == null) return;
      const editingSubtitles =
        subtitleData[dstLang] ?? getDefaultEditingSubtitle(subtitleData);
      set({ dstLang, editingSubtitles });
    },
    setSubtitles: (editingSubtitles: SubtitleBlock[]) => {
      set({ editingSubtitles });
    },
    setEditingBlock: (editingBlock) => {
      set({ editingBlock });
    },
    deleteSubtitle: (index: number) => {
      const editingSubtitles = get().editingSubtitles;
      if (editingSubtitles == null) return;
      set({
        editingSubtitles: editingSubtitles.filter((_, i) => i !== index),
      });
    },
    createSubtitle: (at: number) => {
      const editingSubtitles = get().editingSubtitles;
      if (editingSubtitles == null) return;
      const index = findCreatableSubtitle(at, editingSubtitles);

      if (index < 0) return;
      const from = at;
      const to = at + MINIMUM_BLOCK_SIZE;
      if (
        index < editingSubtitles.length - 1 &&
        to >= editingSubtitles[index + 1].from
      ) {
        return;
      }

      const left = editingSubtitles.slice(0, index);
      const right = editingSubtitles.slice(index, editingSubtitles.length);
      set({
        editingSubtitles: [
          ...left,
          {
            from,
            to,
            text: "",
          },
          ...right,
        ],
      });
      return index;
    },
  });
  return stateCreator;
};

export const createSubtitleEditorStore = (
  subtitleData: Record<string, SubtitleBlock[]>,
  subtitleStore: SubtitleStore
) => {
  const stateCreator = createSubtitleEditorCreator(subtitleData, subtitleStore);
  return createStore(stateCreator);
};
