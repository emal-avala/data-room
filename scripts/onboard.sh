#!/usr/bin/env bash
# Copy env defaults and print the founder checklist.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Wrote .env.local from .env.example"
else
  echo ".env.local already exists (left untouched)"
fi

cat <<'EOF'

Next:

  1. Edit .env.local
       NEXT_PUBLIC_COMPANY_NAME
       NEXT_PUBLIC_COMPANY_DOMAIN
       SUPERADMIN_EMAIL          # your Google/Microsoft login
  2. bun install && bun dev      # http://localhost:3000
  3. Follow docs/ONBOARDING.md   # Supabase, Vercel, brand, documents

EOF
