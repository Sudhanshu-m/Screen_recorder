import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import ffmpeg from "fluent-ffmpeg";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    const start = Number(formData.get("start") ?? 0);
    const end = Number(formData.get("end") ?? 0);

    if (!file) {
      return Response.json({ error: "No video uploaded" }, { status: 400 });
    }

    const id = uuid();
    const uploadDir = path.join(process.cwd(), "public", "videos");
    await mkdir(uploadDir, { recursive: true });

    const rawPath = path.join(uploadDir, `${id}-raw.webm`);
    const finalPath = path.join(uploadDir, `${id}.webm`);

    await writeFile(rawPath, Buffer.from(await file.arrayBuffer()));

    // 🔥 SERVER-SIDE FFMPEG TRIM
    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(rawPath);

      if (start > 0) command = command.setStartTime(start);
      if (end > start) command = command.setDuration(end - start);

      command
        .output(finalPath)
        .on("end", () => resolve())
        .on("error", (err: Error) => reject(err))
        .run();
    });

    await prisma.video.create({
      data: {
        id,
        filename: `${id}.webm`,
      },
    });

    return Response.json({ id });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      { error: "Upload or trim failed" },
      { status: 500 }
    );
  }
}
