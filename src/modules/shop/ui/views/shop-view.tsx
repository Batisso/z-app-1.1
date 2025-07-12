"use client";   
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const ShopView = () => {
  const trpc = useTRPC();
  const [data] = trpc.shop.getMany.useSuspenseQuery();

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
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-orange-50/1 via-orange-400/10 to-yellow-100/5 duration-300 font-sans animate-gradient">
         
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="320" height="320" viewBox="0 0 320 320" className="animate-spin-slower">
                    <circle cx="160" cy="160" r="140" fill="none" stroke="#FFD700" strokeWidth="8" strokeDasharray="30 30" opacity="0.15" />
                </svg>
            </div>
            {/* Glassmorphism Card */}
            <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl px-6 py-6 max-w-lg w-full flex flex-col items-center ">
            {/* Hero Animation */}
            <div className="mb-8 w-44 h-44 flex items-center justify-center relative">
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
            <h1 className="text-[16px] md:text-[25px] font-extrabold text-gray-650 text-center mb-5 tracking-tight drop-shadow-[0_2px_72px_#FFB34788]">
               
                <span className="bg-gradient-to-r from-[#ffae00] to-[#FF4500] bg-clip-text text-transparent">ZADULIS SHOP</span> COMING SOON

            </h1>
            {/* Subtext */}
            <p className="text-[15px] md:text-[15px] text-gray-650 text-center mb-8 font-medium">
               Soon, you'll be able to buy and sell any Original Art, Fashion, and Products from the boldest creators across Africa and the Diaspora — all in one curated destination.
            </p>
            {/* Notify Me Button */}
            <form className="w-full flex flex-col items-center gap-3">
                <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-full bg-white/60 text-gray-700 placeholder-gray-500 border-2 border-orange-300 outline-none focus:ring-2 focus:ring-[#FFD700] transition"
                />
                <button
                    type="submit"
                    className="mt-2 px-8 py-3 rounded-full bg-white/30 backdrop-blur-md border border-red-500 shadow-[0_0_24px_4px_rgba(255,215,0,0.25)] text-[#1a1a1a] font-bold relative overflow-hidden transition hover:scale-105 hover:shadow-[0_0_32px_8px_rgba(255,140,0,0.35)] focus:outline-none hover"
                    style={{
                        boxShadow: "0 0 24px 4px #FFD70055, 0 2px 8px 0 #FF8C0033",
                    }}
                >
                    <span className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-r from-[#FFD70066] via-[#FF8C0033] to-[#FFD70033] opacity-60 blur-[10px] animate-pulse transition-all duration-300"></span>
                    <span className="relative z-8">Join the Waitlist</span>
                </button>
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

