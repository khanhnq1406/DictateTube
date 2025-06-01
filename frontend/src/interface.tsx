import { VideoFormState } from "./const";

export interface Transcript {
  time: number;
  transcript: string;
}
export interface VideoDataForm {
  videoUrl: string;
  transcript: Transcript[];
  isPlaying: boolean;
  currentIndex: number;
}

export interface PageState {
  page: VideoFormState;
}

export interface VideoPlayer {
  isPlay: boolean;
}
