interface SubtitleBlock {
  from: number;
  to: number;
  text?: string;
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

const loadAllSubtitles = async (subtitles: Record<string, string>) => {
  const map: Record<string, SubtitleBlock[]> = {};
  for (const lang in subtitles) {
    const subtitleData = await loadSubtitles(subtitles[lang]);
    map[lang] = subtitleData;
  }
  return map;
};

const loadSubtitles = async (path: string) => {
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

const LOCAL_STORAGE_KEY = "SUBTITLES";

export const createSubtitleStore = (videoId: string) => {
  const getVideoMeta = async () => {
    const response = await fetch(videoId);
    const data: {
      videoUrl: string;
      subtitles: Record<string, string>;
    } = await response.json();
    return data;
  };
  const get: () => Promise<Record<string, SubtitleBlock[]>> = async () => {
    const data = await getVideoMeta();
    const defaultData = await loadAllSubtitles(data.subtitles);
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rawData == null) return defaultData;
    try {
      const subtitles = JSON.parse(rawData);
      const entries = Object.entries(subtitles);
      const map: Record<string, SubtitleBlock[]> = {};
      for (const [lang, subtitles] of entries) {
        if (!Array.isArray(subtitles)) continue;
        map[lang] = subtitles;
      }
      return { ...defaultData, ...map };
    } catch {
      return defaultData;
    }
  };
  const save = async (lang: string, blocks: SubtitleBlock[]) => {
    const current = get();
    const nextData = { ...current, [lang]: blocks };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextData));
  };
  return {
    getVideoMeta,
    get,
    save,
  };
};

export interface SubtitleStore {
  get: () => Promise<Record<string, SubtitleBlock[]>>;
  save: (lang: string, blocks: SubtitleBlock[]) => Promise<void>;
}
