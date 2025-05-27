import Footer from "@/modules/footer";
import Header from "@/modules/header";
import TypeForm from "@/modules/type-form";
import VideoPlayer from "@/modules/video-player";

export default function Dictation() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-8 font-[family-name:var(--font-plus-jakarta-sans)]`">
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center w-full">
        <Header />
      </header>
      <main className="grid grid-rows-1 grid-cols-12 w-full gap-20 px-10">
        <div className="col-span-5">
          <VideoPlayer />
        </div>
        <div className="col-span-7">
          <TypeForm />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
