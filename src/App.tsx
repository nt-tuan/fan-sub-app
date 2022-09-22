import "antd/dist/antd.css";

import { Tabs } from "antd";
import TimebarScreen from "./timebar-screen/timebar-screen";

// import { useVideoSubStore } from "./store";
// import { Timeline } from "./timestamp/timeline";
// import { VideoPlayer } from "./video-player/video-player";

function App() {
  return (
    <div className="App">
      <main>
        {/* <div style={{ width: "50%" }}>
          <VideoPlayer />
        </div>
        <div style={{ color: "red" }}>My time: {currentTime}</div>
        <Timeline width={500} height={200} /> */}
        <Tabs centered defaultActiveKey="2">
          <Tabs.TabPane tab="Translator" key="1">
            Translator
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
