CREATE TABLE IF NOT EXISTS practice_questions (
  subject TEXT NOT NULL,
  id TEXT NOT NULL,
  position INTEGER NOT NULL,
  data JSONB NOT NULL,
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
