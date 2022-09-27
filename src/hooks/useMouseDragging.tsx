import { useCallback, useEffect, useRef, useState } from "react";

import useEventListener from "./useEventListener";

const useMouseDragging = (
  initPosition: number | undefined,
  elementRef?: any | undefined
) => {
  const dragging = useRef<boolean>(false);
  const previousPosition = useRef<number>(0);
  const previousClientX = useRef<number>(0);
  const [position, setPosition] = useState<number>(initPosition || 0);

  const onMove = useCallback((event: any) => {
    event.stopPropagation();
    event.preventDefault();
    if (!dragging.current) return;
    setPosition(
      previousPosition.current + (event.clientX - previousClientX.current)
    );
  }, []);

  const onMouseUp = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      dragging.current = false;
      previousClientX.current = 0;
      document.removeEventListener("mousemove", onMove, false);
      document?.removeEventListener("mouseup", onMouseUp);
    },
    [onMove]
  );

  const onMouseDown = useCallback(
    (event: any) => {
      event.stopPropagation();
      previousClientX.current = event.clientX;
      dragging.current = true;
      previousPosition.current = position;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onMove, onMouseUp, position]
  );

  useEventListener("mousedown", onMouseDown, elementRef);

  return position;
};

export default useMouseDragging;
