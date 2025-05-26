"use client";
import { useWatch, useForm } from "react-hook-form";

import { VideoDataForm } from "@/interface";
import YouTube, { YouTubeEvent } from "react-youtube";
import VideoForm from "../video-form";

const VideoPlayer: React.FC = () => {
  const methods = useForm<VideoDataForm>();
  const { control } = methods;
  const [videoUrl, transcript] = useWatch({
    control,
    name: ["videoUrl", "transcript"],
  });
  const onPlayerReady = (event: YouTubeEvent) => {
    console.log(event.target);
  };
  const opts = {
    width: "100%",
  };
  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="w-full">
        <YouTube videoId="8InuLZ-2vV4" onReady={onPlayerReady} opts={opts} />
      </div>
      <div className="w-full">
        <VideoForm />
      </div>
    </div>
  );
};

export default VideoPlayer;
