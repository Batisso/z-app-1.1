-- Add website_url column to creator_profiles table
ALTER TABLE creator_profiles
ADD COLUMN website_url TEXT;

-- Create an index for the website_url column
CREATE INDEX idx_creator_profiles_website_url ON creator_profiles(website_url);

-- Update existing records to set website_url from the first social link
UPDATE creator_profiles
SET website_url = social_links[1]
WHERE array_length(social_links, 1) > 0;

-- Add a comment to the column
COMMENT ON COLUMN creator_profiles.website_url IS 'The creator''s main website URL'; 