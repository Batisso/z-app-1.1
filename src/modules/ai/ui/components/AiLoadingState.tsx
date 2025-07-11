"use client"

import React from 'react';
import { AtomIcon, ArrowDown } from 'lucide-react';

export const AiLoadingState = () => {
  return (
    <React.Fragment>
                <div className="relative flex flex-col rounded-xxl text-white transition-all duration-300 overflow-hidden lg:h-[100vh]">
                    {/* Background image with rotation placeholder */}
                    <div className="absolute w-[500vw] h-[500vh] md:w-[200vw] md:h-[200vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 animate-pulse"></div>
                    {/* Floating Circle 1 placeholder */}
                    <div className="hidden md:block absolute top-1/4 left-10 w-44 h-34 rounded-full bg-gray-700 animate-pulse z-10"></div>
                    {/* Floating Circle 2 placeholder */}
                    <div className="hidden md:block absolute top-1/3 right-10 w-28 h-28 rounded-full bg-gray-700 animate-pulse z-10"></div>

                    {/* Header Loading State */}
                    <div className="sticky top-0 z-40 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-6 py-3">
                            <div className="flex items-center justify-between bg-white/30 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-sm animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-10 bg-gray-400 rounded-xl flex items-center justify-center shadow-md">
                                        <AtomIcon className="text-white font-bold text-lg" />
                                    </div>
                                    <div>
                                        <div className="h-6 bg-gray-400 rounded w-32 mb-1"></div>
                                        <div className="h-4 bg-gray-400 rounded w-48"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section Content Loading State */}
                    <div className="flex flex-col items-center justify-center flex-1 text-center h-full mt-4 py-7 px-4 md:px-24 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 md:mx-auto max-w-7xl animate-pulse">
                        <div className="h-8 bg-gray-400 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-400 rounded w-1/2 mb-4"></div>
                        <ArrowDown className="mx-auto mt-4 text-gray-400 text-4xl animate-bounce" />
                    </div>

                    {/* Main Content - AI Avatar Cards Loading State */}
                    <div className="flex flex-1 p-4 md:p-1 md:flex-row flex-col justify-center mt-4">
                        <div className="flex justify-center p-4 md:p-5 mx-auto w-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 max-w-7xl mx-auto lg:max-w-screen-5xl">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="rounded-4xl shadow-xl bg-white/30 backdrop-blur-lg border-2 border-white/40 w-full md:w-96 flex-shrink-0 animate-pulse">
                                        <div className="relative">
                                            <div className="relative w-50 h-50 mx-auto mt-4 rounded-xl overflow-hidden bg-gray-300"></div>
                                        </div>
                                        <div className="p-4">
                                            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                                            <div className="h-10 bg-gray-300 rounded-xl py-2 px-4 block mx-auto"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
</div>

    </React.Fragment>
  );
};