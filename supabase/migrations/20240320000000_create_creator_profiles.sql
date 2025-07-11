-- Create creator_profiles table
CREATE TABLE creator_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_photo JSONB,
    full_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    discipline TEXT NOT NULL,
    country_of_origin TEXT NOT NULL,
    based_in TEXT NOT NULL,
    bio JSONB,
    works JSONB,
    social_links TEXT[],
    style_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_creator_profiles_slug ON creator_profiles(slug);
CREATE INDEX idx_creator_profiles_discipline ON creator_profiles(discipline);
CREATE INDEX idx_creator_profiles_country_of_origin ON creator_profiles(country_of_origin);

-- Enable Row Level Security (RLS)
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON creator_profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON creator_profiles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON creator_profiles
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON creator_profiles
    FOR DELETE
    USING (auth.role() = 'authenticated'); 