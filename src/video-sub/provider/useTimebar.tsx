import { useMemo, useState } from "react";

import { MINIMUM_BLOCK_SIZE } from "@/constant";
import {
  ResizeEventInterface,
  SubtitleBlock as SubtitleBlockInterface,
} from "@/store/model";
import { getMilisecondFromPx } from "@/utils/time-utils";
import {
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "@/video-sub/provider";

const DISTANCE_TIME_ENUM = 500;

const useTimebar = ({ width }: { width: number }) => {
  const halfOfContainer = width / 2;
  const { currentTime, endTime, goTo } = useVideoPlayerStore();

  const [editingSubtitles, setEditingSubtitles] = useSubtitleEditorStore(
    (state) => [state.editingSubtitles, state.setSubtitles]
  );

  const [editingBlock, setEditingBlock] = useSubtitleEditorStore((state) => [
    state.editingBlock,
    state.setEditingBlock,
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const updateSubtitle = (index: number, segment: SubtitleBlockInterface) => {
    const subtitlesTemp = editingSubtitles;
    if (subtitlesTemp == null) return;
    const newSubtitles = [...subtitlesTemp.map((item) => ({ ...item }))];
    newSubtitles[index].from = segment.from;
    newSubtitles[index].to = segment.to;
    setEditingSubtitles(newSubtitles);
  };

  const edittingSubOrginal = useMemo(() => {
    if (selectedIndex !== null && editingSubtitles)
      return editingSubtitles[selectedIndex as number];
  }, [selectedIndex, editingSubtitles]);

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

    setEditingBlock({ ...state, ...validOption });
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
      setEditingBlock(editingSubtitles[index]);
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

  const onRewind = () => {
    const newTime = currentTime - DISTANCE_TIME_ENUM;
    goTo(Math.max(0, newTime));
  };

  const onFastForward = () => {
    if (endTime) {
      const newTime = currentTime + DISTANCE_TIME_ENUM;
      goTo(Math.min(endTime, newTime));
    }
  };

  const onFindBlanks = () => {
    if (!editingSubtitles) return;
    const blankSubtitle = editingSubtitles?.find((sub) => !sub.text);
    if (blankSubtitle) goTo(blankSubtitle.from);
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
    onRewind,
    onFastForward,
    onFindBlanks,
    editingSub: editingBlock,
  };
};

export default useTimebar;
