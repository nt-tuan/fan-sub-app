import { useMemo, useRef, useState } from "react";

import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { useSubtitleEditor } from "../../provider";
import styles from "./video-player.module.scss";

export const VideoSubtitleDisplayer = () => {
  const { getCurrentSubtitleByTime } = useSubtitleEditor();
  const currentSub = getCurrentSubtitleByTime();
  const [parentSize, setParentSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [childSize, setChildSize] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const defaultPosition = useMemo(() => {
    const currentPercentX = 0;
    const currentPercentY = -40;
    const _x = (currentPercentX * parentSize.width) / 100;
    const _y = (currentPercentY * parentSize.height) / 100;

    return {
      x: _x,
      y: _y,
    };
  }, [parentSize]);

  const bounds = useMemo(() => {
    const maxX = (parentSize.width - childSize.width) / 2;
    const maxTop =
      (parentSize.height - childSize.height) / 2 + defaultPosition.y;
    const maxBotom =
      (parentSize.height - childSize.height) / 2 - defaultPosition.y;
    return {
      left: -maxX,
      right: maxX,
      top: -maxTop,
      bottom: maxBotom,
    };
  }, [childSize, parentSize, defaultPosition]);

  const [{ x, y }, api] = useSpring(
    () => ({ ...defaultPosition, immediate: true }),
    [defaultPosition]
  );

  const bind = useDrag(
    ({ last, offset: [ox, oy] }) => {
      const { width, height } = parentSize;
      let _x = ox + defaultPosition.x;
      let _y = oy + defaultPosition.y;
      const percentX = (_x * 100) / width;
      const percentY = (_y * 100) / height;
      if (last) {
        console.log("todo: save percent", percentX, percentY);
      }
      api.start({ x: _x, y: _y, immediate: true });
    },
    {
      bounds,
    }
  );
  if (currentSub == null) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={(node) => {
        const parentNode = node?.parentElement;
        if (parentNode) {
          const {
            width,
            height,
            x: _x,
            y: _y,
          } = parentNode.getBoundingClientRect();
          if (
            width !== parentSize.width ||
            height !== parentSize.height ||
            _x !== parentSize.x ||
            _y !== parentSize.y
          ) {
            setParentSize({
              width,
              height,
              x: _x,
              y: _y,
            });
          }
        }
      }}
    >
      <animated.div
        className={styles.subtitle_container}
        {...bind()}
        style={{ x, y, touchAction: "none" }}
        ref={(node) => {
          if (node) {
            const {
              width,
              height,
              x: _x,
              y: _y,
            } = node.getBoundingClientRect();
            if (
              width !== childSize.width ||
              height !== childSize.height ||
              _x !== childSize.x ||
              _y !== childSize.y
            ) {
              setChildSize({
                width,
                height,
                x: _x,
                y: _y,
              });
            }
          }
        }}
      >
        <div className={styles.subtitle_text}>{currentSub?.text ?? ""}</div>
      </animated.div>
    </div>
  );
};
