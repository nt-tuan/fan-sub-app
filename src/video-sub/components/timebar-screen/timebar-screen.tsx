import { useState, useMemo } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";

import { getMilisecondFromPx } from "@/utils/time-utils";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store/model";
import {
  useSubtitleEditorStore,
  useVideoPlayerStore,
} from "@/video-sub/components/provider";
import VideoPlayer from "@/video-sub/components/video-player/video-player";

import useTimelineEditor from "./provider/useTimelineEditor";
import { ResizeEventInterface } from "./components/subtitles/subtitle-block";
import Timeline from "./components/timeline";
import TimelineMenu from "./components/timeline-menu";
import { MINIMUM_BLOCK_SIZE } from "./constant";

const useTimebar = ({ width }: { width: number }) => {
  const halfOfContainer = width / 2;
  const { currentTime } = useVideoPlayerStore();
  const { editingSubtitles = [], updateSubtitle } = useTimelineEditor();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingSub, setEditingSub] = useState<SubtitleBlockInterface>(
    {} as SubtitleBlockInterface
  );

  const edittingSubOrginal = useMemo(() => {
    if (selectedIndex !== null)
      return editingSubtitles[selectedIndex as number];
    return undefined;
  }, [selectedIndex, editingSubtitles]);

  const { minFrom, maxTo } = useMemo(() => {
    if (selectedIndex == null) return { minFrom: 0, maxTo: 0 };
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

  const changePosition = (
    setAction: (state: SubtitleBlockInterface) => SubtitleBlockInterface,
    keepSize: boolean
  ) => {
    setEditingSub((preState) => {
      const state = setAction(preState);
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

      return {
        ...state,
        ...validOption,
      };
    });
  };

  const onResizeLeft = ({
    distanceDuration: extendDuration,
  }: ResizeEventInterface) => {
    const orginalFrom = edittingSubOrginal?.from ?? 0;
    changePosition((state) => {
      return {
        ...state,
        from: Math.min(
          state.to - MINIMUM_BLOCK_SIZE,
          orginalFrom + extendDuration
        ),
      };
    }, false);
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

  const onFocus = (index: number | null) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      setEditingSub(editingSubtitles[index as number]);
    }
  };

  const onMouseUp = () => {
    updateSubtitle(selectedIndex as number, editingSub);
  };

  const subtitles = useMemo(() => {
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
    onMouseUp,
    onMove,
    onResizeLeft,
    onResizeRight,
    editingSub,
  };
};

const Wrapper = ({ width }: { width: number }) => {
  if (!width) return null;
  return <TimebarScreenContent width={width} />;
};
const TimebarScreenContent = ({ width }: { width: number }) => {
  const props = useTimebar({ width });
  const deleteSubtitle = useSubtitleEditorStore(
    (store) => store.deleteSubtitle
  );
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (props.selectedIndex == null) return;
    deleteSubtitle(props.selectedIndex);
    props.onFocus(null);
  };

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
        <div style={{ height: 480, width: 640 }}>
          <VideoPlayer key="timeline-video" />
        </div>
      </div>
      <Timeline {...(props as any)} width={width} />
      <TimelineMenu
        onDelete={handleDelete}
        disabled={props.selectedIndex == null}
      />
    </div>
  );
};

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactVirtualizedAutoSizer>{Wrapper}</ReactVirtualizedAutoSizer>
    </div>
  );
};

export default TimebarScreen;
