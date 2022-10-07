import React, { useMemo } from "react";

import RulerFiveSecondsBlock from "./RulerFiveSecondsBlock";

// TODO
// import RemainingBlock from "./RemainingBlock";

const Timeline = ({ duration }: { duration: number }) => {
  const videoDurationBySecond = useMemo(() => duration / 1000, [duration]);
  const amountOfBlock = Math.floor(videoDurationBySecond / 5);
  return (
    <>
      {Array.from(Array(amountOfBlock).keys()).map((index) => (
        <RulerFiveSecondsBlock index={index} key={index} />
      ))}
      {/* Add remaining block */}
    </>
  );
};

export default React.memo(Timeline);
