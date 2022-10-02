export interface SubtitleBlock {
  from: number;
  to: number;
  text?: string;
}

export interface IVideo {
  isLoading: boolean;
  videoUrl?: string;
  subtitleData?: Record<string, SubtitleBlock[]>;
  subtitleStore?: {
    get: () => Promise<Record<string, SubtitleBlock[]>>;
    save: (lang: string, blocks: SubtitleBlock[]) => Promise<void>;
  };
}

export interface VideoStore extends IVideo {
  loadData: (videoUrl: string) => Promise<void>;
}

export interface VideoPlayerStore {
  currentTime: number;
  endTime?: number;
  videoRef?: React.RefObject<HTMLVideoElement>;

  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  increase: (miliseconds: number) => void;
  setCurrentTime: (miliseconds: number) => void;
  setEndTime: (miliseconds: number) => void;

  goTo: (miliseconds: number) => void;
}

export interface SubtitleStore {
  get: () => Promise<Record<string, SubtitleBlock[]>>;
  save: (lang: string, blocks: SubtitleBlock[]) => Promise<void>;
}

interface SubtitleEditorStoreState {
  srcLang?: string;
  dstLang?: string;
  subtitleData?: Record<string, SubtitleBlock[]>;
  editingSubtitles?: SubtitleBlock[];
  editingBlock?: SubtitleBlock;
  subtitleStore: SubtitleStore;
}

interface SubtitleEditorAction {
  setSrcLang: (lang: string) => void;
  setDstLang: (lang: string) => void;

  setSubtitleData: (data: Record<string, SubtitleBlock[]>) => void;
  setSubtitles: (subtitles: SubtitleBlock[]) => void;
  setEditingBlock: (block?: SubtitleBlock) => void;

  createSubtitle: (at: number) => number | undefined;
  deleteSubtitle: (at: number) => void;
}

export type SubtitleEditorStore = SubtitleEditorStoreState &
  SubtitleEditorAction;
