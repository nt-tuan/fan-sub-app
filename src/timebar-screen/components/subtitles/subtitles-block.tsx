import { PIXEL_PER_SECOND, UNIT } from "../ruler/ruler.enum";
import { useRef, useState } from "react";

import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import classNames from "classnames";
import styles from "./subtitles.module.scss";

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
  selectedId?: number | null;
  onSelected: (from: number) => void;
  subtitle: SubtitleBlockInterface;
  prviousSub?: SubtitleBlockInterface;
  nextSub?: SubtitleBlockInterface;
}

const SubtitleBlock = ({
  selectedId,
  subtitle,
  onSelected,
}: SubtitleBlockProps) => {
  const { from, to } = subtitle;

  const onClick = () => {
    onSelected(from);
  };

  const onResizeRight = (event: any) => {
    event.stopPropagation();
  };

  const isSelected = selectedId === from;

  return (
    <div
      className={classNames(styles.subtitle_block_container, {
        [styles.subtitle_block_selected]: isSelected,
      })}
      style={{
        width: ((to - from) / 1000) * PIXEL_PER_SECOND,
        left: (from / 1000) * PIXEL_PER_SECOND,
      }}
      onClick={onClick}
    >
      {isSelected && <div className={styles.subtitle_block_mock}></div>}
      {isSelected && (
        <div
          className={styles.subtitle_block_mock}
          onClick={onResizeRight}
        ></div>
      )}
    </div>
  );
};

export default SubtitleBlock;
