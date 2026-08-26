import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PUBLIC_DEMO_VIEWER_EMAIL } from "@/lib/dataroom-variants";
import { isInternalViewer } from "@/lib/document-audience";
import { MOCK_AUTH_DISCLAIMER, MOCK_AUTH_EMAIL } from "@/lib/auth-demo";

const REAL_FIRM_MARKERS = ["Sequoia", "Andreessen", "a16z", "Accel"];

describe("mock auth walkthrough", () => {
  const login = readFileSync(path.join(process.cwd(), "src/app/login/page.tsx"), "utf8");
  const header = readFileSync(path.join(process.cwd(), "src/components/Header.tsx"), "utf8");
  const staticLogin = readFileSync(path.join(process.cwd(), "demo/login.html"), "utf8");

  it("keeps the public disclaimer and a non-staff demo email", () => {
    expect(MOCK_AUTH_DISCLAIMER).toBe(
      "Example sign-in. Authentication is mocked for this demo — no Google or Microsoft account is contacted.",
    );
    expect(MOCK_AUTH_EMAIL).toBe(PUBLIC_DEMO_VIEWER_EMAIL);
    expect(MOCK_AUTH_EMAIL).toBe("demo@example.com");
    expect(MOCK_AUTH_EMAIL).not.toMatch(/@acme\.example$/i);
    expect(isInternalViewer(MOCK_AUTH_EMAIL)).toBe(false);
  });

  it("shows Google and Microsoft on the unconfigured login page", () => {
    expect(login).toContain("Continue with Google");
    expect(login).toContain("Continue with Microsoft");
    expect(login).toContain("MOCK_AUTH_DISCLAIMER");
    expect(login).not.toContain("Set the keys in");
    expect(login).not.toContain(".env.local");
    expect(header).toContain('href="/login"');
    expect(header).toContain("Sign in");
  });

  it("mocks the provider click before any OAuth call", () => {
    const signIn = login.slice(login.indexOf("async function signIn"), login.indexOf("if (authState === \"checking\")"));
    expect(signIn.indexOf("if (!isConfigured)")).toBeGreaterThan(-1);
    expect(signIn.indexOf("return")).toBeGreaterThan(signIn.indexOf("if (!isConfigured)"));
    expect(signIn.indexOf("return")).toBeLessThan(signIn.indexOf("signInWithOAuth"));
    expect(signIn).toContain("MOCK_AUTH_EMAIL");
    const mockBranch = signIn.slice(signIn.indexOf("if (!isConfigured)"), signIn.indexOf("const supabase"));
    expect(mockBranch).not.toContain("createClient");
    expect(mockBranch).not.toContain("signInWithOAuth");
  });

  it("mirrors the same disclaimer on the static demo login", () => {
    expect(staticLogin).toContain(MOCK_AUTH_DISCLAIMER);
    expect(staticLogin).toContain("Continue with Google");
    expect(staticLogin).toContain("Continue with Microsoft");
    expect(staticLogin).toContain("demo@example.com");
    expect(staticLogin).toContain("protect.js");
    expect(staticLogin).not.toContain("@acme.example");
    for (const marker of REAL_FIRM_MARKERS) {
      expect(staticLogin, marker).not.toContain(marker);
    }
  });
});
