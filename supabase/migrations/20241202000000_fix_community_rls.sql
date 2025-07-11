-- Fix RLS policies for community table when using external auth
-- Drop existing policies and create new ones that work without Supabase auth

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create communities" ON "community";
DROP POLICY IF EXISTS "Community owners can update their communities" ON "community";
DROP POLICY IF EXISTS "Community owners can delete their communities" ON "community";

-- Create new policies that don't rely on Supabase auth
CREATE POLICY "Anyone can create communities" ON "community"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update communities" ON "community"
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete communities" ON "community"
  FOR DELETE USING (true);

-- Same for other tables
DROP POLICY IF EXISTS "Users can join communities" ON "community_members";
DROP POLICY IF EXISTS "Users can leave communities" ON "community_members";

CREATE POLICY "Anyone can join communities" ON "community_members"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can leave communities" ON "community_members"
  FOR DELETE USING (true);

-- Fix posts table policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON "posts";
DROP POLICY IF EXISTS "Post authors can update their posts" ON "posts";
DROP POLICY IF EXISTS "Post authors can delete their posts" ON "posts";

CREATE POLICY "Anyone can create posts" ON "posts"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update posts" ON "posts"
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete posts" ON "posts"
  FOR DELETE USING (true);

-- Fix comments table policies
DROP POLICY IF EXISTS "Authenticated users can create comments" ON "comments";
DROP POLICY IF EXISTS "Comment authors can update their comments" ON "comments";
DROP POLICY IF EXISTS "Comment authors can delete their comments" ON "comments";

CREATE POLICY "Anyone can create comments" ON "comments"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update comments" ON "comments"
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete comments" ON "comments"
  FOR DELETE USING (true);

-- Fix votes table policies
DROP POLICY IF EXISTS "Authenticated users can vote" ON "votes";
DROP POLICY IF EXISTS "Users can update their own votes" ON "votes";
DROP POLICY IF EXISTS "Users can delete their own votes" ON "votes";

CREATE POLICY "Anyone can vote" ON "votes"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update votes" ON "votes"
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete votes" ON "votes"
  FOR DELETE USING (true);

-- Fix user table policies
DROP POLICY IF EXISTS "Users can update their own profile" ON "user";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "user";

CREATE POLICY "Anyone can update user profiles" ON "user"
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert user profiles" ON "user"
  FOR INSERT WITH CHECK (true);
