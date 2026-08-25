export const WATERMARK_OPACITY = 0.04;
export const WATERMARK_HIDDEN_METADATA_KEY = "hide_watermark";

export function viewerEmailForLookup(authEmail: string): string {
  return authEmail;
}

export function isWatermarkHidden(metadata: unknown): boolean {
  return (
    typeof metadata === "object" &&
    metadata !== null &&
    !Array.isArray(metadata) &&
    (metadata as Record<string, unknown>)[WATERMARK_HIDDEN_METADATA_KEY] === true
  );
}

export function withWatermarkHidden(
  metadata: unknown,
  hidden: boolean,
): Record<string, unknown> {
  const next =
    typeof metadata === "object" && metadata !== null && !Array.isArray(metadata)
      ? { ...(metadata as Record<string, unknown>) }
      : {};

  if (hidden) {
    next[WATERMARK_HIDDEN_METADATA_KEY] = true;
  } else {
    delete next[WATERMARK_HIDDEN_METADATA_KEY];
  }

  return next;
}
