import { Transcript } from "@/interface";

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

// API response interfaces
interface ApiSegment {
  utf8: string;
}

interface ApiEvent {
  tStartMs: number;
  dDurationMs: number;
  segs: ApiSegment[];
  wpWinPosId: number;
}

interface ApiResponse {
  wireMagic: string;
  pens: Record<string, unknown>[];
  wsWinStyles: Record<string, unknown>[];
  wpWinPositions: Record<string, unknown>[];
  events: ApiEvent[];
}

export const parseApiResponse = (response: ApiResponse): Transcript[] => {
  if (!response.events || !Array.isArray(response.events)) {
    return [];
  }

  return response.events
    .filter((event: ApiEvent) => event.segs && event.segs.length > 0)
    .map((event: ApiEvent) => {
      let combinedTranscript = "";

      event.segs.forEach((segment: ApiSegment) => {
        if (segment.utf8) {
          const cleanText = segment.utf8
            .replace(/\\n/g, "")
            .replace(/\n/g, " ")
            .replace(/\[Music\]/g, "")
            .trim();

          if (cleanText) {
            combinedTranscript += cleanText + " ";
          }
        }
      });

      return {
        time: event.tStartMs / 1000,
        transcript: combinedTranscript.trim(),
      };
    })
    .filter((item) => item.transcript.length > 0);
};
