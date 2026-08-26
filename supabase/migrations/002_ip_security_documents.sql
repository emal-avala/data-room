-- Full-room slots for security/compliance and IP/licensing.
-- Apply AFTER the deploy that registers these slugs in src/lib/documents.ts.
-- Unknown slugs lock every room that names them.

INSERT INTO dataroom_variant_documents (variant_id, document_slug, asset_policy, sort_order)
SELECT id, slug, 'all', ord
FROM dataroom_variants
CROSS JOIN (
    VALUES
        ('security-compliance', 100),
        ('intellectual-property', 110)
) AS extra(slug, ord)
WHERE dataroom_variants.slug = 'full'
ON CONFLICT (variant_id, document_slug) DO NOTHING;

INSERT INTO tracked_documents (title, slug, type, settings)
VALUES
    ('Security and compliance', 'security-compliance', 'other', '{"require_nda": false}'::jsonb),
    ('Intellectual property', 'intellectual-property', 'other', '{"require_nda": true}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
