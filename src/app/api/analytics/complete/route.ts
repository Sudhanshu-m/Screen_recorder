import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { id } = await req.json();

  await prisma.video.update({
    where: { id },
    data: { completed: { increment: 1 } },
  });

  return Response.json({ success: true });
}
