import { useCallback, useRef, useState } from "react";

import Ruler from "./ruler";
import Subtitles from "./subtitles/subtitles";
import styles from "./timeline.module.scss";
import useMouseDragging from "../../hooks/useMouseDragging";

// import { useVideoPlayerStore, useVideoStore } from "@/store";

// dump data
const VIDEO_TIME = 1 * 60 * 1000 + 13000; // 5 minutes in miliseconds

const Timeline = () => {
  const rulerOuterRef = useRef<any>(null);
  const rulerPosition = useMouseDragging(0, rulerOuterRef);

  return (
    <div className={styles.timeline_container}>
      <div className={styles.timeline_cursor} />
      <div
        className={styles.timeline}
        style={{
          left: rulerPosition,
        }}
      >
        <Subtitles />
        <div ref={rulerOuterRef} className={styles.ruler_outer}>
          <Ruler duration={VIDEO_TIME} />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
