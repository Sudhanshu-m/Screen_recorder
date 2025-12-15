export async function startRecording(
  onDataAvailable: (blob: Blob) => void
) {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  const micStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  const combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...micStream.getAudioTracks(),
  ]);

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: "video/webm",
  });

  const chunks: Blob[] = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    onDataAvailable(blob);
  };

  mediaRecorder.start();

  return mediaRecorder;
}
