export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
            {/* Hero Section Loading */}
            <div className="relative h-[60vh] w-full bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <div className="container mx-auto px-4 py-12">
                        <div className="h-12 bg-gray-300 rounded w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-6 bg-gray-300 rounded w-32"></div>
                            <div className="h-6 bg-gray-300 rounded w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section Loading */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Loading */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
                                <div className="text-center w-full">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-6 bg-gray-200 rounded-full w-16"></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <div className="h-6 bg-gray-200 rounded-full w-6"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - About & Works Loading */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>

                        {/* Featured Works Gallery Loading */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 