import { Button, Checkbox, Input, Space, Typography } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";

import { useSubtitleEditor, useVideoPlayerStore } from "@/video-sub/provider";
import useFindWords from "@/video-sub/provider/useFindWords";
import { CloseOutlined } from "@ant-design/icons";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import styles from "./styles.module.scss";

interface FindWordModalProps {
  isModalOpen: boolean;
  onCancel: () => void;
}

const FindWordModal = ({ isModalOpen, onCancel }: FindWordModalProps) => {
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [replaceInput, setReplaceInput] = useState<string>("");
  const [findWords, setFindWords] = useState<string>("");

  const { subIndexFindedOut, findNext, setCurrentFocus, replaceWords } =
    useFindWords(findWords, matchCase);

  const debounceChangeFindWords = useMemo(
    () =>
      debounce((value) => {
        setFindWords(value);
        setCurrentFocus(-1);
      }, 400),
    [setFindWords, setCurrentFocus]
  );

  const handleChangeFindWords = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounceChangeFindWords(e.target.value);
    },
    [debounceChangeFindWords]
  );

  const onChangeReplaceWord = (event: React.ChangeEvent<HTMLInputElement>) =>
    setReplaceInput(event.target.value);

  const handleReplace = () => {
    if (subIndexFindedOut.length > 0) replaceWords(findWords, replaceInput);
  };
  const handleReplaceAll = () => {};

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
  }));
  const bind = useDrag(({ down, offset: [mx, my] }) => {
    api.start({ x: mx, y: my, immediate: down });
  });

  if (!isModalOpen) return null;
  return (
    <animated.div style={{ position: "fixed", x, y, zIndex: 100 }}>
      <div className={styles.find_modal}>
        <Space className={styles.find_modal_title} {...bind()}>
          <Typography.Title level={4}>Find Word</Typography.Title>
          <Button
            style={{ border: "none", backgroundColor: "#fafafa" }}
            size="middle"
            onClick={onCancel}
            icon={<CloseOutlined />}
          />
        </Space>
        <div className={styles.find_modal_body}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%", flex: 1 }}>
              <Space align="end">
                <Space direction="vertical">
                  <Typography.Text>Find what?</Typography.Text>
                  <Input
                    placeholder="Find word"
                    size="large"
                    onChange={handleChangeFindWords}
                  />
                </Space>
                <Button type="primary" size="large" onClick={findNext}>
                  Find Next
                </Button>
                <Button size="large" onClick={onCancel}>
                  Close
                </Button>
              </Space>
              <Checkbox
                onChange={() => setMatchCase((state) => !state)}
                checked={matchCase}
              >
                Match case
              </Checkbox>
            </Space>
            <Space align="end">
              <Space direction="vertical">
                <Typography.Text>Replace with</Typography.Text>
                <Input
                  placeholder="Replace"
                  size="large"
                  onChange={onChangeReplaceWord}
                />
              </Space>
              <Button
                size="large"
                onClick={handleReplace}
                disabled={subIndexFindedOut.length === 0}
              >
                Replace
              </Button>
              <Button size="large" onClick={handleReplaceAll}>
                Replace All
              </Button>
            </Space>
          </Space>
        </div>
      </div>
    </animated.div>
  );
};

export default FindWordModal;
