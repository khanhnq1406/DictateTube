"use client";
import {
  arrow,
  pause,
  play,
  shadowingFieldKey as fieldKey,
  microphone,
} from "@/const";
import { useVideoForm } from "@/context/video-form";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { VideoDataForm, Transcript } from "@/interface";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { RecordButton } from "./components";
const VoiceRecord: React.FC = () => {
  const { videoMethods } = useVideoForm();
  const { control, setValue } = videoMethods;
  const [transcript, isPlaying, currentIndex] = useWatch<VideoDataForm>({
    control,
    name: [fieldKey.transcript, fieldKey.isPlaying, fieldKey.currentIndex],
  }) as [Transcript[], boolean, number];

  const {
    transcript: recordTranscript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());

  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    // When speech is detected, reset the silence timer
    if (recordTranscript && recordTranscript.trim()) {
      setLastSpeechTime(Date.now());

      // Clear existing timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }

      // Set new timer to stop after 3 seconds of silence
      const timer = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 2000);

      setSilenceTimer(timer);
    }
  }, [recordTranscript]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [silenceTimer]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handlePlay();
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!listening) {
      setIsNew(false);
      console.log("Handle stop");
    }
  }, [listening, recordTranscript]);

  const resetState = () => {
    setValue(fieldKey.currentIndex, currentIndex + 1);
    window.localStorage.setItem(
      fieldKey.currentIndex,
      String(currentIndex + 1)
    );
    setValue(fieldKey.isPlaying, true);
  };
  const handleNavigation = (direction: "prev" | "next") => {
    setIsNew(true);
    if (direction === "prev" && currentIndex > 0) {
      setValue(fieldKey.currentIndex, currentIndex - 1);
      window.localStorage.setItem(
        fieldKey.currentIndex,
        String(currentIndex - 1)
      );

      setValue(fieldKey.isPlaying, true);
    } else if (
      direction === "next" &&
      currentIndex < (transcript?.length || 0) - 1
    ) {
      resetState();
    }
  };

  const handlePlay = () => {
    setValue(fieldKey.isPlaying, !isPlaying);
  };

  // Return early if transcript is not available yet
  if (!transcript || transcript.length === 0) {
    return (
      <div className="bg-bg-secondary w-full h-full rounded-3xl shadow-shadow-primary-l py-8 flex flex-col gap-8 px-10 mobile:justify-center mobile:items-center mobile:p-[5vw] mobile:gap-[5vw]">
        <div className="flex items-center justify-center h-full">
          <p>Loading transcript data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary w-full h-full rounded-3xl shadow-shadow-primary-l py-8 flex flex-col gap-8 px-10 mobile:justify-center mobile:items-center mobile:p-[5vw] mobile:gap-[5vw]">
      <div className="flex flex-row gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`border border-btn hover:bg-bg-primary p-2 rounded-md 
                }`}
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <Image src={pause} alt="pause-icon" width={20} height={20} />
                ) : (
                  <Image src={play} alt="play-icon" width={20} height={20} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-white text-bg-primary p-2 z-50 rounded"
            >
              {`You can press "Ctrl" to replay!`}
              <TooltipArrow fill="white" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-row gap-4 items-center">
          <button
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900"
            onClick={() => handleNavigation("prev")}
            disabled={currentIndex === 0}
          >
            <Image
              src={arrow}
              alt="arrow-icon"
              width={20}
              height={20}
              className="rotate-180"
            />
          </button>
          <p>{`${currentIndex + 1} / ${transcript?.length || 0}`}</p>
          <button
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900"
            onClick={() => handleNavigation("next")}
            disabled={currentIndex === (transcript?.length || 0) - 1}
          >
            <Image src={arrow} alt="arrow-icon" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-rows-3 h-full">
        <div className="flex gap-2 flex-col">
          <div className="font-bold">Original Transcript</div>
          <div>{transcript?.[currentIndex]?.transcript}</div>
        </div>
        <div>
          <div className="font-bold">Your Speech</div>
          <div>{recordTranscript}</div>
        </div>
        <div>
          {!listening ? (
            <>
              {isNew ? (
                <>
                  <RecordButton onClick={startListening} intent="start" />
                </>
              ) : (
                <div className="flex w-full justify-between items-center">
                  <RecordButton onClick={startListening} intent="start" />
                  <div className="rounded-full">80%</div>
                  <div className="flex justify-center items-center bg-btn p-4 rounded-full hover:bg-btn-hover">
                    Next
                  </div>
                </div>
              )}
            </>
          ) : (
            <RecordButton
              onClick={() => SpeechRecognition.stopListening()}
              intent="stop"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecord;
