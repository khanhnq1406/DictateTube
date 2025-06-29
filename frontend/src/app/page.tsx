"use client";
import Landing from "@/modules/landing/index";
import Header from "@/modules/header/index";
import Footer from "@/modules/footer/index";
import { fieldKey, glow, VideoFormState } from "@/const";
import { useForm, useWatch } from "react-hook-form";
import { PageState } from "@/interface";
import Dictation from "@/modules/dictation";
import { useEffect } from "react";
import { useVideoForm } from "@/context/video-form";
import { parseTranscript } from "@/utils/transcript";

export default function Home() {
  const pageMethods = useForm<PageState>();
  const { control: pageControl, setValue: setPageValue } = pageMethods;
  const [page] = useWatch({ control: pageControl, name: ["page"] });

  const { videoMethods } = useVideoForm();
  const { setValue: setVideoValue } = videoMethods;

  useEffect(() => {
    if (window.localStorage.getItem(fieldKey.videoUrl)) {
      setPageValue("page", VideoFormState.dictation);
    } else {
      setPageValue("page", VideoFormState.landing);
    }
    if (window.localStorage.getItem(fieldKey.transcript)) {
      const parsedTranscript = parseTranscript(
        window.localStorage.getItem(fieldKey.transcript) || ""
      );
      setVideoValue(fieldKey.transcript, parsedTranscript);
    }
  }, []);

  const setPage = (newPage: VideoFormState) => {
    setPageValue("page", newPage);
  };

  return (
    <div
      className={`grid items-center justify-items-center min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)]`}
      style={
        page === VideoFormState.landing
          ? {
              backgroundImage: `url(${glow})`,
              backgroundSize: "cover",
            }
          : {}
      }
    >
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center w-full">
        <Header />
      </header>
      {page === VideoFormState.landing && <Landing setPage={setPage} />}
      {page === VideoFormState.dictation && <Dictation />}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
