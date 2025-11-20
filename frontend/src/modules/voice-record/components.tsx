"use client";
import { microphone } from "@/const";
import Image from "next/image";

type RecordButtonType = {
  intent: "start" | "stop";
  onClick?: () => void;
  isNew?: boolean;
};

export const RecordButton: React.FC<RecordButtonType> = (props) => {
  const { onClick, intent, isNew = false } = props;

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Only prevent default on mouse events, not touch events to avoid passive listener errors
    if ("type" in e && e.type === "click") {
      e.preventDefault();
    }
    if ("stopPropagation" in e) {
      e.stopPropagation();
    }
    if (onClick) {
      onClick();
    }
  };

  const handleTouchEnd = () => {
    // Handle touch events separately to avoid passive listener issues
    if (onClick) {
      // Small delay to ensure the touch event is fully processed
      setTimeout(() => {
        onClick();
      }, 50);
    }
  };

  if (intent === "start") {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-28">
        <button
          type="button"
          className="flex justify-center items-center bg-btn p-4 rounded-full hover:bg-btn-hover active:bg-btn-hover focus:outline-none focus:ring-2 focus:ring-btn-focus mobile-play-button"
          onClick={handleClick}
          onTouchEnd={() => handleTouchEnd()}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Image src={microphone} alt="microphone" width={20} height={20} />
        </button>
        <div>Record</div>
        {isNew && <div className="text-text-secondary">Tap to record</div>}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-28">
        <button
          type="button"
          className="flex justify-center items-center bg-red-500 p-4 rounded-full hover:bg-red-700 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mobile-play-button"
          onClick={handleClick}
          onTouchEnd={handleTouchEnd}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Image src={microphone} alt="microphone" width={20} height={20} />
        </button>
        <div>Recording...</div>
        <div className="text-text-secondary">Tap to stop</div>
      </div>
    );
  }
};

type CircularProgressProps = {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 96,
  strokeWidth = 8,
  className = "",
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`relative`} style={{ width: size, height: size }}>
      <svg className="transform" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="#4f46e5"
          className="text-gray-300"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-green-500 transition-all duration-300 ease-out ${className}`}
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xl font-semibold"
          style={{ fontSize: size * 0.2 }}
        >
          {Math.round(progress * 100)}%
        </div>
      )}
    </div>
  );
};
