import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ params is async in latest Next.js
    const { id } = await params;

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return new Response(
        JSON.stringify({ error: "Video not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(video), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("VIDEO FETCH ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch video" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
