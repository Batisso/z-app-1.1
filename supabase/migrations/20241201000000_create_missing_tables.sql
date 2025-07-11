-- Create user table (referenced by posts and comments)
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "image" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create community table (referenced by posts)
CREATE TABLE IF NOT EXISTS "community" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "instructions" TEXT,
  "image" TEXT,
  "url" TEXT,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create community_members table (for join/unjoin functionality)
CREATE TABLE IF NOT EXISTS "community_members" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "community_id" TEXT NOT NULL REFERENCES "community"("id") ON DELETE CASCADE,
  "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Ensure a user can only join a community once
  CONSTRAINT "unique_community_member" UNIQUE ("user_id", "community_id")
);

-- Add missing columns to posts table
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "tags" TEXT[];
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author" TEXT;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_image" TEXT;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "community_name" TEXT;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "liked_by" TEXT[];

-- Add missing columns to comments table
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "author" TEXT;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "author_image" TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_community_slug" ON "community"("slug");
CREATE INDEX IF NOT EXISTS "idx_community_user_id" ON "community"("user_id");
CREATE INDEX IF NOT EXISTS "idx_community_members_user_id" ON "community_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_community_members_community_id" ON "community_members"("community_id");

-- Enable Row Level Security (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "community" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "community_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "votes" ENABLE ROW LEVEL SECURITY;

-- Create policies for user table
CREATE POLICY "Users can read all profiles" ON "user"
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON "user"
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own profile" ON "user"
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Create policies for community table
CREATE POLICY "Anyone can read communities" ON "community"
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create communities" ON "community"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Community owners can update their communities" ON "community"
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Community owners can delete their communities" ON "community"
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for community_members table
CREATE POLICY "Anyone can read community memberships" ON "community_members"
  FOR SELECT USING (true);

CREATE POLICY "Users can join communities" ON "community_members"
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can leave communities" ON "community_members"
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for posts table
CREATE POLICY "Anyone can read posts" ON "posts"
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON "posts"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Post authors can update their posts" ON "posts"
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Post authors can delete their posts" ON "posts"
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for comments table
CREATE POLICY "Anyone can read comments" ON "comments"
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON "comments"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Comment authors can update their comments" ON "comments"
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Comment authors can delete their comments" ON "comments"
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for votes table
CREATE POLICY "Anyone can read votes" ON "votes"
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON "votes"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own votes" ON "votes"
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own votes" ON "votes"
  FOR DELETE USING (auth.uid()::text = user_id);
