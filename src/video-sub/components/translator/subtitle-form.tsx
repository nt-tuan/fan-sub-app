import { Button, Spin } from "antd";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import {
  useSubtitleEditor,
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "../../provider";
import FindWordModal from "./find-word-modal";
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
  const {
    editingSubtitles,
    findBlankIndex,
    editingBlock,
    setOpenModal,
    isModalOpen,
    setEditingBlock,
  } = useSubtitleEditor();
  const dstLang = useSubtitleEditorStore((state) => state.dstLang);
  const { currentTime, videoRef, goTo } = useVideoPlayerStore();
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

  const handleFindBlank = async () => {
    videoRef?.current?.pause();
    const index = findBlankIndex();
    if (index && index >= 0 && editingSubtitles?.[index].from) {
      goTo(editingSubtitles[index].from);
      scrollToCurrentTime(editingSubtitles[index].from);
      setEditingBlock(editingSubtitles[index]);
    }
    setTimeout(() => {
      videoRef?.current?.play();
    }, 100);
  };

  const handleFindWords = () => setOpenModal(true);

  if (nSubtitleSegments == null) return <Spin />;

  return (
    <div className={styles.subtitle_container}>
      {isModalOpen && (
        <FindWordModal
          isModalOpen={isModalOpen}
          onCancel={() => setOpenModal(false)}
        />
      )}
      <div>
        <SubtitleLanguages />
        <div className={styles.subtitle_actions}>
          <Button onClick={handleFindBlank}>Find Blanks</Button>
          <Button onClick={handleFindWords}>Find Word</Button>
        </div>
      </div>
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
