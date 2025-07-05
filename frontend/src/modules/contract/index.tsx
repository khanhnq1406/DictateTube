"use client";

import { useState } from "react";

export default function DictationSubmit() {
  const [score, setScore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitSentence() {
    setLoading(true);

    try {
      const result = await fetch(`/api/contract`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const text = await result.text();
      setScore(text);
    } catch (error) {
      console.error("❌ Error submitting:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={submitSentence}
        disabled={loading}
        className="bg-blue-600 text-white rounded px-4 py-2"
      >
        {loading ? "Submitting..." : "Submit Sentence"}
      </button>
      {score !== null && (
        <p className="mt-4 text-green-700">✅ Score: {score}</p>
      )}
    </div>
  );
}
