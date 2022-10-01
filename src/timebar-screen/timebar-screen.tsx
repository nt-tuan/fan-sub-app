import Timeline from "./components/timeline";
import TimelineMenu from "./components/timeline-menu";
import VideoPlayer from "@/video-sub/components/video-player/video-player";

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <div style={{ height: 480, width: 640 }}>
          <VideoPlayer />
        </div>
      </div>
      <Timeline />
      <TimelineMenu />
    </div>
  );
};

export default TimebarScreen;
