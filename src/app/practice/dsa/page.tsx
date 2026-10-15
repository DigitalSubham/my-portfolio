import type { Metadata } from "next";
import Quiz from "./Quiz";

export const metadata: Metadata = {
  title: "TRE DSA Question Bank",
  description: "DSA practice with topic filters, worked explanations, timed tests and saved progress.",
  alternates: { canonical: "/practice/dsa" },
  openGraph: { title: "TRE DSA Question Bank", url: "/practice/dsa" },
};

export default function DsaPracticePage() {
  return <Quiz />;
}
