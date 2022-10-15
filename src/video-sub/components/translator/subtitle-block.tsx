import { Button, Divider } from "antd";
import classnames from "classnames";
import debounce from "lodash.debounce";
import React from "react";

import useOutsideClick from "@/hooks/use-outside-click";
import { formatTime } from "@/utils/format";

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
  const debounceChangeSubtitle = React.useMemo(
    () => debounce(changeSubtitleText, 300),
    [changeSubtitleText]
  );
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      debounceChangeSubtitle(index, e.target.value);
    },
    [index, debounceChangeSubtitle]
  );
  const handleFocus = () => {
    if (!subtitle) return;
    focus(subtitle);
  };

  const ref = React.useRef<HTMLTextAreaElement>(null);
  useOutsideClick(ref, unfocus);

  const handleCancel = () => {
    cancelSubtitle(index);
    if (ref.current && subtitle?.text != null)
      ref.current.value = getDefaultSubtitleText(index);
  };

  // for replace word modal
  React.useEffect(() => {
    if (ref.current && isModalOpen) ref.current.value = subtitle?.text ?? "";
  }, [ref, subtitle?.text, isModalOpen]);

  const isActive = subtitle && isActiveSubtitle(subtitle);
  if (subtitle == null)
    return <div style={style} className={styles.segment_container}></div>;
  return (
    <div
      style={style}
      className={classnames(styles.subtitle_block, {
        [styles.subtitle_segment_active]: isActive,
      })}
      onClick={handleFocus}
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
        // value={subtitle.text}
        onChange={handleChange}
        rows={3}
      />
      <div className={styles.subtitle_segment_actions}>
        <Button
          className={styles.subtitle_segment_action_item}
          type="text"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Divider type="vertical" />
        <Button
          className={styles.subtitle_segment_action_item}
          onClick={() => saveSubtitle(index)}
          type="text"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
