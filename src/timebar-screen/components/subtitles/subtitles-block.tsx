import { useRef, useState } from "react";

import ExtendMount from "./extend-mount";
import { PIXEL_PER_SECOND } from "../ruler/ruler.enum";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import classNames from "classnames";
import { getMilisecondFromPx } from "@/utils/time-utils";
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
  // const leftMockRef = useRef<any>(null);
  const subBlockRef = useRef<any>(null);
  const [sub, setSub] = useState(subtitle);
  const { from, to } = sub;
  console.log("🚀 ~ file: subtitles-block.tsx ~ line 47 ~ from", from);

  const onClick = () => {
    onSelected(from);
  };

  const onResizeLeftSize = (event: any) => {
    // event.stopPropagation();
  };
  const onResizeRightSize = (event: any) => {
    const leftPosX = subBlockRef.current.getBoundingClientRect().x;
    const newWidth = (event.clientX as number) - leftPosX;
    const newTime = getMilisecondFromPx(newWidth);

    setSub((c) => ({ ...c, to: c.from + newTime }));
  };

  // const isSelected = selectedId === from;
  const isSelected = true;
  const blockWidthStyle = ((to - from) / 1000) * PIXEL_PER_SECOND;
  const blockLeftStyle = (from / 1000) * PIXEL_PER_SECOND;

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
      ref={subBlockRef}
    >
      {isSelected && <ExtendMount id="left" onMouseMove={onResizeLeftSize} />}
      {isSelected && (
        <ExtendMount
          parentRef={subBlockRef}
          id="right"
          onMouseMove={onResizeRightSize}
        />
      )}
    </div>
  );
};

export default SubtitleBlock;
