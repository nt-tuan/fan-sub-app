import React from "react";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface IStore {
  currentTime: number;
  endTime?: number;
  videoRef?: React.RefObject<HTMLVideoElement>;

  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  increase: (miliseconds: number) => void;
  setCurrentTime: (miliseconds: number) => void;
  setEndTime: (miliseconds: number) => void;

  goTo: (miliseconds: number) => void;
}

export const useVideoPlayerStore = create(
  subscribeWithSelector<IStore>((set, get) => ({
    currentTime: 0,
    endTime: undefined,
    setVideoRef: (videoRef?: React.RefObject<HTMLVideoElement>) => {
      set({ videoRef });
    },
    setEndTime: (miliseconds: number) => {
      set({ endTime: miliseconds });
    },
    setCurrentTime: (miliseconds: number) => {
      set({ currentTime: miliseconds });
    },
    goTo: (miliseconds) => {
      const videoRef = get().videoRef;
      if (videoRef?.current == null) {
        return;
      }
      videoRef.current.currentTime = Math.ceil(miliseconds / 1000);
      set({ currentTime: miliseconds });
    },
    increase: (miliseconds: number) =>
      set((state) => ({ currentTime: state.currentTime + miliseconds })),
  }))
);

export const useVideoPlayerSubcribe = <T>(
  selector: (state: IStore) => T,
  callback: (state: T) => void
) => {
  React.useEffect(() => {
    const unsub = useVideoPlayerStore.subscribe(selector, callback);
    return () => {
      unsub();
    };
  }, [selector, callback]);
};
