import { useVideoPlayerStore, useVideoStore } from "@/store";
import React from "react";

import styles from "./video-player.module.scss";

export const VideoSubtitleDisplayer = () => {
  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const getCurrentSubtitle = useVideoStore((state) => state.getCurrentSubtitle);

  const currentSub = React.useMemo(() => {
    return getCurrentSubtitle(currentTime)?.text;
  }, [currentTime, getCurrentSubtitle]);

  if (currentSub == null) return null;
  return (
    <div className={styles.subtitle_container}>
      <div className={styles.subtitle_text}>{currentSub}</div>
    </div>
  );
};
