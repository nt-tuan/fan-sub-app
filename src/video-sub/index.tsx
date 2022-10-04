import { ConfigProvider, Tabs } from "antd";

import TimebarScreen from "@/video-sub/components/timebar-screen/timebar-screen";

import { Translator } from "./components/translator/translator";
import VideoSubProvider from "./provider";
import styles from "./styles.module.scss";

const VideoSubTranslator = () => {
  return (
    <VideoSubProvider>
      <Tabs
        className={styles.video_sub_container}
        centered
        defaultActiveKey="2"
        destroyInactiveTabPane
        items={[
          {
            key: "1",
            label: "Translator",
            children: <Translator />,
          },
          {
            key: "2",
            label: "Timebar",
            children: <TimebarScreen />,
          },
        ]}
      ></Tabs>
    </VideoSubProvider>
  );
};

function VideoSub() {
  return (
    <ConfigProvider>
      <VideoSubTranslator />
    </ConfigProvider>
  );
}

export default VideoSub;
