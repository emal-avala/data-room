import { requireDataRoomDocument } from "@/lib/require-dataroom-document";

export const dynamic = "force-dynamic";

export default async function DocumentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireDataRoomDocument(slug);
  return children;
}
