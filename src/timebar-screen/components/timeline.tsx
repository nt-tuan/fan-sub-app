import { useRef, useState } from "react";

import styles from "./timeline.module.scss";
import useEventListener from "../../hooks/useEventListener";
import { getTimeLabel } from "../../utils/time-utils";

// dump data
const VIDEO_TIME = 5 * 60 * 1000 + 6000; // 5 minutes in miliseconds

const UNIT = 10; // 1000 miliseconds = 1 second = 10px | 1 px = 100 miliseconds

const RulerFiveSecondsBlock = () => {
  return (
    <div
      className={styles.rulerblock_container}
      style={{ width: UNIT * 25 - 1 }}
    >
      <div className={styles.ruler_line} style={{ left: UNIT * 5 }} />
      <div className={styles.ruler_line} style={{ left: UNIT * 10 }} />
      <div className={styles.ruler_line} style={{ left: UNIT * 15 }} />
      <div className={styles.ruler_line} style={{ left: UNIT * 20 }} />
    </div>
  );
};

const Timeline = () => {
  const rulerOuterRef = useRef<any>(null);
  const [rulerPosision, setRulerPosision] = useState(0);
  const [startPosision, setStartPosition] = useState({
    mousePosition: 0,
    elPosition: 0,
  });
  console.log("  :", VIDEO_TIME, getTimeLabel(VIDEO_TIME));
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
        ref={rulerOuterRef}
        className={styles.ruler_outer}
        style={{
          left: rulerPosision,
        }}
      >
        <RulerFiveSecondsBlock />
        <RulerFiveSecondsBlock />
        <RulerFiveSecondsBlock />
      </div>
    </div>
  );
};

export default Timeline;
