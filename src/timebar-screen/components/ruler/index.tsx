import React, { useMemo } from "react";

import RemainingBlock from "./RemainingBlock";
import RulerFiveSecondsBlock from "./RulerFiveSecondsBlock";

// import styles from "./ruler.module.scss";

const Ruler = ({ duration }: { duration: number }) => {
  const videoDurationBySecond = useMemo(() => duration / 1000, [duration]);
  const amountOfBlock = Math.floor(videoDurationBySecond / 5);

  return (
    <>
      {Array.from(Array(amountOfBlock).keys()).map((index) => (
        <RulerFiveSecondsBlock index={index} key={index} />
      ))}
      <RemainingBlock
        durationMilisecond={duration}
        remaining={videoDurationBySecond % 5}
      />
    </>
  );
};

export default React.memo(Ruler);
