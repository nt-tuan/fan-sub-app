import { useVideoPlayerStore, useVideoStore } from "@/store";

import React from "react";
import { VideoSubtitleDisplayer } from "./video-subtitle-displayer";
import styles from "./video-player.module.scss";

const VideoPlayer = () => {
  const { isLoading, videoUrl, subtitleData } = useVideoStore();
  if (isLoading || videoUrl == null || subtitleData == null) return null;
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

  const refUpdateTimer = React.useRef<NodeJS.Timer>();
  const handlePlay = () => {
    refUpdateTimer.current = setInterval(() => {
      const currentTimeInMiliseconds = (ref.current?.currentTime ?? 0) * 1000;
      setCurrentTime(currentTimeInMiliseconds);
    }, 40);
  };
  const handlePause = () => {
    clearInterval(refUpdateTimer.current);
  };

  return (
    <div className={styles.player_container}>
      <div className={styles.video_container}>
        <video
          onPlay={handlePlay}
          onPause={handlePause}
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
export default VideoPlayer;
