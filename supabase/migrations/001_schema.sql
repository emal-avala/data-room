-- Data Room schema
-- Generic investor-portal tables: viewers, documents, analytics, access,
-- NDA evidence, admin roster, funds, and room variants.
-- No company-specific seed data.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Viewers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    firm VARCHAR(255),
    fund_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_viewers_email ON viewers(email);
CREATE INDEX idx_viewers_last_seen ON viewers(last_seen_at DESC);

-- ---------------------------------------------------------------------------
-- Tracked documents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracked_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'pdf',
    page_count INTEGER,
    file_url TEXT,
    settings JSONB NOT NULL DEFAULT '{"allow_download": true, "require_nda": false, "require_email": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_type CHECK (type IN ('pdf', 'video', 'excel', 'deck', 'other'))
);

-- ---------------------------------------------------------------------------
-- Document engagement
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES tracked_documents(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    device_info JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    referrer TEXT,
    is_active BOOLEAN GENERATED ALWAYS AS (ended_at IS NULL) STORED
);

CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    view_id UUID NOT NULL REFERENCES document_views(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exited_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    scroll_depth INTEGER DEFAULT 0,
    CONSTRAINT valid_page CHECK (page_number > 0)
);

CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES tracked_documents(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS viewer_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Site analytics
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL DEFAULT uuid_generate_v4()::text,
    current_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS site_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Access control
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    requested_path TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255),
    CONSTRAINT valid_access_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    document_slug VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_doc_request_status CHECK (status IN ('pending', 'approved', 'denied'))
);

CREATE TABLE IF NOT EXISTS document_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    document_slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (email, document_slug)
);

CREATE TABLE IF NOT EXISTS admin_users (
    email VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Append-only NDA evidence. Service role only.
CREATE TABLE IF NOT EXISTS nda_signature_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signer_email VARCHAR(255) NOT NULL,
    nda_version VARCHAR(50) NOT NULL,
    nda_text TEXT NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET
);

CREATE INDEX idx_nda_evidence_email ON nda_signature_evidence(signer_email);

-- ---------------------------------------------------------------------------
-- Funds + rooms
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dataroom_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    raise_amount_cents BIGINT NOT NULL,
    show_raise_amount BOOLEAN NOT NULL DEFAULT FALSE,
    deck_headline TEXT,
    use_of_funds JSONB NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dataroom_variant_documents (
    variant_id UUID NOT NULL REFERENCES dataroom_variants(id) ON DELETE CASCADE,
    document_slug VARCHAR(255) NOT NULL,
    asset_policy VARCHAR(20) NOT NULL DEFAULT 'all',
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (variant_id, document_slug)
);

CREATE TABLE IF NOT EXISTS dataroom_variant_assets (
    variant_id UUID NOT NULL REFERENCES dataroom_variants(id) ON DELETE CASCADE,
    document_slug VARCHAR(255) NOT NULL,
    asset_path TEXT NOT NULL,
    PRIMARY KEY (variant_id, document_slug, asset_path)
);

CREATE TABLE IF NOT EXISTS funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    stage VARCHAR(40) NOT NULL DEFAULT 'lead',
    dataroom_variant_id UUID REFERENCES dataroom_variants(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE viewers
    ADD CONSTRAINT viewers_fund_fk
    FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS fund_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    stage VARCHAR(40) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS viewer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_id UUID REFERENCES funds(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES viewers(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- ---------------------------------------------------------------------------
-- Engagement view
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW viewer_engagement AS
SELECT
    v.id AS viewer_id,
    v.email,
    v.name,
    v.firm,
    v.fund_id,
    COUNT(DISTINCT dv.id) AS total_views,
    COALESCE(SUM(dv.duration_seconds), 0) AS total_duration_seconds,
    COUNT(DISTINCT dv.document_id) AS unique_documents,
    MAX(GREATEST(v.last_seen_at, dv.started_at)) AS last_activity_at,
    LEAST(100, (
        COALESCE(SUM(dv.duration_seconds), 0) / 60.0 * 2 +
        COUNT(DISTINCT dv.id) * 5 +
        COUNT(DISTINCT dv.document_id) * 10
    )::int) AS engagement_score
FROM viewers v
LEFT JOIN document_views dv ON dv.viewer_id = v.id
GROUP BY v.id;

-- ---------------------------------------------------------------------------
-- RLS: deny the Data API by default. Application code uses the service role
-- after checking a verified session. Anon/authenticated keys must not read
-- investor activity.
-- ---------------------------------------------------------------------------
ALTER TABLE viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_signature_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataroom_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataroom_variant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataroom_variant_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewer_notes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- admin_users: a signed-in user may SELECT their own roster row.
GRANT SELECT ON admin_users TO authenticated;
CREATE POLICY admin_users_self_select ON admin_users
    FOR SELECT TO authenticated
    USING (email = lower(auth.jwt() ->> 'email'));
