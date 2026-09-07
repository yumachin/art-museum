-- Add fame level (1-5) to artworks. Default 3 for existing rows.
ALTER TABLE artworks
  ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 3;

ALTER TABLE artworks
  DROP CONSTRAINT IF EXISTS artworks_level_check;

ALTER TABLE artworks
  ADD CONSTRAINT artworks_level_check CHECK (level >= 1 AND level <= 5);

UPDATE artworks SET level = 3 WHERE level IS NULL;
