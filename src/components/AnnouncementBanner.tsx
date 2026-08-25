"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { X } from "lucide-react";

export function AnnouncementBanner() {
  const announcement = ANNOUNCEMENTS.find((entry) => entry.active);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!announcement) return;
    setDismissed(window.localStorage.getItem(`announcement:${announcement.id}`) === "1");
  }, [announcement]);

  if (!announcement || dismissed) return null;

  return (
    <div className="border-b border-border bg-muted px-4 py-2 text-center text-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        {announcement.href ? (
          <Link href={announcement.href} className="hover:text-primary">
            {announcement.message}
          </Link>
        ) : (
          <span>{announcement.message}</span>
        )}
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            window.localStorage.setItem(`announcement:${announcement.id}`, "1");
            setDismissed(true);
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
