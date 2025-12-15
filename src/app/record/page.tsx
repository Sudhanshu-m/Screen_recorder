"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [uploading, setUploading] = useState(false);

  // 🎬 Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setVideoBlob(blob);
    };

    recorder.start();
    setRecording(true);
  };

  // ⏹ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // ☁️ Upload (server-side trim)
  const uploadVideo = async () => {
    if (!videoBlob) return;

    if (endTime > 0 && endTime <= startTime) {
      alert("End time must be greater than start time");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("video", videoBlob);
    formData.append("start", startTime.toString());
    formData.append("end", endTime.toString());

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        alert("Upload or trim failed");
        return;
      }

      const data = await res.json();
      router.push(`/share/${data.id}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Screen Recorder
          </h1>
          <p className="text-slate-700">
            Record your screen, trim the video, and share a public link.
          </p>
        </header>

        {/* STEP 1 */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Step 1: Record your screen
          </h2>

          {!recording && (
            <button
              onClick={startRecording}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop Recording
            </button>
          )}
        </section>

        {/* STEP 2 */}
        {videoBlob && (
          <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Step 2: Preview & choose trim range
            </h2>

            <video
              controls
              className="w-full rounded-lg border"
              src={URL.createObjectURL(videoBlob)}
            />

            <p className="text-sm text-slate-600">
              Select the part of the video you want to keep.
              <br />
              <span className="text-slate-500">
                The trimming is done on the server when you upload.
              </span>
            </p>

            <div className="flex gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                  Start time (seconds)
                </label>
                <input
                  type="number"
                  min={0}
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="border rounded-md p-2 w-40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                  End time (seconds)
                </label>
                <input
                  type="number"
                  min={0}
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="border rounded-md p-2 w-40"
                />
              </div>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {videoBlob && (
          <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Step 3: Trim & upload
            </h2>

            <p className="text-sm text-slate-600">
              Clicking below will trim the video using the selected time range
              and generate a public share link.
            </p>

            <button
              onClick={uploadVideo}
              disabled={uploading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 disabled:opacity-60"
            >
              {uploading ? "Trimming & Uploading..." : "Trim & Upload"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
