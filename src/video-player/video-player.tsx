import { useVideo } from "./use-video";
import styles from "./video-player.module.scss";

export const VideoPlayer = () => {
  const { data } = useVideo();
  if (data?.videoUrl == null) return null;
  return (
    <div className={styles.player_container}>
      <div className={styles.video_container}>
        <video className={styles.video} controls>
          <source src={data.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className={styles.subtitle_container}>here is subtitle</div>
    </div>
  );
};
