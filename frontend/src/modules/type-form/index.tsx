"use client";
import { AnswerState, arrow, correct, play, warning } from "@/const";
import { useVideoForm } from "@/context/video-form";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

const TypeForm: React.FC = () => {
  const [answerState, setAnswerState] = useState<AnswerState>(
    AnswerState.immediately
  );
  const { videoMethods } = useVideoForm();
  const { control } = videoMethods;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [typeText, setTypeText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [answer, setAnswer] = useState("");

  const [transcript] = useWatch({
    control,
    name: ["transcript"],
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handlePlay();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]);

  const resetState = () => {
    setCurrentIndex((prev) => prev + 1);
    setTypeText("");
    setIsCorrect(undefined);
    setAnswer("");
  };
  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTypeText("");
      setIsCorrect(undefined);
      setAnswer("");
    } else if (direction === "next" && currentIndex < transcript.length - 1) {
      resetState();
    }
  };

  const handlePlay = () => {
    console.log("clicked handled");
    setIsPlaying(!isPlaying);
  };

  const onCheckAnswer = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnswer(getDisplayText());
    const typedWords = typeText.trim().toLowerCase().split(/\s+/);
    const correctWords = transcript[currentIndex].transcript
      .toLowerCase()
      .split(/\s+/);

    let isAllCorrect = true;
    for (let i = 0; i < Math.max(typedWords.length, correctWords.length); i++) {
      if (typedWords[i] !== correctWords[i]) {
        isAllCorrect = false;
        break;
      }
    }

    setIsCorrect(isAllCorrect);
  };

  const handleSkip = () => {
    if (currentIndex < transcript.length - 1) {
      resetState();
    }
  };

  const getDisplayText = () => {
    if (answerState === AnswerState.immediately) {
      const typedWords = typeText.trim().toLowerCase().split(/\s+/);
      const correctWords = transcript[currentIndex].transcript
        .toLowerCase()
        .split(/\s+/);

      return correctWords
        .map((word, index) => {
          if (index >= typedWords.length) {
            return "*".repeat(word.length);
          }
          return typedWords[index] === word ? word : "*".repeat(word.length);
        })
        .join(" ");
    } else {
      return transcript[currentIndex].transcript;
    }
  };

  return (
    <div className="bg-bg-secondary w-full h-full rounded-3xl shadow-shadow-primary-l py-8 flex flex-col gap-8 px-10">
      <div className="flex flex-row gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`border border-btn hover:bg-bg-primary p-2 rounded-md ${
                  isPlaying ? "bg-bg-primary" : ""
                }`}
                onClick={handlePlay}
              >
                <Image src={play} alt="play-icon" width={20} height={20} />
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
          <p>{`${currentIndex + 1} / ${transcript.length}`}</p>
          <button
            className="bg-bg-primary p-2 rounded-md hover:bg-slate-900"
            onClick={() => handleNavigation("next")}
            disabled={currentIndex === transcript.length - 1}
          >
            <Image src={arrow} alt="arrow-icon" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="h-1/2">
        <textarea
          placeholder="Type what you hear..."
          className="bg-bg-primary border-2 border-btn rounded-lg p-4 resize-none h-full w-full"
          value={typeText}
          onChange={(e) => setTypeText(e.target.value)}
        />
      </div>

      <div className="flex flex-row items-center place-content-between">
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
        <div className="flex flex-row gap-4">
          {isCorrect === true ? (
            <button className="bg-text-success hover:bg-text-success-hover text-white rounded-full px-4 py-3 font-semibold w-40">
              Next
            </button>
          ) : (
            <>
              <button
                className="bg-btn hover:bg-btn-hover text-white rounded-full px-4 py-3 font-semibold w-40"
                onClick={onCheckAnswer}
              >
                Check
              </button>
              <button
                className="border border-btn hover:bg-bg-primary text-white rounded-full px-4 py-3 font-semibold w-40"
                onClick={handleSkip}
              >
                Skip
              </button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-6">
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
