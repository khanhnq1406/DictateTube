"use client";
import { microphone } from "@/const";
import Image from "next/image";

type RecordButtonType = {
  intent: "start" | "stop";
  onClick?: () => void;
};

export const RecordButton: React.FC<RecordButtonType> = (props) => {
  const { onClick, intent } = props;

  if (intent === "start") {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-28">
        <div
          className="flex justify-center items-center bg-btn p-4 rounded-full hover:bg-btn-hover"
          onClick={onClick}
        >
          <Image src={microphone} alt="microphone" width={20} height={20} />
        </div>
        <div>Record</div>
        <div className="text-text-secondary">Tap to record</div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-28">
        <div
          className="flex justify-center items-center bg-red-500 p-4 rounded-full hover:bg-red-700"
          onClick={onClick}
        >
          <Image src={microphone} alt="microphone" width={20} height={20} />
        </div>
        <div>Recording...</div>
        <div className="text-text-secondary">Tap to stop</div>
      </div>
    );
  }
};
