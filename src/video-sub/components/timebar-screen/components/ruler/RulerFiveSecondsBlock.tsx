import React, { useMemo } from "react";

import { getTimeLabel } from "../../../../../utils/time-utils";
import { UNIT, UNIT_SPACE } from "./ruler.enum";
import styles from "./ruler.module.scss";

const RulerFiveSecondsBlock = ({ index }: { index: number }) => {
  const currentSecond = useMemo(() => index * 5, [index]);
  const timeLabel = useMemo(
    () => getTimeLabel(currentSecond * 1000),
    [currentSecond]
  );

  return (
    <div className={styles.rulerblock_outer}>
      {index >= 0 && (
        <label className={styles.rulerblock_time_label}>{timeLabel}</label>
      )}
      <div
        className={styles.rulerblock_container}
        style={{ width: UNIT * UNIT_SPACE[5] }}
      >
        <div
          className={styles.ruler_line}
          style={{ left: UNIT * UNIT_SPACE[1] }}
        />
        <div
          className={styles.ruler_line}
          style={{ left: UNIT * UNIT_SPACE[2] }}
        />
        <div
          className={styles.ruler_line}
          style={{ left: UNIT * UNIT_SPACE[3] }}
        />
        <div
          className={styles.ruler_line}
          style={{ left: UNIT * UNIT_SPACE[4] }}
        />
      </div>
    </div>
  );
};

export default React.memo(RulerFiveSecondsBlock);
