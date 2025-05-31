import { VideoFormState } from "./const";

export interface Transcript {
  time: string;
  transcript: string;
}
export interface VideoDataForm {
  videoUrl: string;
  transcript: Transcript[];
}

export interface PageState {
  page: VideoFormState;
}
