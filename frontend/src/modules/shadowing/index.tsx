"use client";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import VideoPlayer from "../video-player";
import { VideoFormState } from "@/const";
import VoiceRecord from "../voice-record";

const Shadowing: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    // <div>
    <main className="grid grid-rows-1 grid-cols-12 w-full gap-20 px-10 mobile:flex mobile:flex-col mobile:justify-center mobile:max-w-[100vw] mobile:gap-[8vw] mobile:px-[7vw]">
      <div className="col-span-5">
        <VideoPlayer type={VideoFormState.shadowing} />
      </div>
      <div className="col-span-7">
        <VoiceRecord />
        {/* <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p> */}
      </div>
    </main>
    // </div>
  );
};

export { Shadowing };
