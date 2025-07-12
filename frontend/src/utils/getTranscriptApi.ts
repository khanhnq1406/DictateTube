// Helper function to convert YouTube short URLs to standard format
function convertYouTubeUrl(videoUrl: string): string {
  // Check if it's a YouTube short URL (youtu.be)
  const shortUrlRegex = /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)(\?.*)?$/;
  const match = videoUrl.match(shortUrlRegex);

  if (match) {
    const videoId = match[1];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Return original URL if it's not a short URL
  return videoUrl;
}

async function getTranscriptApi(videoUrl: string) {
  if (videoUrl) {
    try {
      // convert videourl
      const convertedUrl = convertYouTubeUrl(videoUrl);
      const res = await fetch(
        `/api/transcript?url=${encodeURIComponent(convertedUrl)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch transcript");
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching transcript:", error);
      throw error;
    }
  }
  return undefined;
}

export { getTranscriptApi };
