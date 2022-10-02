import React from "react";
import { StateCreator } from "zustand";
import { VideoPlayerStore } from "./model";

export const createVideoPlayerSlice: StateCreator<VideoPlayerStore> = (
  set,
  get
) => ({
  currentTime: 0,
  endTime: undefined,
  setVideoRef: (videoRef?: React.RefObject<HTMLVideoElement>) => {
    if (videoRef?.current)
      videoRef.current.currentTime = get().currentTime / 1000;
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
    videoRef.current.currentTime = miliseconds / 1000;
    set({ currentTime: miliseconds });
  },
  increase: (miliseconds: number) =>
    set((state) => ({ currentTime: state.currentTime + miliseconds })),
});
