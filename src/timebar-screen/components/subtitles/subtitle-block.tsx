import { useEffect, useRef, useState } from "react";

import ExtendMount from "./extend-mount";
import { PIXEL_PER_SECOND } from "../ruler/ruler.enum";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import classNames from "classnames";
import { getMilisecondFromPx } from "@/utils/time-utils";
import styles from "./subtitles.module.scss";
import useMouseDragging from "@/hooks/useMouseDragging";

// import

// import { ResizableBox } from "react-resizable";

/**
 * startPos
 * endPos
 * from
 * endTime
 *
 * previousEndTime
 * nextStartTime
 *
 * onChange
 */

/**
 * Left condition
 * converToTime(clientX(startPos)) <= previousEndTime -> disable
 * converToTime(clientX(endPos)) >= nextStartTime -> disable
 */

interface SubtitleBlockProps {
  index?: number;
  selectedId?: number | null;
  onSelected: (from: number | undefined) => void;
  subtitle: SubtitleBlockInterface;
  previousSub?: SubtitleBlockInterface;
  nextSub?: SubtitleBlockInterface;
}

const SubtitleBlock = ({
  index,
  selectedId,
  subtitle,
  onSelected,
  previousSub,
  nextSub,
}: SubtitleBlockProps) => {
  const subtitleRef = useRef<any>(null);

  const [subtitleState, setSubtitleState] = useState(subtitle);
  const { from, to } = subtitleState;

  const onClick = () => {
    onSelected(index);
  };

  const onResizeLeftSize = (event: any) => {
    const leftXPosition = event.clientX as number;
    const rightXPosition = subtitleRef.current.getBoundingClientRect().right;
    const newWidth = rightXPosition - leftXPosition;
    const newDuration = getMilisecondFromPx(newWidth);
    if (previousSub && previousSub.to < subtitleState.to - newDuration)
      setSubtitleState((state) => ({ ...state, from: state.to - newDuration }));
  };

  const onResizeRightSize = (event: any) => {
    const rightXPosition = event.clientX as number;
    const leftXPosition = subtitleRef.current.getBoundingClientRect().left;
    const newWidth = rightXPosition - leftXPosition;
    const newDuration = getMilisecondFromPx(newWidth);
    if (nextSub && subtitleState.from + newDuration < nextSub.from)
      setSubtitleState((state) => ({ ...state, to: state.from + newDuration }));
  };

  const isSelected = selectedId === index;
  // const isSelected = true;
  const blockWidthStyle = ((to - from) / 1000) * PIXEL_PER_SECOND;
  const blockLeftStyleInit = (subtitle.from / 1000) * PIXEL_PER_SECOND;

  const blockLeftStyle = useMouseDragging(blockLeftStyleInit, subtitleRef);

  return (
    <div
      className={classNames(styles.subtitle_block_container, {
        [styles.subtitle_block_selected]: isSelected,
      })}
      style={{
        width: blockWidthStyle,
        left: blockLeftStyle,
      }}
      onClick={onClick}
      ref={subtitleRef}
    >
      {isSelected && <ExtendMount id={from} onMouseMove={onResizeLeftSize} />}
      {isSelected && <ExtendMount id={to} onMouseMove={onResizeRightSize} />}
    </div>
  );
};

export default SubtitleBlock;
