import React, { useRef } from "react";
import useDrag from "@/hooks/useDrag";

import styles from "./subtitles.module.scss";

interface ExtendMountProps {
  id?: string | number;
  onMouseMove: (distance: number, event: any) => void;
  onMouseUpCallback: () => void;
}

const ExtendMount = ({
  id,
  onMouseMove,
  onMouseUpCallback,
}: ExtendMountProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useDrag(ref, {
    id,
    onMouseMove,
    onMouseUpCallback,
  });
  return (
    <div
      id={`${id}-extend-mount`}
      ref={ref}
      className={styles.subtitle_block_mock}
    />
  );
};

export default React.memo(ExtendMount);
