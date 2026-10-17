import type { ReactNode } from 'react';
import base from '../../history/notes/reader.module.css';
import styles from './reader.module.css';

export default function OopNotesLayout({ children }: { children: ReactNode }) {
  return <div className={`${base.reader} ${styles.oop}`}>{children}</div>;
}
