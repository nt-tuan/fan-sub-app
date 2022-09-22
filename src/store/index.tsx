import create from "zustand";

interface IStore {
  currentTime: number;
  increase: (miliseconds: number) => void;
}

export const useVideoSubStore = create<IStore>((set) => ({
  currentTime: 0,
  increase: (miliseconds: number) =>
    set((state) => ({ currentTime: state.currentTime + miliseconds })),
}));
