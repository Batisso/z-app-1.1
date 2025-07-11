"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import Filters from "../components/Filters";
import GlobalApi from "@/app/_services/GlobalApi";
import { useEffect, useState } from "react";

interface CreatorProfile {
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
    }>;
    socialLinks: string[];
    styleTags: string[];
}

export const DiscoverView = () => {
    const trpc = useTRPC();
    const [filters, setFilters] = useState<CreatorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getFilters();
    }, []);

    const getFilters = async () => {
        try {
            setIsLoading(true);
            const resp = await GlobalApi.getFilteredCreators();
            setFilters(resp.creatorProfiles);
        } catch (error) {
            console.error('Error fetching filters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {/* Hero Section Loading State */}
                <div className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden mb-8 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300/70 via-gray-400/70 to-gray-400/60 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="h-8 bg-gray-300/80 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-300/80 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-32 shadow-lg"></div>
                                <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-32 shadow-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Loading State */}
                <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-400 ease-in-out transform hover:scale-105">
                            <div className="relative">
                                <div className="w-full h-55 bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="p-4">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                    ))}
                                </div>
                                <div className="flex justify-start mt-4">
                                    <div className="h-8 bg-gray-200 rounded-full w-28 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-3 scrollable-discover">
            <Filters filters={filters} />
        </div>
    );
};

export const DiscoverViewLoading = () => {
    return (
        <LoadingState
        title="LOADING DISCOVER" 
        />
    )
}


export const DiscoverViewError = () => {
    return (
        <ErrorState
    title=":( Error Loading"
    description="Try Refreshing The Page"/>
    )
}