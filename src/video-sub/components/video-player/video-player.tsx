import React from "react";
import { VideoSubtitleDisplayer } from "./video-subtitle-displayer";
import styles from "./video-player.module.scss";
import { useVideoPlayerStore, useVideoStore } from "../provider";

interface Props {
  onPlay?: () => void;
}
const VideoPlayer = (props: Props) => {
  const { isLoading, videoUrl, subtitleData } = useVideoStore();
  if (isLoading || videoUrl == null || subtitleData == null) return null;
  return <VideoPlayerContent videoUrl={videoUrl} {...props} />;
};

const VideoPlayerContent = ({
  videoUrl,
  onPlay,
}: { videoUrl: string } & Props) => {
  const { setCurrentTime, setEndTime, setVideoRef } = useVideoPlayerStore();

  const ref = React.useRef<HTMLVideoElement>(null);

  const handleTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    setCurrentTime(e.currentTarget.currentTime * 1000);
  };
  const handleCanPlay: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    setEndTime(e.currentTarget.duration * 1000);
  };

  const refUpdateTimer = React.useRef<NodeJS.Timer>();
  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    }
    refUpdateTimer.current = setInterval(() => {
      const currentTimeInMiliseconds = (ref.current?.currentTime ?? 0) * 1000;
      setCurrentTime(currentTimeInMiliseconds);
    }, 40);
  };
  const handlePause = () => {
    clearInterval(refUpdateTimer.current);
  };

  React.useEffect(() => {
    setVideoRef(ref);
  }, [setVideoRef]);

  React.useEffect(() => {
    return () => {
      clearInterval(refUpdateTimer.current);
    };
  }, []);

  return (
    <div className={styles.player_container}>
      <div className={styles.video_container}>
        <video
          data-setup='{ "inactivityTimeout": 0 }'
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
