import { prisma } from "@/lib/db";

export async function GET() {
  const count = await prisma.video.count();
  return Response.json({ count });
}
