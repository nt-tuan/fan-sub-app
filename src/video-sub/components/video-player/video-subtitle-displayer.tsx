import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { useSubtitleEditor } from "../../provider";
import styles from "./video-player.module.scss";

export const VideoSubtitleDisplayer = () => {
  const { getCurrentSubtitleByTime } = useSubtitleEditor();
  const currentSub = getCurrentSubtitleByTime();

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const bind = useDrag(({ down, offset: [mx, my] }) => {
    api.start({ x: mx > 0 ? mx : 0, y: my > 0 ? my : 0, immediate: down });
  });

  if (currentSub == null) return null;

  return (
    <animated.div {...bind()} style={{ position: "absolute", x, y }}>
      <div className={styles.subtitle_container}>
        <div style={currentSub.position} className={styles.subtitle_text}>
          {currentSub?.text ?? ""}
        </div>
      </div>
    </animated.div>
  );
};
