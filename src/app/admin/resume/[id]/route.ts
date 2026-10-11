import { getCurrentAdmin } from "@/lib/auth";
import { getResumeFile } from "@/lib/db";

export const dynamic = "force-dynamic";

// Any one resume, for preview and download in the admin. Non-default resumes stay private.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentAdmin())) return new Response("Unauthorized", { status: 401 });
  const id = Number((await params).id);
  const resume = await getResumeFile(id);
  if (!resume || resume.id !== id) return new Response("Resume not found.", { status: 404 });

  return new Response(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Subham-Kumar-Resume.pdf"',
      "Cache-Control": "private, no-cache",
    },
  });
}
