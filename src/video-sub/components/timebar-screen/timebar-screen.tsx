import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";

import VideoPlayer from "@/video-sub/components/video-player/video-player";
import { useSubtitleEditorStore } from "@/video-sub/provider";
import useTimebar from "@/video-sub/provider/useTimebar";

import TimelineContent from "./components/timeline-content";
import TimelineMenu from "./components/timeline-menu";

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
      <TimelineContent {...(props as any)} width={width} />
      <TimelineMenu
        disabled={props.selectedIndex == null}
        onDelete={handleDelete}
        onRewind={props.onRewind}
        onFastForward={props.onFastForward}
        onFindBlanks={props.onFindBlanks}
      />
    </div>
  );
};

const Wrapper = ({ width }: { width: number }) => {
  if (!width) return null;
  return <TimebarScreenContent width={width} />;
};

const TimebarScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactVirtualizedAutoSizer>{Wrapper}</ReactVirtualizedAutoSizer>
    </div>
  );
};

export default TimebarScreen;
