import { Button, Space } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import {
  useSubtitleEditor,
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "@/video-sub/provider";
import { ActionInterface, ActionType } from "@/video-sub/provider/useUndo";
import {
  DeleteOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import styles from "./timeline-menu.module.scss";

interface TimelineMenuProps {
  disabled: boolean;
  canRewind?: boolean;
  canFastForward?: boolean;

  onDelete: (e: React.MouseEvent) => void;
  onRewind: () => void;
  onFastForward: () => void;
  onFindBlanks: () => void;

  canUndo?: boolean;
  undoAction: () => void;
  pushAction: (action: ActionInterface) => void;
  setCreatingSubtitle: (e: boolean) => void;
}

const TimelineMenu = ({
  disabled,
  onDelete,
  onRewind,
  canRewind,
  onFastForward,
  canFastForward,
  onFindBlanks,
  canUndo,
  undoAction,
  pushAction,
  setCreatingSubtitle,
}: TimelineMenuProps) => {
  const [createdSubtitleIndex, setCreatedSubtitleIndex] = useState<number>();
  const createSubtitle = useSubtitleEditorStore(
    (state) => state.createSubtitle
  );

  const [editingSubtitles = [], setEditingSubtitles] = useSubtitleEditorStore(
    (state) => [state.editingSubtitles, state.setSubtitles]
  );
  const { saveSubtitles } = useSubtitleEditor();
  const { currentTime, videoRef } = useVideoPlayerStore();

  const disabledAddBtn = useMemo(() => {
    return editingSubtitles.some((sub: SubtitleBlockInterface) => {
      return sub.from <= currentTime && currentTime <= sub?.to;
    });
  }, [editingSubtitles, currentTime]);

  const handleCreateSubtitle = useCallback(() => {
    if (videoRef?.current == null) return;
    videoRef.current.play();
    const handlePause = () => {
      setCreatedSubtitleIndex(undefined);
      videoRef.current?.removeEventListener("pause", handlePause);
    };
    videoRef.current.addEventListener("pause", handlePause);
    const index = createSubtitle(currentTime);
    setCreatedSubtitleIndex(index);
    if (index !== undefined && index >= 0) {
      pushAction({ type: ActionType.Delete, index });
      setCreatingSubtitle(true);
    }
  }, [currentTime, videoRef, createSubtitle, pushAction, setCreatingSubtitle]);

  useEffect(() => {
    if (createdSubtitleIndex == null) {
      setCreatingSubtitle(false);
      return;
    }
    const next = editingSubtitles[createdSubtitleIndex + 1];
    if (next && next.from <= currentTime) {
      setCreatedSubtitleIndex(undefined);
      editingSubtitles[createdSubtitleIndex].to = next.from;
      setEditingSubtitles(editingSubtitles);
      return;
    }
    editingSubtitles[createdSubtitleIndex].to = currentTime;
    setEditingSubtitles(editingSubtitles);
  }, [
    currentTime,
    editingSubtitles,
    createdSubtitleIndex,
    setEditingSubtitles,
    setCreatingSubtitle,
  ]);

  return (
    <div className={styles.timeline_menu_container}>
      <Space>
        <Button
          onClick={handleCreateSubtitle}
          disabled={disabledAddBtn}
          type="primary"
          icon={<PlusOutlined />}
          size="large"
        >
          Subtitle
        </Button>
        <Button
          disabled={!canRewind}
          onClick={onRewind}
          icon={<DoubleLeftOutlined />}
          size="large"
        />
        <Button
          disabled={!canFastForward}
          onClick={onFastForward}
          icon={<DoubleRightOutlined />}
          size="large"
        />
        <Button
          disabled={disabled}
          onClick={onDelete}
          icon={<DeleteOutlined />}
          size="large"
        />
        <Button
          disabled={!canUndo}
          onClick={undoAction}
          icon={<UndoOutlined />}
          size="large"
        />
        <Button onClick={() => saveSubtitles(editingSubtitles)} size="large">
          Save
        </Button>
        <Button
          ghost
          onClick={onFindBlanks}
          size="large"
          icon={<SearchOutlined />}
        >
          Find blanks
        </Button>
      </Space>
    </div>
  );
};

export default TimelineMenu;
