export function isPracticeQuizPath(pathname: string): boolean {
  return ["dbms", "oops", "dsa", "history"].some((subject) => pathname === `/practice/${subject}`);
}

export function practiceReturnPath(value: unknown): string {
  if (value === "/dsa-practice.html") return "/practice/dsa";
  if (typeof value !== "string") return "/admin";
  const [pathname] = value.split("?");
  return isPracticeQuizPath(pathname) ? value : "/admin";
}
