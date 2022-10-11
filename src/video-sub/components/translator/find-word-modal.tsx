import { Button, Checkbox, Input, Space, Typography } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";

import useSearchReplace from "@/video-sub/provider/useSearchReplace";
import { CloseOutlined } from "@ant-design/icons";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import styles from "./styles.module.scss";

// import { useSubtitleEditor, useVideoPlayerStore } from "@/video-sub/provider";

interface FindWordModalProps {
  isModalOpen: boolean;
  onCancel: () => void;
}

const FindWordModal = ({ isModalOpen, onCancel }: FindWordModalProps) => {
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [alternativeInput, setAlternativeInput] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const {
    subIndexFoundOut,
    findNext,
    currentFocus,
    setCurrentFocus,
    replaceWords,
    replaceAllWords,
  } = useSearchReplace(searchInput, matchCase);

  // Search Input
  const debounceChangeSearchInput = useMemo(
    () =>
      debounce((value) => {
        setSearchInput(value);
        setCurrentFocus(-1);
      }, 400),
    [setSearchInput, setCurrentFocus]
  );
  const handleChangeSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounceChangeSearchInput(e.target.value);
    },
    [debounceChangeSearchInput]
  );
  // Alternative Input
  const debounceChangeAlternativeInput = debounce(setAlternativeInput, 400);
  const onChangeReplaceWord = (event: React.ChangeEvent<HTMLInputElement>) =>
    debounceChangeAlternativeInput(event.target.value);

  const handleReplace = () => {
    if (subIndexFoundOut.length > 0)
      replaceWords(searchInput, alternativeInput);
  };
  const handleReplaceAll = () => {
    if (subIndexFoundOut.length > 0)
      replaceAllWords(searchInput, alternativeInput);
  };

  // move window handler
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
        <Space
          className={styles.find_modal_title}
          style={{ touchAction: "none" }}
          {...bind()}
        >
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
                  <Typography.Text>
                    Find what?{" "}
                    <span>
                      {subIndexFoundOut.length === 0
                        ? "No results"
                        : `(${currentFocus + 1}/${subIndexFoundOut.length})`}
                    </span>
                  </Typography.Text>
                  <Input
                    placeholder="Find word"
                    size="large"
                    onChange={handleChangeSearchInput}
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
                disabled={subIndexFoundOut.length === 0}
              >
                Replace
              </Button>
              <Button
                size="large"
                onClick={handleReplaceAll}
                disabled={subIndexFoundOut.length === 0}
              >
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
