// import { PIXEL_PER_SECOND, UNIT } from "../ruler/ruler.enum";

import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./subtitles.module.scss";
import useEventListener from "../../../hooks/useEventListener";

// import classNames from "classnames";

interface ExtendMountProps {
  id?: string;
  parentRef?: any;
  onMouseMove: (distance: number, event: any) => void;
}
const ExtendMount = ({ onMouseMove, parentRef }: ExtendMountProps) => {
  const ref = useRef<any>(null);

  //   const [startPos, setStartPos] = useState<number | null>(0);

  //   const onMouseUp = () => setStartPos(null);

  const onMove = useCallback(
    (startPos: number) => (event: any) => {
      event.stopPropagation();

      const newPos = event.clientX as number;
      //   console.log("startPos,  newPos:", startPos, newPos);
      if (startPos) onMouseMove(newPos - startPos, event);
    },
    [onMouseMove]
  );

  const onMouseDown = (event: any) => {
    event.stopPropagation();
    const xPos = event.clientX as number;
    // setStartPos(event.clientX);

    const element = parentRef.current;
    const onM = onMove(xPos);
    element.addEventListener("mousemove", onM);
  };

  const onMouseUp = () => {
    parentRef?.current?.removeEventListener("mousemove", onMove);
  };

  useEventListener("mousedown", onMouseDown, ref);
  useEventListener("mouseup", onMouseUp, ref);
  //   useEventListener("mousemove", onMove);

  //   useEffect(() => {
  //     return () => {
  //       ref?.current?.removeEventListener("mousemove", onMove);
  //     };
  //   }, [ref, onMove]);

  return <div ref={ref} className={styles.subtitle_block_mock} />;
};

export default React.memo(ExtendMount);
