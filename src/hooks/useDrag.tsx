import React, { useRef } from "react";

interface SubtitleOverlayProps {
  id?: string | number;
  onMouseMove: (distance: number, event: any) => void;
  onMouseUpCallback: () => void;
}
const useDrag = (
  ref: React.RefObject<HTMLDivElement>,
  { onMouseMove, onMouseUpCallback, id }: SubtitleOverlayProps
) => {
  const dragging = useRef<boolean>(false);
  const previousMouseClientX = useRef<number>(0);

  React.useEffect(() => {
    if (ref.current == null) return;
    const currentRef = ref.current;
    const onMouseDown = (event: any) => {
      event.stopPropagation();
      dragging.current = true;
      previousMouseClientX.current = event.clientX;
    };
    ref.current.addEventListener("mousedown", onMouseDown);
    return () => {
      currentRef.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref, onMouseUpCallback]);

  React.useEffect(() => {
    const onMove = (event: any) => {
      if (!dragging.current) return;
      event.stopPropagation();
      event.preventDefault();
      const mouseClientX = event.clientX;
      const distance = mouseClientX - previousMouseClientX.current;
      onMouseMove(distance, event);
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, [onMouseMove]);

  React.useEffect(() => {
    const onMouseUp = (event: any) => {
      if (!dragging.current) return;
      dragging.current = false;
      event.stopPropagation();
      event.preventDefault();
      onMouseUpCallback();
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseUpCallback]);
};

export default useDrag;
