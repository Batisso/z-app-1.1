import React from 'react'
import GlobalApi from '@/app/_services/GlobalApi'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import FeaturedWorksGallery from '@/app/(dashboard)/discover/details/[id]/FeaturedWorksGallery'

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {/* Hero Banner */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image 
                    src={creatorProfile.works[0]?.url || creatorProfile.profilePhoto.url}
                    alt={creatorProfile.fullName}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/50 flex items-end">
                    {/* Back Button */}
                    <div className="absolute top-4 left-4 z-50">
                        <Link 
                            href="/discover" 
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all backdrop-blur-sm"
                        >
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Discover
                        </Link>
                    </div>
                    <div className="container mx-auto px-4 py-12 text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-2">{creatorProfile.fullName}</h1>
                        <p className="text-xl md:text-2xl mb-4">{creatorProfile.discipline}</p>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center">
                                <span className="mr-2">📍</span>
                                {creatorProfile.basedIn}
                            </span>
                            <div className="flex gap-4">
                                {creatorProfile.websiteUrl && (
                                    <a 
                                        href={creatorProfile.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all"
                                    >
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                <div className="flex flex-col items-center">
                                    <div className="relative w-32 h-32 mb-4">
                                        <Image
                                            src={creatorProfile.profilePhoto.url}
                                            alt={creatorProfile.fullName}
                                            fill
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold mb-2">{creatorProfile.fullName}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {creatorProfile.countryOfOrigin}
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                                            {creatorProfile.styleTags.map((tag: string, index: number) => (
                                                <span 
                                                    key={index}
                                                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 justify-center mb-4">
                                            {creatorProfile.socialLinks.map((link: string, index: number) => (
                                                <a 
                                                    key={index}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative px-4 py-2 text-white transition-all duration-300 group"
                                                >
                                                    <span className="relative z-10">{new URL(link).hostname.replace('www.', '')}</span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg opacity-70 blur-sm animate-pulse"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </a>
                                            ))}
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 text-white px-6 py-2 rounded-full hover:opacity-50 transition-all duration-300">
                                            Support Creator
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* About Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">About</h2>
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: creatorProfile.bio.raw }} />
                        </div>

                        {/* Featured Works Gallery */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Featured Works</h2>
                            <FeaturedWorksGallery works={creatorProfile.works} isLoading={!creatorProfile.works} />
                        </div>

                       

                        {/* SUPPORT & BOOKING Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Support & Booking</h2>
                            <div className="flex gap-4">
                                <button className="bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-all">
                                    Book This Creator
                                </button>
                                <button className="bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-all">
                                    Commission Work
                                </button>
                            </div>
                        </div>


                         {/* Related Creators Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Related Creators from {creatorProfile.countryOfOrigin}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedCreators.slice(0, 3).map((relatedCreator) => (
                                    <Link 
                                        key={relatedCreator.id} 
                                        href={`/discover/details/${relatedCreator.id}`}
                                        className="block hover:opacity-90 transition-opacity"
                                    >
                                        <div className="relative h-48 w-full mb-2">
                                            <Image
                                                src={relatedCreator.works[0]?.url || relatedCreator.profilePhoto.url}
                                                alt={relatedCreator.fullName}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <h3 className="font-semibold">{relatedCreator.fullName}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{relatedCreator.discipline}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 