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
  }));
