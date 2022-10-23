import { useMemo, useState } from "react";

import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { useSubtitleEditor } from "../../provider";
import styles from "./video-player.module.scss";

export const VideoSubtitleDisplayer = () => {
  const { getCurrentSubtitleByTime, saveCurrentSubtitlePosition } =
    useSubtitleEditor();
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
    const currentPercentX =
      currentSub?.position?.x ??
      ((parentSize.width - childSize.width) * 100) / 2 / parentSize.width;
    const currentPercentY =
      currentSub?.position?.y ??
      ((parentSize.height - childSize.height - 40) * 100) / parentSize.height;

    const _x = (currentPercentX * parentSize.width) / 100;
    const _y = (currentPercentY * parentSize.height) / 100;

    return {
      x: Math.min(Math.max(_x, 0), parentSize.width - childSize.width),
      y: Math.min(Math.max(_y, 0), parentSize.height - childSize.height),
    };
  }, [parentSize, currentSub, childSize]);

  const bounds = useMemo(() => {
    return {
      left: -defaultPosition.x,
      top: -defaultPosition.y,
      right: parentSize.width - childSize.width - defaultPosition.x,
      bottom: parentSize.height - childSize.height - defaultPosition.y,
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
        saveCurrentSubtitlePosition({ x: percentX, y: percentY });
      }

      api.start({ x: _x, y: _y, immediate: true });
    },
    {
      bounds,
      from: () => [0, 0],
    }
  );

  if (currentSub == null) return null;

  return (
    <div
      key={`${defaultPosition.x}_${defaultPosition.y}`}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        key={`${defaultPosition.x}_${defaultPosition.y}`}
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
