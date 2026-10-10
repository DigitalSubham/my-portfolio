"use client";

import { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";

// Put inside a <Link>: shows a progress bar at the top of the screen while that link's page loads.
// Portalled to <body> because the sidebar and tiles use transforms, which would trap a fixed element.
export default function LinkPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return createPortal(
    <div className="adm-progress" role="progressbar" aria-label="Loading page" />,
    document.body,
  );
}
