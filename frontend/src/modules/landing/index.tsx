import VideoForm from "../video-form";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-7xl text-center font-extrabold">
        Free YouTube Listening & Typing Tool
      </p>
      <p className="text-center text-2xl font-semibold">Listen. Type. Learn.</p>
      <VideoForm />
    </div>
  );
};

export default Landing;
