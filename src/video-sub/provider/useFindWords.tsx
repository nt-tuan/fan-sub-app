import { useCallback, useMemo, useState } from "react";

import { useSubtitleEditor, useVideoPlayerStore } from ".";

const useFindWords = (words: string, matchCase: boolean) => {
  const {
    editingSubtitles,
    findWordsIndex,
    setEditingBlock,
    replaceSubtitleContent,
  } = useSubtitleEditor();

  const { goTo } = useVideoPlayerStore();
  const [currentFocus, setCurrentFocus] = useState<number>(-1);

  const subIndexFindedOut = useMemo(
    () => findWordsIndex(words, matchCase),
    [words, matchCase, findWordsIndex]
  );

  const findNext = useCallback(() => {
    if (editingSubtitles == null || subIndexFindedOut.length === 0) {
      window.alert("No results");
      return;
    }

    const index = subIndexFindedOut[currentFocus + 1] ? currentFocus + 1 : 0;
    if (editingSubtitles[subIndexFindedOut[index]]) {
      goTo(editingSubtitles[subIndexFindedOut[index]].from);
      setEditingBlock(editingSubtitles[subIndexFindedOut[index]]);
      setCurrentFocus((c) => (subIndexFindedOut[c + 1] ? c + 1 : 0));
    }
  }, [
    currentFocus,
    editingSubtitles,
    subIndexFindedOut,
    goTo,
    setEditingBlock,
  ]);

  const replaceWords = useCallback(
    (findWords: string, replace: string) => {
      replaceSubtitleContent(
        subIndexFindedOut[currentFocus],
        findWords,
        replace,
        () => setCurrentFocus((c) => (subIndexFindedOut[c + 1] ? c + 1 : 0))
      );
    },
    [currentFocus, replaceSubtitleContent, subIndexFindedOut]
  );

  return { subIndexFindedOut, findNext, setCurrentFocus, replaceWords };
};

export default useFindWords;
