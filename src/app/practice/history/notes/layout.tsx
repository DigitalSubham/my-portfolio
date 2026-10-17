import type { ReactNode } from "react";
import styles from "./reader.module.css";

export default function HistoryNotesLayout({ children }: { children: ReactNode }) {
  return <div className={styles.reader}>{children}</div>;
}
