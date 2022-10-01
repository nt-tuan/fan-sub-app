import SubtitleBlock from "./subtitle-block";
import styles from "./subtitles.module.scss";

const Subtitles = ({
  subtitles,
  editingSubtitles,
  selectedIndex,
  onFocus,
  onMouseUp,
  onMove,
  onResizeLeft,
  onResizeRight,
  editingSub,
  width,
}: any) => {
  if (!subtitles) return null;
  return (
    <div className={styles.subtitles_container} style={{ width }}>
      {subtitles.map((index: any) => {
        const isActive = selectedIndex === index;
        const subtitle = isActive ? editingSub : editingSubtitles[index];
        return (
          <SubtitleBlock
            key={`${index}-key`}
            index={index}
            isActive={isActive}
            subtitle={subtitle}
            onFocus={onFocus}
            onResizeLeft={onResizeLeft}
            onResizeRight={onResizeRight}
            onMove={onMove}
            prevSub={editingSubtitles[index - 1]}
            nextSub={editingSubtitles[index + 1]}
            onMouseUpCallback={onMouseUp}
          />
        );
      })}
    </div>
  );
};

export default Subtitles;
