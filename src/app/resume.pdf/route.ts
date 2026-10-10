import { getResume } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const resume = await getResume();
  if (!resume) return new Response("Resume not uploaded yet.", { status: 404 });

  return new Response(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Subham-Kumar-Resume.pdf"',
      "Cache-Control": "no-cache",
      "Last-Modified": resume.updatedAt.toUTCString(),
    },
  });
}
