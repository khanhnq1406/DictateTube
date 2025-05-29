import { VideoFormState } from "./const";

export interface VideoDataForm {
  videoUrl: string;
  transcript: string;
}

export interface PageState {
  page: VideoFormState;
}
