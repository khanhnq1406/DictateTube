"use client";
import Landing from "@/modules/landing/index";
import Header from "@/modules/header/index";
import Footer from "@/modules/footer/index";
import { glow, VideoFormState } from "@/const";
import { useForm, useWatch } from "react-hook-form";
import { PageState } from "@/interface";
import Dictation from "@/modules/dictation";
import { useEffect } from "react";

export default function Home() {
  const methods = useForm<PageState>();
  const { control, setValue } = methods;
  const [page] = useWatch({ control, name: ["page"] });

  useEffect(() => {
    setValue("page", VideoFormState.landing);
  }, []);

  const setPage = (newPage: VideoFormState) => {
    setValue("page", newPage);
  };

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)]`}
      style={{
        backgroundImage: `url(${glow})`,
        backgroundSize: "cover",
      }}
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
