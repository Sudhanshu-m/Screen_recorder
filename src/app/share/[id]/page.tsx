import { prisma } from "@/lib/db";
import ShareClient from "./ShareClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: Props) {
  const { id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700 text-lg">Video not found</p>
      </div>
    );
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${id}`;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Shared Video
          </h1>
          <p className="text-slate-600">
            Anyone with this link can view the video.
          </p>
        </header>

        {/* CLIENT SIDE CONTENT */}
        <ShareClient id={id} shareUrl={shareUrl} />

        <footer className="text-center text-sm text-slate-500">
          Built with Next.js, ffmpeg & Prisma
        </footer>
      </div>
    </div>
  );
}
