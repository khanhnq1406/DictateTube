"use client";
import {
  arrow,
  pause,
  play,
  shadowingFieldKey as fieldKey,
  next,
} from "@/const";
import { useVideoForm } from "@/context/video-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { VideoDataForm, Transcript } from "@/interface";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { RecordButton, CircularProgress } from "./components";
import { compareTranscripts } from "./helpers";
import { useWindowSize } from "@/utils/hooks";
import { audioOutputManager } from "./audio-helpers";
import { useMobileAudio } from "./useMobileAudio";
import "./mobile-fixes.css";
const VoiceRecord: React.FC = () => {
  const { width } = useWindowSize();
  const { videoMethods } = useVideoForm();
  const { control, setValue } = videoMethods;

  // Initialize mobile audio handling to prevent phone call output
  const { forceSpeakerOutput } = useMobileAudio({
    preferSpeakerOutput: true,
    preventPhoneCallOutput: true,
  });
  const [transcript, isPlaying, currentIndex] = useWatch<VideoDataForm>({
    control,
    name: [fieldKey.transcript, fieldKey.isPlaying, fieldKey.currentIndex],
  }) as [Transcript[], boolean, number];

  const {
    transcript: recordTranscript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  const startListening = async () => {
    resetTranscript();
    // Reset highlighted words and progress when starting new recording
    setHighlightedWords([]);
    setProgress(0);

    try {
      // Force speaker output to prevent phone call routing
      await forceSpeakerOutput();

      // Initialize audio context for better mobile control
      audioOutputManager.initializeAudioContext();

      // Start speech recognition with mobile-friendly options
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    } catch (error) {
      console.error("❌ Failed to start speech recognition:", error);
    }
  };

  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSpeechTime, setLastSpeechTime] = useState(Date.now());

  const [isNew, setIsNew] = useState(true);
  const [progress, setProgress] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState<
    Array<{ word: string; isCorrect: boolean }>
  >([]);
  const [localPlayingState, setLocalPlayingState] = useState(isPlaying);

  // Synchronize local playing state with form state
  useEffect(() => {
    setLocalPlayingState(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    // When speech is detected, reset the silence timer
    if (recordTranscript && recordTranscript.trim()) {
      console.log(lastSpeechTime);
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
    if (!listening) {
      setIsNew(false);
      // Compare transcripts when recording stops
      const originalText = transcript?.[currentIndex]?.transcript || "";
      if (recordTranscript && originalText) {
        const result = compareTranscripts(originalText, recordTranscript);
        setHighlightedWords(result.words);
        setProgress(result.accuracy);
      }
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
    const newState = !localPlayingState;
    setLocalPlayingState(newState);
    setValue(fieldKey.isPlaying, newState);
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
    <div className="bg-bg-secondary w-full h-full rounded-3xl shadow-shadow-primary-l py-8 flex flex-col gap-8 px-10 mobile:justify-center mobile:items-center mobile:p-[5vw] mobile:gap-[5vw] voice-record-container prevent-phone-output">
      <div className="flex flex-row gap-6">
        <button
          className={`border border-btn hover:bg-bg-primary active:bg-bg-primary p-2 rounded-md 
                }`}
          onClick={handlePlay}
        >
          {isPlaying ? (
            <Image src={pause} alt="pause-icon" width={20} height={20} />
          ) : (
            <Image src={play} alt="play-icon" width={20} height={20} />
          )}
        </button>

        <div className="flex flex-row gap-4 items-center">
          <button
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900 active:bg-slate-900"
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
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900 active:bg-slate-900"
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
          <div className="break-words">
            {highlightedWords.length > 0 ? (
              highlightedWords.map((item, index) => (
                <span
                  key={index}
                  className={item.isCorrect ? "text-green-500" : "text-red-500"}
                >
                  {item.word}
                  {index < highlightedWords.length - 1 && " "}
                </span>
              ))
            ) : (
              <div>{recordTranscript}</div>
            )}
          </div>
        </div>
        <div>
          {!listening ? (
            <>
              {isNew ? (
                <>
                  <RecordButton
                    onClick={startListening}
                    intent="start"
                    isNew={isNew}
                  />
                </>
              ) : (
                <div className="flex w-full justify-center items-center gap-20 mobile:gap-0 mobile:justify-between">
                  <RecordButton onClick={startListening} intent="start" />
                  <CircularProgress
                    progress={progress}
                    size={width < 640 ? 80 : 96}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      className="flex justify-center items-center bg-btn p-4 rounded-full hover:bg-btn-hover active:bg-btn-hover"
                      onClick={() => handleNavigation("next")}
                    >
                      <Image src={next} alt="next" width={20} height={20} />
                    </div>
                    <div>Next</div>
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
