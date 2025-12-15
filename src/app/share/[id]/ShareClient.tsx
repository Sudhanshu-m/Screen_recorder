"use client";

import { useEffect, useState } from "react";

type Video = {
  id: string;
  filename: string;
  views: number;
  completed: number;
};

export default function ShareClient({
  id,
  shareUrl,
}: {
  id: string;
  shareUrl: string;
}) {
  const [video, setVideo] = useState<Video | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      const res = await fetch(`/api/video/${id}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to fetch video:", text);
        return;
      }

      const data = await res.json();
      setVideo(data);
    };

    loadVideo();

    // 👀 Track view
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!video) {
    return (
      <div className="p-6 text-center text-slate-600">
        Loading video…
      </div>
    );
  }

  const completionRate =
    video.views === 0
      ? 0
      : Math.round((video.completed / video.views) * 100);

  return (
    <div className="space-y-8">
      {/* VIDEO */}
      <video
        src={`/videos/${video.filename}`}
        controls
        className="w-full rounded-lg border"
        onEnded={() => {
          fetch("/api/analytics/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
        }}
      />

      {/* ANALYTICS */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Views: {video.views}</span>
          <span>Completion: {completionRate}%</span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* SHARE LINK */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
        <p className="text-sm font-medium text-slate-700">
          Share this link
        </p>

        <div className="flex gap-3">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 border rounded-md p-2 text-sm text-blue-700"
          />

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
