import { useCallback, useRef, useState } from "react";

import useEventListener from "./useEventListener";

interface MouseDraggingInterface {
  initPosition: number | undefined;
  elementRef?: any | undefined;
  onMouseUpCallBack?: (position: number) => void;
}

const useMouseDragging = ({
  initPosition,
  elementRef,
  onMouseUpCallBack,
}: MouseDraggingInterface) => {
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
      if (onMouseUpCallBack) onMouseUpCallBack(event.clientX);
    },
    [onMove, onMouseUpCallBack]
  );

  const onMouseDown = useCallback(
    (event: any) => {
      event.stopPropagation();
      dragging.current = true;
      previousClientX.current = event.clientX;
      previousPosition.current =
        elementRef?.current?.getBoundingClientRect()?.left;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onMove, onMouseUp, elementRef]
  );

  useEventListener("mousedown", onMouseDown, elementRef);

  return { draggingPosition: position, isDragging: dragging.current };
};

export default useMouseDragging;
