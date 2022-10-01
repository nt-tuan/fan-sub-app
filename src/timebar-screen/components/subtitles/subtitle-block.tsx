import React, { useRef } from "react";
import classNames from "classnames";

import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import { getMilisecondFromPx } from "@/utils/time-utils";
import useOutsideClick from "@/hooks/use-outside-click";
import styles from "./subtitles.module.scss";
import ExtendMount from "./extend-mount";
import SubtitleOverlay from "./subtitle-overlay";
import { PIXEL_PER_SECOND } from "../ruler/ruler.enum";

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

  const onMouseUp = () => {
    onMouseUpCallback();
  };

  const onFocusSubtitle = () => {
    onFocus(index);
  };

  const subWidth = ((to - from) / 1000) * PIXEL_PER_SECOND;
  const subLeft = (from / 1000) * PIXEL_PER_SECOND;

  return (
    <div
      className={classNames(styles.subtitle_block_container, {
        [styles.subtitle_block_selected]: isActive,
      })}
      style={{
        width: subWidth,
        left: subLeft,
      }}
      onClick={onFocusSubtitle}
      ref={subtitleRef}
    >
      {isActive && (
        <ExtendMount
          id={`${index}left`}
          onMouseMove={onResizeLeftSide}
          onMouseUpCallback={onMouseUp}
        />
      )}
      {isActive && (
        <ExtendMount
          id={`${index}right`}
          onMouseMove={onResizeRightSide}
          onMouseUpCallback={onMouseUp}
        />
      )}
      {isActive && (
        <SubtitleOverlay
          id="overlay"
          onMouseMove={onMoveSub}
          onMouseUpCallback={onMouseUp}
        />
      )}
    </div>
  );
};

export default React.memo(SubtitleBlock);
