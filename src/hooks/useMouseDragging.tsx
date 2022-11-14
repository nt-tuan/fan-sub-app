import { useCallback, useRef, useState } from "react";

import useEventListener from "./useEventListener";

interface MouseDraggingInterface {
  initPosition: number | undefined;
  elementRef?: any | undefined;
  onMouseDownCallBack?: () => void;
  onMouseUpCallBack?: () => void;
  onMouseMouseMoveValidator?: (newLeftPosition: number) => void;
  disabled: boolean;
}

const useMouseDragging = ({
  initPosition,
  elementRef,
  onMouseDownCallBack,
  onMouseUpCallBack,
  onMouseMouseMoveValidator,
  disabled,
}: MouseDraggingInterface) => {
  const dragging = useRef<boolean>(false);
  const previousPosition = useRef<number>(0);
  const previousMouseClientX = useRef<number>(0);

  const [position, setPosition] = useState<number>(initPosition || 0);

  const onMove = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      if (!dragging.current) return;
      const mouseClientX = event.clientX;

      const newPos =
        previousPosition.current +
        (mouseClientX - previousMouseClientX.current);
      const validate = onMouseMouseMoveValidator
        ? onMouseMouseMoveValidator(newPos)
        : true;
      if (validate) setPosition(newPos);
    },
    [onMouseMouseMoveValidator]
  );

  const onMouseUp = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      dragging.current = false;
      if (onMouseUpCallBack && previousMouseClientX.current !== event.clientX)
        onMouseUpCallBack();
      previousMouseClientX.current = 0;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onMouseUp);
    },
    [onMouseUpCallBack, onMove]
  );

  const onMouseDown = useCallback(
    (event: any) => {
      event.stopPropagation();
      if (disabled) return;
      dragging.current = true;
      previousMouseClientX.current = event.clientX;
      // const parentLeft = getParentElement()?.getBoundingClientRect()?.left ?? 0;
      previousPosition.current =
        elementRef?.current?.getBoundingClientRect()?.left;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
      if (onMouseDownCallBack) onMouseDownCallBack();
    },
    [disabled, onMove, onMouseUp, elementRef, onMouseDownCallBack]
  );

  useEventListener("mousedown", onMouseDown, elementRef);

  return { draggingPosition: position, isDragging: dragging.current };
};

export default useMouseDragging;
