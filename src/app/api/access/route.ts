import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { isApprovedAdmin } from "@/lib/admin-emails";
import { isInternalViewer } from "@/lib/document-audience";
import { sanitizeNextPath } from "@/lib/next-path";
import { siteConfig } from "@/config/site";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const normalizedEmail = user.email.toLowerCase();
    if (isInternalViewer(normalizedEmail) && user.email_confirmed_at) {
      return NextResponse.json({ status: "approved", isAutoApproved: true });
    }

    const admin = createAdminClient();
    if (user.email_confirmed_at && (await isApprovedAdmin(normalizedEmail, admin))) {
      return NextResponse.json({ status: "approved", isAdminApproved: true });
    }

    const { data: request } = await admin
      .from("access_requests")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (request) {
      const effectiveStatus =
        request.status === "approved" && !user.email_confirmed_at
          ? "pending"
          : request.status;
      return NextResponse.json({
        status: effectiveStatus,
        requestedAt: request.requested_at,
      });
    }

    return NextResponse.json({ status: "none" });
  } catch {
    return NextResponse.json({ status: "none" });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { requestedPath?: string };
    const requestedPath = sanitizeNextPath(body.requestedPath ?? null);
    const admin = createAdminClient();
    const email = user.email.toLowerCase();

    const { data: existing } = await admin
      .from("access_requests")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (!existing) {
      await admin.from("access_requests").insert({
        email,
        status: "pending",
        requested_path: requestedPath,
      });
    }

    if (resend) {
      await resend.emails.send({
        from: siteConfig.fromEmail,
        to: siteConfig.adminInbox,
        subject: `Access request: ${email}`,
        text: `${email} requested access to ${siteConfig.companyName}.\n\nReview: ${siteConfig.siteUrl}/admin/access`,
      });
      await resend.emails.send({
        from: siteConfig.fromEmail,
        to: email,
        subject: `We received your ${siteConfig.companyName} data-room request`,
        text: `Thanks. An admin will review your request shortly.`,
      });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
