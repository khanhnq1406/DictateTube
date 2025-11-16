export const resources =
  "https://raw.githubusercontent.com/khanhnq1406/resources/main/DictateTube/";
export const glow = `${resources}glow.webp`;
export const logo = `${resources}icon.png`;
export const arrow = `${resources}arrow.png`;
export const correct = `${resources}correct.png`;
export const warning = `${resources}warning.png`;
export const play = `${resources}play.png`;
export const pause = `${resources}pause.png`;
export const loading = `${resources}grey_style.gif`;
export const microphone = `${resources}microphone.png`;
export const next = `${resources}right-arrow.png`;

export enum AnswerState {
  full = "full",
  immediately = "immediately",
}

export enum VideoFormState {
  landing = "landing",
  dictation = "dictation",
  shadowing = "shadowing",
}

export enum dictationFieldKey {
  currentIndex = "dictationCurrentIndex",
  transcript = "dictationTranscript",
  videoUrl = "dictationVideoUrl",
  isPlaying = "dictationIsPlaying",
  id = "id",
  username = "username",
}

export enum shadowingFieldKey {
  currentIndex = "shadowingCurrentIndex",
  transcript = "shadowingTranscript",
  videoUrl = "shadowingVideoUrl",
  isPlaying = "shadowingIsPlaying",
  id = "id",
  username = "username",
}
