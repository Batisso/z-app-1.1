'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type Work = {
    id: string;
    url: string;
    title?: string;
    medium?: string;
    price?: number;
    isVerified?: boolean;
};

type Props = {
    works: Work[];
    isLoading?: boolean;
    error?: string | null;
};

const LoadingSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="group relative">
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    <div className="mt-2 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const ErrorState = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 mb-4 text-red-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
};

export default function FeaturedWorksGallery({ works, isLoading = false, error = null }: Props) {
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedImagePosition, setClickedImagePosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [nextWork, setNextWork] = useState<Work | null>(null);
    const imageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen || isTransitioning) return;

            if (e.key === 'ArrowLeft') {
                navigateWork('prev');
            } else if (e.key === 'ArrowRight') {
                navigateWork('next');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, isTransitioning, selectedWork]);

    const openModal = (work: Work, event: React.MouseEvent<HTMLDivElement>) => {
        const clickedElement = event.currentTarget;
        const rect = clickedElement.getBoundingClientRect();
        
        setClickedImagePosition({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        });
        
        setSelectedWork(work);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            setSelectedWork(null);
        }, 300);
    };

    const navigateWork = (direction: 'prev' | 'next') => {
        if (!selectedWork || isTransitioning) return;
        
        setIsTransitioning(true);
        setSlideDirection(direction === 'next' ? 'left' : 'right');
        
        const currentIndex = works.findIndex(work => work.id === selectedWork.id);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = currentIndex + 1 >= works.length ? 0 : currentIndex + 1;
        } else {
            newIndex = currentIndex - 1 < 0 ? works.length - 1 : currentIndex - 1;
        }
        
        setNextWork(works[newIndex]);
        
        setTimeout(() => {
            setSelectedWork(works[newIndex]);
            setNextWork(null);
            setSlideDirection(null);
            setIsTransitioning(false);
        }, 500);
    };

    const setRef = (id: string) => (el: HTMLDivElement | null) => {
        imageRefs.current[id] = el;
    };

    if (error) {
        return <ErrorState message={error} />;
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map((work, index) => (
                    <div 
                        key={`${work.id}-${index}`}
                        className="group relative cursor-pointer" 
                        onClick={(e) => openModal(work, e)}
                        ref={setRef(work.id)}
                    >
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image 
                                src={work.url}
                                alt={work.title || "Creator's work"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                unoptimized
                            />
                            {work.isVerified && (
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 shadow-lg">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-1">
                                {work.title && <h3 className="font-semibold">{work.title}</h3>}
                                {work.isVerified && (
                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                )}
                            </div>
                            {work.medium && <p className="text-sm text-gray-600 dark:text-gray-300">{work.medium}</p>}
                            {work.price && <p className="text-sm font-medium">${work.price}</p>}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <h2 className="text-white text-2xl font-bold">View</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedWork && (
                <div 
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
                        isModalOpen 
                            ? 'opacity-100 pointer-events-auto' 
                            : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={closeModal}
                >
                    {/* Backdrop with Close Button */}
                    <div 
                        className={`absolute inset-0 bg-black/90 transition-all duration-500 ${
                            isModalOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
                        }`}
                    >
                        <button 
                            onClick={closeModal}
                            className={`absolute top-8 right-8 text-white bg-black/30 hover:bg-black/50 rounded-full p-3 z-10 transition-all duration-300 hover:scale-110 group ${
                                isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                            }`}
                        >
                            <svg className="w-8 h-8 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div 
                        className={`relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-500 ${
                            isModalOpen 
                                ? 'scale-100 opacity-100 translate-y-0 shadow-2xl' 
                                : 'scale-95 opacity-0 translate-y-4 shadow-none'
                        }`}
                        style={{
                            transformOrigin: isModalOpen ? 'center' : `${clickedImagePosition.x + clickedImagePosition.width/2}px ${clickedImagePosition.y + clickedImagePosition.height/2}px`,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Navigation Buttons */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateWork('prev');
                            }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 z-10 transition-all duration-300 hover:scale-110 group ${
                                isTransitioning ? 'pointer-events-none opacity-50' : ''
                            } ${isModalOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                        >
                            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateWork('next');
                            }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 z-10 transition-all duration-300 hover:scale-110 group ${
                                isTransitioning ? 'pointer-events-none opacity-50' : ''
                            } ${isModalOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                        >
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className="relative aspect-[3/2] w-full overflow-hidden">
                            {/* Current Work */}
                            <div 
                                className={`absolute inset-0 transition-all duration-500 ${
                                    slideDirection === 'left' ? 'translate-x-[-100%] opacity-0 scale-95' :
                                    slideDirection === 'right' ? 'translate-x-[100%] opacity-0 scale-95' :
                                    'translate-x-0 opacity-100 scale-100'
                                }`}
                            >
                                <Image
                                    src={selectedWork.url}
                                    alt={selectedWork.title || "Creator's work"}
                                    fill
                                    className="object-contain transition-all duration-500"
                                    unoptimized
                                />
                                {selectedWork.isVerified && (
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Next Work (during transition) */}
                            {nextWork && (
                                <div 
                                    className={`absolute inset-0 transition-all duration-500 ${
                                        slideDirection === 'left' ? 'translate-x-[100%] opacity-0 scale-105' :
                                        slideDirection === 'right' ? 'translate-x-[-100%] opacity-0 scale-105' :
                                        'translate-x-0 opacity-100 scale-100'
                                    }`}
                                    style={{
                                        transform: slideDirection === 'left' ? 'translateX(0%)' :
                                                 slideDirection === 'right' ? 'translateX(0%)' :
                                                 'translateX(0%)',
                                        opacity: slideDirection ? 1 : 0
                                    }}
                                >
                                    <Image
                                        src={nextWork.url}
                                        alt={nextWork.title || "Creator's work"}
                                        fill
                                        className="object-contain transition-all duration-500"
                                        unoptimized
                                    />
                                    {nextWork.isVerified && (
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg">
                                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="pt-2 transform transition-all duration-700 ease-in-out">
                            <div className="flex items-center gap-2 ">
                               
                                {selectedWork.isVerified && (
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                )}
                            </div>
                            {selectedWork.medium && (
                                <p className="text-gray-600 dark:text-gray-300 mb-1 transform transition-all duration-700 ease-in-out text-sm">
                                    {selectedWork.medium}
                                </p>
                            )}
                            {selectedWork.price && (
                                <p className="text-lg font-medium transform transition-all duration-700 ease-in-out">
                                    ${selectedWork.price}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 