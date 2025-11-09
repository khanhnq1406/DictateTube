import VideoPlayer from "@/modules/video-player";
import TypeForm from "@/modules/type-form";
import { VideoFormState } from "@/const";

const Dictation: React.FC = () => {
  return (
    <main className="grid grid-rows-1 grid-cols-12 w-full gap-20 px-10 mobile:flex mobile:flex-col mobile:justify-center mobile:max-w-[100vw] mobile:gap-[8vw] mobile:px-[7vw]">
      <div className="col-span-5">
        <VideoPlayer type={VideoFormState.dictation} />
      </div>
      <div className="col-span-7">
        <TypeForm />
      </div>
    </main>
  );
};

export default Dictation;
