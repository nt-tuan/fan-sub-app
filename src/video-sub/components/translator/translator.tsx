import { Col, Row } from "antd";
import VideoPlayer from "@/video-sub/components/video-player/video-player";
import { SubtitleForm } from "./subtitle-form";
import styles from "./styles.module.scss";
import { useSubtitleEditor } from "../provider";

export const Translator = () => {
  const { unfocus } = useSubtitleEditor();
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
