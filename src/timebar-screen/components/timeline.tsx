import { useRef, useState } from "react";
import { useVideoPlayerStore, useVideoStore } from "@/store";

import Ruler from "./ruler";
import Subtitles from "./subtitles/subtitles";
import styles from "./timeline.module.scss";
import useEventListener from "../../hooks/useEventListener";

// import { getTimeLabel } from "../../utils/time-utils";

// dump data
const VIDEO_TIME = 1 * 60 * 1000 + 13000; // 5 minutes in miliseconds

const Timeline = () => {
  const rulerOuterRef = useRef<any>(null);
  const [rulerPosision, setRulerPosision] = useState(0);
  const [startPosision, setStartPosition] = useState({
    mousePosition: 0,
    elPosition: 0,
  });

  // const { subtitles } = useVideoStore();

  // Event

  const onMouseDown = (event: any) => {
    setStartPosition({
      mousePosition: event.clientX,
      elPosition: rulerPosision,
    });
  };

  const onMouseUp = () => setStartPosition({ mousePosition: 0, elPosition: 0 });

  const onMouseMove = (event: any) => {
    if (startPosision.mousePosition !== 0) {
      setRulerPosision(
        startPosision.elPosition + (event.clientX - startPosision.mousePosition)
      );
    }
  };

  useEventListener("mousedown", onMouseDown, rulerOuterRef);
  useEventListener("mouseup", onMouseUp, rulerOuterRef);
  useEventListener("mousemove", onMouseMove);

  return (
    <div className={styles.timeline_container}>
      <div className={styles.timeline_cursor} />
      <div
        className={styles.timeline}
        style={{
          left: rulerPosision,
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
