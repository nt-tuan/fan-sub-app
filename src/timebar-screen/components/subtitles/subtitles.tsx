import SubtitleBlock from "./subtitle-block";
import styles from "./subtitles.module.scss";
import { SubtitleBlock as SubtitleBlockInterface } from "@/store";
import { useMemo, useState, useRef } from "react";
import useTimelineEditor from "../../provider/useTimelineEditor";
import { ResizeEventInterface } from "./subtitle-block";

const Subtitles = ({ getParentElement }: any) => {
  const subContainerRef = useRef<any>(null);
  const editingSubRef = useRef<SubtitleBlockInterface | null>(null);
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
      const validOption = keepSize
        ? options.find(
            (option) =>
              option.from >= minFrom &&
              option.to <= maxTo &&
              option.from - option.to === state.from - state.to
          ) ?? state
        : option1;
      console.log(
        { minFrom, maxTo, validOption, options, length },
        options.map(
          (option) =>
            option.from >= minFrom &&
            option.to <= maxTo &&
            from - to === state.from - state.to
        )
      );
      editingSubRef!.current = {
        ...state,
        ...validOption,
      };
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
        from: orginalFrom + extendDuration,
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
        to: orginalTo + extendDuration,
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
      console.log(" onFocus :");
      setSelectedIndex(index);
      setEditingSub(editingSubtitles[index as number]);
      editingSubRef!.current = editingSubtitles[index as number];
    }
  };

  const onMouseUp = () => {
    updateSubtitle(
      selectedIndex as number,
      editingSubRef?.current as SubtitleBlockInterface
    );
  };

  const nSubtitleSegments = 10;

  return (
    <div ref={subContainerRef} className={styles.subtitles_container}>
      {Array.from(Array(nSubtitleSegments).keys()).map((_, index) => {
        const isActive = selectedIndex === index;
        const subtitle = isActive ? editingSub : editingSubtitles[index];
        return (
          <SubtitleBlock
            key={`${index}-key`}
            index={index}
            isActive={isActive}
            subtitle={subtitle}
            getParentElement={getParentElement}
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
