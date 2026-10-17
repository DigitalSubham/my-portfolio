CREATE TABLE IF NOT EXISTS practice_questions (
  subject TEXT NOT NULL,
  id TEXT NOT NULL,
  position INTEGER NOT NULL,
  data JSONB NOT NULL,
  PRIMARY KEY (subject, id)
);

CREATE TABLE IF NOT EXISTS practice_notes (
  subject TEXT NOT NULL,
  id TEXT NOT NULL,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  PRIMARY KEY (subject, id)
);

CREATE TABLE IF NOT EXISTS practice_saves (
  admin_id BIGINT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  snapshot JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (admin_id, subject)
);

ALTER TABLE practice_saves ADD COLUMN IF NOT EXISTS writer_id TEXT NOT NULL DEFAULT '';
ALTER TABLE practice_saves ADD COLUMN IF NOT EXISTS writer_sequence INTEGER NOT NULL DEFAULT 0;
ALTER TABLE practice_saves ADD COLUMN IF NOT EXISTS writer_base_revision INTEGER NOT NULL DEFAULT 0;
