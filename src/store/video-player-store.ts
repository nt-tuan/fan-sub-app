import create from "zustand";

interface IStore {
  currentTime: number;
  endTime?: number;
  increase: (miliseconds: number) => void;
  setCurrentTime: (miliseconds: number) => void;
  setEndTime: (miliseconds: number) => void;
}

export const useVideoPlayerStore = create<IStore>((set) => ({
  currentTime: 0,
  endTime: undefined,
  setEndTime: (miliseconds: number) => {
    set({ endTime: miliseconds });
  },
  setCurrentTime: (miliseconds: number) => {
    set({ currentTime: miliseconds });
  },
  increase: (miliseconds: number) =>
    set((state) => ({ currentTime: state.currentTime + miliseconds })),
}));
