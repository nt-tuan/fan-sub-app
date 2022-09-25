import { ConfigProvider, Tabs } from "antd";
import { SubtitleBlock, useVideoStore } from "../store";

import React from "react";
import { SubtitleStore } from "@/store/subtitle-store";
import { Translator } from "./components/translator/translator";
import VideoSubProvider from "./components/provider";
import styles from "./styles.module.scss";

const VideoSubTranslator = ({
  subtitleData,
  subtitleStore,
}: {
  subtitleData: Record<string, SubtitleBlock[]>;
  subtitleStore: SubtitleStore;
}) => {
  return (
    <VideoSubProvider subtitleData={subtitleData} subtitleStore={subtitleStore}>
      <Tabs
        className={styles.video_sub_container}
        centered
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Translator",
            children: <Translator />,
          },
          {
            key: "2",
            label: "Timebar",
            // children: <TimebarScreen />,
            children: null,
          },
        ]}
      ></Tabs>
    </VideoSubProvider>
  );
};

const VIDEO_URL = "/video/data.json";
function VideoSub() {
  const { subtitleData, loadData, subtitleStore } = useVideoStore();
  React.useEffect(() => {
    loadData(VIDEO_URL);
  }, [loadData]);
  if (subtitleData == null || subtitleStore == null) return null;
  return (
    <ConfigProvider>
      <VideoSubTranslator
        subtitleData={subtitleData}
        subtitleStore={subtitleStore}
      />
    </ConfigProvider>
  );
}

export default VideoSub;
