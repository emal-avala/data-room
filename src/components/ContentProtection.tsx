"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide copy deterrent (same contract as the investor site).
 *
 * Blocks selection, copy/cut, right-click, drag, and common
 * Ctrl/Cmd shortcuts (C/X/A/S/P/U) on public pages. Admin stays
 * usable. Form fields stay selectable so login still works.
 *
 * This is not DRM. Watermarking and access control are the real controls.
 */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function ContentProtection({ disabled = false }: { disabled?: boolean }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) return;
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (["c", "x", "a", "s", "p", "u"].includes(key)) {
      event.preventDefault();
    }
  }, []);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
  }, []);

  const handleCopy = useCallback((event: ClipboardEvent) => {
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
  }, []);

  const handleDragStart = useCallback((event: DragEvent) => {
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
  }, []);

  const handleSelectStart = useCallback((event: Event) => {
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (disabled || isAdminPage) return;

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, [
    disabled,
    isAdminPage,
    handleKeyDown,
    handleContextMenu,
    handleCopy,
    handleDragStart,
    handleSelectStart,
  ]);

  return null;
}
