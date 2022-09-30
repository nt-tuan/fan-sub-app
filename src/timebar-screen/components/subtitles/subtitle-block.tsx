import React, { useCallback, useEffect, useRef, useState } from "react";

import ExtendMount from "./extend-mount";
import { PIXEL_PER_SECOND } from "../ruler/ruler.enum";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import classNames from "classnames";
import { getMilisecondFromPx } from "@/utils/time-utils";
import styles from "./subtitles.module.scss";
import useMouseDragging from "@/hooks/useMouseDragging";
import useOutsideClick from "@/hooks/use-outside-click";
import { useTimelineEditor } from "../../provider";

// const subtitles: SubtitleBlockInterface[] = [
//   {
//     from: 2000,
//     to: 5000,
//     text: "",
//   },
//   {
//     from: 7000,
//     to: 8000,
//     text: "",
//   },
//   {
//     from: 9000,
//     to: 10000,
//     text: "",
//   },
// ];

interface SubtitleBlockProps {
  index: number;
}

const SubtitleBlock = ({ index }: SubtitleBlockProps) => {
  const subtitleRef = useRef<any>(null);
  const {
    isActiveSubtitle,
    editingSubtitles = [],
    focus,
    unfocus,
  } = useTimelineEditor();

  const subtitle = editingSubtitles[index];
  const previousSub = editingSubtitles[index - 1];
  const nextSub = editingSubtitles[index + 1];

  const [subtitleState, setSubtitleState] = useState(subtitle);
  const { from, to } = subtitleState;

  const onFocus = () => focus(subtitle);
  useOutsideClick(subtitleRef, unfocus);

  const onResizeLeftSize = (event: any) => {
    const leftXPosition = event.clientX as number;
    const rightXPosition = subtitleRef?.current.getBoundingClientRect().right;
    const newWidth = rightXPosition - leftXPosition;
    const newDuration = getMilisecondFromPx(newWidth);
    if (previousSub && previousSub.to < subtitleState.to - newDuration)
      setSubtitleState((state) => ({ ...state, from: state.to - newDuration }));
  };

  const onResizeRightSize = (event: any) => {
    const rightXPosition = event.clientX as number;
    const leftXPosition = subtitleRef?.current.getBoundingClientRect().left;
    const newWidth = rightXPosition - leftXPosition;
    const newDuration = getMilisecondFromPx(newWidth);
    if (nextSub && subtitleState.from + newDuration < nextSub.from)
      setSubtitleState((state) => ({ ...state, to: state.from + newDuration }));
  };

  const blockWidthStyle = ((to - from) / 1000) * PIXEL_PER_SECOND;
  const blockLeftStyleInit = (subtitle.from / 1000) * PIXEL_PER_SECOND;

  const onMouseUpCallBack = useCallback((newPo) => {
    // console.log("🚀 ~ file: subtitle-block.tsx ~ line 84 ~ newPo", newPo);
  }, []);

  const { draggingPosition: blockLeftStyle } = useMouseDragging({
    initPosition: blockLeftStyleInit,
    elementRef: subtitleRef,
    onMouseUpCallBack,
  });

  const isActive = subtitle && isActiveSubtitle(subtitle);

  return (
    <div
      className={classNames(styles.subtitle_block_container, {
        [styles.subtitle_block_selected]: isActive,
      })}
      style={{
        width: blockWidthStyle,
        left: blockLeftStyle,
      }}
      onClick={onFocus}
      ref={subtitleRef}
    >
      {isActive && <ExtendMount id={from} onMouseMove={onResizeLeftSize} />}
      {isActive && <ExtendMount id={to} onMouseMove={onResizeRightSize} />}
    </div>
  );
};

export default React.memo(SubtitleBlock);
