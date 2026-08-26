/**
 * Copy and identity for the unconfigured-demo sign-in walkthrough.
 *
 * When Supabase is missing, `/login` still shows the Google / Microsoft
 * buttons so a visitor can see the IR auth experience. Nothing is sent
 * to an identity provider. The email must not be `@acme.example`.
 */

export const MOCK_AUTH_DISCLAIMER =
  "Example sign-in. Authentication is mocked for this demo — no Google or Microsoft account is contacted.";

export const MOCK_AUTH_EMAIL = "demo@example.com";
