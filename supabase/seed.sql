-- Demo seed. Safe for a fresh project. Contains no real companies or people.
-- Run after 001_schema.sql:  supabase db reset   (applies migrations + this file)

INSERT INTO dataroom_variants (
    slug, name, description, raise_amount_cents, show_raise_amount, use_of_funds, is_default, status
) VALUES
(
    'core',
    'Core room',
    'Minimum diligence set for a first conversation.',
    500000000,
    FALSE,
    '[
      {"category":"Product","percentage":40,"description":"Engineering and product."},
      {"category":"Go-to-market","percentage":25,"description":"Sales and customer success."},
      {"category":"Operations","percentage":15,"description":"G&A and infrastructure."},
      {"category":"People","percentage":15,"description":"Hiring the next twelve months."},
      {"category":"Reserve","percentage":5,"description":"Working-capital buffer."}
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
      {"category":"Product","percentage":40,"description":"Engineering and product."},
      {"category":"Go-to-market","percentage":25,"description":"Sales and customer success."},
      {"category":"Operations","percentage":15,"description":"G&A and infrastructure."},
      {"category":"People","percentage":15,"description":"Hiring the next twelve months."},
      {"category":"Reserve","percentage":5,"description":"Working-capital buffer."}
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
        ('cap-table', 50)
) AS extra(slug, ord)
WHERE dataroom_variants.slug = 'full';

INSERT INTO tracked_documents (title, slug, type, settings) VALUES
    ('Sample Pitch Deck', 'pitch-deck', 'deck', '{"require_nda": false}'::jsonb),
    ('Sample Investment Memo', 'investment-memo', 'other', '{"require_nda": false}'::jsonb),
    ('Sample Financial Overview', 'financial-overview', 'other', '{"require_nda": false}'::jsonb),
    ('Sample Use of Funds', 'use-of-funds', 'other', '{"require_nda": false}'::jsonb),
    ('Sample Cap Table', 'cap-table', 'pdf', '{"require_nda": true}'::jsonb);
