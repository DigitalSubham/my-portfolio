import { getResumeFile } from "@/lib/db";

export const dynamic = "force-dynamic";

// Always the default resume; other resumes are only reachable from the admin.
export async function GET() {
  const resume = await getResumeFile();
  if (!resume) return new Response("Resume not uploaded yet.", { status: 404 });

  return new Response(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Subham-Kumar-Resume.pdf"',
      "Cache-Control": "no-cache",
      "Last-Modified": resume.createdAt.toUTCString(),
    },
  });
}
