import { VideoFormState } from "@/const";
import VideoForm from "../video-form";

type LandingProps = {
  setPage: (page: VideoFormState) => void;
};

const Landing: React.FC<LandingProps> = ({ setPage }) => {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="flex flex-col gap-6 items-center">
        <p className="text-7xl text-center font-extrabold mobile:text-[7vw]">
          Free YouTube Listening & Typing Tool
        </p>
        <p className="text-center text-2xl font-semibold">
          Listen. Type. Learn.
        </p>
        <div className="w-1/2 mobile:w-full mobile:p-[5vw]">
          <VideoForm formState={VideoFormState.landing} setPage={setPage} />
        </div>
      </div>
    </main>
  );
};

export default Landing;
