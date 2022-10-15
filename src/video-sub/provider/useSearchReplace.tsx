import { useCallback, useMemo, useState } from "react";

import { useSubtitleEditor, useVideoPlayerStore } from ".";

const useSearchReplace = (words: string, matchCase: boolean) => {
  const {
    editingSubtitles,
    findSubIndexByWords,
    setEditingBlock,
    replaceSubtitleContent,
    replaceAllSubtitleContent,
  } = useSubtitleEditor();

  const { goTo } = useVideoPlayerStore();
  const [currentFocus, setCurrentFocus] = useState<number>(-1);

  const subIndexFoundOut: number[] = useMemo(
    () => findSubIndexByWords(words, matchCase),
    [words, matchCase, findSubIndexByWords]
  );

  const findNextHandler = useCallback(
    (index: number) => {
      if (
        editingSubtitles != null &&
        editingSubtitles[subIndexFoundOut[index]]
      ) {
        goTo(editingSubtitles[subIndexFoundOut[index]].from);
        setEditingBlock(editingSubtitles[subIndexFoundOut[index]]);
        setCurrentFocus((c) => (subIndexFoundOut[c + 1] ? c + 1 : 0));
      }
    },
    [editingSubtitles, goTo, setEditingBlock, subIndexFoundOut]
  );

  const findNext = useCallback(() => {
    if (editingSubtitles == null || subIndexFoundOut.length === 0) {
      window.alert("No results");
      return;
    }

    const index = subIndexFoundOut[currentFocus + 1] ? currentFocus + 1 : 0;
    findNextHandler(index);
  }, [currentFocus, editingSubtitles, subIndexFoundOut, findNextHandler]);

  const replaceWords = useCallback(
    (searchInput: string, alternativeInput: string) => {
      replaceSubtitleContent(
        subIndexFoundOut[currentFocus],
        searchInput,
        alternativeInput,
        findNext
      );
    },
    [currentFocus, replaceSubtitleContent, subIndexFoundOut, findNext]
  );

  const replaceAllWords = useCallback(
    (searchInput: string, alternativeInput: string) => {
      replaceAllSubtitleContent(
        subIndexFoundOut,
        searchInput,
        alternativeInput,
        () => setCurrentFocus(-1)
      );
    },
    [replaceAllSubtitleContent, subIndexFoundOut]
  );

  return {
    subIndexFoundOut,
    findNext,
    currentFocus,
    setCurrentFocus,
    replaceWords,
    replaceAllWords,
  };
};

export default useSearchReplace;
