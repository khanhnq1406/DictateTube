"use client";
import {
  AnswerState,
  arrow,
  correct,
  pause,
  play,
  warning,
  dictationFieldKey as fieldKey,
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
import { cleanWord } from "@/utils/transcript";

const TypeForm: React.FC = () => {
  const [answerState, setAnswerState] = useState<AnswerState>(
    AnswerState.immediately
  );
  const { videoMethods } = useVideoForm();
  const { control, setValue } = videoMethods;
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [typeText, setTypeText] = useState("");
  const [answer, setAnswer] = useState("");

  const [transcript, isPlaying, currentIndex] = useWatch<VideoDataForm>({
    control,
    name: [fieldKey.transcript, fieldKey.isPlaying, fieldKey.currentIndex],
  }) as [Transcript[], boolean, number];

  const [localPlayingState, setLocalPlayingState] = useState(isPlaying);

  // Synchronize local playing state with form state
  useEffect(() => {
    setLocalPlayingState(isPlaying);
  }, [isPlaying]);

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

  const resetState = () => {
    setValue(fieldKey.currentIndex, currentIndex + 1);
    window.localStorage.setItem(
      fieldKey.currentIndex,
      String(currentIndex + 1)
    );
    setValue(fieldKey.isPlaying, true);
    setTypeText("");
    setIsCorrect(undefined);
    setAnswer("");
  };
  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setValue(fieldKey.currentIndex, currentIndex - 1);
      window.localStorage.setItem(
        fieldKey.currentIndex,
        String(currentIndex - 1)
      );

      setValue(fieldKey.isPlaying, true);
      setTypeText("");
      setIsCorrect(undefined);
      setAnswer("");
    } else if (direction === "next" && currentIndex < transcript?.length - 1) {
      resetState();
    }
  };

  const handlePlay = () => {
    const newState = !localPlayingState;
    setLocalPlayingState(newState);
    setValue(fieldKey.isPlaying, newState);
  };

  const handleCheckAnswer = () => {
    setAnswer(getDisplayText());
    const typedWords = typeText.trim().toLowerCase().split(/\s+/);
    const correctWords = transcript?.[currentIndex].transcript
      .toLowerCase()
      .split(/\s+/);

    let isAllCorrect = true;
    for (let i = 0; i < Math.max(typedWords.length, correctWords.length); i++) {
      if (cleanWord(typedWords[i] || "") !== cleanWord(correctWords[i] || "")) {
        isAllCorrect = false;
        break;
      }
    }

    setIsCorrect(isAllCorrect);
  };

  const handleSkip = () => {
    setIsCorrect(true);
    setAnswer(getDisplayText(true));
  };

  const handleNext = () => {
    if (currentIndex < transcript?.length - 1) {
      resetState();
    }
  };

  const getDisplayText = (isFull?: boolean) => {
    if (answerState === AnswerState.immediately && !isFull) {
      const typedWords = typeText.trim().toLowerCase().split(/\s+/);
      const correctWords = transcript?.[currentIndex].transcript
        .toLowerCase()
        .split(/\s+/);

      return correctWords
        .map((word: string, index: number) => {
          if (index >= typedWords.length) {
            return "*".repeat(word.length);
          }
          return cleanWord(typedWords[index]) === cleanWord(word)
            ? word
            : "*".repeat(word.length);
        })
        .join(" ");
    } else {
      return transcript?.[currentIndex].transcript;
    }
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
                className={`border border-btn hover:bg-bg-primary active:bg-bg-primary p-2 rounded-md 
                }`}
                onClick={handlePlay}
              >
                {localPlayingState ? (
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
          <p>{`${currentIndex + 1} / ${transcript?.length}`}</p>
          <button
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900 active:bg-slate-900"
            onClick={() => handleNavigation("next")}
            disabled={currentIndex === transcript?.length - 1}
          >
            <Image src={arrow} alt="arrow-icon" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="h-1/2 mobile:h-fit mobile:w-full">
        <textarea
          placeholder="Type what you hear..."
          className="bg-bg-primary border-2 border-btn rounded-lg p-4 resize-none h-full w-full"
          value={typeText}
          onChange={(e) => {
            setTypeText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleCheckAnswer();
              return;
            }
          }}
        />
      </div>

      <div className="flex flex-row items-center place-content-between mobile:flex-col mobile:gap-[5vw]">
        <div className="flex flex-row gap-3 items-center">
          {isCorrect === true && (
            <>
              <Image
                src={correct}
                alt="correct-icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <p className="text-text-success font-bold">You are correct!</p>
            </>
          )}
          {isCorrect === false && (
            <>
              <Image
                src={warning}
                alt="warning-icon"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <p className="text-text-warning font-bold">Incorrect!</p>
            </>
          )}
        </div>
        <div className="flex flex-row gap-4 mobile:flex-col">
          {isCorrect === true ? (
            <button
              className="bg-text-success hover:bg-text-success-hover active:bg-text-success-hover text-white rounded-full px-4 py-3 font-semibold w-40"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <>
              <button
                className="bg-btn hover:bg-btn-hover active:bg-btn-hover text-white rounded-full px-4 py-3 font-semibold w-40"
                onClick={handleCheckAnswer}
              >
                Check
              </button>
              <button
                className="border border-btn hover:bg-bg-primary active:bg-bg-primary text-white rounded-full px-4 py-3 font-semibold w-40"
                onClick={handleSkip}
              >
                Skip
              </button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-6 mobile:text-center">
        <p>{answer}</p>
      </div>

      <div>
        <div className="flex flex-row gap-2">
          <input
            type="checkbox"
            id="immediately"
            name="immediately"
            value="immediately"
            checked={answerState === AnswerState.immediately}
            onChange={() => setAnswerState(AnswerState.immediately)}
          />
          <label htmlFor="immediately">Show answer immediately</label>
        </div>
        <div className="flex flex-row gap-2">
          <input
            type="checkbox"
            id="full"
            name="full"
            value="full"
            checked={answerState === AnswerState.full}
            onChange={() => setAnswerState(AnswerState.full)}
          />
          <label htmlFor="full">Show full answer</label>
        </div>
      </div>
    </div>
  );
};

export default TypeForm;
