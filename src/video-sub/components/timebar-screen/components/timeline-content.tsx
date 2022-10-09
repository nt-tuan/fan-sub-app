import { useCallback, useMemo, useRef } from "react";

import useMouseDragging from "@/hooks/useMouseDragging";
import { getMilisecondFromPx, getPxFromMilisecond } from "@/utils/time-utils";
import { useVideoPlayerStore } from "@/video-sub/provider";

import Subtitles from "./subtitles";
import Timeline from "./timeline";
import styles from "./timeline-content.module.scss";

const TimelineContent = (props: any) => {
  const rulerOuterRef = useRef<any>(null);
  const timelineContainerRef = useRef<any>(null);
  const subtitleParent = useRef<HTMLDivElement>(null);

  const { currentTime, endTime, goTo } = useVideoPlayerStore();

  const halfOfContainer = props.width / 2;

  // update video current time onDraggEnd
  const onMouseUpCallBack = useCallback(() => {
    const currentLeft = rulerOuterRef?.current?.getBoundingClientRect()?.left;
    goTo(getMilisecondFromPx(halfOfContainer + -1 * currentLeft));
  }, [goTo, halfOfContainer]);

  const { draggingPosition: rulerOffsetByDrag, isDragging } = useMouseDragging({
    initPosition: 0,
    elementRef: rulerOuterRef,
    onMouseUpCallBack,
  });

  const rulerOffsetByVideoTime = useMemo(() => {
    const currentTimePosition = getPxFromMilisecond(currentTime);
    return halfOfContainer - currentTimePosition - 1;
  }, [currentTime, halfOfContainer]);

  const rulerOffset = isDragging ? rulerOffsetByDrag : rulerOffsetByVideoTime;

  const unSelectSubtitleBlock = () => props.onFocus(null);

  return (
    <div ref={timelineContainerRef} className={styles.timeline_container}>
      <div className={styles.timeline_cursor} />
      <div className={styles.background}></div>
      <div
        className={styles.timeline}
        ref={subtitleParent}
        style={{
          left: rulerOffset,
        }}
      >
        <Subtitles {...props} />
        <div
          ref={rulerOuterRef}
          className={styles.ruler_outer}
          onClick={unSelectSubtitleBlock}
        >
          {endTime && <Timeline duration={endTime} />}
        </div>
      </div>
    </div>
  );
};

export default TimelineContent;
