import { UNIT, UNIT_SPACE } from "./ruler.enum";

import React from "react";
import { getTimeLabel } from "../../../utils/time-utils";
import styles from "./ruler.module.scss";

const RemainingBlock = ({
  remaining,
  durationMilisecond,
}: {
  remaining: number;
  durationMilisecond: number;
}) => {
  if (remaining === 0) return <></>;
  const timeLabel = getTimeLabel(durationMilisecond - remaining * 1000);
  return (
    <div className={styles.rulerblock_outer}>
      <label className={styles.rulerblock_time_label}>{timeLabel}</label>
      <div
        className={styles.rulerblock_container}
        style={{
          width: UNIT * UNIT_SPACE[remaining as keyof typeof UNIT_SPACE],
        }}
      >
        {Array.from(Array(remaining).keys()).map((_, index) => (
          <div
            key={`key${index}`}
            className={styles.ruler_line}
            style={{
              left: UNIT * UNIT_SPACE[(index + 1) as keyof typeof UNIT_SPACE],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(RemainingBlock);
