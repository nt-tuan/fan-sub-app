import React from "react";
import { Tabs } from "antd";
import { useVideoStore } from "../store";
import TimebarScreen from "../timebar-screen/timebar-screen";
import { Translator } from "../translator/translator";
import styles from "./styles.module.scss";

function App() {
  const { loadData } = useVideoStore();
  React.useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <div className="app">
      <main>
        <Tabs
          className={styles.video_sub_container}
          centered
          defaultActiveKey="1"
        >
          <Tabs.TabPane tab="Translator" key="1">
            <Translator />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Timebar" key="2">
            <TimebarScreen />
          </Tabs.TabPane>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
