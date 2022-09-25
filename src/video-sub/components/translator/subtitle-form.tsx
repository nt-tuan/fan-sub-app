import React from "react";
import { Spin } from "antd";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { SubtitleBlock } from "./subtitle-block";
import styles from "./styles.module.scss";
import { useSubtitleEditor, useSubtitleEditorStore } from "../provider";
import { SubtitleLanguges } from "./subtitle-languages";
import { useVideoPlayerSubcribe } from "@/store";

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
  const editingBlock = useSubtitleEditorStore((state) => state.editingBlock);
  const nSubtitleSegments = editingSubtitles?.length;

  const scrollToCurrentTime = React.useCallback(
    (currentTime: number) => {
      if (editingBlock) return;
      if (editingSubtitles == null) return;
      for (let i = 0; i < editingSubtitles.length; i++) {
        if (editingSubtitles[i].to > currentTime) {
          ref.current?.scrollToItem(i, "center");
          return;
        }
      }
    },
    [editingSubtitles, editingBlock]
  );

  useVideoPlayerSubcribe((state) => state.currentTime, scrollToCurrentTime);

  if (nSubtitleSegments == null) return <Spin />;
  return (
    <div className={styles.subtitle_container}>
      <SubtitleLanguges />
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
