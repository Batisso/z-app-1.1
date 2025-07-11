const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    try {
        // Read the JSON file
        const jsonData = JSON.parse(fs.readFileSync('./src/data/creators.json', 'utf8'));
        const creators = jsonData.creatorProfiles;

        // Transform the data to match the new schema
        const transformedCreators = creators.map(creator => ({
            profile_photo: creator.profilePhoto,
            full_name: creator.fullName,
            slug: creator.slug,
            discipline: creator.discipline,
            country_of_origin: creator.countryOfOrigin,
            based_in: creator.basedIn,
            bio: creator.bio,
            works: creator.works,
            social_links: creator.socialLinks,
            style_tags: creator.styleTags
        }));

        // Insert the data into Supabase
        const { data, error } = await supabase
            .from('creator_profiles')
            .insert(transformedCreators);

        if (error) {
            console.error('Error inserting data:', error);
            return;
        }

        console.log('Migration completed successfully!');
        console.log(`Migrated ${transformedCreators.length} creator profiles`);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateData(); 