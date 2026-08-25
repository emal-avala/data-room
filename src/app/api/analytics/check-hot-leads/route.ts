import { NextResponse } from "next/server";
import { requireInternalSecret } from "@/lib/internal-auth";
import { createAdminClient } from "@/utils/supabase/server";
import { siteConfig } from "@/config/site";
import { Resend } from "resend";

const HOT_LEAD_SCORE = 70;

export async function POST(request: Request) {
  const denied = requireInternalSecret(request);
  if (denied) return denied;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("viewer_engagement")
    .select("email, engagement_score, viewer_id")
    .gte("engagement_score", HOT_LEAD_SCORE);

  if (process.env.RESEND_API_KEY && data && data.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: siteConfig.fromEmail,
      to: siteConfig.adminInbox,
      subject: `${data.length} hot lead${data.length === 1 ? "" : "s"} in the data room`,
      text: data.map((row) => `${row.email} · score ${row.engagement_score}`).join("\n"),
    });
  }

  return NextResponse.json({ hotLeads: data?.length ?? 0 });
}
