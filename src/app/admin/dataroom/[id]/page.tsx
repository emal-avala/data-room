import { notFound } from "next/navigation";
import { BUILTIN_DATAROOM_VARIANTS } from "@/lib/dataroom-variants";

export default async function DataRoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = BUILTIN_DATAROOM_VARIANTS[id];
  if (!room) notFound();

  return (
    <div>
      <p className="text-eyebrow">Room</p>
      <h1 className="text-2xl font-semibold tracking-tight">{room.name}</h1>
      <p className="mt-2 text-muted-foreground">{room.description}</p>
      <ul className="mt-8 container-box divide-y divide-border">
        {[...room.documents.values()].map((doc) => (
          <li key={doc.slug} className="p-4 text-sm">
            {doc.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}
