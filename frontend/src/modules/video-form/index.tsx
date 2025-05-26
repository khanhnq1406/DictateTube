import { Controller, useForm } from "react-hook-form";
import { VideoDataForm } from "@/interface";

const VideoForm: React.FC = () => {
  const methods = useForm<VideoDataForm>();
  const { control, handleSubmit } = methods;

  const onSubmit = (data: VideoDataForm) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Controller
        control={control}
        name="videoUrl"
        render={({ field }) => (
          <div className="relative bg-bg-secondary h-16 rounded-full p-[2px]">
            <div className="absolute inset-0 bg-border-gradient rounded-full"></div>
            <input
              type="text"
              {...field}
              placeholder="Enter YouTube video URL"
              className="relative bg-bg-secondary h-full w-full rounded-full px-4 focus:outline-none"
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name="transcript"
        render={({ field }) => (
          <div className="relative bg-bg-secondary h-32 rounded-2xl p-[2px]">
            <div className="absolute inset-0 bg-border-gradient rounded-2xl"></div>
            <textarea
              {...field}
              placeholder="Enter YouTube video transcript"
              className="relative bg-bg-secondary h-full w-full rounded-2xl p-4 resize-none focus:outline-none"
            />
          </div>
        )}
      />
      <div className="flex flex-row place-content-between items-center">
        <button
          className="underline bg-transparent text-text-secondary"
          type="button"
          onClick={() => {
            // window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
          }}
        >
          How to get a YouTube transcript?
        </button>
        <button
          type="submit"
          className="bg-btn text-white rounded-full px-4 py-2 font-semibold"
        >
          Start Dictation
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
