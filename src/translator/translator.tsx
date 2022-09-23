import { Col, Row } from "antd";
import { VideoPlayer } from "@/video-player/video-player";
import { SubtitleForm } from "./subtitle-form";

export const Translator = () => {
  return (
    <Row>
      <Col span={16}>
        <VideoPlayer />
      </Col>
      <Col span={8}>
        <SubtitleForm />
      </Col>
    </Row>
  );
};
