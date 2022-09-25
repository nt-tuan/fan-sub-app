import Timeline from "./components/timeline";
import { VideoPlayer } from "@/video-player/video-player";

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: 400, width: 600 }}>{/* <VideoPlayer /> */}</div>
      <Timeline />
    </div>
  );
};

export default TimebarScreen;
