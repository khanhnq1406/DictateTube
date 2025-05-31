export interface TranscriptItem {
  time: string;
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
          time: match[1],
          transcript: match[2].trim(),
        };
      }

      return null;
    })
    .filter((item): item is TranscriptItem => item !== null);
};
