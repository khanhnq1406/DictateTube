"use client";

import { useSpeechRecognition } from "react-speech-recognition";
import VideoPlayer from "../video-player";
import { VideoFormState } from "@/const";
import VoiceRecord from "../voice-record";

const Shadowing: React.FC = () => {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <main className="grid grid-rows-1 grid-cols-12 w-full gap-20 px-10 mobile:flex mobile:flex-col mobile:justify-center mobile:max-w-[100vw] mobile:gap-[8vw] mobile:px-[7vw]">
      <div className="col-span-5">
        <VideoPlayer type={VideoFormState.shadowing} />
      </div>
      <div className="col-span-7">
        <VoiceRecord />
      </div>
    </main>
  );
};

export { Shadowing };
