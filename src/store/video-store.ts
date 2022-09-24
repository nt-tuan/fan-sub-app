import create from "zustand";

interface SubtitleBlock {
  from: number;
  to: number;
  text?: string;
}

interface IState {
  isLoading: boolean;
  videoUrl?: string;
  nSubtitleSegments?: number;
  defaultSubtitles?: SubtitleBlock[];
  subtitles?: SubtitleBlock[];
}

interface IStore extends IState {
  loadData: () => Promise<void>;
  changeSubtitleText: (index: number, value: string) => void;
  getCurrentSubtitle: (currentTime: number) => SubtitleBlock | null;
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
    if (isNaN(parseInt(lineStr))) {
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
  return subtitles;
};

export const useVideoStore = create<IStore>((set, get) => ({
  isLoading: false,
  loadData: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/video/data.json");
      const data: {
        videoUrl: string;
        subtitleUrl: string;
      } = await response.json();
      const defaultSubtitles = await getSubtitles(data.subtitleUrl);
      const currentSubtitles = defaultSubtitles.map((item) => ({
        ...item,
        text: "",
      }));
      set({
        videoUrl: data.videoUrl,
        subtitles: currentSubtitles,
        defaultSubtitles: defaultSubtitles,
        nSubtitleSegments: currentSubtitles.length,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  changeSubtitleText: (index: number, value: string) => {
    set((state) => {
      if (state.subtitles == null) {
        return {};
      }
      const newSubtitles = [...state.subtitles];
      newSubtitles[index].text = value;
      return { subtitles: newSubtitles };
    });
  },
  getCurrentSubtitle: (currentTime: number) => {
    const subtitles = get().subtitles;
    if (subtitles == null) return null;
    for (const sub of subtitles) {
      if (sub.from <= currentTime && currentTime < sub.to) {
        return sub;
      }
      if (currentTime < sub.to) {
        return null;
      }
    }
    return null;
  },
}));
