import React from "react";
import { VideoPlayer } from "./video-player/video-player";

function App() {
  return (
    <div className="App">
      <main>
        <div style={{ width: "50%" }}>
          <VideoPlayer />
        </div>

        <div style={{ color: "red" }}>My new change</div>
      </main>
    </div>
  );
}

export default App;
