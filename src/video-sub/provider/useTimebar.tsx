import { useMemo, useState } from "react";

import { MINIMUM_BLOCK_SIZE } from "@/constant";
import {
  ResizeEventInterface,
  SubtitleBlock as SubtitleBlockInterface,
} from "@/store/model";
import { getMilisecondFromPx } from "@/utils/time-utils";
import { useSubtitleEditor, useVideoPlayerStore } from "@/video-sub/provider";

import useUndo, { ActionType } from "./useUndo";

const useTimebar = ({ width }: { width: number }) => {
  const halfOfContainer = width / 2;
  const { currentTime } = useVideoPlayerStore();

  const {
    findBlankIndex,
    editingSubtitles,
    setEditingSubtitles,
    editingBlock,
    setEditingBlock,
  } = useSubtitleEditor();

  const { pushAction, popAction, canUndo } = useUndo();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const edittingSubOrginal = useMemo(() => {
    if (selectedIndex !== null && editingSubtitles)
      return editingSubtitles[selectedIndex as number];
  }, [selectedIndex, editingSubtitles]);

  const updateSubtitle = (index: number, segment: SubtitleBlockInterface) => {
    const subtitlesTemp = editingSubtitles;
    if (subtitlesTemp == null) return;
    const newSubtitles = [...subtitlesTemp.map((item) => ({ ...item }))];
    newSubtitles[index].from = segment.from;
    newSubtitles[index].to = segment.to;
    setEditingSubtitles(newSubtitles);
    pushAction({ type: ActionType.Edit, index, subtitle: edittingSubOrginal });
  };

  const { minFrom, maxTo } = useMemo(() => {
    if (selectedIndex == null || !editingSubtitles)
      return { minFrom: 0, maxTo: 0 };
    const prevSub = editingSubtitles[(selectedIndex as number) - 1];
    const minFrom = selectedIndex === 0 ? 0 : prevSub.to;
    const maxTo =
      selectedIndex === editingSubtitles.length - 1
        ? editingSubtitles[selectedIndex].to
        : editingSubtitles[(selectedIndex as number) + 1].from;
    return {
      minFrom,
      maxTo,
    };
  }, [editingSubtitles, selectedIndex]);

  const canFastForward =
    editingBlock && editingBlock.to + MINIMUM_BLOCK_SIZE <= maxTo;
  const canRewind =
    editingBlock && editingBlock.from - MINIMUM_BLOCK_SIZE >= minFrom;

  // start: resize handler
  const changePosition = (
    setAction: (state: SubtitleBlockInterface) => SubtitleBlockInterface,
    keepSize: boolean
  ) => {
    if (editingBlock == null) return;
    const state = setAction(editingBlock);
    const from = Math.max(minFrom, state.from);
    const to = Math.min(maxTo, state.to);
    const length = state.to - state.from;
    const option1 = { from, to };
    const option2 = { from, to: from + length };
    const option3 = { from: to - length, to };
    const options = [option1, option2, option3];
    const validOption =
      options.find(
        (option) =>
          option.from >= minFrom &&
          option.to <= maxTo &&
          (!keepSize || option.from - option.to === state.from - state.to) &&
          option.to - option.from > MINIMUM_BLOCK_SIZE
      ) ?? state;

    setEditingBlock({ ...state, ...validOption }, false);
  };

  const onResizeLeft = ({
    distanceDuration: extendDuration,
  }: ResizeEventInterface) => {
    const orginalFrom = edittingSubOrginal?.from ?? 0;
    changePosition(
      (state) => ({
        ...state,
        from: Math.min(
          state.to - MINIMUM_BLOCK_SIZE,
          orginalFrom + extendDuration
        ),
      }),
      false
    );
  };

  const onResizeRight = ({
    distanceDuration: extendDuration,
  }: ResizeEventInterface) => {
    const orginalTo = edittingSubOrginal?.to ?? 0;

    changePosition((state) => {
      return {
        ...state,
        to: Math.max(
          state.from + MINIMUM_BLOCK_SIZE,
          orginalTo + extendDuration
        ),
      };
    }, false);
  };

  // move subtitle
  const onMove = ({ distanceDuration }: ResizeEventInterface) => {
    const orginalFrom = edittingSubOrginal?.from ?? 0;
    const orginalTo = edittingSubOrginal?.to ?? 0;

    changePosition((state) => {
      return {
        ...state,
        to: orginalTo + distanceDuration,
        from: orginalFrom + distanceDuration,
      };
    }, true);
  };

  // click to subtitle
  const onFocus = (index: number) => {
    if (index !== selectedIndex && editingSubtitles) {
      setSelectedIndex(index);
      setEditingBlock(editingSubtitles[index], false);
    }
  };

  // unclick to subtitle
  const onUnfocus = () => {
    setSelectedIndex(null);
    setEditingBlock();
  };

  const onMouseUp = () => {
    if (!editingBlock) return;
    updateSubtitle(selectedIndex as number, editingBlock);
  };
  // end: resize handler

  // start: move subtitle block when click onRewind, onFastForward
  const moveSubtitleBlock = (distance: number) => {
    if (!editingBlock) return;
    const orginalFrom = editingBlock?.from ?? 0;
    const orginalTo = editingBlock?.to ?? 0;
    changePosition(
      (state) => ({
        ...state,
        to: orginalTo + distance,
        from: orginalFrom + distance,
      }),
      true
    );
    updateSubtitle(selectedIndex as number, {
      ...editingBlock,
      to: orginalTo + distance,
      from: orginalFrom + distance,
    });
  };

  const onRewind = () => moveSubtitleBlock(-1 * MINIMUM_BLOCK_SIZE);
  const onFastForward = () => moveSubtitleBlock(MINIMUM_BLOCK_SIZE);
  // end: move subtitle block when click onRewind, onFastForward

  const onFindBlanks = () => {
    if (!editingSubtitles) return;
    const blankSubtitleIndex = findBlankIndex();
    if (blankSubtitleIndex == null) return;
    const blankSubtitle = editingSubtitles[blankSubtitleIndex];
    if (blankSubtitle) {
      setSelectedIndex(blankSubtitleIndex);
    }
  };

  const subtitles = useMemo(() => {
    if (!editingSubtitles) return;
    const minTimelineRender =
      currentTime - getMilisecondFromPx(halfOfContainer) * 3;
    const maxTimelineRender =
      currentTime + getMilisecondFromPx(halfOfContainer) * 3;

    return editingSubtitles
      .map((sub, index) => ({ ...sub, index }))
      .filter(
        (subtitle) =>
          minTimelineRender <= subtitle.from && subtitle.to <= maxTimelineRender
      )
      .map((item) => item.index);
  }, [editingSubtitles, halfOfContainer, currentTime]);

  return {
    subtitles,
    editingSubtitles,
    selectedIndex,
    onFocus,
    onUnfocus,
    onMouseUp,
    onMove,
    onResizeLeft,
    onResizeRight,

    canFastForward,
    onFastForward,
    canRewind,
    onRewind,

    onFindBlanks,

    canUndo,
    undoAction: popAction,
    pushAction,
    editingSub: editingBlock,
  };
};

export default useTimebar;
