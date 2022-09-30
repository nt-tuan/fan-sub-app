import SubtitleBlock from "./subtitle-block";
import styles from "./subtitles.module.scss";
import { useMemo } from "react";
import { useSubtitleEditor } from "@/video-sub/components/provider";

const Subtitles = () => {
  const { editingSubtitles = [] } = useSubtitleEditor();

  // const nSubtitleSegments = useMemo(
  //   () => editingSubtitles?.length,
  //   [editingSubtitles]
  // );
  const nSubtitleSegments = 10;
  return (
    <div className={styles.subtitles_container}>
      {Array.from(Array(nSubtitleSegments).keys()).map((index) => (
        <SubtitleBlock key={`${index}-key`} index={index} />
      ))}
    </div>
  );
};

export default Subtitles;
