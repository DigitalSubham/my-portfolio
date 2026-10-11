import nodemailer from "nodemailer";
import { getPortfolioData, getResumeFile, getSql, hasDatabase, listResumes } from "./db";

export type ApplicationDraft = {
  company: string;
  role: string;
  experienceRequired: string;
  location: string;
  applyEmail: string;
  contactName: string;
  skills: string[];
  dealbreakers: string[];
  fitSummary: string;
  subject: string;
  body: string;
  // The resume to attach; the AI picks it when there is more than one.
  resumeId: number;
  model: string;
};

// Free OpenRouter models that read images and were answering in Oct 2026. OpenRouter tries them in
// order. The Gemma ones share Google's free quota with everyone, so they are often rate-limited.
const defaultModels =
  "dots-studio/dots-3-note-preview:free,google/gemma-4-31b-it:free,google/gemma-4-26b-a4b-it:free";

async function getJobProfile(): Promise<Record<string, string>> {
  if (!hasDatabase) return {};
  try {
    const rows = (await getSql()`SELECT * FROM job_profile WHERE id = 1`) as Record<string, string>[];
    return rows[0] ?? {};
  } catch (error) {
    console.error("Failed to load job profile from Neon.", error);
    return {};
  }
}

// Everything the model may claim about the candidate. It is told to use nothing else.
async function candidateFacts() {
  const [data, profile] = await Promise.all([getPortfolioData(), getJobProfile()]);
  return {
    name: data.site.name,
    title: data.site.title,
    email: data.site.email,
    website: data.site.siteUrl,
    links: data.socials.map((social) => `${social.label}: ${social.href}`),
    currentLocation: profile.current_location || "not stated",
    relocation: profile.relocation || "not stated",
    noticePeriod: profile.notice_period || "not stated",
    about: `${data.about.intro}\n${data.about.body}`,
    experience: data.workExperiences.map((job) => ({
      company: job.company,
      position: job.position,
      period: job.period,
      technologies: job.technologies,
      projects: job.projects.map((project) => ({
        name: project.name,
        description: project.description,
        achievements: project.achievements,
        impact: project.impact,
      })),
    })),
    projects: data.projects.map((project) => ({
      title: project.title,
      description: project.description,
      impact: project.impact,
      tags: project.tags,
    })),
    skills: data.skillGroups.map((group) => `${group.title}: ${group.skills.join(", ")}`),
    certificates: data.certificates.map((cert) => `${cert.title} (${cert.issuer})`),
    extraFacts: profile.extra_facts || "",
    signature: profile.signature || `${data.site.name}\n${data.site.siteUrl}`,
    sampleEmails: profile.sample_emails || "",
  };
}

const instructions = `You help a job seeker apply to a job posting by email.

Read the JOB POSTING (text and/or image) and the CANDIDATE facts, then reply with ONLY a JSON object:
{
  "company": string,
  "role": string,
  "experienceRequired": string ("" if not stated),
  "location": string, including work mode such as on-site/remote/hybrid ("" if not stated),
  "applyEmail": string, the address to send the application to ("" if none is given),
  "contactName": string, the recruiter or HR person's name ("" if none is given),
  "skills": string[], the skills the posting actually asks for,
  "dealbreakers": string[], requirements the candidate may NOT meet, each as a short sentence (compare location, interview mode, experience, and required skills against the candidate facts; [] if none),
  "fitSummary": string, one sentence on how well the candidate fits,
  "subject": string, the email subject,
  "body": string, the plain-text email body,
  "resumeId": number, the id from RESUMES whose "bestFor" fits this job best (the default one if none fits better)
}

Rules:
- Ignore hashtags; they are recruiter keywords, not requirements.
- Use ONLY the candidate facts. Never invent experience, numbers, skills, or employers.
- Facts marked "not stated" are unknown: leave them out of the email entirely, never say a detail is missing or unspecified.
- Keep numbers exactly as the facts state them ("20,000+", "200+"); never round them into words like "thousands".
- Write the email body in exactly this shape, as plain text with blank lines between parts:
  1. Greeting: "Dear <first name only>," if a contact is known (for "Krishna Vaghasiya" write "Dear Krishna,"), otherwise "Dear Hiring Team,".
  2. "I hope you are doing well. I am applying for the <role> role at <company>." (use "at your organization" only if the company is unknown).
  3. One paragraph of 2 or 3 sentences, at most 70 words: total experience and the stack that matches the posting, then 2 or 3 achievements from the candidate facts with their exact numbers, choosing the ones closest to this job (backend roles get backend achievements, mobile roles get React Native ones, and so on). Name the employer for each achievement.
  4. The details block, one bullet per line starting with "• ": "Experience: <years>", "Current location: <city>", then if the job is on-site or hybrid in another city and the relocation fact allows it "Open to relocating to <job city> and attending interviews in person: Yes", then "Notice period: <period>". Skip any bullet whose fact is "not stated".
  5. "I have attached my resume for your review. I look forward to hearing from you."
  6. "Best regards," then the signature exactly as given.
- 120 to 180 words. No filler or generic claims ("scalable applications", "clean code", "fast-paced environments", "I believe my skills align"): every sentence must carry a specific fact. Never explain what a technology is for ("MongoDB for robust data management", "React for dynamic interfaces"); just name it.
- The sample emails show the structure the candidate likes. Do not copy their wording; they are weaker than what you should write. No buzzwords, no emojis.
- Subject format: "Application for <role> | <candidate name> | <years of experience> | <two skills>", where the two skills are the candidate's skills that best match the posting. Example: "Application for MERN Stack Developer | Subham Kumar | 3+ Years | React, Node.js". Keep it under 90 characters.`;

