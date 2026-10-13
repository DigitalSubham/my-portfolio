export const officialWebsite = "https://subhams.online";
export const experienceParagraphWordRange = { min: 45, max: 65 };

export function normalizePublicLink(value: string) {
  // Match the whole link, including prefixes left by older drafts, in one pass.
  return value.replace(
    /(?<![\w@./-])(?:(?:https?:\/\/|www\.))*(subhams\.(?:site|online)|github\.com\/DigitalSubham|linkedin\.com\/in\/subham-kr)(?![\w@-]|\.[\w-])/gi,
    (_, address: string) => {
      if (address.toLowerCase().startsWith("subhams.")) return officialWebsite;
      if (address.toLowerCase().startsWith("github.")) return "https://github.com/DigitalSubham";
      return "https://www.linkedin.com/in/subham-kr";
    },
  );
}

export function formatApplicationSignature(value: string) {
  return normalizePublicLink(value)
    .split(/[\n\u00b7]+/)
    .map((line) => line.replace(/^\s*[\u2022*-]\s+/, "").trim())
    .filter(Boolean)
    .join("\n");
}

export function experienceParagraphIssues(paragraph: string, evidence: { text: string; projectNames: string[] }) {
  const issues: string[] = [];
  const words = paragraph.trim().split(/\s+/).filter(Boolean).length;
  if (words < experienceParagraphWordRange.min || words > experienceParagraphWordRange.max) {
    issues.push(`The experience paragraph has ${words} words. Use ${experienceParagraphWordRange.min} to ${experienceParagraphWordRange.max} words.`);
  }
  const namedProjects = evidence.projectNames.filter((name) => paragraph.toLowerCase().includes(name.toLowerCase()));
  if (namedProjects.length > 2) issues.push(`Describe only TWO projects, not ${namedProjects.length}: ${namedProjects.join(", ")}.`);

  const numberPattern = /\b\d[\d,]*(?:\.\d+)?(?:[MKB])?(?:\+|%|x)?/gi;
  const allowedNumbers = new Set((evidence.text.match(numberPattern) ?? []).map((value) => value.toLowerCase()));
  const unsupportedNumbers = [...new Set(paragraph.match(numberPattern) ?? [])].filter((value) => !allowedNumbers.has(value.toLowerCase()));
  if (unsupportedNumbers.length) issues.push(`These figures are not stated exactly in the candidate facts: ${unsupportedNumbers.join(", ")}. Use the exact recorded figures, including +, %, M and x.`);

  const unsupportedServices = [...new Set(paragraph.match(/\b(?:Lambda|EC2|S3|CloudFront|ECS|EKS)\b/gi) ?? [])]
    .filter((service) => !new RegExp(`\\b${service}\\b`, "i").test(evidence.text));
  if (unsupportedServices.length) issues.push(`Do not claim these AWS services; they are absent from the candidate facts: ${unsupportedServices.join(", ")}.`);
  if (/\b(?:relocat\w*|notice period|current location|in.person interviews?|best regards)\b|https?:\/\//i.test(paragraph)) {
    issues.push("The experience paragraph must contain only experience and project contributions. The app adds logistics and the signature.");
  }
  if (/\b(?:my current role|complex enterprise systems|comprehensive admin dashboard|scalable applications|clean code|fast.paced environments)\b/i.test(paragraph)) {
    issues.push("Replace vague role summaries and generic claims with a named project and your specific contribution.");
  }
  return issues;
}

export function isExplicitRelocationRequest(request: string, posting: { text: string; imageDataUrl?: string }) {
  const quote = request.replace(/\s+/g, " ").trim().toLowerCase();
  if (!quote) return false;
  const text = posting.text.replace(/\s+/g, " ").toLowerCase();
  if (text && !text.includes(quote)) return false;
  if (!text && !posting.imageDataUrl) return false;
  if (/\b(?:no|not|without)\b.{0,30}\brelocat|\brelocat\w*\b.{0,30}\b(?:not required|not necessary)\b/.test(quote)) return false;

  // A city, office work mode, or relocation benefit alone is not a request.
  return /\b(?:willing(?:ness)?|open|ready|able|must|should|can|require(?:d|ment)?|expect(?:ed)?|ability|availability|confirm|mention|share)\b.{0,80}\brelocat(?:e|ion|ing)\b|\brelocat(?:e|ion|ing)\b.{0,80}(?:\b(?:required|mandatory|willing(?:ness)?|availability|preference)\b|[?:])/.test(quote);
}

type BodyInput = {
  company: string;
  role: string;
  contactName: string;
  experienceParagraph: string;
  relocationRequest: string;
};

type BodyFacts = {
  currentLocation: string;
  relocation: string;
  noticePeriod: string;
  signature: string;
};

export function buildApplicationBody(input: BodyInput, facts: BodyFacts, posting: { text: string; imageDataUrl?: string }) {
  const known = (value: string) => value.trim() && value.trim().toLowerCase() !== "not stated";
  const details: string[] = [];
  if (known(facts.currentLocation)) details.push(`\u2022 Current location: ${facts.currentLocation}`);
  if (known(facts.relocation) && isExplicitRelocationRequest(input.relocationRequest, posting)) {
    details.push(`\u2022 Relocation: ${facts.relocation}`);
  }
  if (known(facts.noticePeriod)) details.push(`\u2022 Notice period: ${facts.noticePeriod}`);
  const firstName = input.contactName.trim().split(/\s+/)[0];

  return [
    firstName ? `Dear ${firstName},` : "Dear Hiring Team,",
    `I am applying for the ${input.role} role ${input.company ? `at ${input.company}` : "at your organization"}${input.company.endsWith(".") ? "" : "."}`,
    normalizePublicLink(input.experienceParagraph.replace(/\s+/g, " ").trim()),
    details.join("\n"),
    "My resume is attached for your review.",
    `Best regards,\n${formatApplicationSignature(facts.signature)}`,
  ].filter(Boolean).join("\n\n");
}
