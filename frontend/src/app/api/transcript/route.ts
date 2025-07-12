import { NextRequest, NextResponse } from "next/server";

type SubtitleData = {
  subtitles: [
    {
      languageName: string;
      languageCode: string;
      isTranslatable: boolean;
      url: string;
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const videoId = url.split("v=")[1]?.substring(0, 11);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get RapidAPI configuration from environment variables
    const rapidUrl = process.env.RAPID_URL;
    const rapidHost = process.env.RAPID_HOST;
    const rapidKey = process.env.RAPID_KEY;

    if (!rapidUrl || !rapidHost || !rapidKey) {
      return NextResponse.json(
        { error: "RapidAPI configuration missing" },
        { status: 500 }
      );
    }

    // First request to get subtitle URLs
    const subtitlesResponse = await fetch(
      `${rapidUrl}/subtitles?id=${videoId}&format=json3`,
      {
        headers: {
          "x-rapidapi-host": rapidHost,
          "x-rapidapi-key": rapidKey,
        },
      }
    );

    if (!subtitlesResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch subtitle information" },
        { status: 500 }
      );
    }

    const subtitlesData: SubtitleData = await subtitlesResponse.json();
    const englistUrl = subtitlesData?.subtitles?.find(
      (sub) => sub.languageCode === "en"
    );
    const transcriptUrl = englistUrl?.url;

    if (!transcriptUrl) {
      return NextResponse.json(
        { error: "No transcript available for this video" },
        { status: 404 }
      );
    }

    // Second request to get the actual transcript
    const transcriptResponse = await fetch(transcriptUrl);

    if (!transcriptResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transcript" },
        { status: 500 }
      );
    }

    const transcriptData = await transcriptResponse.json();
    return NextResponse.json(transcriptData);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "An exception occurred" },
      { status: 500 }
    );
  }
}
