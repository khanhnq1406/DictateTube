"use client";
import { Controller } from "react-hook-form";
import { VideoFormState, fieldKey } from "@/const";
import { useVideoForm } from "@/context/video-form";
import { useEffect, useState } from "react";
import { parseApiResponse } from "@/utils/transcript";
import { getTranscriptApi } from "@/utils/getTranscriptApi";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

type VideoFormProps = {
  formState: VideoFormState;
  setPage?: (page: VideoFormState) => void;
};

const VideoForm: React.FC<VideoFormProps> = (props) => {
  const { formState, setPage } = props;
  const { videoMethods } = useVideoForm();
  const { control, handleSubmit } = videoMethods;
  // const [transcript, setTranscript] = useState<string>("");
  const [localVideoUrl, setLocalVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storagedTranscript = window.localStorage.getItem(fieldKey.transcript);
    if (storagedTranscript) {
      try {
        const parsedStoredTranscript = JSON.parse(storagedTranscript);
        videoMethods.setValue(fieldKey.transcript, parsedStoredTranscript);
      } catch (error) {
        console.error("Error parsing stored transcript:", error);
      }
    }
    const storagedCurrentIndex = window.localStorage.getItem(
      fieldKey.currentIndex
    );
    if (storagedCurrentIndex) {
      videoMethods.setValue(
        fieldKey.currentIndex,
        Number(storagedCurrentIndex)
      );
    }
    const storagedVideoUrl = window.localStorage.getItem(fieldKey.videoUrl);
    if (storagedVideoUrl) {
      videoMethods.setValue(fieldKey.videoUrl, storagedVideoUrl);
      setLocalVideoUrl(storagedVideoUrl);
    }
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await getTranscriptApi(localVideoUrl);
    setIsLoading(false);
    const parsedTranscript = parseApiResponse(res);
    videoMethods.setValue(fieldKey.videoUrl, localVideoUrl);
    videoMethods.setValue(fieldKey.transcript, parsedTranscript);
    videoMethods.setValue(fieldKey.isPlaying, true);
    videoMethods.setValue(fieldKey.currentIndex, 0);
    window.localStorage.setItem(
      fieldKey.transcript,
      JSON.stringify(parsedTranscript)
    );
    window.localStorage.setItem(fieldKey.currentIndex, "0");
    window.localStorage.setItem(fieldKey.videoUrl, localVideoUrl);

    let id = window.localStorage.getItem(fieldKey.id);
    if (!id) {
      id = uuidv4();
      window.localStorage.setItem(fieldKey.id, id);
      // try {
      //   fetch(`/api/contract/`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       id: id,
      //       username: id,
      //       totalPoint: "0",
      //     }),
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
    }
    if (formState === VideoFormState.landing && setPage) {
      setPage(VideoFormState.dictation);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Controller
        control={control}
        name={fieldKey.videoUrl}
        render={({ field }) => (
          <div className="relative bg-bg-secondary h-16 rounded-full p-[2px]">
            <div className="absolute inset-0 bg-border-gradient rounded-full"></div>
            <input
              required
              type="text"
              {...field}
              placeholder="Enter YouTube video URL"
              className="relative bg-bg-secondary h-full w-full rounded-full px-4 focus:outline-none"
              onChange={(event) => setLocalVideoUrl(event.target.value)}
              value={localVideoUrl}
            />
          </div>
        )}
      />
      {/* <Controller
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
                value={transcript}
              />
            </div>
          )}
        /> */}
      <div className="flex flex-row place-content-between items-center mobile:justify-center">
        <button
          className="underline bg-transparent text-text-secondary mobile:hidden"
          type="button"
          onClick={() => {
            // window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
          }}
        >
          How to get a YouTube transcript?
        </button>
        <button
          type="submit"
          className="bg-btn hover:bg-btn-hover text-white rounded-full px-4 py-2 font-semibold flex flex-row items-center gap-2"
          style={
            isLoading
              ? {
                  backgroundColor: "rgba(67, 56, 202, 0.5)",
                  color: "rgba(255, 255, 255, 0.5)",
                }
              : undefined
          }
          disabled={isLoading}
        >
          {isLoading && (
            <Image
              src={"https://i.sstatic.net/kOnzy.gif"}
              alt="loading-icon"
              width={15}
              height={15}
            />
          )}
          Start Dictation
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
