import { useSubtitleEditor } from "../../provider";
import styles from "./video-player.module.scss";

export const VideoSubtitleDisplayer = () => {
  const { getCurrentSubtitleByTime } = useSubtitleEditor();
  const currentSub = getCurrentSubtitleByTime();

  if (currentSub == null) return null;
  return (
    <div className={styles.subtitle_container}>
      <div className={styles.subtitle_text}>{currentSub?.text ?? ""}</div>
    </div>
  );
};
