import React, { useCallback, useEffect, useRef, useState } from "react";

import ExtendMount from "./extend-mount";
import SubtitleOverlay from "./subtitle-overlay";
import { PIXEL_PER_SECOND } from "../ruler/ruler.enum";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import classNames from "classnames";
import { getMilisecondFromPx } from "@/utils/time-utils";
import styles from "./subtitles.module.scss";
// import useMouseDragging from "@/hooks/useMouseDragging";
import useOutsideClick from "@/hooks/use-outside-click";
// import { useTimelineEditor } from "../../provider/useTimelineEditor";

export interface ResizeEventInterface {
  distancePixel: number;
  distanceDuration: number;
  subElement: any;
}

interface SubtitleBlockProps {
  index: number;
  isActive: boolean;
  subtitle: SubtitleBlockInterface | undefined;
  getParentElement?: () => HTMLElement | null;
  onFocus: (index: number | null) => void;
  onResizeLeft: (event: ResizeEventInterface) => void;
  onResizeRight: (event: ResizeEventInterface) => void;
  onMove: (event: ResizeEventInterface) => void;
  onMouseUpCallback: () => void;
  prevSub: SubtitleBlockInterface | undefined;
  nextSub: SubtitleBlockInterface | undefined;
}

const SubtitleBlock = ({
  index,
  isActive,
  subtitle,
  onFocus,
  onResizeLeft,
  onResizeRight,
  onMove,
  onMouseUpCallback,
}: SubtitleBlockProps) => {
  const subtitleRef = useRef<any>(null);
  const { from = 0, to = 0 } = subtitle ?? {};

  useOutsideClick(subtitleRef, () => onFocus(null));

  const onResizeLeftSide = (distance: number) => {
    const distanceDuration = getMilisecondFromPx(Math.abs(distance));
    const direction = distance < 0 ? -1 : 1;
    onResizeLeft({
      distancePixel: distance,
      distanceDuration: distanceDuration * direction,
      subElement: subtitleRef,
    });
  };

  const onResizeRightSide = (distance: number) => {
    const distanceDuration = getMilisecondFromPx(Math.abs(distance));
    const direction = distance < 0 ? -1 : 1;
    onResizeRight({
      distancePixel: distance,
      distanceDuration: distanceDuration * direction,
      subElement: subtitleRef,
    });
  };

  const onMoveSub = (distance: number) => {
    const distanceDuration = getMilisecondFromPx(Math.abs(distance));
    const direction = distance < 0 ? -1 : 1;
    onMove({
      distancePixel: distance,
      distanceDuration: distanceDuration * direction,
      subElement: subtitleRef,
    });
  };

  const onMouseDownCallBack = () => {
    // setSubtitleEditting(subtitle);
    // isEdittingRef.current = true;
  };

  const onMouseUp = () => {
    onMouseUpCallback();
    // const leftXPosition = subtitleRef?.current.getBoundingClientRect().left;
    // const rightXPosition = subtitleRef?.current.getBoundingClientRect().right;
    // const newFrom = getMilisecondFromPx(leftXPosition);
    // const newTo = getMilisecondFromPx(rightXPosition);
    // console.log(
    //   "🚀 ~ file: subtitle-block.tsx ~ line 69 ~ onMouseUpCallBack ~ leftXPosition",
    //   leftXPosition
    // );
    // const subWidth = subtitleRef?.current.getBoundingClientRect().width;
    // setSubtitleEditting({ ...subtitleEditting, from: newFrom, to: newTo });
    // isEdittingRef.current = false;
  };

  const onFocusSubtitle = () => {
    onFocus(index);
  };

  const subWidth = ((to - from) / 1000) * PIXEL_PER_SECOND;
  const subLeftDefault = (from / 1000) * PIXEL_PER_SECOND;

  // const onMouseMouseMoveValidator = useCallback((newPos) => {
  //   if (newPos >= 0) return true;
  //   return false;
  // }, []);

  // const { draggingPosition: subLeftByDrag, isDragging } = useMouseDragging({
  //   initPosition: subLeftDefault,
  //   elementRef: subtitleRef,
  //   onMouseDownCallBack,
  //   onMouseUpCallBack,
  //   onMouseMouseMoveValidator,
  //   getParentElement,
  // });

  // const subLeft = isDragging ? subLeftByDrag : subLeftDefault;

  return (
    <div
      className={classNames(styles.subtitle_block_container, {
        [styles.subtitle_block_selected]: isActive,
      })}
      style={{
        width: subWidth,
        left: subLeftDefault,
      }}
      onClick={onFocusSubtitle}
      ref={subtitleRef}
    >
      {isActive && (
        <ExtendMount
          id={index}
          onMouseMove={onResizeLeftSide}
          onMouseUpCallback={onMouseUpCallback}
        />
      )}
      {isActive && (
        <ExtendMount
          id={index}
          onMouseMove={onResizeRightSide}
          onMouseUpCallback={onMouseUpCallback}
        />
      )}
      {isActive && (
        <SubtitleOverlay
          id={index}
          onMouseMove={onMoveSub}
          onMouseUpCallback={onMouseUpCallback}
        />
      )}
    </div>
  );
};

export default React.memo(SubtitleBlock);
