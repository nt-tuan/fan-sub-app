import { useVideoStore } from "@/store";
import { Spin } from "antd";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { SubtitleBlock } from "./subtitle-block";
import styles from "./styles.module.scss";

const ItemRenderer = ({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties;
}) => <SubtitleBlock key={index} style={style} index={index} />;
export const SubtitleForm = () => {
  const nSubtitleSegments = useVideoStore((state) => state.nSubtitleSegments);

  if (nSubtitleSegments == null) return <Spin />;
  return (
    <div className={styles.subtitle_container}>
      <AutoSizer>
        {({ width, height }) => (
          <FixedSizeList
            height={height}
            itemCount={nSubtitleSegments}
            itemSize={150}
            width={width}
          >
            {ItemRenderer}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
