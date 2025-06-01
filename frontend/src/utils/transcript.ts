export interface TranscriptItem {
  time: number;
  transcript: string;
}

export const parseTranscript = (text: string): TranscriptItem[] => {
  if (!text) return [];

  // Split the text into lines and filter out empty lines, comments, and [Music]
  const lines = text
    .split("\n")
    .filter(
      (line) =>
        line.trim() && !line.startsWith("#") && !line.includes("[Music]")
    );

  return lines
    .map((line) => {
      // Match the time and transcript parts
      const match = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s+(.*)$/);

      if (match) {
        return {
          time: timeToSeconds(match[1]),
          transcript: match[2].trim(),
        };
      }

      return null;
    })
    .filter((item): item is TranscriptItem => item !== null);
};

export const timeToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return Math.floor(hours * 3600 + minutes * 60 + seconds);
};
