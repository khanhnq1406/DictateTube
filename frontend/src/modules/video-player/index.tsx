"use client";
import { useWatch } from "react-hook-form";
import YouTube, { YouTubeEvent } from "react-youtube";
import VideoForm from "../video-form";
import { VideoFormState } from "@/const";
import { useVideoForm } from "@/context/video-form";
import { useEffect, useState } from "react";
import { extractVideoId } from "@/utils/youtube";

const VideoPlayer: React.FC = () => {
  const { videoMethods } = useVideoForm();
  const { control } = videoMethods;
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl] = useWatch({
    control,
    name: ["videoUrl"],
  });

  useEffect(() => {
    if (videoUrl) {
      const id = extractVideoId(videoUrl);
      console.log(id);
      setVideoId(id);
    }
  }, [videoUrl]);

  const onPlayerReady = (event: YouTubeEvent) => {
    console.log(event.target);
  };

  const opts = {
    width: "100%",
  };

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="w-full shadow-shadow-primary-s">
        {videoId ? (
          <YouTube videoId={videoId} onReady={onPlayerReady} opts={opts} />
        ) : (
          <div className="w-full aspect-video bg-bg-secondary rounded-lg flex items-center justify-center">
            <p className="text-text-secondary">Enter a YouTube URL to start</p>
          </div>
        )}
      </div>
      <div className="w-full">
        <VideoForm formState={VideoFormState.dictation} />
      </div>
    </div>
  );
};

export default VideoPlayer;