function parseDraft(content: string): Omit<ApplicationDraft, "model" | "resumeId"> & { resumeId: number } | null {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const raw = JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
    const text = (key: string) => (typeof raw[key] === "string" ? (raw[key] as string).trim() : "");
    const list = (key: string) =>
      Array.isArray(raw[key]) ? (raw[key] as unknown[]).map(String).filter(Boolean) : [];
    const draft = {
      company: text("company"),
      role: text("role"),
      experienceRequired: text("experienceRequired"),
      location: text("location"),
      applyEmail: text("applyEmail"),
      contactName: text("contactName"),
      skills: list("skills"),
      dealbreakers: list("dealbreakers"),
      fitSummary: text("fitSummary"),
      subject: text("subject"),
      body: text("body"),
      resumeId: Number(raw.resumeId) || 0,
    };
    return draft.role && draft.subject && draft.body ? draft : null;
  } catch {
    return null;
  }
}

export async function draftApplication(posting: { text: string; imageDataUrl?: string }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set.");

  const [facts, resumes] = await Promise.all([candidateFacts(), listResumes()]);
  const resumeChoices = resumes.map(({ id, name, bestFor, isDefault }) => ({ id, name, bestFor, isDefault }));
  const content: Record<string, unknown>[] = [
    {
      type: "text",
      text: `JOB POSTING:\n${posting.text || "(see image)"}\n\nCANDIDATE:\n${JSON.stringify(facts, null, 2)}\n\nRESUMES:\n${JSON.stringify(resumeChoices, null, 2)}`,
    },
  ];
  if (posting.imageDataUrl) {
    content.push({ type: "image_url", image_url: { url: posting.imageDataUrl } });
  }

  const models = (process.env.OPENROUTER_MODELS || defaultModels)
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  // Free models sometimes return malformed JSON, so give them one more try.
  let lastError = "The model did not return a usable draft.";
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": facts.website,
        "X-Title": "Portfolio apply assistant",
      },
      body: JSON.stringify({
        models,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });

    const json = (await response.json().catch(() => null)) as {
      model?: string;
      choices?: { message?: { content?: string } }[];
      error?: { message?: string; metadata?: { raw?: string } };
    } | null;

    if (!response.ok) {
      // "Provider returned error" alone is useless; the provider's own message is in metadata.raw.
      lastError = json?.error?.metadata?.raw || json?.error?.message || `OpenRouter returned ${response.status}.`;
      // Rate limits and auth errors will not fix themselves on a retry.
      if (response.status === 429 || response.status === 401 || response.status === 402) break;
      continue;
    }

    const draft = parseDraft(json?.choices?.[0]?.message?.content ?? "");
    if (draft) {
      // Fall back to the default resume when the model picks an id that does not exist.
      const picked = resumes.find((resume) => resume.id === draft.resumeId) ?? resumes.find((resume) => resume.isDefault);
      return { ...draft, resumeId: picked?.id ?? 0, model: json?.model ?? models[0] };
    }
  }

  throw new Error(lastError);
}

export type SentApplication = {
  id: number;
  company: string;
  role: string;
  toEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  resumeId: number;
  resumeName: string;
};

export async function getSentApplications(): Promise<SentApplication[]> {
  if (!hasDatabase) return [];
  try {
    const rows = (await getSql()`
      SELECT id, company, role, to_email, subject, body, sent_at, resume_id, resume_name FROM applications ORDER BY sent_at DESC
    `) as Record<string, string>[];
    return rows.map((row) => ({
      id: Number(row.id),
      company: row.company,
      role: row.role,
      toEmail: row.to_email,
      subject: row.subject,
      body: row.body,
      sentAt: new Date(row.sent_at).toISOString(),
      resumeId: Number(row.resume_id) || 0,
      resumeName: row.resume_name,
    }));
  } catch (error) {
    console.error("Failed to load applications from Neon.", error);
    return [];
  }
}

export const gmailConnected = () => Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

// Sends one application from the user's Gmail with the current resume attached, then logs it.
// Only ever called from the review screen's Send button.
export async function sendApplication(email: {
  to: string;
  subject: string;
  body: string;
  company: string;
  role: string;
  resumeId: number;
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("Gmail is not connected: set GMAIL_USER and GMAIL_APP_PASSWORD.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.to)) throw new Error("Enter a valid email address.");

  const [resume, data] = await Promise.all([getResumeFile(email.resumeId), getPortfolioData()]);
  if (!resume) throw new Error("No resume uploaded. Upload one under Admin → Resumes first.");

  // Gmail's SMTP server keeps a copy in the Sent folder, so replies thread like normal mail.
  await nodemailer.createTransport({ service: "gmail", auth: { user, pass } }).sendMail({
    from: { name: data.site.name, address: user },
    to: email.to,
    subject: email.subject,
    text: email.body,
    attachments: [
      {
        filename: `${data.site.name.replace(/\s+/g, "_")}_Resume.pdf`,
        content: resume.data,
        contentType: "application/pdf",
      },
    ],
  });

  await getSql()`
    INSERT INTO applications (company, role, to_email, subject, body, resume_id, resume_name)
    VALUES (${email.company}, ${email.role}, ${email.to}, ${email.subject}, ${email.body}, ${resume.id}, ${resume.name})
  `;
}
