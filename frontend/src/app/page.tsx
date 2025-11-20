"use client";
import Landing from "@/modules/landing/index";
import Header from "@/modules/header/index";
import Footer from "@/modules/footer/index";
import { dictationFieldKey as fieldKey, glow } from "@/const";
import { useVideoForm } from "@/context/video-form";
import { parseTranscript } from "@/utils/transcript";
import { useEffect } from "react";

export default function Home() {
  const { videoMethods } = useVideoForm();
  const { setValue: setVideoValue } = videoMethods;

  useEffect(() => {
    if (window.localStorage.getItem(fieldKey.transcript)) {
      const parsedTranscript = parseTranscript(
        window.localStorage.getItem(fieldKey.transcript) || ""
      );
      setVideoValue(fieldKey.transcript, parsedTranscript);
    }
  }, []);

  return (
    <div
      className={
        "flex flex-col items-center justify-items-center place-content-between min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)] mobile:max-w-[100vw] mobile:flex mobile:flex-col mobile:justify-center mobile:p-[2vw] mobile:py-[5vw] mobile:gap-[5vw]"
      }
      style={{
        backgroundImage: `url(${glow})`,
        backgroundSize: "cover",
        justifyContent: "space-between",
      }}
    >
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center w-full">
        <Header />
      </header>
      <Landing />
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
