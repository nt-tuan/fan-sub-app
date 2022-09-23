import create from "zustand";

interface SubtitleBlock {
  from: number;
  to: number;
  text?: string;
}

interface IState {
  isLoading: boolean;
  videoUrl?: string;
  subtitles?: Record<string, SubtitleBlock[]>;
}

interface IStore extends IState {
  loadData: () => Promise<void>;
}

const readTime = (str: string) => {
  const [hr, min, sec] = str.split(":");
  return (parseInt(hr) * 60 * 60 + parseInt(min) * 60 + parseInt(sec)) * 1000;
};
const readTimeSegment = (str: string) => {
  const [fromString, toString] = str.split(" --> ");
  return {
    from: readTime(fromString),
    to: readTime(toString),
  };
};

const getSubtitles = async (path: string) => {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.split("\n");
  let index = 0;
  const subtitles: SubtitleBlock[] = [];
  while (index < lines.length) {
    const lineStr = lines[index];
    if (!isNaN(parseInt(lineStr))) {
      index++;
      continue;
    }
    try {
      const timeSegmentString = lines[index + 1];
      const timeSegment = readTimeSegment(timeSegmentString);
      const text = lines[index + 2];
      const subtitleBlock = {
        ...timeSegment,
        text,
      };
      subtitles.push(subtitleBlock);
    } catch {}
    index += 3;
  }
  return { en: subtitles };
};

export const useVideoStore = create<IStore>((set) => ({
  isLoading: false,
  loadData: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/video/data.json");
      const data: {
        videoUrl: string;
        subtitleUrl: string;
      } = await response.json();
      const subtitles = await getSubtitles(data.subtitleUrl);
      set({ videoUrl: data.videoUrl, subtitles });
    } finally {
      set({ isLoading: false });
    }
  },
}));
