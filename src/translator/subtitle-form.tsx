import { useVideoStore } from "@/store";
import { Spin } from "antd";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { SubtitleBlock } from "./subtitle-block";
import styles from "./styles.module.scss";

export const SubtitleForm = () => {
  const subtitles = useVideoStore((state) => state.subtitles);
  const defaultSubtitles = useVideoStore((state) => state.defaultSubtitles);
  if (subtitles == null || defaultSubtitles == null) return <Spin />;
  return (
    <div className={styles.subtitle_container}>
      <AutoSizer>
        {({ width, height }) => (
          <FixedSizeList
            height={height}
            itemCount={subtitles.length}
            itemSize={150}
            width={width}
          >
            {({ index, style }) => (
              <SubtitleBlock
                key={`${subtitles[index].from}_${subtitles[index].to}`}
                style={style}
                index={index}
                defaultSubtitle={defaultSubtitles[index]}
                subtitle={subtitles[index]}
              />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
