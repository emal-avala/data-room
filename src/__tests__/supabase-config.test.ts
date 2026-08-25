import { afterEach, describe, expect, it } from "vitest";
import { isSupabaseConfigured } from "@/utils/supabase/config";

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const previous = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of KEYS) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
});

describe("isSupabaseConfigured", () => {
  it("is false when env is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("rejects .env.example placeholders", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("accepts a real-looking project URL", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abcd.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOi.live";
    expect(isSupabaseConfigured()).toBe(true);
  });
});
