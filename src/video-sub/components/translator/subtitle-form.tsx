import { Spin } from "antd";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import {
  useSubtitleEditor,
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "../../provider";
import styles from "./styles.module.scss";
import { SubtitleBlock } from "./subtitle-block";
import { SubtitleLanguages } from "./subtitle-languages";

const ItemRenderer = ({
  index,
  style,
}: {
  index: number;
  style: React.CSSProperties;
}) => <SubtitleBlock key={index} style={style} index={index} />;

export const SubtitleForm = () => {
  const ref = React.useRef<FixedSizeList<any>>(null);
  const { editingSubtitles } = useSubtitleEditor();
  const dstLang = useSubtitleEditorStore((state) => state.dstLang);
  const { currentTime } = useVideoPlayerStore();
  const editingBlock = useSubtitleEditorStore((state) => state.editingBlock);
  const lastEditingBlockIndex = React.useRef<number>();
  const nSubtitleSegments = editingSubtitles?.length;

  const scrollToCurrentTime = React.useCallback(
    (currentTime: number) => {
      if (editingBlock) return;
      if (editingSubtitles == null) return;
      for (let i = 0; i < editingSubtitles.length; i++) {
        if (editingSubtitles[i].to > currentTime) {
          if (lastEditingBlockIndex.current === i) {
            return;
          }

          if (lastEditingBlockIndex.current == null) {
            setTimeout(() => {
              ref.current?.scrollToItem(i, "center");
            });
          } else {
            ref.current?.scrollToItem(i, "smart");
          }
          lastEditingBlockIndex.current = i;

          return;
        }
      }
    },
    [editingSubtitles, editingBlock]
  );

  React.useEffect(() => {
    scrollToCurrentTime(currentTime);
  }, [currentTime, scrollToCurrentTime]);

  if (nSubtitleSegments == null) return <Spin />;

  return (
    <div className={styles.subtitle_container}>
      <SubtitleLanguages />
      <div className={styles.subtitle_block_group}>
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              ref={ref}
              key={dstLang}
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
    </div>
  );
};
