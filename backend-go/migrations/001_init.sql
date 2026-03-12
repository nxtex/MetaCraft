-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash TEXT          NOT NULL,
    bio           TEXT          DEFAULT '',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── Files ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS files (
    id            TEXT PRIMARY KEY,
    user_id       TEXT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255)  NOT NULL,
    object_key    TEXT          NOT NULL UNIQUE,
    mime_type     VARCHAR(100)  NOT NULL,
    size_bytes    BIGINT        NOT NULL DEFAULT 0,
    metadata      JSONB         NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_files_user_id   ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_created   ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_mime      ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_metadata  ON files USING GIN(metadata);

-- ── Revoked tokens (for logout / refresh revocation) ───────────
CREATE TABLE IF NOT EXISTS revoked_tokens (
    jti        TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_revoked_exp ON revoked_tokens(expires_at);

-- Auto-cleanup of expired revoked tokens
CREATE OR REPLACE FUNCTION cleanup_revoked_tokens() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM revoked_tokens WHERE expires_at < NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_cleanup_revoked
AFTER INSERT ON revoked_tokens
EXECUTE FUNCTION cleanup_revoked_tokens();
