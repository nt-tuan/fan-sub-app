import React, { useRef, useState } from "react";

import SubtitleBlock from "./subtitles-block";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import styles from "./subtitles.module.scss";

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
  const [slectedSubId, setSlectedSubId] = useState<number | null>(null);

  const onBlockSelected = (id: number) => {
    setSlectedSubId(id);
    // setSlectedSubId((curId) => (curId === id ? null : id));
  };

  return (
    <div className={styles.subtitles_container}>
      {subtitles.map((subtitle, index) => (
        <SubtitleBlock
          key={subtitle.from}
          prviousSub={subtitles[index - 1]}
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
