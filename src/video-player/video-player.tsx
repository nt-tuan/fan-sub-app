import { useVideoPlayerStore, useVideoStore } from "@/store";
import React from "react";

import styles from "./video-player.module.scss";
import { VideoSubtitleDisplayer } from "./video-subtitle-displayer";

export const VideoPlayer = () => {
  const { isLoading, loadData, videoUrl } = useVideoStore();
  React.useEffect(() => {
    loadData();
  }, [loadData]);
  if (isLoading || videoUrl == null) return null;
  return <VideoPlayerContent videoUrl={videoUrl} />;
};
const VideoPlayerContent = ({ videoUrl }: { videoUrl: string }) => {
  const { setCurrentTime, setEndTime, setVideoRef } = useVideoPlayerStore();

  const ref = React.useRef<HTMLVideoElement>(null);

  const handleTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    setCurrentTime(e.currentTarget.currentTime * 1000);
  };
  const handleCanPlay: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    setEndTime(e.currentTarget.duration * 1000);
  };

  React.useEffect(() => {
    setVideoRef(ref);
  }, [setVideoRef]);

  return (
    <div className={styles.player_container}>
      <div className={styles.video_container}>
        <video
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          ref={ref}
          className={styles.video}
          controls
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <VideoSubtitleDisplayer />
    </div>
  );
};
