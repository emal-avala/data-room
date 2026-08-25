-- Acme Corporation demo seed. Safe for a fresh project.
-- Run after 001_schema.sql:  supabase db reset   (applies migrations + this file)

INSERT INTO dataroom_variants (
    slug, name, description, raise_amount_cents, show_raise_amount, use_of_funds, is_default, status
) VALUES
(
    'core',
    'Core room',
    'Deck, memo, and financials for a first conversation.',
    500000000,
    FALSE,
    '[
      {"category":"Product","percentage":40,"description":"On-vehicle perception, multi-yard dispatch, snow mode, and the partner-tractor interface."},
      {"category":"Go-to-market","percentage":25,"description":"A second delivery pod, two enterprise AEs, and customer success for the live network."},
      {"category":"Operations","percentage":15,"description":"Field trucks, spare compute, insurance, and Chicago / Dallas leases."},
      {"category":"People","percentage":15,"description":"Perception, reliability, and implementation hiring gated on go-lives."},
      {"category":"Reserve","percentage":5,"description":"Working-capital buffer. Not a second product."}
    ]'::jsonb,
    TRUE,
    'active'
),
(
    'full',
    'Full diligence',
    'Expanded room for an active lead conversation.',
    1000000000,
    FALSE,
    '[
      {"category":"Product","percentage":40,"description":"On-vehicle perception, multi-yard dispatch, snow mode, and the partner-tractor interface."},
      {"category":"Go-to-market","percentage":25,"description":"A second delivery pod, two enterprise AEs, and customer success for the live network."},
      {"category":"Operations","percentage":15,"description":"Field trucks, spare compute, insurance, and Chicago / Dallas leases."},
      {"category":"People","percentage":15,"description":"Perception, reliability, and implementation hiring gated on go-lives."},
      {"category":"Reserve","percentage":5,"description":"Working-capital buffer. Not a second product."}
    ]'::jsonb,
    FALSE,
    'active'
);

INSERT INTO dataroom_variant_documents (variant_id, document_slug, asset_policy, sort_order)
SELECT id, slug, 'all', ord
FROM dataroom_variants
CROSS JOIN (
    VALUES
        ('pitch-deck', 10),
        ('investment-memo', 20),
        ('financial-overview', 30)
) AS core(slug, ord)
WHERE dataroom_variants.slug IN ('core', 'full');

INSERT INTO dataroom_variant_documents (variant_id, document_slug, asset_policy, sort_order)
SELECT id, slug, 'all', ord
FROM dataroom_variants
CROSS JOIN (
    VALUES
        ('use-of-funds', 40),
        ('go-to-market', 50),
        ('competitive-landscape', 60),
        ('technical-architecture', 70),
        ('case-studies', 80),
        ('cap-table', 90)
) AS extra(slug, ord)
WHERE dataroom_variants.slug = 'full';

INSERT INTO tracked_documents (title, slug, type, settings) VALUES
    ('Series A deck', 'pitch-deck', 'deck', '{"require_nda": false}'::jsonb),
    ('Investment memo', 'investment-memo', 'other', '{"require_nda": false}'::jsonb),
    ('Financial overview', 'financial-overview', 'other', '{"require_nda": false}'::jsonb),
    ('Use of funds', 'use-of-funds', 'other', '{"require_nda": false}'::jsonb),
    ('Go-to-market', 'go-to-market', 'other', '{"require_nda": false}'::jsonb),
    ('Competitive landscape', 'competitive-landscape', 'other', '{"require_nda": false}'::jsonb),
    ('Technical architecture', 'technical-architecture', 'other', '{"require_nda": false}'::jsonb),
    ('Site notes', 'case-studies', 'other', '{"require_nda": false}'::jsonb),
    ('Cap table', 'cap-table', 'other', '{"require_nda": true}'::jsonb);
