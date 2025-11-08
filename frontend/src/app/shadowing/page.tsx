"use client";
import Header from "@/modules/header/index";
import Footer from "@/modules/footer/index";
import { Shadowing } from "@/modules/shadowing";

export default function Home() {
  return (
    <div
      className={
        "flex flex-col items-center justify-items-center place-content-between min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)] mobile:max-w-[100vw] mobile:flex mobile:flex-col mobile:justify-center mobile:p-[2vw] mobile:py-[5vw] mobile:gap-[5vw]"
      }
    >
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center w-full">
        <Header />
      </header>
      <Shadowing />
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
