"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Plus, Compass, Users, ShoppingBag, Bot, ChevronRight, BookOpen, Music, Paintbrush, LayoutGrid, X, ExternalLink } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import GlobalApi from "@/app/_services/GlobalApi";
import { useRouter } from 'next/navigation';

interface EventDetails {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
  detailedDescription?: string;
  location: string;
}

const HomeViewLoading = () => (
  <div className="flex h-screen p-4 rounded-xl overflow-hidden animate-breathing">
    <style jsx global>{`
      @keyframes breathing {
        0% { opacity: 0.7; filter: blur(4px); }
        50% { opacity: 1; filter: blur(2px); }
        100% { opacity: 0.7; filter: blur(4px); }
      }
      .animate-breathing {
        animation: breathing 2.5s ease-in-out infinite;
      }
      .loading-bg {
        opacity: 0.7;
      }
      .loading-block {
        background: #fff;
        opacity: 0.3;
        border-radius: 1rem;
        min-height: 2rem;
      }
    `}</style>
    <div className="flex-1 flex flex-col p-4 rounded-xl shadow-3xl overflow-hidden backdrop-blur-lg relative">
      <div className="absolute inset-0 w-full h-full loading-bg z-0 animate-rotate-slow" />
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="loading-block w-1/3 h-8 mb-2" />
        <div className="flex items-center space-x-4">
          <div className="loading-block w-48 h-8" />
          <div className="rounded-full bg-gray-300 w-10 h-10" />
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 overflow-y-auto pr-2 h-full">
        <div className="mb-6 relative z-10 col-span-2 sm:w-full h-full">
          <div className="bg-white/40 p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300/40 to-slate-400/40 opacity-90 rounded-xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-end">
              <div className="loading-block w-1/2 h-6 mb-4" />
              <div className="loading-block w-1/3 h-10 mb-4" />
              <div className="loading-block w-1/4 h-6 mb-3" />
              <div className="loading-block w-2/3 h-4 mb-4" />
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="loading-block w-16 h-6" />
                <div className="loading-block w-12 h-6" />
              </div>
              <div className="loading-block w-1/3 h-6 mb-6" />
              <div className="flex gap-2">
                <div className="loading-block w-24 h-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col relative z-10 h-full">
          <div className="loading-block w-2/3 h-8 mb-4" />
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-5 bg-gray-50/80 backdrop-blur rounded-lg">
                <div className="flex items-center space-x-3 ">
                  <div className="rounded-full bg-gray-300 w-12 h-12" />
                  <div>
                    <div className="loading-block w-24 h-4 mb-2" />
                    <div className="loading-block w-16 h-3" />
                  </div>
                </div>
                <div className="loading-block w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 relative z-10 mt-4">
          <div className="loading-block w-1/4 h-8 mb-4" />
          <div className="flex flex-nowrap space-x-4 min-w-[600px]">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-64 flex-shrink-0 p-4 rounded-xl shadow-md bg-white/50 backdrop-blur-sm">
                <div className="loading-block w-full h-32 mb-2" />
                <div className="loading-block w-3/4 h-4 mb-1" />
                <div className="loading-block w-1/2 h-3 mb-1" />
                <div className="loading-block w-1/2 h-3 mb-1" />
                <div className="loading-block w-full h-3 mb-3" />
                <div className="loading-block w-full h-8" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 relative z-10 mt-12">
          <div className="h-100 bg-white/20 backdrop-blur-lg p-10 rounded-xl shadow-2xl flex flex-col items-center justify-center relative">
            <div className="loading-block w-2/3 h-8 mb-4" />
            <div className="loading-block w-3/4 h-4 mb-4" />
            <div className="loading-block w-24 h-8" />
          </div>
        </div>
        <div className="col-span-1 relative z-10 mt-12">
          <div className="h-100 bg-white/20 backdrop-blur-sm p-10 rounded-xl shadow-2xl flex flex-col items-center justify-center relative">
            <div className="loading-block w-2/3 h-8 mb-4" />
            <div className="loading-block w-3/4 h-4 mb-4" />
            <div className="loading-block w-24 h-8" />
          </div>
        </div>
        <div className="col-span-1 relative z-10 mt-12">
          <div className="h-100 bg-white/20 backdrop-blur-sm p-10 rounded-xl shadow-2xl flex flex-col items-center justify-center relative">
            <div className="loading-block w-2/3 h-8 mb-4" />
            <div className="loading-block w-3/4 h-4 mb-4" />
            <div className="loading-block w-24 h-8" />
          </div>
        </div>
        <div className="col-span-3 relative z-10 mt-12">
          <div className="loading-block w-1/4 h-8 mb-4" />
          <div className="flex flex-nowrap space-x-4 min-w-[300px] px-1 mb-10">
            {[1,2,3].map(i => (
              <div key={i} className="p-4 rounded-xl shadow-md flex items-center space-x-3 bg-white/50 backdrop-blur-sm w-64 min-w-[16rem]">
                <div className="loading-block w-20 h-20 mr-2" />
                <div className="flex-1 min-w-0">
                  <div className="loading-block w-24 h-4 mb-2" />
                  <div className="loading-block w-16 h-3" />
                </div>
                <div className="loading-block w-12 h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error state component
const HomeViewError = ({ message }: { message?: string }) => (
  <div className="flex h-screen items-center justify-center bg-white/80">
    <div className="p-8 rounded-xl shadow-2xl bg-white/90 border border-red-200 flex flex-col items-center">
      <span className="text-4xl mb-4 text-red-500">&#9888;</span>
      <h2 className="text-2xl font-bold mb-2 text-red-700">Something went wrong</h2>
      <p className="text-gray-700 mb-4">{message || 'Unable to load the home view. Please try again later.'}</p>
    </div>
  </div>
);

export const HomeView = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const userName = data?.user?.name ? data.user.name.split(" ")[0] : "Zadulis User";

  // Greeting logic (can be SSR-safe)
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  let greeting = "Good evening";
  let formattedTime = "--:--:--";
  if (currentTime) {
    const hours = currentTime.getHours();
    if (hours < 12) greeting = "Good morning";
    else if (hours < 18) greeting = "Good afternoon";
    formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  // Dummy Data
  const featuredCreator = {
    // name: "Kwame Nkrumah",
    // category: "Digital Artist",
    // description: "A visionary artist blending traditional African motifs with futuristic digital landscapes.",
    // styleTags: ["Afrofuturist", "NeoHeritage", "Vibrant"],
    // reviews: 53,
    // image: "/xPic.jpeg", // Assuming this path is correct from public/
  };

  const [newCreators, setNewCreators] = useState<{ id: number; name: string; discipline: string; avatar: string; countryOfOrigin?: string }[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchNewCreators = async () => {
      setLoadingCreators(true);
      try {
        const { creatorProfiles } = await GlobalApi.getFilteredCreators(undefined, undefined, undefined, undefined, undefined);
        const filtered = (creatorProfiles || []).filter((c: any) => c.newCreator === true || c.new_creator === true);
        setNewCreators(
          filtered.map((c: any) => ({
            id: c.id,
            name: c.fullName,
            discipline: c.discipline,
            avatar: c.profilePhoto?.url || '/default-avatar.png',
            countryOfOrigin: c.countryOfOrigin || c.country_of_origin || '',
          }))
        );
        setHasError(false);
      } catch (e) {
        setHasError(true);
      }
      setLoadingCreators(false);
    };
    fetchNewCreators();
  }, []);

  const trendingEvents = [
    { id: 1, title: "Congo Biennale", date: "July 16-August 30, 2025", description: "One of the continent's premier contemporary art showcases, spotlighting bold, political themes.", image: "/CongoBiennale.jpg", detailedDescription: "The 3rd edition of the Congo Biennale is preparing to be one of the largest contemporary art manifestations in DRCongo, purported to elevate the city of Kinshasa to a major artistic venue. ", location: "Kinshasa, DRC", link: "https://web.facebook.com/YoungCongoBiennale/" },
    { id: 2, title: "The Timitar festival", date: "July 2-5, 2025", description: "A festival in Morocco that celebrates Amazigh (Berber) culture", image: "/Timitar.jpg", detailedDescription: "Celebrates Amazigh (Berber) culture through music, dance, and contemporary art attended by roughly 500,000 people.", location: "Agadir, Morocco", link: "https://www.instagram.com/festivaltimitar/" },
    { id: 3, title: "ART X Lagos", date: "November 6-9, 2025", description: "West Africa's leading contemporary art fair, showcasing emerging and established artists.", image: "/Art-X-Lagos.jpg", detailedDescription: "Widely regarded as West Africa's leading contemporary art fair, showcasing emerging and established artists.", location: "Lagos, Nigeria", link: "https://www.artxlagos.com/" },
    { id: 4, title: "Jazzablanca 2025", date: "July 3-12, 2025", description: "A major jazz/world-music festival featuring international and regional artists", image: "/Jazzablanca.png", detailedDescription: "Early July in Casablanca, Morocco. A major jazz/world-music festival featuring international and regional artists, plus cultural and educational side events.", location: "Casablanca, Morocco", link: "https://www.jazzablanca.com/en" },
    { id: 5, title: "Durban International Film Festival", date: "July 17-27, 2025", description: "Film Festival showcasing local and international films", image: "/durban.jpg", detailedDescription: "One of Africa's premier cinema events, featuring both local and international films, talks, closed-door industry sessions, and workshops for emerging talent.", location: "Durban, South Africa", link: "https://ccadiff.ukzn.ac.za/" },
  ];

  const blogPosts = [
    { id: 1, title: "Why Africa is the World's Next Creative Powerhouse", category: "Art & Culture", thumbnail: "/blog1.jpeg" },
    { id: 2, title: "Top 10 Fastest-Growing Creative Categories in Africa Right Now", category: "Business", thumbnail: "/blog2.jpeg" },
    { id: 3, title: "Inside Zadulis: 5 Trends We're Seeing Across African Art & Design", category: "Community", thumbnail: "/blog3.png" },
    { id: 4, title: "How AI Is Empowering The Next Generation of African Creatives", category: "Art & Culture", thumbnail: "/blog4.jpeg" },
    { id: 5, title: "What Happens When African Creativity Goes Global", category: "Business", thumbnail: "/blog5.jpeg" },
    { id: 6, title: "How Gen Z Is Reimagining African Identity", category: "Community", thumbnail: "/blog6.jpeg" },
  ];

  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredBio, setFeaturedBio] = useState('');

  // Move this declaration above the useEffect for correct scoping
  const selectedFeaturedCreator =
    featuredCreators.length > 0 ? featuredCreators[featuredIndex] : featuredCreator;

  useEffect(() => {
    const fetchFeaturedCreators = async () => {
      try {
        const { creatorProfiles } = await GlobalApi.getFilteredCreators(undefined, undefined, undefined, undefined, undefined);
        const featured = (creatorProfiles || []).filter((c: any) => c.isFeatured === true || c.is_featured === true);
        setFeaturedCreators(featured);
        setFeaturedIndex(0);
        setHasError(false);
      } catch (e) {
        setHasError(true);
      }
    };
    fetchFeaturedCreators();
  }, []);

  useEffect(() => {
    const fetchBio = async () => {
      if (selectedFeaturedCreator && selectedFeaturedCreator.id) {
        try {
          const { creatorProfile } = await GlobalApi.getCreatorDetails(selectedFeaturedCreator.id.toString());
          let bio = '';
          // Handle possible object or array types
          if (typeof creatorProfile?.bio === 'string') {
            bio = creatorProfile.bio;
          } else if (Array.isArray(creatorProfile?.bio)) {
            bio = creatorProfile.bio.join(' ');
          } else if (creatorProfile?.bio && typeof creatorProfile.bio === 'object') {
            // If object with 'raw' property, use that
            if ('raw' in creatorProfile.bio && typeof creatorProfile.bio.raw === 'string') {
              bio = creatorProfile.bio.raw;
            } else {
              // Fallback: join all string values in the object
              bio = Object.values(creatorProfile.bio).filter(v => typeof v === 'string').join(' ');
            }
          } else {
            bio = '';
          }
          const sentences = bio.match(/[^.!?]+[.!?]+/g) || [bio];
          if (sentences.length < 2) {
            setFeaturedBio('');
            return;
          }
          const firstSentence = sentences[0].trim();
          const secondSentence = sentences[1].trim();
          const words = secondSentence.split(' ');
          let displaySecond = '';
          if (words.length > 7) {
            displaySecond = words.slice(0, 7).join(' ') + '... <view-more-link>';
          } else {
            displaySecond = secondSentence;
          }
          setFeaturedBio(`${firstSentence} ${displaySecond}`);
        } catch (e) {
          setFeaturedBio('');
        }
      } else {
        setFeaturedBio('');
      }
    };
    fetchBio();
    // Only run when featured creator changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFeaturedCreator?.id]);

  const handleNextFeatured = () => {
    if (featuredCreators.length > 0) {
      setFeaturedIndex((prev) => (prev + 1) % featuredCreators.length);
    }
  };

  if (hasError) return <HomeViewError />;
  if (isPending || loadingCreators) return <HomeViewLoading />;

  return (
    <div className="flex h-screen p-4 rounded-xl overflow-hidden">
      {/* Global styles for scrollbars and animation */}
      <style jsx global>{`
        @keyframes rotate-slow {
          0% { transform: scale(1.1) rotate(0deg); }
          100% { transform: scale(1.1) rotate(360deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow 40s linear infinite;
        }
        #events-scroll::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        #events-scroll::-webkit-scrollbar-thumb {
          background: #FF7F00;
          border-radius: 8px;
        }
        #events-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        #blogs-scroll::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        #blogs-scroll::-webkit-scrollbar-thumb {
          background: #FF7F00;
          border-radius: 8px;
        }
        #blogs-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-bg {
          background: rgba(0,0,0,0.6);
        }
        .modal-animate {
          animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.6)) drop-shadow(0 0 10px rgba(255, 255, 0, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 255, 0, 1)) drop-shadow(0 0 20px rgba(255, 255, 0, 0.8)); }
        }
        .star-glow {
          animation: glow 1.5s ease-in-out infinite alternate;
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite alternate;
        }
      `}</style>

      {/* Modal for Event Details */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-bg" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative modal-animate" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setSelectedEvent(null)} aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-56 object-cover rounded-xl mb-4" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {selectedEvent.title}
                <a href={selectedEvent.link || '#'} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#FF7F00] hover:text-[#E64A19]" aria-label="External Link">
                  <ExternalLink className="h-5 w-5 inline" />
                </a>
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-2">{selectedEvent.date} <span className="mx-2">•</span> <span className="text-xs">{selectedEvent.location}</span></p>
            <p className="text-base text-gray-700 mb-4">{selectedEvent.detailedDescription}</p>
            <Button onClick={() => setSelectedEvent(null)} className="w-full mt-2 bg-[#FF7F00] text-white hover:bg-[#E64A19]">Close</Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 rounded-xl shadow-3xl overflow-hidden backdrop-blur-lg relative">
        {/* Blurred random image background */}
        <img src="https://picsum.photos/800/1200?random=1" 
        alt="background" 
        className="absolute inset-0 w-full h-full object-cover z-0 blur-2xl scale-110 opacity-90 animate-rotate-slow" 
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />
        {/* Top Bar (Header) */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-lg font-medium border-white-200/40" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>{greeting}, {userName} <span className="text-base font-normal ml-2">{formattedTime}</span></h1>
          <div className="flex items-center space-x-4">
            <div className="relative w-80s">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 " />
              <Input
                type="text"
                placeholder="Search for creators, events, blogs..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7F00] focus:border-transparent"
              />
            </div>
            <Avatar className="h-10 w-10 border-2 border-[#FF7F00]">
              <AvatarImage src={data?.user?.image || undefined} alt={userName} />
              <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </div>



        {/* Main Content Grid */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 overflow-y-auto pr-2 h-full">
          {/* Featured Creator / Hero Section */}
          <div className="mb-6 relative z-10 col-span-2 sm:w-full h-full">
            <Card className="bg-[#FF7F00]/40 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7F00]/40 to-[#E64A19]/40 opacity-90 rounded-xl"></div>
              <img src={selectedFeaturedCreator.profilePhoto?.url || selectedFeaturedCreator.image} alt={selectedFeaturedCreator.fullName || selectedFeaturedCreator.name} className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-xl" />
              <div className="relative z-10 flex flex-col h-full justify-end">
                <h3 className="text-lg font-bold ">Creator Of The Week</h3>
                <h4 className="text-6xl sm:text-4xl md:text-7xl lg:text-7xl font-extrabold mb-4">{selectedFeaturedCreator.fullName || selectedFeaturedCreator.name}</h4>
                <Badge variant="secondary" className="bg-white text-[#FF7F00] rounded-full px-3 py-1 text-sm font-semibold self-start mb-3">
                  {selectedFeaturedCreator.category || selectedFeaturedCreator.discipline}
                </Badge>
                <p className="text-sm mb-4 max-w-md">
                  {typeof featuredBio === 'string' && featuredBio.includes('<view-more-link>') ? (
                    <>
                      {featuredBio.replace('<view-more-link>', '')}
                      <span style={{ color: '#FF7F00', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => {
                        if (selectedFeaturedCreator.id) {
                          router.push(`/discover/details/${selectedFeaturedCreator.id}`);
                        }
                      }}>
                        view more
                      </span>
                    </>
                  ) : featuredBio}
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {(selectedFeaturedCreator.styleTags || selectedFeaturedCreator.style_tags || []).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-white text-white rounded-full px-3 py-1 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center mb-6">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1 star-glow" />
                  <span className="text-xl font-bold">+ 5 Stars From Zadulis</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white text-[#FF7F00] hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-semibold self-start shadow-md"
                    onClick={() => {
                      if (selectedFeaturedCreator.id) {
                        router.push(`/discover/details/${selectedFeaturedCreator.id}`);
                      }
                    }}
                  >
                    View Creator
                  </Button>

                </div>
              </div>
            </Card>
          </div>


          {/* New Creators List */}
          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col relative z-10 h-full">
            <h3 className="text-xl font-bold ">New Zadulis Creators</h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4">
                {loadingCreators ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : newCreators.length === 0 ? (
                  <div className="text-center text-gray-500">No new creators found.</div>
                ) : (
                  newCreators.map((creator) => (
                    <a
                      key={creator.id}
                      href={`/discover/details/${creator.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex items-center justify-between p-5 bg-gray-50/80 backdrop-blur rounded-lg cursor-pointer hover:bg-gray-400/50 transition-all duration-300">
                        <div className="flex items-center space-x-3 ">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {creator.name}
                              {creator.countryOfOrigin && (
                                <span className="ml-2 text-xs text-gray-500">({creator.countryOfOrigin})</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{creator.discipline}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </a>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* New Events / Quick Access to Events Section */}
          <div className="col-span-3 relative z-10 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold p-2 border-white-200/40" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>HOTTEST EVENTS AROUND AFRICA</h3>
              <Button variant="link" className="text-[#FF7F00] hover:text-[#E64A19] text-base">
                <ChevronRight className="ml-1 h-30 w-full sm:h-20 sm:w-20 animate-bounce-horizontal" />
              </Button>
            </div>
            <div className="relative w-full">
              {/* Scroll Buttons */}
              <button
                type="button"
                aria-label="Scroll Left"
                onClick={() => {
                  const el = document.getElementById('events-scroll');
                  if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 border border-gray-200"
                style={{ pointerEvents: 'auto' }}
                id="scroll-left-btn"
              >
                <ChevronRight className="h-9 w-9 text-[#FF7F00] rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Scroll Right"
                onClick={() => {
                  const el = document.getElementById('events-scroll');
                  if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 border border-gray-200"
                style={{ pointerEvents: 'auto' }}
                id="scroll-right-btn"
              >
                <ChevronRight className="h-9 w-9 text-[#FF7F00]" />
              </button>
              <div
                id="events-scroll"
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#FF7F00]/60 scrollbar-track-transparent rounded-xl pb-4 group"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarColor: '#FF7F00 transparent', scrollbarWidth: 'thin' }}
                onScroll={e => {
                  const el = e.currentTarget;
                  const leftBtn = document.getElementById('scroll-left-btn');
                  const rightBtn = document.getElementById('scroll-right-btn');
                  if (leftBtn && rightBtn) {
                    leftBtn.style.opacity = el.scrollLeft > 10 ? '1' : '0';
                    rightBtn.style.opacity = el.scrollLeft + el.clientWidth < el.scrollWidth - 10 ? '1' : '0';
                  }
                }}
              >
                <div className="flex flex-nowrap space-x-4 min-w-[600px] transition-all duration-300" style={{ scrollBehavior: 'smooth' }}>
                  {trendingEvents.map((event) => (
                    <Card key={event.id} className="w-64 flex-shrink-0 p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer  z-10 bg-white/50 backdrop-blur-sm hover:bg-gray-400/50 transition-all duration-300"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <img src={event.image} alt={event.title} className="w-full h-42 object-cover rounded-lg" />
                      <h4 className="font-semibold text-lg truncate text-slate-800">{event.title}</h4>
                      <p className="text-sm text-slate-800">{event.date}</p>
                      <p className="text-sm text-slate-800">{event.location}</p>
                      <p className="text-sm line-clamp-2 mb-3 text-slate-800">{event.description}</p>
                      <Button variant="outline" className="w-full rounded-lg border-[#FF7F00] hover:bg-orange-50">
                        Open
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Zadulis Circles */}
          <div className="col-span-1 relative z-10 mt-12">
            <Card
              className="h-100 bg-white/20 backdrop-blur-lg p-10 rounded-xl shadow-2xl text-gray-900 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-700 hover:scale-109 hover:bg-gray-400/50"
              onClick={() => router.push('/community')} // Placeholder link
            >
              <div className="absolute inset-0">
                <img src="/zCommunityIcon.png" alt="background orb" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center ">
                <h3 className="text-lg font-extrabold mb-2 bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>ZADULIS CIRCLES</h3>
                <p className="text-sm text-black mb-4 max-w-xs bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>
                  Connect with like-minded creators and build your community.
                </p>
                <Button variant="outline" className="rounded-lg border-[#FF7F00] hover:bg-orange-50">
                  Open
                </Button>
              </div>
            </Card>
          </div>

          {/* Zadulis Ai */}
          <div className="col-span-1 relative z-10 mt-12">
            <Card
              className="h-100 bg-white/20 backdrop-blur-sm p-10 rounded-xl shadow-2xl text-gray-900 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-700 hover:scale-109 hover:bg-gray-400/50"
              onClick={() => router.push('/ai')} // Placeholder link
            >
              <div className="absolute inset-0">
                <img src="/zAiIcon.png" alt="background orb" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-extrabold mb-2 bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>ZADULIS AI</h3>
                <p className="text-sm text-black mb-4 max-w-xs bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>
                  Explore our intelligent trained and crafted African AI companions
                </p>
                <Button variant="outline" className="rounded-lg border-[#FF7F00] hover:bg-orange-50">
                  Open
                </Button>
              </div>
            </Card>
          </div>

          {/* Zadulis Shop */}
          <div className="col-span-1 relative z-10 mt-12">
            <Card
              className="h-100 bg-white/20 backdrop-blur-sm p-10 rounded-xl shadow-2xl text-gray-900 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-700 hover:scale-109 hover:bg-gray-400/50"
              onClick={() => router.push('/shop')} // Placeholder link
            >
              <div className="absolute inset-0">
                <img src="/zShopIcon.png" alt="background orb" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center ">
                 <h3 className="text-lg font-extrabold mb-2 bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>ZADULIS SHOP</h3>
                <p className="text-sm text-black mb-4 max-w-xs bg-white/70 border-2 p-3 rounded-4xl border-gray-200" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>
                  Soon, you'll be able to buy and sell any Original African Art, Fashion, and Products
                </p>
                <Button variant="outline" className="rounded-lg border-2 border-[#FF7F00] hover:bg-orange-50">
                  Open
                </Button>
              </div>
            </Card>
          </div>


          {/* Blogs / Blog Feed */}
          <div className="col-span-3 relative z-10 mt-12">
            <h3 className="text-xl font-bold mb-4" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6)' }}>Latest Blogs</h3>
            <div className="relative w-full">
              {/* Scroll Buttons */}
              <button
                type="button"
                aria-label="Scroll Left"
                onClick={() => {
                  const el = document.getElementById('blogs-scroll');
                  if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 border border-gray-200"
                style={{ pointerEvents: 'auto' }}
                id="scroll-left-btn-blogs"
              >
                <ChevronRight className="h-6 w-6 text-[#FF7F00] rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Scroll Right"
                onClick={() => {
                  const el = document.getElementById('blogs-scroll');
                  if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 border border-gray-200"
                style={{ pointerEvents: 'auto' }}
                id="scroll-right-btn-blogs"
              >
                <ChevronRight className="h-6 w-6 text-[#FF7F00]" />
              </button>
              <div
                id="blogs-scroll"
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#FF7F00]/60 scrollbar-track-transparent rounded-xl pb-4 group"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarColor: '#FF7F00 transparent', scrollbarWidth: 'thin' }}
                onScroll={e => {
                  const el = e.currentTarget;
                  const leftBtn = document.getElementById('scroll-left-btn-blogs');
                  const rightBtn = document.getElementById('scroll-right-btn-blogs');
                  if (leftBtn && rightBtn) {
                    leftBtn.style.opacity = el.scrollLeft > 10 ? '1' : '0';
                    rightBtn.style.opacity = el.scrollLeft + el.clientWidth < el.scrollWidth - 10 ? '1' : '0';
                  }
                }}
              >
                <div className="lg:h-100 sm:10 md:h-70 flex flex-nowrap space-x-4 min-w-[300px] transition-all duration-300 px-1 sm:px-0 mb-10" style={{ scrollBehavior: 'smooth' }}>
                  {blogPosts.map((blog) => (
                    <Card key={blog.id} className="p-3 sm:p-4 rounded-xl shadow-md flex items-center space-x-3 sm:space-x-4 hover:shadow-lg cursor-pointer relative z-10 bg-white/50 backdrop-blur-sm w-64 min-w-[16rem] sm:w-80 sm:min-w-[20rem] max-w-xs sm:max-w-sm hover:bg-gray-400/50 transition-all duration-300">
                      <img src={blog.thumbnail} alt={blog.title} className="lg:w-70 lg:h-50 sm:w-70 sm:h-50 object-cover rounded-lg" />
                      <div className="flex-1 min-w-2">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">{blog.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{blog.category}</p>
                      </div>
                      <Button variant="outline" className="w-30 rounded-lg border-[#FF7F00] hover:bg-orange-50">
                        Read
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

