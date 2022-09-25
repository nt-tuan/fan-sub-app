import { Col, Row } from "antd";
import VideoPlayer from "@/video-sub/components/video-player/video-player";
import { SubtitleForm } from "./subtitle-form";
import styles from "./styles.module.scss";

export const Translator = () => {
  return (
    <Row className={styles.video_translator_container}>
      <Col span={16}>
        <VideoPlayer />
      </Col>
      <Col span={8}>
        <SubtitleForm />
      </Col>
    </Row>
  );
};
