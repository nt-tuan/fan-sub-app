import React, { useRef, useState } from "react";

import SubtitleBlock from "./subtitle-block";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import styles from "./subtitles.module.scss";

export interface NewSubtitleBlockInterface extends SubtitleBlockInterface {
  id: number | string;
}

const subtitles: SubtitleBlockInterface[] = [
  {
    from: 2000,
    to: 5000,
    text: "",
  },
  {
    from: 7000,
    to: 8000,
    text: "",
  },
];

const Subtitles = () => {
  const [slectedSubId, setSlectedSubId] = useState<number | undefined>(
    undefined
  );

  const onBlockSelected = (id: number | undefined) => {
    setSlectedSubId(id);
  };

  return (
    <div className={styles.subtitles_container}>
      {subtitles.map((subtitle, index) => (
        <SubtitleBlock
          key={`${index}-key`}
          index={index}
          previousSub={subtitles[index - 1]}
          nextSub={subtitles[index + 1]}
          subtitle={subtitle}
          onSelected={onBlockSelected}
          selectedId={slectedSubId}
        />
      ))}
    </div>
  );
};

export default React.memo(Subtitles);
