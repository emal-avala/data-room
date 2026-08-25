import Link from "next/link";
import { BUILTIN_DATAROOM_VARIANTS } from "@/lib/dataroom-variants";

export default function DataRoomAdminPage() {
  const rooms = Object.values(BUILTIN_DATAROOM_VARIANTS);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Rooms</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Two built-in variants ship. After you run the
        migrations, the composer reads live rows from{" "}
        <code>dataroom_variants</code>.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <Link key={room.slug} href={`/admin/dataroom/${room.slug}`} className="container-box p-6">
            <h2 className="font-semibold">{room.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{room.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              {room.documents.size} documents
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
