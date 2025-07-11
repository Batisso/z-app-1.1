-- Add liked_by column to comments table
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "liked_by" TEXT[] DEFAULT '{}';
