import { cache } from "react";
import { notFound } from "next/navigation";
import {
  canAccessDataRoomDocument,
  resolveAuthenticatedDataRoomContext,
  type DataRoomVariantContext,
} from "@/lib/dataroom-variants";

const resolveRequiredDataRoomDocument = cache(async function (
  documentSlug: string,
): Promise<DataRoomVariantContext> {
  const access = await resolveAuthenticatedDataRoomContext();
  if (
    access.status !== "allowed" ||
    !canAccessDataRoomDocument(access.context, documentSlug)
  ) {
    notFound();
  }
  return access.context;
});

/** Fail closed for pages that do not flow through /docs/[slug]. */
export function requireDataRoomDocument(
  documentSlug: string,
): Promise<DataRoomVariantContext> {
  return resolveRequiredDataRoomDocument(documentSlug);
}
