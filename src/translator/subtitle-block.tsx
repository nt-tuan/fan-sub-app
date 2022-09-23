import React from "react";
import { useVideoStore } from "@/store";
import { formatTime } from "@/utils/format";
import { Divider, Input } from "antd";
import styles from "./styles.module.scss";

interface ISubtitle {
  from: number;
  to: number;
  text?: string;
}
export const SubtitleBlock = ({
  index,
  subtitle,
  defaultSubtitle,
  style,
}: {
  index: number;
  subtitle: ISubtitle;
  defaultSubtitle: ISubtitle;
  style?: React.CSSProperties;
}) => {
  const [localValue, setLocalValue] = React.useState(subtitle.text);
  const { changeSubtitleText } = useVideoStore();
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    changeSubtitleText(index, e.target.value);
  };
  return (
    <div style={style}>
      <div className={styles.subtitle_time_segment}>
        {formatTime(subtitle.from)} - {formatTime(subtitle.to)}
      </div>
      <div className={styles.subtitle_segment_preference}>
        {defaultSubtitle.text && "There is no reference subtitle."}
      </div>
      <Input.TextArea
        defaultValue={subtitle.text}
        onChange={handleChange}
        autoSize={{ minRows: 3, maxRows: 3 }}
      />
      <div className={styles.subtitle_segment_actions}>
        <a href="#">Cancel</a>
        <Divider type="vertical" />
        <a href="#">Save</a>
      </div>
    </div>
  );
};
