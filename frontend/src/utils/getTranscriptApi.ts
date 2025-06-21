async function getTranscriptApi(videoUrl: string) {
  if (videoUrl) {
    const id = videoUrl.split("v=")[1].substring(0, 11);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_RAPID_URL}/subtitles?id=${id}&format=json3`,
      {
        headers: {
          "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPID_HOST ?? "",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_KEY ?? "",
        },
      }
    );
    const textRes = await res.text();
    const parsedData = JSON.parse(textRes);
    const transcriptUrl = parsedData.subtitles[0]?.url;
    if (transcriptUrl) {
      const transcriptRes = await fetch(transcriptUrl);
      return await transcriptRes.json();
    }
    return undefined;
  }
  return undefined;
}

export { getTranscriptApi };
