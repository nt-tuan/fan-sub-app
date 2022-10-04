import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";

import VideoPlayer from "@/video-sub/components/video-player/video-player";
import { useSubtitleEditorStore } from "@/video-sub/provider";
import useTimebar from "@/video-sub/provider/useTimebar";

import Timeline from "./components/timeline";
import TimelineMenu from "./components/timeline-menu";

const Wrapper = ({ width }: { width: number }) => {
  if (!width) return null;
  return <TimebarScreenContent width={width} />;
};

const TimebarScreenContent = ({ width }: { width: number }) => {
  const props = useTimebar({ width });
  const deleteSubtitle = useSubtitleEditorStore(
    (store) => store.deleteSubtitle
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (props.selectedIndex == null) return;
    deleteSubtitle(props.selectedIndex);
    props.onUnfocus();
  };

  return (
    <div style={{ height: "100%", width }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <div style={{ height: 480, width: 640 }}>
          <VideoPlayer key="timeline-video" />
        </div>
      </div>
      <Timeline {...(props as any)} width={width} />
      <TimelineMenu
        onDelete={handleDelete}
        disabled={props.selectedIndex == null}
      />
    </div>
  );
};

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactVirtualizedAutoSizer>{Wrapper}</ReactVirtualizedAutoSizer>
    </div>
  );
};

export default TimebarScreen;
