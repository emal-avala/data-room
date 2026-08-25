import { NextResponse } from "next/server";
import { requireInternalSecret } from "@/lib/internal-auth";
import { createAdminClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import { Resend } from "resend";

export async function GET(request: Request) {
  const denied = requireInternalSecret(request);
  if (denied) return denied;

  const supabase = createAdminClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("document_views")
    .select("id", { count: "exact", head: true })
    .gte("started_at", since);

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: siteConfig.fromEmail,
      to: siteConfig.adminInbox,
      subject: `${siteConfig.companyName} weekly data-room digest`,
      text: `${count ?? 0} document views in the last 7 days.\n\n${siteConfig.siteUrl}/admin`,
    });
  }

  return NextResponse.json({ views: count ?? 0 });
}
