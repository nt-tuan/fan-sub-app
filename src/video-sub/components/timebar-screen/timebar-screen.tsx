import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";

import { SubtitleBlock } from "@/store/model";
import VideoPlayer from "@/video-sub/components/video-player/video-player";
import {
  useSubtitleEditor,
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "@/video-sub/provider";
import useTimebar from "@/video-sub/provider/useTimebar";
import { ActionType } from "@/video-sub/provider/useUndo";

import SubtitleInputOverlay from "./components/subtitle-input-overlay";
import TimelineContent from "./components/timeline-content";
import TimelineMenu from "./components/timeline-menu";

const TimebarScreenContent = ({ width }: { width: number }) => {
  const inputSubRef = useRef<HTMLInputElement>(null);
  const props = useTimebar({ width });
  const { currentTime } = useVideoPlayerStore();
  const { editingSubtitles, changeSubtitleText } = useSubtitleEditor();
  const deleteSubtitle = useSubtitleEditorStore(
    (store) => store.deleteSubtitle
  );
  const [currentSubIndex, setCurrentSubIndex] = React.useState<number>(-1);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (props.selectedIndex == null) return;
    deleteSubtitle(props.selectedIndex);
    props.onUnfocus();
    if (editingSubtitles)
      props.pushAction({
        type: ActionType.Create,
        index: props.selectedIndex,
        subtitle: editingSubtitles[props.selectedIndex],
      });
  };

  const handleChangeSub = (newSubContent: string) => {
    changeSubtitleText(currentSubIndex, newSubContent);
  };

  const showCurrentSubtitle = useCallback(
    (currentTime) => {
      if (editingSubtitles == null) return;
      const newCurrentSubIdx = editingSubtitles.findIndex(
        (sub: SubtitleBlock) => sub.from <= currentTime && currentTime <= sub.to
      );

      if (currentSubIndex !== newCurrentSubIdx) {
        setCurrentSubIndex(newCurrentSubIdx);
        if (inputSubRef.current)
          inputSubRef.current.value =
            editingSubtitles[newCurrentSubIdx]?.text ?? "";
      }
    },
    [editingSubtitles, inputSubRef, currentSubIndex]
  );

  useEffect(() => {
    showCurrentSubtitle(currentTime);
  }, [currentTime, showCurrentSubtitle]);

  const showSubtitleInput = useMemo(() => {
    if (!editingSubtitles) return false;
    return Boolean(editingSubtitles[currentSubIndex]);
  }, [currentSubIndex, editingSubtitles]);

  return (
    <div style={{ height: "100%", width }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <div style={{ height: 480, width: 640, position: "relative" }}>
          <VideoPlayer hideSubtitle key="timeline-video" />
          <SubtitleInputOverlay
            ref={inputSubRef}
            onChange={handleChangeSub}
            showSubtitleInput={showSubtitleInput}
          />
        </div>
      </div>
      <TimelineContent {...(props as any)} width={width} />
      <TimelineMenu
        disabled={props.selectedIndex == null}
        onDelete={handleDelete}
        onRewind={props.onRewind}
        canRewind={props.canRewind}
        onFastForward={props.onFastForward}
        canFastForward={props.canFastForward}
        onFindBlanks={props.onFindBlanks}
        undoAction={props.undoAction}
        canUndo={props.canUndo}
        pushAction={props.pushAction}
      />
    </div>
  );
};

const Wrapper = ({ width }: { width: number }) => {
  if (!width) return null;
  return <TimebarScreenContent width={width} />;
};

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactVirtualizedAutoSizer>{Wrapper}</ReactVirtualizedAutoSizer>
    </div>
  );
};

export default TimebarScreen;
