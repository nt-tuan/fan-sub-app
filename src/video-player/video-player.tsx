import React from "react";
import styles from "./video-player.module.scss";
import { useVideo } from "./use-video";
import { useVideoSubStore } from "@/store";

const VideoPlayerContent = ({ videoUrl }: { videoUrl: string }) => {
  const { setCurrentTime, setEndTime } = useVideoSubStore();
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    let el = ref.current;
    if (el == null) return;
    const updateCurrentTime = (e: any) => {
      if (typeof e.target.currentTime === "number")
        setCurrentTime(e.target.currentTime * 1000);
    };
    const updateEndTime = (e: any) => {
      if (typeof e.target.duration === "number")
        setEndTime(e.target.duration * 1000);
    };

    el.addEventListener("timeupdate", updateCurrentTime);
    el.addEventListener("canplay", updateEndTime);
    return () => {
      if (!el) return;
      el.removeEventListener("timeupdate", updateCurrentTime);
      el.removeEventListener("endTime", updateEndTime);
    };
  }, [setCurrentTime, setEndTime]);

  return (
    <div className={styles.player_container}>
      <div className={styles.video_container}>
        <video ref={ref} className={styles.video} controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className={styles.subtitle_container}>here is subtitle</div>
    </div>
  );
};

export const VideoPlayer = () => {
  const { data } = useVideo();

  if (data?.videoUrl == null) return null;

  return <VideoPlayerContent videoUrl={data.videoUrl} />;
};
