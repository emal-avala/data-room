"use client";

import { useEffect } from "react";

/**
 * Soft deterrent: blocks common copy/print shortcuts for non-admin viewers.
 * This is not DRM. Watermarking and access control are the real controls.
 */
export function ContentProtection({ disabled = false }: { disabled?: boolean }) {
  useEffect(() => {
    if (disabled) return;
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && ["c", "p", "s", "u"].includes(key)) {
        event.preventDefault();
      }
    };
    const onContext = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onContext);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
    };
  }, [disabled]);
  return null;
}
