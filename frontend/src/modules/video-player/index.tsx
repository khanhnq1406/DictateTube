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
  const [localPlayingState, setLocalPlayingState] = useState(isPlaying);
  const [isInternalStateChange, setIsInternalStateChange] = useState(false);

  useEffect(() => {
    if (videoUrl) {
      const id = extractVideoId(videoUrl);
      setVideoId(id);
    }
  }, [videoUrl]);

  // Synchronize local playing state with form state
  useEffect(() => {
    setLocalPlayingState(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    let stateChangeTimeout: NodeJS.Timeout;

    if (
      player !== null &&
      isPlayerReady &&
      transcript &&
      currentIndex !== undefined
    ) {
      const currentTime = transcript[currentIndex].time;
      const nextTime = transcript[currentIndex + 1]?.time;

      const handlePlayback = () => {
        // Add player ready state validation
        if (!player || !isPlayerReady) {
          console.warn("Player not ready, skipping playback control");
          return;
        }

        try {
          // Set flag to indicate this is an internal state change
          setIsInternalStateChange(true);

          if (localPlayingState) {
            player.seekTo(currentTime);
            player.playVideo();
          } else {
            player.pauseVideo();
          }

          // Reset flag after a short delay
          stateChangeTimeout = setTimeout(() => setIsInternalStateChange(false), 200);
        } catch (error) {
          console.error("Error controlling video:", error);
          setIsInternalStateChange(false);
        }
      };

      // Debounce state updates to prevent race conditions
      timeoutId = setTimeout(() => {
        handlePlayback();
      }, 100);

      // Set up interval to check if we need to move to next segment
      interval = setInterval(() => {
        try {
          if (!player || !isPlayerReady) return;

          const currentPlayerTime = player.getCurrentTime();
          if (nextTime && currentPlayerTime >= nextTime) {
            setIsInternalStateChange(true);
            player.pauseVideo();
            setLocalPlayingState(false);
            videoMethods.setValue(fieldKey.isPlaying, false);
            stateChangeTimeout = setTimeout(() => setIsInternalStateChange(false), 200);
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
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (stateChangeTimeout) {
        clearTimeout(stateChangeTimeout);
      }
    };
  }, [
    player,
    isPlayerReady,
    localPlayingState,
    transcript,
    currentIndex,
    fieldKey.isPlaying,
    fieldKey,
  ]);

  const onPlayerReady = (event: YouTubeEvent) => {
    try {
      setPlayer(event.target);
      setIsPlayerReady(true);
    } catch (error) {
      console.error("Error initializing player:", error);
    }
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    try {
      const playerState = event.target.getPlayerState();
      const isVideoPlaying = playerState === 1; // YT.PlayerState.PLAYING

      // Only sync player state back to form if this wasn't an internal change
      if (!isInternalStateChange && isVideoPlaying !== localPlayingState) {
        setLocalPlayingState(isVideoPlaying);
        videoMethods.setValue(fieldKey.isPlaying, isVideoPlaying);
      }
    } catch (error) {
      console.error("Error handling player state change:", error);
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
            onStateChange={onPlayerStateChange}
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
