"use client";
import { Controller } from "react-hook-form";
import { VideoFormState } from "@/const";
import { useVideoForm } from "@/context/video-form";
import { useState } from "react";
import { parseTranscript } from "@/utils/transcript";

type VideoFormProps = {
  formState: VideoFormState;
  setPage?: (page: VideoFormState) => void;
};

const VideoForm: React.FC<VideoFormProps> = (props) => {
  const { formState, setPage } = props;
  const { videoMethods } = useVideoForm();
  const { control, handleSubmit } = videoMethods;
  const [transcript, setTranscript] = useState<string>("");

  const onSubmit = () => {
    const parsedTranscript = parseTranscript(transcript);
    console.log(parsedTranscript);
    videoMethods.setValue("transcript", transcript);
    if (formState === VideoFormState.landing && setPage) {
      setPage(VideoFormState.dictation);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Controller
        control={control}
        name="videoUrl"
        render={({ field }) => (
          <div className="relative bg-bg-secondary h-16 rounded-full p-[2px]">
            <div className="absolute inset-0 bg-border-gradient rounded-full"></div>
            <input
              required
              type="text"
              {...field}
              placeholder="Enter YouTube video URL"
              className="relative bg-bg-secondary h-full w-full rounded-full px-4 focus:outline-none"
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name="transcript"
        render={() => (
          <div className="relative bg-bg-secondary h-32 rounded-2xl p-[2px]">
            <div className="absolute inset-0 bg-border-gradient rounded-2xl"></div>
            <textarea
              required
              placeholder="Enter YouTube video transcript"
              className="relative bg-bg-secondary h-full w-full rounded-2xl p-4 resize-none focus:outline-none"
              onChange={(e) => {
                setTranscript(e.target.value);
              }}
            />
          </div>
        )}
      />
      <div className="flex flex-row place-content-between items-center">
        <button
          className="underline bg-transparent text-text-secondary"
          type="button"
          onClick={() => {
            // window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
          }}
        >
          How to get a YouTube transcript?
        </button>
        <button
          type="submit"
          className="bg-btn hover:bg-btn-hover text-white rounded-full px-4 py-2 font-semibold"
        >
          Start Dictation
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
