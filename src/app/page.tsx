import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Screen Recorder</h1>

      <p className="text-gray-600">
        Record your screen, upload, and share instantly.
      </p>

      <Link
        href="/record"
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Start Recording
      </Link>
    </main>
  );
}
