import React, { useCallback, useRef } from "react";

import styles from "./subtitles.module.scss";
import useEventListener from "../../../hooks/useEventListener";

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
  const ref = useRef<any>(null);
  const dragging = useRef<boolean>(false);
  const previousMouseClientX = useRef<number>(0);

  const onMove = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      if (!dragging.current) return;
      const mouseClientX = event.clientX;
      const distance = mouseClientX - previousMouseClientX.current;
      onMouseMove(distance, event);
    },
    [onMouseMove]
  );

  const onMouseUp = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      dragging.current = false;
      document.removeEventListener("mousemove", onMove, false);
      document?.removeEventListener("mouseup", onMouseUp);
      onMouseUpCallback();
    },
    [onMove, onMouseUpCallback]
  );

  const onMouseDown = useCallback(
    (event: any) => {
      event.stopPropagation();
      dragging.current = true;
      previousMouseClientX.current = event.clientX;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onMove, onMouseUp]
  );

  useEventListener("mousedown", onMouseDown, ref);

  return (
    <div
      id={`${id}-sub-overlay`}
      ref={ref}
      className={styles.subtitle_block_overplay}
    />
  );
};

export default React.memo(SubtitleOverlay);
