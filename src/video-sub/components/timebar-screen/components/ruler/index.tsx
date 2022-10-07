import React, { useMemo } from "react";

import RulerFiveSecondsBlock from "./RulerFiveSecondsBlock";

// import RemainingBlock from "./RemainingBlock";

const Ruler = ({ duration }: { duration: number }) => {
  const videoDurationBySecond = useMemo(() => duration / 1000, [duration]);
  const amountOfBlock = Math.floor(videoDurationBySecond / 5);
  return (
    <>
      {Array.from(Array(amountOfBlock).keys()).map((index) => (
        <RulerFiveSecondsBlock index={index} key={index} />
      ))}
    </>
  );
};

export default React.memo(Ruler);
