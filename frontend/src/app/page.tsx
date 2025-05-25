"use client";
import VideoForm from "@/modules/video-form/index";
import Header from "@/modules/header/index";
import Footer from "@/modules/footer/index";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)]">
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center w-full">
        <Header />
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <VideoForm />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
