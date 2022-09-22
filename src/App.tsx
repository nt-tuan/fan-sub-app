import React from "react";
import { useVideoSubStore } from "./store";
import { Timeline } from "./timestamp/timeline";
import { VideoPlayer } from "./video-player/video-player";

function App() {
  const { currentTime } = useVideoSubStore();
  return (
    <div className="App">
      <main>
        <div style={{ width: "50%" }}>
          <VideoPlayer />
        </div>
        <div style={{ color: "red" }}>My time: {currentTime}</div>
        <Timeline width={500} height={200} />
      </main>
    </div>
  );
}

export default App;
