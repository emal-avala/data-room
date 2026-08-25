import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { NDA_VERSION, getNdaText } from "@/lib/nda-agreement";
import { hasCanonicalNdaEvidence } from "@/lib/nda-evidence";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ signed: false }, { status: 401 });
  }
  const admin = createAdminClient();
  const signed = await hasCanonicalNdaEvidence(admin, user.email);
  return NextResponse.json({ signed });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const admin = createAdminClient();
  const forwarded = request.headers.get("x-forwarded-for");
  await admin.from("nda_signature_evidence").insert({
    signer_email: user.email.toLowerCase(),
    nda_version: NDA_VERSION,
    nda_text: getNdaText(),
    ip_address: forwarded?.split(",")[0] ?? null,
  });
  return NextResponse.json({ signed: true });
}
