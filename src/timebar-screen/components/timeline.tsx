import { getMilisecondFromPx, getPxFromMilisecond } from "@/utils/time-utils";
import { useCallback, useMemo, useRef } from "react";

import Ruler from "./ruler";
import Subtitles from "./subtitles/subtitles";
import styles from "./timeline.module.scss";
import useMouseDragging from "../../hooks/useMouseDragging";
import { useVideoPlayerStore } from "@/store";

// import { useVideoPlayerStore, useVideoStore } from "@/store";

const Timeline = () => {
  const rulerOuterRef = useRef<any>(null);
  const timelineContainerRef = useRef<any>(null);

  const { currentTime, endTime, goTo } = useVideoPlayerStore();

  const containerWidth =
    timelineContainerRef?.current?.getBoundingClientRect()?.width || 0;

  const onMouseUpCallBack = useCallback(
    (mouseClientX) => {
      goTo(
        getMilisecondFromPx(
          mouseClientX - rulerOuterRef?.current?.getBoundingClientRect()?.left
        )
      );
    },
    [goTo]
  );

  const { draggingPosition: rulerOffsetByDrag, isDragging } = useMouseDragging({
    initPosition: 0,
    elementRef: rulerOuterRef,
    onMouseUpCallBack,
  });

  const rulerOffsetByVideoTime = useMemo(() => {
    const currentTimePosition = getPxFromMilisecond(currentTime);
    return containerWidth / 2 - currentTimePosition - 1;
  }, [currentTime, containerWidth]);

  const rulerOffset = isDragging ? rulerOffsetByDrag : rulerOffsetByVideoTime;

  return (
    <div ref={timelineContainerRef} className={styles.timeline_container}>
      <div className={styles.timeline_cursor} />
      <div
        className={styles.timeline}
        style={{
          left: rulerOffset,
          ...(!isDragging && {
            transition: "all 0.25s",
            // "-webkit-transition": "all 0.25s",
          }),
        }}
      >
        {/* <Subtitles /> */}
        <div ref={rulerOuterRef} className={styles.ruler_outer}>
          {endTime && <Ruler duration={endTime} />}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
