import { StateCreator } from "zustand";
import { VideoStore } from "./model";
import { createSubtitleStore } from "./subtitle-store";

export const createVideoStore: StateCreator<VideoStore> = (set) => ({
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
});
