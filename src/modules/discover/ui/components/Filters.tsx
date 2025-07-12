import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Filter, AlertCircle } from 'lucide-react'

// Filters.tsx is a Creators directory page with Search and Filter Panel with a Dropdown Location, Discipline, & Style Tags filters that render Creators

type Creator = {
  id: string;
  fullName: string;
  basedIn: string;
  countryOfOrigin: string;
  discipline: string;
  styleTags: string[];
  profilePhoto: {
    url: string;
  };
};

type FiltersProps = {
  filters: Creator[];
  isLoading?: boolean;
  error?: string | null;
};

type ToggleState = 'Creators' | 'Works';

interface ToggleSwitchProps {
  onToggle?: (activeState: ToggleState) => void;
  defaultState?: ToggleState;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  onToggle, 
  defaultState = 'Creators',
  className = '' 
}) => {
  const [activeState, setActiveState] = useState<ToggleState>(defaultState);

  const handleToggle = (newState: ToggleState) => {
    if (newState !== activeState) {
      setActiveState(newState);
      onToggle?.(newState);
    }
  };

  const isCreatorsActive = activeState === 'Creators';
  const isWorksActive = activeState === 'Works';

  return (
    <>
      <style jsx>{`
        @keyframes slideToRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes slideToLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .slider-creators {
          animation: slideToLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slider-works {
          animation: slideToRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .slider-creators,
          .slider-works {
            animation: none;
          }
        }
      `}</style>
      
      <div className={`flex justify-center mt-6 ${className}`}>
        <div 
          className="relative bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-inner"
          role="tablist"
          aria-label="Toggle between Creators and Works"
        >
          <div className="flex relative">
            {/* Creators Button */}
            <button
              onClick={() => handleToggle('Creators')}
              className={`
                relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out
                ${isCreatorsActive 
                  ? 'text-red-700 dark:text-red-600' 
                  : 'text-red-300 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300'
                }
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700
                sm:px-8 sm:py-3 sm:text-base
              `}
              role="tab"
              aria-selected={isCreatorsActive}
              aria-controls="creators-panel"
              tabIndex={isCreatorsActive ? 0 : -1}
            >
              Creators
            </button>

            {/* Works Button */}
            <button
              onClick={() => handleToggle('Works')}
              className={`
                relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out
                ${isWorksActive 
                  ? 'text-white' 
                  : 'text-orange-300 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300'
                }
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700
                sm:px-8 sm:py-3 sm:text-base
              `}
              role="tab"
              aria-selected={isWorksActive}
              aria-controls="works-panel"
              tabIndex={isWorksActive ? 0 : -1}
            >
              Works
            </button>

            {/* Animated Slider Background - Only visible when Works is active */}
            {isWorksActive && (
              <div 
                className={`
                  absolute top-1 right-1 bottom-1 w-1/2 
                  bg-gradient-to-r from-orange-500 to-red-600 
                  rounded-full shadow-lg
                  ${isWorksActive ? 'slider-works' : 'slider-creators'}
                  transition-all duration-300 ease-in-out
                `}
                style={{
                  transform: isWorksActive ? 'translateX(0)' : 'translateX(-100%)'
                }}
              >
                {/* Logo/Icon in the center of the slider */}
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    {/* Zadulis Logo - Using a simple "Z" for now, replace with actual logo */}
                    <span className="text-orange-600 font-bold text-xs sm:text-sm">Z</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Screen reader content */}
          <div className="sr-only">
            <div id="creators-panel" role="tabpanel" aria-labelledby="creators-tab">
              {isCreatorsActive && "Creators view is currently active"}
            </div>
            <div id="works-panel" role="tabpanel" aria-labelledby="works-tab">
              {isWorksActive && "Works view is currently active"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const glowAnimation = `
@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.55);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 140, 0, 0.55);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.55);
  }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
  will-change: box-shadow;
}
`;

const floatAnimation = `
@keyframes fun-float-1 {
  0% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
  25% { transform: translateY(-55%) translateX(-8px) rotate(-5deg) scale(1.05); }
  50% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
  75% { transform: translateY(-45%) translateX(8px) rotate(5deg) scale(1.05); }
  100% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
}

@keyframes fun-float-2 {
  0% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
  25% { transform: translateY(-45%) translateX(8px) rotate(5deg) scale(1.05); }
  50% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
  75% { transform: translateY(-55%) translateX(-8px) rotate(-5deg) scale(1.05); }
  100% { transform: translateY(-50%) translateX(0) rotate(0deg) scale(1); }
}

.animate-fun-float-1 {
  animation: fun-float-1 8s ease-in-out infinite;
  will-change: transform;
}

.animate-fun-float-2 {
  animation: fun-float-2 8s ease-in-out infinite;
  will-change: transform;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes dropdownFadeOut {
  from {
    opacity: 1;
    transform: scaleY(1);
  }
  to {
    opacity: 0;
    transform: scaleY(0);
  }
}

.dropdown-enter {
  animation: dropdownFadeIn 0.2s ease-out forwards;
  will-change: transform, opacity;
}

.dropdown-exit {
  animation: dropdownFadeOut 0.2s ease-out forwards;
  will-change: transform, opacity;
}
`;

const gradientAnimation = `
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 3s ease infinite;
  will-change: background-position;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

@keyframes loader-bar {
  0% { transform: scaleY(0.1); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.1); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes pinterest-skeleton-pulse {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.pinterest-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: pinterest-skeleton-pulse 1.5s infinite;
}
`;

// Pinterest-style masonry grid styles
const masonryStyles = `
.masonry-grid {
  column-count: 1;
  column-gap: 1.5rem;
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (min-width: 768px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    column-count: 4;
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    column-count: 5;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.work-card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  will-change: transform, box-shadow;
}

.work-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 140, 0, 0.3);
}

.work-card-image {
  transition: transform 0.5s ease-in-out;
}

.work-card:hover .work-card-image {
  transform: scale(1.05);
}

/* Pinterest-style vertical loading skeleton */
.pinterest-loading-container {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

.pinterest-loading-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .pinterest-loading-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .pinterest-loading-column {
    gap: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .pinterest-loading-container {
    gap: 1rem;
  }
  
  .pinterest-loading-column {
    gap: 1rem;
  }
}
`;

function Filters({ filters, isLoading = false, error = null }: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeView, setActiveView] = useState<ToggleState>('Creators');
  const creatorsPerPage = 16;
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [styleTagsSearch, setStyleTagsSearch] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract unique values for filters
  const locations = [...new Set(filters.map(creator => creator.countryOfOrigin))].filter(Boolean).sort((a, b) => a.localeCompare(b));
  const disciplines = [...new Set(filters.map(creator => creator.discipline))].filter(Boolean);
  const styleTags = [...new Set(filters.flatMap(creator => creator.styleTags || []))].filter(Boolean);

  // Filter options based on search terms
  const filteredLocations = locations.filter(location => 
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredDisciplines = disciplines.filter(discipline => 
    discipline.toLowerCase().includes(disciplineSearch.toLowerCase())
  );

  const filteredStyleTags = styleTags.filter(tag => 
    tag.toLowerCase().includes(styleTagsSearch.toLowerCase())
  );

  // Filter the creators based on search and filters
  const filteredCreators = filters
    .filter(creator => {
      const matchesSearch = searchTerm === '' || 
        creator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.basedIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.styleTags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(creator.countryOfOrigin);
      const matchesDiscipline = selectedDisciplines.length === 0 || selectedDisciplines.includes(creator.discipline);
      const matchesStyleTags = selectedStyleTags.length === 0 || 
        selectedStyleTags.some(tag => creator.styleTags?.includes(tag));

      return matchesSearch && matchesLocation && matchesDiscipline && matchesStyleTags;
    })
    .sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID in ascending order

  // Get current page creators
  const indexOfLastCreator = currentPage * creatorsPerPage;
  const indexOfFirstCreator = indexOfLastCreator - creatorsPerPage;
  const currentCreators = filteredCreators.slice(0, indexOfLastCreator);
  const hasMoreCreators = filteredCreators.length > indexOfLastCreator;

  // For Works view, use all available creators (not filtered by creator-specific filters)
  const worksData = activeView === 'Works' ? 
    filters.filter(creator => {
      const matchesSearch = searchTerm === '' || 
        creator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.basedIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.styleTags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    }).slice(0, currentPage * creatorsPerPage) : [];

  // Generate random heights for Pinterest-style layout
  const getRandomHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 400, 280, 320, 380];
    return heights[index % heights.length];
  };

  // Calculate number of columns based on screen size
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(location)) {
        return prev.filter(loc => loc !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleDisciplineSelect = (discipline: string) => {
    setSelectedDisciplines(prev => {
      if (prev.includes(discipline)) {
        return prev.filter(dis => dis !== discipline);
      } else {
        return [...prev, discipline];
      }
    });
  };

  const handleToggleChange = (newView: ToggleState) => {
    setActiveView(newView);
    // Reset filters when switching views
    if (newView === 'Works') {
      setSearchTerm('');
      setSelectedLocations([]);
      setSelectedDisciplines([]);
      setSelectedStyleTags([]);
      setCurrentPage(1);
    }
    console.log(`Switched to ${newView} view`);
  };

  const scrollToFilters = () => {
    filterPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="relative">
            <div className="w-full h-55 bg-gray-200"></div>
          </div>
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-full w-16"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Pinterest-style vertical loading skeleton
  const MasonryLoadingSkeleton = () => {
    const columnCount = getColumnCount();
    const totalItems = 20;
    
    // Distribute items into columns vertically
    const columns: number[][] = Array.from({ length: columnCount }, () => []);
    
    for (let i = 0; i < totalItems; i++) {
      const columnIndex = i % columnCount;
      columns[columnIndex].push(i);
    }

    return (
      <div className="pinterest-loading-container">
        {columns.map((columnItems, columnIndex) => (
          <div key={columnIndex} className="pinterest-loading-column">
            {columnItems.map((itemIndex) => (
              <div 
                key={itemIndex} 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                style={{
                  animation: `fade-in-up 0.6s ease-out forwards`,
                  animationDelay: `${itemIndex * 100}ms`,
                  opacity: 0
                }}
              >
                <div 
                  className="w-full pinterest-skeleton" 
                  style={{ height: `${getRandomHeight(itemIndex)}px` }}
                />
                <div className="p-3">
                  <div className="h-4 pinterest-skeleton rounded w-3/4 mb-2" />
                  <div className="h-3 pinterest-skeleton rounded w-1/2 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <div className="h-4 pinterest-skeleton rounded-full w-12" />
                    <div className="h-4 pinterest-skeleton rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Error state component
  const ErrorState = ({ message }: { message: string }) => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const handleFilterClick = (filterType: string) => {
    if (isAnimating) return;
    
    if (openFilter === filterType) {
      setIsAnimating(true);
      const dropdown = document.querySelector(`.dropdown-${filterType}`);
      if (dropdown) {
        dropdown.classList.add('dropdown-exit');
        setTimeout(() => {
          setOpenFilter(null);
          setIsAnimating(false);
        }, 200);
      }
    } else {
      setOpenFilter(filterType);
    }
  };

  // Loading skeleton for next batch
  const LoadingMoreSkeleton = () => (
    <div className="col-span-full flex justify-center items-center py-12">
      <div className="flex space-x-2">
        <div className="w-2 h-8 bg-orange-500" style={{ animation: 'loader-bar 1s infinite ease-in-out', animationDelay: '0.1s' }}></div>
        <div className="w-2 h-8 bg-red-500" style={{ animation: 'loader-bar 1s infinite ease-in-out', animationDelay: '0.2s' }}></div>
        <div className="w-2 h-8 bg-yellow-500" style={{ animation: 'loader-bar 1s infinite ease-in-out', animationDelay: '0.3s' }}></div>
        <div className="w-2 h-8 bg-orange-500" style={{ animation: 'loader-bar 1s infinite ease-in-out', animationDelay: '0.4s' }}></div>
        <div className="w-2 h-8 bg-red-500" style={{ animation: 'loader-bar 1s infinite ease-in-out', animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );

  // Pinterest-style loading more skeleton
  const MasonryLoadingMoreSkeleton = () => {
    const columnCount = getColumnCount();
    const totalItems = 8;
    
    // Distribute items into columns vertically
    const columns: number[][] = Array.from({ length: columnCount }, () => []);
    
    for (let i = 0; i < totalItems; i++) {
      const columnIndex = i % columnCount;
      columns[columnIndex].push(i + 100); // Add offset to avoid key conflicts
    }

    return (
      <div className="pinterest-loading-container">
        {columns.map((columnItems, columnIndex) => (
          <div key={`more-${columnIndex}`} className="pinterest-loading-column">
            {columnItems.map((itemIndex) => (
              <div 
                key={itemIndex} 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                style={{
                  animation: `fade-in-up 0.6s ease-out forwards`,
                  animationDelay: `${(itemIndex - 100) * 100}ms`,
                  opacity: 0
                }}
              >
                <div 
                  className="w-full pinterest-skeleton" 
                  style={{ height: `${getRandomHeight(itemIndex)}px` }}
                />
                <div className="p-3">
                  <div className="h-4 pinterest-skeleton rounded w-3/4 mb-2" />
                  <div className="h-3 pinterest-skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Load more function
  const loadMore = React.useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(progress);
      setIsScrolling(true);

      if (scrollTop + container.clientHeight >= scrollHeight - 200 && hasMoreCreators && !isLoadingMore) {
        loadMore();
      }

      // Clear the previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasMoreCreators, isLoadingMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Use a timeout to ensure DOM elements are rendered
    const timeoutId = setTimeout(() => {
      const creatorCards = document.querySelectorAll('.creator-card, .work-card');
      creatorCards.forEach((card) => observer.observe(card));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const creatorCards = document.querySelectorAll('.creator-card, .work-card');
      creatorCards.forEach((card) => observer.unobserve(card));
    };
  }, [currentCreators, worksData, activeView]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4">
      <style>{glowAnimation}</style>
      <style>{floatAnimation}</style>
      <style>{gradientAnimation}</style>
      <style>{masonryStyles}</style>
      <style jsx global>{`
        .scrollable-filters {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
        }
        
        .scrollable-filters::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollable-filters::-webkit-scrollbar-thumb {
          background: #a0aec0;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        
        .scrollable-filters::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
        
        .scrollable-filters::-webkit-scrollbar-track {
          background: #f7fafc;
        }

        .scroll-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, #ff8c00, #ff4500);
          transform-origin: 0 50%;
          transform: scaleX(0);
          transition: transform 0.1s ease-out;
          z-index: 10;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
        }

        .content-container {
          position: relative;
        }

        .creator-card {
          transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
          will-change: transform, box-shadow;
        }

        .creator-card:hover {
          transform: translateY(-15px) scale(1.08);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 140, 0, 0.4);
        }

        .creator-card-image {
          transition: transform 0.8s ease-in-out;
        }

        .creator-card:hover .creator-card-image {
          transform: scale(1.15);
        }

        .creator-card-text {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease-in-out;
        
        }

        .creator-card-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: var(--bg-image);
          background-size: cover;
          background-position: center;
          filter: blur(20px) brightness(0.5);
          transform: scale(1.2) rotate(180deg);
          z-index: -1;
        }

        .creator-card:hover .creator-card-text {
          transform: translateY(-10px);
        }

        @media (prefers-reduced-motion: reduce) {
          .scrollable-filters {
            scroll-behavior: auto;
          }
          .creator-card, .work-card {
            transition: none;
          }
        }
       `}</style>

      <div 
        ref={scrollContainerRef}
        className="filters scrollable-filters"
        style={{
          maxHeight: '98vh',
          overflowY: 'auto',
          scrollbarWidth: 'auto',
          scrollbarColor: '#a0aec0 #f7fafc',
          willChange: 'transform'
        }}
      >
        {/* Hero Section */}
        <div className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden mb-8">
          {/* Floating Images */}
          <div className="absolute -left-2 top-1/2  w-45 h-45 rounded-full overflow-hidden shadow-9xl animate-fun-float-1 animate-glow">
            <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz88zkfc07lpaorfkiol" alt="Floating decoration" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -right-2 top-1/2  w-45 h-45 rounded-full overflow-hidden shadow-9xl animate-fun-float-2 animate-glow">
            <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz8nzkfi07lpfxewxjnm" alt="Floating decoration" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-orange-900/70 to-orange-900/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">DISCOVER AFRICA'S BOLDEST CREATORS</h1>
              <p className="text-sm sm:text-lg mb-4">Browse and connect with a new generation of African artists, designers, and culture-makers.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={scrollToFilters}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-green-400"
                >
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300"></div>
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Start Exploring
                  </div>
                </button>
                <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full hover:from-yellow-600 hover:to-amber-700 transition-all duration-500 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-orange-200">
                  <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div>
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                  <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500"></div>
                  <div className="absolute -inset-[4px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Become a Creator
                  </div>
                </button>
              </div>
              {/* Toggle Switch */}
        <ToggleSwitch 
          onToggle={handleToggleChange}
          defaultState="Creators"
          className="pt-4 mt-4 sm:mt-6"
        />
            </div>
          </div>
        </div>

        

        {/* Search and Filter Panel */}
        <div ref={filterPanelRef} className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-3 z-10 max-w-xl mx-auto rounded-xl border-2 border-transparent hover:border-orange-500 hover:shadow-[0_0_15px_rgba(255,140,0,0.3)] transition-all duration-500 animate-glow">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-between p-1.5 mb-1.5 text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <span className="font-bold text-sm">Filters</span>
            <svg
              className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`transition-all duration-300 ease-in-out ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="max-w-xl mx-auto space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={`Search ${activeView.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-gray-600 w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-lg hover:shadow-red-500/50 transition-shadow duration-300 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Filters Grid - Only show when Creators view is active */}
              {activeView === 'Creators' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
                {/* Location Filter */}
                <div className="relative">
                  <button
                    onClick={() => handleFilterClick('location')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-sm ${
                      openFilter === 'location' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedLocations.length > 0 
                        ? `${selectedLocations.length} selected` 
                        : 'Location'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${openFilter === 'location' ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFilter === 'location' && (
                    <div className={`dropdown-location absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transform origin-top dropdown-enter`}>
                      <div className="p-1.5">
                        <input
                          type="text"
                          placeholder="Search locations..."
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredLocations.map((location) => (
                          <button
                            key={location}
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 ${
                              selectedLocations.includes(location) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            {selectedLocations.includes(location) && (
                              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {location}
                          </button>
                        ))}
                        {filteredLocations.length === 0 && (
                          <div className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                            No locations found
                          </div>
                        )}
                        {selectedLocations.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedLocations([]);
                              handleFilterClick('location');
                            }}
                            className="w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-2"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Discipline Filter */}
                <div className="relative">
                  <button
                    onClick={() => handleFilterClick('discipline')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-sm ${
                      openFilter === 'discipline' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      {selectedDisciplines.length > 0 
                        ? `${selectedDisciplines.length} selected` 
                        : 'Discipline'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${openFilter === 'discipline' ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFilter === 'discipline' && (
                    <div className={`dropdown-discipline absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transform origin-top dropdown-enter`}>
                      <div className="p-1.5">
                        <input
                          type="text"
                          placeholder="Search disciplines..."
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                          value={disciplineSearch}
                          onChange={(e) => setDisciplineSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredDisciplines.map((discipline) => (
                          <button
                            key={discipline}
                            onClick={() => handleDisciplineSelect(discipline)}
                            className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 ${
                              selectedDisciplines.includes(discipline) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            {selectedDisciplines.includes(discipline) && (
                              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {discipline}
                          </button>
                        ))}
                        {filteredDisciplines.length === 0 && (
                          <div className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                            No disciplines found
                          </div>
                        )}
                        {selectedDisciplines.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedDisciplines([]);
                              handleFilterClick('discipline');
                            }}
                            className="w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-2"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Style Tags Filter */}
                <div className="relative">
                  <button
                    onClick={() => handleFilterClick('styleTags')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-sm ${
                      openFilter === 'styleTags' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {selectedStyleTags.length > 0 
                        ? `${selectedStyleTags.length} selected` 
                        : 'Style Tags'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${openFilter === 'styleTags' ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFilter === 'styleTags' && (
                    <div className={`dropdown-styleTags absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transform origin-top dropdown-enter`}>
                      <div className="p-1.5">
                        <input
                          type="text"
                          placeholder="Search style tags..."
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                          value={styleTagsSearch}
                          onChange={(e) => setStyleTagsSearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStyleTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedStyleTags(prev => 
                                prev.includes(tag)
                                  ? prev.filter(t => t !== tag)
                                  : [...prev, tag]
                              );
                            }}
                            className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 ${
                              selectedStyleTags.includes(tag) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            {selectedStyleTags.includes(tag) && (
                              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {tag}
                          </button>
                        ))}
                        {filteredStyleTags.length === 0 && (
                          <div className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                            No style tags found
                          </div>
                        )}
                      </div>
                      {selectedStyleTags.length > 0 && (
                        <div className="p-1.5 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => setSelectedStyleTags([])}
                            className="w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div ref={contentRef} className="content-container">
          {/* Scroll Progress Bar - positioned at bottom of content */}
          <div 
            className="scroll-progress-bar" 
            style={{ 
              transform: `scaleX(${scrollProgress / 100})`,
              opacity: isScrolling ? 1 : 0
            }} 
          />
          
          {isLoading ? (
            activeView === 'Works' ? <MasonryLoadingSkeleton /> : <LoadingSkeleton />
          ) : (
            <>
              {activeView === 'Creators' ? (
                <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 relative">
                  {currentCreators.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">No creators found matching your criteria</p>
                    </div>
                  ) : (
                    <>
                      {currentCreators.map((creatorProfile, index) => (
                        <Link href={`/discover/details/${creatorProfile.id}`} key={index}>
                          <div className="creator-card bg-white/20 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-white/60" style={{ opacity: 0 }}>
                            <div className="relative overflow-hidden">
                              <img src={creatorProfile.profilePhoto.url} alt={creatorProfile.fullName} className="creator-card-image w-full h-55 object-cover" />
                            </div>
                            <div
                              className="creator-card-text p-4"
                              style={{ '--bg-image': `url(${creatorProfile.profilePhoto.url})` } as React.CSSProperties}
                            >
                              <h3 className="text-white text-lg font-semibold">{creatorProfile.fullName}</h3>
                              <p className="text-white flex items-center">
                                <span className="mr-2">📍</span> {creatorProfile.basedIn}
                              </p>
                              <p className="text-white flex items-center">
                                <span className="mr-2">Origin:</span> {creatorProfile.countryOfOrigin}
                              </p>
                              <p className="text-white flex items-center">
                                <span className="mr-2"></span> {creatorProfile.discipline}
                              </p>
                              <div className="flex flex-wrap mt-2">
                                {creatorProfile.styleTags.map((tag: string, i: number) => (
                                  <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full mr-2 mb-2 border border-white/20 hover:bg-white/30 transition-colors">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex justify-start mt-4">
                                <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full border border-white/70 hover:bg-white/30 transition-colors transform hover:scale-105 ">
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {isLoadingMore && <LoadingMoreSkeleton />}
                    </>
                  )}
                </div>
              ) : (
                // Works view with Pinterest-style masonry grid
                <div className="masonry-grid max-w-7xl mx-auto">
                  {worksData.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">No works found matching your criteria</p>
                    </div>
                  ) : (
                    <>
                      {worksData.map((creatorProfile, index) => (
                        <div key={`work-${creatorProfile.id}-${index}`} className="masonry-item">
                          <Link href={`/discover/details/${creatorProfile.id}`}>
                            <div className="work-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-orange-300">
                              <div className="relative overflow-hidden">
                                <img 
                                  src={creatorProfile.profilePhoto.url} 
                                  alt={`Work by ${creatorProfile.fullName}`} 
                                  className="work-card-image w-full object-cover" 
                                  style={{ height: `${getRandomHeight(index)}px` }}
                                />
                                {/* Overlay with creator info */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <h3 className="font-semibold text-sm mb-1">{creatorProfile.fullName}</h3>
                                    <p className="text-xs opacity-90">{creatorProfile.discipline}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                                 {creatorProfile.fullName}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2">
                                  {creatorProfile.basedIn}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {creatorProfile.styleTags.slice(0, 2).map((tag: string, i: number) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                      #{tag}
                                    </span>
                                  ))}
                                  {creatorProfile.styleTags.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{creatorProfile.styleTags.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                      {isLoadingMore && <MasonryLoadingMoreSkeleton />}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Filters