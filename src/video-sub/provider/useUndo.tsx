import { useCallback, useState } from "react";

import { SubtitleBlock as SubtitleBlockInterface } from "@/store/model";

import { useSubtitleEditorStore } from ".";

export enum ActionType {
  Edit,
  Delete,
  Create,
}
export interface ActionInterface {
  type: ActionType;
  index: number;
  subtitle?: SubtitleBlockInterface;
}

const useUndo = () => {
  const [editingSubtitles, setEditingSubtitles, deleteSubtitle] =
    useSubtitleEditorStore((state) => [
      state.editingSubtitles,
      state.setSubtitles,
      state.deleteSubtitle,
    ]);

  const [actions, setActions] = useState<ActionInterface[]>([]);

  const undoEdit = (action: ActionInterface) => {
    const subtitlesTemp = editingSubtitles;
    const { index, subtitle } = action;
    if (subtitlesTemp == null || subtitle === undefined) return;
    const newSubtitles = [...subtitlesTemp.map((item) => ({ ...item }))];
    newSubtitles[index].from = subtitle.from;
    newSubtitles[index].to = subtitle.to;
    setEditingSubtitles(newSubtitles);
  };

  const createSubtitle = (action: ActionInterface) => {
    const subtitlesTemp = editingSubtitles;
    const { index, subtitle } = action;
    if (subtitlesTemp == null || subtitle === undefined) return;
    const left = subtitlesTemp.slice(0, index);
    const right = subtitlesTemp.slice(index, subtitlesTemp.length);
    setEditingSubtitles([...left, subtitle, ...right]);
  };

  const handleAction = (action: ActionInterface) => {
    switch (action.type) {
      case ActionType.Edit:
        undoEdit(action);
        break;
      case ActionType.Delete:
        deleteSubtitle(action.index);
        break;
      case ActionType.Create:
        createSubtitle(action);
        break;
      default:
        break;
    }
  };

  const pushAction = useCallback((action: ActionInterface) => {
    setActions((a) => [...a, action]);
  }, []);

  const popAction = () => {
    let actionsTemp = actions;
    const action = actionsTemp.pop();
    if (action) handleAction(action);
    setActions(actionsTemp);
  };

  const canUndo = actions.length > 0;
  return { actions, pushAction, popAction, canUndo };
};

export default useUndo;
