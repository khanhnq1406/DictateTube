"use client";
import { useWatch } from "react-hook-form";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import VideoForm from "../video-form";
import { VideoFormState, shadowingFieldKey, dictationFieldKey } from "@/const";
import { useVideoForm } from "@/context/video-form";
import { useEffect, useState } from "react";
import { extractVideoId } from "@/utils/youtube";
import { VideoDataForm, Transcript } from "@/interface";

type VideoPlayerProps = {
  type: VideoFormState;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ type }) => {
  const { videoMethods } = useVideoForm();
  const { control } = videoMethods;
  const [videoId, setVideoId] = useState<string | null>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const fieldKey =
    type === VideoFormState.dictation ? dictationFieldKey : shadowingFieldKey;
  const [videoUrl, isPlaying, transcript, currentIndex] =
    useWatch<VideoDataForm>({
      control,
      name: [
        fieldKey.videoUrl,
        fieldKey.isPlaying,
        fieldKey.transcript,
        fieldKey.currentIndex,
      ],
    }) as [string, boolean, Transcript[], number];

  useEffect(() => {
    if (videoUrl) {
      const id = extractVideoId(videoUrl);
      setVideoId(id);
    }
  }, [videoUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      player !== null &&
      isPlayerReady &&
      transcript &&
      currentIndex !== undefined
    ) {
      const currentTime = transcript[currentIndex].time;
      const nextTime = transcript[currentIndex + 1]?.time;
      const handlePlayback = () => {
        try {
          if (isPlaying) {
            player.seekTo(currentTime);
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        } catch (error) {
          console.error("Error controlling video:", error);
        }
      };

      // Initial playback control
      handlePlayback();

      // Set up interval to check if we need to move to next segment
      interval = setInterval(() => {
        try {
          const currentPlayerTime = player.getCurrentTime();
          if (nextTime && currentPlayerTime >= nextTime) {
            player.pauseVideo();
            videoMethods.setValue("isPlaying", false);
          }
        } catch (error) {
          console.error("Error checking video time:", error);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [player, isPlayerReady, isPlaying, transcript, currentIndex]);

  const onPlayerReady = (event: YouTubeEvent) => {
    try {
      setPlayer(event.target);
      setIsPlayerReady(true);
    } catch (error) {
      console.error("Error initializing player:", error);
    }
  };

  const onError = (event: YouTubeEvent<number>) => {
    console.error("YouTube Player Error:", event);
    setIsPlayerReady(false);
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      controls: 0,
      disablekb: 1,
      cc_load_policy: 0,
    },
  };

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="w-full shadow-shadow-primary-s">
        {videoId ? (
          <YouTube
            videoId={videoId}
            onReady={onPlayerReady}
            onError={onError}
            opts={opts}
            className="w-full aspect-video"
            iframeClassName="w-full h-full rounded-xl"
          />
        ) : (
          <div className="w-full aspect-video bg-bg-secondary rounded-lg flex items-center justify-center">
            <p className="text-text-secondary">Enter a YouTube URL to start</p>
          </div>
        )}
      </div>
      <div className="w-full">
        <VideoForm formState={type} />
      </div>
    </div>
  );
};

export default VideoPlayer;
