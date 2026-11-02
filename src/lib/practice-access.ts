export function isPracticeQuizPath(pathname: string): boolean {
  const match = /^\/practice\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(pathname);
  return Boolean(match && match[0] === pathname && match[1].length <= 80);
}

export function practiceReturnPath(value: unknown): string {
  if (value === "/dsa-practice.html") return "/practice/dsa";
  if (typeof value !== "string") return "/admin";
  const [pathname] = value.split("?");
  return isPracticeQuizPath(pathname) ? value : "/admin";
}
