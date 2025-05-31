"use client";
import { createContext, useContext, ReactNode } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { VideoDataForm } from "@/interface";

type VideoFormContextType = {
  videoMethods: UseFormReturn<VideoDataForm>;
};

const VideoFormContext = createContext<VideoFormContextType | undefined>(
  undefined
);

export const VideoFormProvider = ({ children }: { children: ReactNode }) => {
  const videoMethods = useForm<VideoDataForm>();

  return (
    <VideoFormContext.Provider value={{ videoMethods }}>
      {children}
    </VideoFormContext.Provider>
  );
};

export const useVideoForm = () => {
  const context = useContext(VideoFormContext);
  if (context === undefined) {
    throw new Error("useVideoForm must be used within a VideoFormProvider");
  }
  return context;
};
