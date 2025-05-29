import VideoPlayer from "@/modules/video-player";
import TypeForm from "@/modules/type-form";

const Dictation: React.FC = () => {
  return (
    <main className="grid grid-rows-1 grid-cols-12 w-full gap-20 px-10">
      <div className="col-span-5">
        <VideoPlayer />
      </div>
      <div className="col-span-7">
        <TypeForm />
      </div>
    </main>
  );
};

export default Dictation;
