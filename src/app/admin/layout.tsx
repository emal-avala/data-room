import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminBackendConfigured } from "@/lib/admin-backend";
import { isApprovedAdmin } from "@/lib/admin-emails";
import { createClient } from "@/utils/supabase/server";
import { AdminNav } from "./components/AdminNav";

export const dynamic = "force-dynamic";

async function isLocalhost(): Promise<boolean> {
  if (process.env.NODE_ENV === "production") return false;
  const host = (await headers()).get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sample = !isAdminBackendConfigured();
  if (sample || (await isLocalhost())) {
    return (
      <div className="min-h-screen bg-muted/40">
        <AdminChrome sample={sample}>{children}</AdminChrome>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) {
    redirect("/login?next=/admin");
  }
  if (!(await isApprovedAdmin(user.email, supabase))) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}

function AdminChrome({
  children,
  sample = false,
}: {
  children: React.ReactNode;
  sample?: boolean;
}) {
  return (
    <>
      {sample ? (
        <div className="border-b border-border bg-background px-4 py-2 text-center text-sm text-muted-foreground">
          Sample IR analytics. Well-known firms are fictional walkthrough traffic, not live
          investors.
        </div>
      ) : null}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-sm font-semibold">
            Admin
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to site
          </Link>
        </div>
        <AdminNav />
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </>
  );
}
