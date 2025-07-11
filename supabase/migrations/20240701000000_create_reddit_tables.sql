-- Create posts table
CREATE TABLE IF NOT EXISTS "posts" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "url" TEXT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "community_id" TEXT NOT NULL REFERENCES "community"("id") ON DELETE CASCADE,
  "upvotes" INTEGER DEFAULT 0,
  "downvotes" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS "comments" (
  "id" TEXT PRIMARY KEY,
  "content" TEXT NOT NULL,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "post_id" TEXT NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "parent_id" TEXT REFERENCES "comments"("id") ON DELETE CASCADE,
  "upvotes" INTEGER DEFAULT 0,
  "downvotes" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS "votes" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "post_id" TEXT REFERENCES "posts"("id") ON DELETE CASCADE,
  "comment_id" TEXT REFERENCES "comments"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Ensure a user can only vote once per post or comment
  CONSTRAINT "unique_post_vote" UNIQUE ("user_id", "post_id"),
  CONSTRAINT "unique_comment_vote" UNIQUE ("user_id", "comment_id"),
  -- Ensure either post_id or comment_id is set, but not both
  CONSTRAINT "vote_target_check" CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_posts_community_id" ON "posts"("community_id");
CREATE INDEX IF NOT EXISTS "idx_comments_post_id" ON "comments"("post_id");
CREATE INDEX IF NOT EXISTS "idx_comments_parent_id" ON "comments"("parent_id");
CREATE INDEX IF NOT EXISTS "idx_votes_post_id" ON "votes"("post_id");
CREATE INDEX IF NOT EXISTS "idx_votes_comment_id" ON "votes"("comment_id");