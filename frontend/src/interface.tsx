import { VideoFormState, dictationFieldKey, shadowingFieldKey } from "./const";

export interface Transcript {
  time: number;
  transcript: string;
}

export interface VideoDataForm {
  [key: string]: string | Transcript[] | boolean | number;
  [dictationFieldKey.videoUrl]: string;
  [dictationFieldKey.transcript]: Transcript[];
  [dictationFieldKey.isPlaying]: boolean;
  [dictationFieldKey.currentIndex]: number;
  [shadowingFieldKey.videoUrl]: string;
  [shadowingFieldKey.transcript]: Transcript[];
  [shadowingFieldKey.isPlaying]: boolean;
  [shadowingFieldKey.currentIndex]: number;
}

export interface PageState {
  page: VideoFormState;
}

export interface VideoPlayer {
  isPlay: boolean;
}
