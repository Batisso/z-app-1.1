import { supabase } from '@/lib/supabase';

const getFilteredCreators = async (
    location?: string, 
    discipline?: string, 
    styleTags?: string[],
    countryOfOrigin?: string,
    excludeId?: string
) => {
    let query = supabase
        .from('creator_profiles')
        .select('*');

    // Apply filters if they exist
    if (location) {
        query = query.or(`based_in.ilike.%${location}%,country_of_origin.ilike.%${location}%`);
    }

    if (discipline) {
        query = query.eq('discipline', discipline);
    }

    if (styleTags && styleTags.length > 0) {
        query = query.contains('style_tags', styleTags);
    }

    if (countryOfOrigin) {
        query = query.eq('country_of_origin', countryOfOrigin);
    }

    if (excludeId) {
        query = query.neq('id', excludeId);
    }

    const { data: creators, error } = await query;

    if (error) {
        console.error('Error fetching creators:', error);
        return { creatorProfiles: [] };
    }

    // Transform the data to match the old format
    const transformedCreators = creators.map(creator => ({
        id: creator.id,
        profilePhoto: creator.profile_photo,
        fullName: creator.full_name,
        slug: creator.slug,
        discipline: creator.discipline,
        countryOfOrigin: creator.country_of_origin,
        basedIn: creator.based_in,
        bio: creator.bio,
        works: creator.works,
        socialLinks: creator.social_links,
        styleTags: creator.style_tags,
        newCreator: creator.new_Creator ?? creator.new_creator ?? false, // Add support for both camelCase and snake_case
        isFeatured: creator.is_Featured ?? false, // Add support for both camelCase and snake_case
    }));

    return { creatorProfiles: transformedCreators };
}

const getCreatorDetails = async (id: string) => {
    const { data: creator, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching creator details:', error);
        return { creatorProfile: null };
    }

    // Transform the data to match the old format
    const transformedCreator = {
        id: creator.id,
        profilePhoto: creator.profile_photo,
        fullName: creator.full_name,
        slug: creator.slug,
        discipline: creator.discipline,
        countryOfOrigin: creator.country_of_origin,
        basedIn: creator.based_in,
        bio: creator.bio,
        works: creator.works,
        socialLinks: creator.social_links,
        styleTags: creator.style_tags,
        websiteUrl: creator.website_url
    };

    return { creatorProfile: transformedCreator };
}

export default {
    getFilteredCreators,
    getCreatorDetails
}
