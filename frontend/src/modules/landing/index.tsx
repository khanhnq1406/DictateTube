import VideoForm from "../video-form";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-7xl text-center font-extrabold">
        Free YouTube Listening & Typing Tool
      </p>
      <p className="text-center text-2xl font-semibold">Listen. Type. Learn.</p>
      <div className="w-1/2">
        <VideoForm />
      </div>
    </div>
  );
};

export default Landing;
