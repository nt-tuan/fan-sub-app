import React from "react";
import { useVideoPlayerStore, useVideoStore } from "@/store";
import { formatTime } from "@/utils/format";
import { Button, Divider, Input } from "antd";
import styles from "./styles.module.scss";
import debounce from "lodash.debounce";
import classnames from "classnames";

export const SubtitleBlock = ({
  index,
  style,
}: {
  index: number;
  style?: React.CSSProperties;
}) => {
  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const getCurrentSubtitle = useVideoStore((state) => state.getCurrentSubtitle);
  const subtitle = useVideoStore((state) => state.subtitles?.[index]);
  const changeSubtitleText = useVideoStore((state) => state.changeSubtitleText);
  const goTo = useVideoPlayerStore((state) => state.goTo);
  const defaultSubtitle = useVideoStore(
    (state) => state.defaultSubtitles?.[index]
  );

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
    goTo(subtitle.from);
  };
  const currentSubtitle = getCurrentSubtitle(currentTime);
  if (subtitle == null || defaultSubtitle == null)
    return <div style={style} className={styles.segment_container}></div>;
  return (
    <div style={style} className={styles.segment_container}>
      <div
        className={classnames(styles.subtitle_time_segment, {
          [styles.subtitle_time_segment_active]:
            currentSubtitle?.from === subtitle.from,
        })}
      >
        {formatTime(subtitle.from)} - {formatTime(subtitle.to)}
      </div>
      <div className={styles.subtitle_segment_preference}>
        {defaultSubtitle.text && "There is no reference subtitle."}
      </div>
      <Input.TextArea
        onFocus={handleFocus}
        className={styles.subtitle_input}
        defaultValue={subtitle.text}
        onChange={handleChange}
        autoSize={{ minRows: 3, maxRows: 3 }}
      />
      <div className={styles.subtitle_segment_actions}>
        <Button className={styles.subtitle_segment_action_item} type="text">
          Cancel
        </Button>
        <Divider type="vertical" />
        <Button className={styles.subtitle_segment_action_item} type="text">
          Save
        </Button>
      </div>
    </div>
  );
};
