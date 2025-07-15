import React from 'react'
import GlobalApi from '@/app/_services/GlobalApi'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import FeaturedWorksGallery from '@/app/(dashboard)/discover/details/[id]/FeaturedWorksGallery'
import CreatorDetailsClient from '@/app/(dashboard)/discover/details/[id]/CreatorDetailsClient'

type Props = {
    params: {
        id: string
    }
}

type CreatorProfile = {
    id: string;
    profilePhoto: {
        id: string;
        url: string;
    };
    fullName: string;
    slug: string;
    discipline: string;
    countryOfOrigin: string;
    basedIn: string;
    
    bio: {
        raw: string;
    };
    works: Array<{
        id: string;
        url: string;
        title?: string;
        medium?: string;
        price?: number;
    }>;
    socialLinks: string[];
    styleTags: string[];
    websiteUrl?: string;
}

type ApiResponse = {
    creatorProfile: CreatorProfile;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const result = await GlobalApi.getCreatorDetails(resolvedParams.id) as ApiResponse;
    return {
        title: result.creatorProfile.fullName,
        description: result.creatorProfile.bio.raw
    }
}

export default async function CreatorDetails({ params }: Props) {
    const resolvedParams = await params;
    const { creatorProfile } = await GlobalApi.getCreatorDetails(resolvedParams.id);
    
    if (!creatorProfile) {
        return <div>Creator not found</div>;
    }

    // Get related creators
    const { creatorProfiles: relatedCreators } = await GlobalApi.getFilteredCreators(
        undefined,
        undefined,
        undefined,
        creatorProfile.countryOfOrigin,
        creatorProfile.id
    );

    return (
        <CreatorDetailsClient 
            creatorProfile={creatorProfile} 
            relatedCreators={relatedCreators} 
        />
    )
} 