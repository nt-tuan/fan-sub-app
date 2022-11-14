import { Col, Row } from "antd";
import React from "react";

import VideoPlayer from "@/video-sub/components/video-player/video-player";

import { useSubtitleEditor } from "../../provider";
import styles from "./styles.module.scss";
import { SubtitleForm } from "./subtitle-form";

export const Translator = () => {
  const { unfocus, setBlankIndex } = useSubtitleEditor();

  React.useEffect(() => {
    return () => {
      setBlankIndex(-1);
    };
  }, [setBlankIndex]);

  return (
    <Row className={styles.video_translator_container}>
      <Col span={16}>
        <VideoPlayer key="translate-video" onPlay={unfocus} />
      </Col>
      <Col span={8}>
        <SubtitleForm />
      </Col>
    </Row>
  );
};
