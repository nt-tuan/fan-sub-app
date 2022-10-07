import React, { useRef } from "react";

import useDrag from "@/hooks/useDrag";

import styles from "./subtitles.module.scss";

interface SubtitleOverlayProps {
  id?: string | number;
  onMouseMove: (distance: number, event: any) => void;
  onMouseUpCallback: () => void;
}

const SubtitleOverlay = ({
  id,
  onMouseMove,
  onMouseUpCallback,
}: SubtitleOverlayProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useDrag(ref, {
    id,
    onMouseMove,
    onMouseUpCallback,
  });
  return (
    <div
      id={`${id}-sub-overlay`}
      ref={ref}
      className={styles.subtitle_block_overplay}
    />
  );
};

export default React.memo(SubtitleOverlay);
