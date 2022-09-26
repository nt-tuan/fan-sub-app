// import { PIXEL_PER_SECOND, UNIT } from "../ruler/ruler.enum";

import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./subtitles.module.scss";
import useEventListener from "../../../hooks/useEventListener";

// import classNames from "classnames";

interface ExtendMountProps {
  id?: string;
  parentRef?: any;
  onMouseMove: (event: any) => void;
}
const ExtendMount = ({ onMouseMove, parentRef }: ExtendMountProps) => {
  const ref = useRef<any>(null);

  const [startPos, setStartPos] = useState<number | null>(0);

  const onMove = useCallback(
    (event: any) => {
      event.stopPropagation();
      event.preventDefault();
      onMouseMove(event);
    },
    [onMouseMove]
  );

  const onMouseUp = useCallback(
    (event: any) => {
      // setStartPos(null);

      event.stopPropagation();
      event.preventDefault();
      console.log("onMouseUp :");
      document.removeEventListener("mousemove", onMove);
    },
    [onMove]
  );

  const onMouseDown = (event: any) => {
    event.stopPropagation();

    const xPos = event.clientX as number;
    setStartPos(xPos);

    document.addEventListener("mousemove", onMove, false);
    // document.addEventListener("mouseup", onMouseUp);
  };

  useEventListener("mousedown", onMouseDown, ref);
  useEventListener("mouseup", onMouseUp);
  // useEventListener("mousemove", onMove);

  // useEffect(() => {
  //   const onMouseUp = () => {
  //     setStartPos(null);
  //     document.removeEventListener("mousemove", onMove);
  //   };
  //   document.addEventListener("mouseup", onMouseUp);
  //   return () => {
  //     document.removeEventListener("mouseup", onMouseUp);
  //   };
  // }, [onMove]);

  return <div ref={ref} className={styles.subtitle_block_mock} />;
};

export default React.memo(ExtendMount);
