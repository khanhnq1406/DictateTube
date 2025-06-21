async function getTranscriptApi(videoUrl: string) {
  if (videoUrl) {
    try {
      const res = await fetch(
        `/api/transcript?url=${encodeURIComponent(videoUrl)}`,
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
