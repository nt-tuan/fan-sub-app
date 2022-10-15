import { Button, Divider } from "antd";
import classnames from "classnames";
import debounce from "lodash.debounce";
import React from "react";
import { useEffect } from "react";
import { useCallback } from "react";

import useOutsideClick from "@/hooks/use-outside-click";
import { formatTime } from "@/utils/format";
import { SaveFilled } from "@ant-design/icons";

import { useSubtitleEditor } from "../../provider";
import styles from "./styles.module.scss";

export const SubtitleBlock = ({
  index,
  style,
}: {
  index: number;
  style?: React.CSSProperties;
}) => {
  const {
    isActiveSubtitle,
    editingSubtitles,
    refSubtitles,
    focus,
    unfocus,
    changeSubtitleText,
    getDefaultSubtitleText,
    saveSubtitle,
    cancelSubtitle,
    isModalOpen,
  } = useSubtitleEditor();

  const subtitle = editingSubtitles?.[index];
  const refSubtitle = refSubtitles?.[index];
  const isActive = subtitle && isActiveSubtitle(subtitle);

  const [isSaved, setSaved] = React.useState<boolean>(false);
  const [isDirty, setDirty] = React.useState<boolean>(false);

  const ref = React.useRef<HTMLTextAreaElement>(null);
  useOutsideClick(ref, unfocus);

  const debounceChangeSubtitle = React.useMemo(
    () => debounce(changeSubtitleText, 300),
    [changeSubtitleText]
  );
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      debounceChangeSubtitle(index, e.target.value);
      setDirty(true);
    },
    [index, debounceChangeSubtitle]
  );

  const handleSave = useCallback(() => {
    saveSubtitle(index);
    setDirty(false);
    setSaved(true);
  }, [index, saveSubtitle]);

  const onFocus = () => {
    if (!subtitle) return;
    focus(subtitle);
  };

  const onCancel = () => {
    cancelSubtitle(index);
    setDirty(false);
    if (ref.current && subtitle?.text != null)
      ref.current.value = getDefaultSubtitleText(index);
  };

  const onSave = () => handleSave();

  // for replace word modal
  React.useEffect(() => {
    if (ref.current && isModalOpen) ref.current.value = subtitle?.text ?? "";
  }, [ref, subtitle?.text, isModalOpen]);

  // unfocus handler
  useEffect(() => {
    if (isDirty && !isActive) handleSave();
  }, [isActive, isDirty, handleSave]);

  if (subtitle == null)
    return <div style={style} className={styles.segment_container}></div>;

  return (
    <div
      style={style}
      className={classnames(styles.subtitle_block, {
        [styles.subtitle_segment_active]: isActive,
      })}
      onClick={onFocus}
    >
      <div className={styles.subtitle_time_segment}>
        {formatTime(subtitle.from)} - {formatTime(subtitle.to)}
      </div>
      <div className={styles.subtitle_segment_preference}>
        {refSubtitle?.text || "There is no reference subtitle."}
      </div>
      <textarea
        ref={ref}
        className={styles.subtitle_input}
        defaultValue={subtitle.text}
        onChange={handleChange}
        rows={3}
      />
      <div className={styles.subtitle_segment_actions}>
        <Button
          className={styles.subtitle_segment_action_item}
          type="text"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Divider type="vertical" />
        <Button
          className={classnames(
            styles.subtitle_segment_action_item,
            styles[
              isDirty
                ? "subtitle_segment_action_item_unsaved"
                : isSaved
                ? "subtitle_segment_action_item_saved"
                : "subtitle_segment_action_item_default"
            ]
          )}
          onClick={onSave}
          type="text"
        >
          {isDirty || !isSaved ? "Save" : "Saved"}
        </Button>
      </div>
    </div>
  );
};
