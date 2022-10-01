import { createStore } from "zustand";
import { SubtitleStore } from "./subtitle-store";

import { SubtitleBlock } from "./video-store";

interface SubtitleEditorStoreState {
  srcLang?: string;
  dstLang?: string;
  subtitleData?: Record<string, SubtitleBlock[]>;
  editingSubtitles?: SubtitleBlock[];
  editingBlock?: SubtitleBlock;
  subtitleStore: SubtitleStore;
}

interface SubtitleEditorAction {
  setSrcLang: (lang: string) => void;
  setDstLang: (lang: string) => void;

  setSubtitleData: (data: Record<string, SubtitleBlock[]>) => void;
  setSubtitles: (subtitles: SubtitleBlock[]) => void;
  setEditingBlock: (block?: SubtitleBlock) => void;

  createSubtitle: (at: number) => number | undefined;
  deleteSubtitle: (at: number) => void;
}

export type SubtitleEditorStore = SubtitleEditorStoreState &
  SubtitleEditorAction;

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

export const createSubtitleEditorStore = (
  subtitleData: Record<string, SubtitleBlock[]>,
  subtitleStore: SubtitleStore
) =>
  createStore<SubtitleEditorStore>((set, get) => ({
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
      const to = at + 500;
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
  }));
