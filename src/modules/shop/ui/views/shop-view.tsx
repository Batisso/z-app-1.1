"use client";   
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState, useRef, useEffect } from "react";
import { countries, disciplines } from "@/lib/countries";

export const ShopView = () => {
  const trpc = useTRPC();
  const [data] = trpc.shop.getMany.useSuspenseQuery();
  
  // Form state management
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Dropdown states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  
  // Refs for dropdown management
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter countries based on search
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch('/api/waitlist/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          country: country || undefined,
          discipline: discipline || undefined
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setIsSuccess(true);
        // Clear the form
        setEmail("");
        setCountry("");
        setDiscipline("");
      } else {
        setMessage(result.error || "Something went wrong. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      setMessage("Network error. Please check your connection and try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

if (!data) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="320" height="320" viewBox="0 0 320 320" className="animate-spin-slower">
                    <circle cx="160" cy="160" r="140" fill="none" stroke="#FFD700" strokeWidth="8" strokeDasharray="30 30" opacity="0.15" />
                </svg>
            </div>
            {/* Glassmorphism Card */}
            <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl px-5 py-5 max-w-lg w-full flex flex-col items-center">
                <div className="mb-8 w-20 h-20 flex items-center justify-center">
                    <svg
                        className="animate-spin"
                        viewBox="0 0 50 50"
                        width="80"
                        height="80"
                    >
                        {/* Thin, glassy background ring */}
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="3"
                            fill="none"
                            style={{
                                filter: "blur(1.5px)",
                            }}
                        />
                        {/* Thin, glassy animated arc */}
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="url(#glassGradient)"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="40 60"
                            strokeDashoffset="20"
                            strokeLinecap="round"
                            style={{
                                filter: "drop-shadow(0 0 6px #FFD70088)",
                            }}
                        />
                        <defs>
                            <linearGradient id="glassGradient" x1="0" y1="0" x2="50" y2="50">
                                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
                                <stop offset="60%" stopColor="#fff" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#FF4500" stopOpacity="0.7" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                {/* Header Skeleton */}
                <div className="h-8 w-3/4 bg-white/40 rounded mb-4 animate-pulse" />
                {/* Subtext Skeleton */}
                <div className="h-5 w-2/3 bg-white/30 rounded mb-8 animate-pulse" />
                {/* Input Skeleton */}
                <div className="h-12 w-full bg-white/40 rounded-full mb-3 animate-pulse" />
                {/* Button Skeleton */}
                <div className="h-12 w-1/2 bg-white/30 rounded-full animate-pulse" />
            </div>
        </div>
    );
}

if (data instanceof Error) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center">
                <span className="text-lg text-red-600 mb-6">Failed to load shop data. Please try again.</span>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-full bg-white/30 backdrop-blur-md border border-amber-300 shadow-[0_0_16px_2px_rgba(255,215,0,0.18)] text-[#1a1a1a] font-bold relative overflow-hidden transition hover:scale-105 hover:shadow-[0_0_24px_6px_rgba(255,140,0,0.25)] focus:outline-none"
                    style={{
                        boxShadow: "0 0 16px 2px #FFD70033, 0 2px 8px 0 #FF8C0022",
                    }}
                >
                    <span className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-r from-[#FFD70044] via-[#FF8C0022] to-[#FFD70022] opacity-60 blur-[6px] animate-pulse"></span>
                    <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.418-2A9 9 0 106 19.418" />
                        </svg>
                        Refresh
                    </span>
                </button>
            </div>
        </div>
    );
}
  return (
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-orange-50/1 via-orange-400/10 to-yellow-100/5 duration-300 font-sans animate-gradient p-4">
         
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="280" height="280" viewBox="0 0 280 280" className="animate-spin-slower">
                    <circle cx="140" cy="140" r="120" fill="none" stroke="#FFD700" strokeWidth="6" strokeDasharray="25 25" opacity="0.12" />
                </svg>
            </div>
            {/* Glassmorphism Card */}
            <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl md:rounded-3xl shadow-2xl px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full flex flex-col items-center">
            {/* Hero Animation */}
            <div className="mb-4 sm:mb-6 md:mb-8 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center relative">
                {/* African pattern animation with glowing yellow and red */}
                <svg viewBox="0 0 160 160" fill="none" className="w-full h-full animate-pulse">
                    <defs>
                        <radialGradient id="glowYellow" cx="50%" cy="50%" r="60%">
                            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="glowRed" cx="50%" cy="50%" r="60%">
                            <stop offset="0%" stopColor="#FF4500" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
                        </radialGradient>
                       
                    </defs>
                    {/* Glowing background */}
                    <circle cx="80" cy="80" r="75" fill="url(#glowYellow)" opacity="0.5">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="80" r="60" fill="url(#glowRed)" opacity="0.3">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    {/* African pattern */}
                    <circle cx="80" cy="80" r="50" fill="url(#africanPattern)" stroke="#FFD700" strokeWidth="4" />
                    {/* Decorative pattern rings */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#FF4500" strokeWidth="2" opacity="0.7">
                        <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="80" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.7">
                        <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                </svg>
               
            </div>
            {/* Header */}
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-gray-650 text-center mb-3 sm:mb-4 md:mb-5 tracking-tight drop-shadow-[0_2px_72px_#FFB34788]">
                <span className="bg-gradient-to-r from-[#ffae00] to-[#FF4500] bg-clip-text text-transparent">ZADULIS SHOP</span> COMING SOON
            </h1>
            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-gray-650 text-center mb-4 sm:mb-6 md:mb-8 font-medium leading-relaxed">
                Soon, you'll be able to buy and sell any original & authentic art, fashion, and products from creators worldwide; all in one curated destination.
            </p>
            {/* Notify Me Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-2 sm:gap-3">
                {/* Country Dropdown */}
                <div ref={countryDropdownRef} className="relative w-full">
                    <button
                        type="button"
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full bg-white/60 text-gray-700 border-2 border-orange-300 outline-none focus:ring-2 focus:ring-[#FFD700] transition disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between text-sm sm:text-base"
                    >
                        <span className={country ? "text-gray-700" : "text-gray-500"}>
                            {country || "Select your country"}
                        </span>
                        <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {isCountryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md border border-orange-200 rounded-xl sm:rounded-2xl shadow-lg max-h-48 sm:max-h-60 overflow-hidden z-50">
                            <div className="p-2 sm:p-3 border-b border-orange-200">
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/80 text-gray-700 placeholder-gray-500 border border-orange-200 outline-none focus:ring-2 focus:ring-[#FFD700] text-xs sm:text-sm"
                                />
                            </div>
                            <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                                {filteredCountries.map((c) => (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => {
                                            setCountry(c.name);
                                            setIsCountryOpen(false);
                                            setCountrySearch("");
                                        }}
                                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-left hover:bg-orange-100/80 text-gray-700 text-xs sm:text-sm transition-colors"
                                    >
                                        {c.name}
                                    </button>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-500 text-xs sm:text-sm">No countries found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Discipline Input */}
                <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder="Discipline (e.g., Art, Design, Tech)"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full bg-white/60 text-gray-700 placeholder-gray-500 border-2 border-orange-300 outline-none focus:ring-2 focus:ring-[#FFD700] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />

                {/* Email Input */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full bg-white/60 text-gray-700 placeholder-gray-500 border-2 border-orange-300 outline-none focus:ring-2 focus:ring-[#FFD700] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 sm:mt-2 px-6 py-2 sm:px-8 sm:py-3 rounded-full bg-white/30 backdrop-blur-md border border-red-500 shadow-[0_0_20px_3px_rgba(255,215,0,0.2)] text-[#1a1a1a] font-bold relative overflow-hidden transition hover:scale-105 hover:shadow-[0_0_28px_6px_rgba(255,140,0,0.3)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                    style={{
                        boxShadow: "0 0 20px 3px #FFD70045, 0 2px 6px 0 #FF8C0025",
                    }}
                >
                    <span className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-r from-[#FFD70055] via-[#FF8C0025] to-[#FFD70025] opacity-60 blur-[8px] animate-pulse transition-all duration-300"></span>
                    <span className="relative z-8 flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Joining...
                            </>
                        ) : (
                            "Join the Waitlist"
                        )}
                    </span>
                </button>
                
                {/* Message Display */}
                {message && (
                    <div className={`mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg text-center text-xs sm:text-sm font-medium ${
                        isSuccess 
                            ? 'bg-green-100/80 text-green-800 border border-green-300' 
                            : 'bg-red-100/80 text-red-800 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}
            </form>
            
            </div>
            {/* Extra floating patterns */}
           
        </div>
  );
};

<style jsx>{`
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient {
  background-size: 300% 300%;
  animation: gradient 10s ease infinite;
}
`}</style>

