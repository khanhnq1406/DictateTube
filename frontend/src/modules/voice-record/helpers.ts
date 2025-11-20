// Function to compare transcripts and calculate progress
export const compareTranscripts = (original: string, recorded: string) => {
  if (!original || !recorded) return { words: [], accuracy: 0 };

  const originalWords = original.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const recordedWords = recorded.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').split(/\s+/);

  const highlighted = recordedWords.map((word, index) => {
    const isCorrect =
      index < originalWords.length && word === originalWords[index];
    return { word, isCorrect };
  });

  // Calculate accuracy (correct words / max length)
  const correctCount = highlighted.filter((w) => w.isCorrect).length;
  const maxLength = Math.max(originalWords.length, recordedWords.length);
  const accuracy = maxLength > 0 ? correctCount / maxLength : 0;

  return { words: highlighted, accuracy };
};
