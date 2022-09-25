import React from "react";
import { Tabs } from "antd";
import TimebarScreen from "../timebar-screen/timebar-screen";
import { Translator } from "../translator/translator";
import styles from "./styles.module.scss";
import { useVideoStore } from "../store";

function App() {
  const { loadData } = useVideoStore();

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="app">
      <main>
        <Tabs
          centered
          className={styles.video_sub_container}
          defaultActiveKey="2"
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
