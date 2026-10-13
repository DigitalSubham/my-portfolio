import assert from "node:assert/strict";
import test from "node:test";
import {
  buildApplicationBody,
  experienceParagraphIssues,
  formatApplicationSignature,
  isExplicitRelocationRequest,
  normalizePublicLink,
} from "../src/lib/job-apply-format.ts";

const signature = "Subham Kumar\n+91-8210243998\nsubhams.site \u00b7 github.com/DigitalSubham \u00b7 linkedin.com/in/subham-kr";
const facts = {
  currentLocation: "Patna",
  relocation: "Open to relocating anywhere",
  noticePeriod: "30 days",
  signature,
};
const input = {
  company: "Xonier Technologies Pvt. Ltd.",
  role: "React JS Developer",
  contactName: "",
  experienceParagraph: "I have 3+ years of experience building React applications. I built the Enterprise ERP System with 200+ modules.",
  relocationRequest: "Work from Office",
};

test("links stay canonical through repeated formatting and repair existing broken drafts", () => {
  const cases = [
    ["subhams.site", "https://subhams.online"],
    ["http://www.subhams.site", "https://subhams.online"],
    ["https://subhams.online", "https://subhams.online"],
    ["github.com/DigitalSubham", "https://github.com/DigitalSubham"],
    ["https://https://github.com/DigitalSubham", "https://github.com/DigitalSubham"],
    ["https://www.https://www.linkedin.com/in/subham-kr", "https://www.linkedin.com/in/subham-kr"],
    ["https://www.linkedin.com/in/subham-kr/", "https://www.linkedin.com/in/subham-kr/"],
    ["https://github.com/DigitalSubham/my-portfolio", "https://github.com/DigitalSubham/my-portfolio"],
    ["https://example.com/subhams.site", "https://example.com/subhams.site"],
    ["subhams.site@example.com", "subhams.site@example.com"],
    ["https://subhams.site.example.com", "https://subhams.site.example.com"],
    ["https://github.com/DigitalSubham-other", "https://github.com/DigitalSubham-other"],
    ["Portfolio: subhams.site.", "Portfolio: https://subhams.online."],
    ["GitHub: https://https://github.com/DigitalSubham.", "GitHub: https://github.com/DigitalSubham."],
  ];
  for (const [value, expected] of cases) {
    assert.equal(normalizePublicLink(value), expected);
    assert.equal(normalizePublicLink(normalizePublicLink(value)), expected);
  }
});

test("signature puts each contact on its own line without decorative bullets", () => {
  const expected = "Subham Kumar\n+91-8210243998\nhttps://subhams.online\nhttps://github.com/DigitalSubham\nhttps://www.linkedin.com/in/subham-kr";
  assert.equal(formatApplicationSignature(signature), expected);
  assert.equal(formatApplicationSignature(formatApplicationSignature(signature)), expected);
  assert.equal(formatApplicationSignature("Subham Kumar\n\u00b7 +91-8210243998\n\u2022 https://https://github.com/DigitalSubham"), "Subham Kumar\n+91-8210243998\nhttps://github.com/DigitalSubham");
});

test("office location, work mode, benefits and interviews do not trigger relocation", () => {
  for (const request of ["Location: Noida, Sector 63", "Work from Office", "On-site availability required", "In-person interviews required", "Relocation assistance provided", "No relocation required", "Must not relocate", "Relocation: not required"]) {
    assert.equal(isExplicitRelocationRequest(request, { text: request }), false, request);
  }
});

test("relocation needs an explicit request quoted from the posting", () => {
  for (const request of ["Must be willing to relocate to Noida", "Please mention your relocation availability", "Relocation required", "Are you willing to relocate?", "Relocation: Yes/No"]) {
    assert.equal(isExplicitRelocationRequest(request, { text: `React Developer\n${request}` }), true, request);
  }
  assert.equal(isExplicitRelocationRequest("Must be willing to relocate", { text: "Work from Office in Noida" }), false);
  assert.equal(isExplicitRelocationRequest("Relocation required", { text: "" }), false);
  assert.equal(isExplicitRelocationRequest("Relocation required", { text: "", imageDataUrl: "data:image/png;base64,fixture" }), true);
});

test("the Xonier office posting produces only location and notice period details", () => {
  const body = buildApplicationBody(input, facts, { text: "Company: Xonier Technologies Pvt. Ltd.\nLocation: Noida, Sector 63\nWork Mode: Work from Office" });
  assert.match(body, /Dear Hiring Team,/);
  assert.match(body, /Enterprise ERP System with 200\+ modules/);
  assert.match(body, /\u2022 Current location: Patna\n\u2022 Notice period: 30 days/);
  assert.doesNotMatch(body, /relocat|interviews|\u2022 Experience:|https:\/\/https:\/\//i);
  assert.equal(body.split("Best regards,")[1].trim(), formatApplicationSignature(signature));
});

test("an explicit relocation question uses the saved preference without inventing interview consent", () => {
  const request = "Please mention your relocation availability";
  const body = buildApplicationBody({ ...input, contactName: "Krishna Vaghasiya", relocationRequest: request }, facts, { text: request });
  assert.match(body, /^Dear Krishna,/);
  assert.match(body, /\u2022 Relocation: Open to relocating anywhere/);
  assert.doesNotMatch(body, /interviews|: Yes/);
  const unavailable = buildApplicationBody({ ...input, relocationRequest: request }, { ...facts, relocation: "Not willing to relocate" }, { text: request });
  assert.match(unavailable, /\u2022 Relocation: Not willing to relocate/);
});

test("unknown profile details are omitted", () => {
  const body = buildApplicationBody(input, { ...facts, currentLocation: "not stated", relocation: "not stated", noticePeriod: "not stated" }, { text: "Work from Office" });
  assert.doesNotMatch(body, /not stated|Current location:|Notice period:|Relocation:/);
});

test("draft review rejects altered metrics and unsupported AWS services", () => {
  const evidence = { text: "3+ years, ERP 200+ modules, Sarthaks.com 20M+ users and 150+ issues, 30% engagement, AWS deployments", projectNames: ["Enterprise ERP System", "Sarthaks.com"] };
  const issues = experienceParagraphIssues("I built over 200 modules and deployed them on AWS Lambda, EC2, S3 and CloudFront.", evidence);
  assert.ok(issues.some((issue) => issue.includes("figures") && issue.includes("200")));
  assert.ok(issues.some((issue) => issue.includes("AWS services") && issue.includes("CloudFront")));
  const exact = experienceParagraphIssues("I have 3+ years of experience. I built 200+ modules and resolved 150+ issues for 20M+ users, improving engagement 30%.", evidence);
  assert.ok(exact.every((issue) => !issue.includes("figures") && !issue.includes("AWS services")));
});

test("draft review rejects project lists, excessive length and logistics in the paragraph", () => {
  const evidence = { text: "AWS", projectNames: ["Sarthaks.com", "Quizard", "Enterprise ERP System"] };
  const issues = experienceParagraphIssues(`Sarthaks.com Quizard Enterprise ERP System ${"production interfaces ".repeat(60)} Open to relocating to Noida.`, evidence);
  assert.ok(issues.some((issue) => issue.includes("75 to 110 words")));
  assert.ok(issues.some((issue) => issue.includes("only TWO projects")));
  assert.ok(issues.some((issue) => issue.includes("logistics")));
});
