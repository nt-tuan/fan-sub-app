import React from "react";
import Konva from "konva";
import { useVideoPlayerStore } from "@/store";
import styles from "./timeline.module.scss";
import { formatTime } from "@/utils/format";

interface Size {
  width: number;
  height: number;
}

const MILISECOND_TO_PIXEL = 50 / 1000;
const getMilestoneGroup = (endTime: number, size: Size) => {
  const group = new Konva.Group({
    ...size,
    rotation: 0,
  });
  for (let i = 0; i <= endTime; i += 200) {
    const x = i * MILISECOND_TO_PIXEL;
    const lineConfig = {
      x,
      y: 30,
      width: 2,
      height: i % 1000 === 0 ? 50 : 20,
      fill: "#3A3D46",
    };
    if (i % 1000 === 0) {
      const text = new Konva.Text({
        x: x - 13,
        y: 15,
        text: formatTime(i),
        align: "center",
        fontSize: 12,
      });

      group.add(text);
    }
    const rect = new Konva.Rect(lineConfig);
    group.add(rect);
  }
  return group;
};

export const Timeline = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const { currentTime, endTime } = useVideoPlayerStore();

  const milestone = React.useRef<{ group: Konva.Group; stage: Konva.Stage }>();
  React.useEffect(() => {
    if (endTime == null) return;
    const stage = new Konva.Stage({
      container: styles.timeline, // id of container <div>
      width,
      height,
    });
    const group = getMilestoneGroup(endTime ?? 1615343, { width, height });

    const layer = new Konva.Layer();
    layer.add(group);
    stage.add(layer);
    milestone.current = { group, stage };
  }, [endTime, width, height]);

  React.useEffect(() => {
    if (milestone.current?.group == null) return;
    const nextX = -currentTime * MILISECOND_TO_PIXEL;
    console.log(nextX);
    milestone.current?.group.setAttrs({
      x: -currentTime * MILISECOND_TO_PIXEL,
      y: 0,
    });
  }, [currentTime, height]);

  return <div id={styles.timeline} style={{ width, height }}></div>;
};
