import create from "zustand";
import { createSubtitleStore } from "./subtitle-store";

export interface SubtitleBlock {
  from: number;
  to: number;
  text?: string;
}

interface IState {
  isLoading: boolean;
  videoUrl?: string;
  subtitleData?: Record<string, SubtitleBlock[]>;
  subtitleStore?: {
    get: () => Promise<Record<string, SubtitleBlock[]>>;
    save: (lang: string, blocks: SubtitleBlock[]) => Promise<void>;
  };
}

interface IStore extends IState {
  loadData: (videoUrl: string) => Promise<void>;
}

export const useVideoStore = create<IStore>((set, get) => ({
  isLoading: false,
  loadData: async (videoId: string) => {
    try {
      const subtitleStore = createSubtitleStore(videoId);
      const meta = await subtitleStore.getVideoMeta();
      set({
        isLoading: true,
        videoUrl: meta.videoUrl,
        subtitleStore,
      });
      const subtitleData = await subtitleStore.get();
      set({
        subtitleData,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
