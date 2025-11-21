-- Add cover_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_url TEXT;

