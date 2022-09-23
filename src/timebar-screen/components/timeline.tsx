import { useRef, useState } from "react";

import styles from "./timeline.module.scss";
import useDebounce from "../../hooks/useDebounce";
import useEventListener from "../../hooks/useEventListener";

const RuleBlock5s = () => {
  return (
    <div className={styles.ruleblock_container}>
      <div className={styles.rule_line} style={{ left: "50px" }} />
      <div className={styles.rule_line} style={{ left: "100px" }} />
      <div className={styles.rule_line} style={{ left: "150px" }} />
      <div className={styles.rule_line} style={{ left: "200px" }} />
    </div>
  );
};

const Timeline = () => {
  const ruleOuterRef = useRef<any>(null);
  const [barPosision, setBarPosition] = useState(500);
  const [startPosision, setStartPosition] = useState({
    mousePosition: 0,
    elPosition: 0,
  });
  // const debouncedBarPosision = useDebounce<number>(barPosision, 0);

  const onMouseDown = (event: any) => {
    setStartPosition({
      mousePosition: event.clientX,
      elPosition: barPosision,
    });
  };

  const onMouseUp = (event: any) => {
    setStartPosition({ mousePosition: 0, elPosition: 0 });
  };

  const onMouseMove = (event: any) => {
    if (startPosision.mousePosition !== 0) {
      console.log(
        " onMouseMove mousePosition:",
        startPosision.mousePosition,
        startPosision.elPosition + (event.clientX - startPosision.mousePosition)
      );
      setBarPosition(
        startPosision.elPosition + (event.clientX - startPosision.mousePosition)
        // ruleOuterRef.current.offsetLeft +
        //   (event.clientX - startPosision.mousePosition)
      );
    }
  };

  useEventListener("mousedown", onMouseDown, ruleOuterRef);
  useEventListener("mouseup", onMouseUp, ruleOuterRef);
  useEventListener("mousemove", onMouseMove);

  return (
    <div className={styles.timeline_container}>
      <div className={styles.timeline_cursor} />
      <div
        ref={ruleOuterRef}
        className={styles.rule_outer}
        style={{
          left: barPosision,
          // transform: `translateX(${debouncedBarPosision}px)`;
        }}
      >
        <RuleBlock5s />
        <RuleBlock5s />
        <RuleBlock5s />
      </div>
    </div>
  );
};

export default Timeline;
