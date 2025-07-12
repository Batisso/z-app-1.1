"use client"

import Companion1 from "@/modules/ai/ui/pages/companion1";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, Plus, AtomIcon, MessageCircle, Search, Bell, User, ArrowBigDown, ArrowDown } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chatbot from "@/components/Chatbot";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AiView = () => {
    const trpc = useTRPC();
    const { data, isLoading} = trpc.ai.getMany.useQuery();

    return (
      <ScrollArea className="h-screen w-full mx-auto">
          <div className="relative flex flex-col rounded-xxl text-white transition-all duration-300 overflow-hidden lg:h-[100vh] md:h-[100vh]">
            {/* Background image with rotation */}
            <div className="absolute w-[500vw] h-[500vh] md:w-[200vw] md:h-[200vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat bg-center animate-rotate-orb" style={{ backgroundImage: 'url("/orb.png")', backgroundAttachment: 'fixed' }}></div>
            {/* Floating Circle 1 */}
            <div className="hidden md:hidden lg:block absolute top-1/4 left-10 w-44 h-34 rounded-full bg-cover animate-float-1 z-10" style={{ backgroundImage: 'url("/backImage.png")' }}></div>
            {/* Floating Circle 2 */}
            <div className="hidden md:hidden lg:block absolute top-1/3 right-10 w-28 h-28 rounded-full bg-cover animate-float-2 z-10" style={{ backgroundImage: 'url("/backImage12.png")' }}></div>
            
              {/* Header */}
              <div className="sticky top-0 z-40 backdrop-blur-md">
                    <div className="max-w-8xl mx-auto px-6 py-3">
                      <div className="flex items-center justify-between bg-white/30 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-sm">
                        <div className="flex items-center gap-4">
                      
                      <div className="w-12 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                        <AtomIcon className="text-white font-bold text-lg" />
                      </div>
                          <div>
                            <h1 className="text-xl text-gray-800 font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                              ZADULIS AI
                            </h1>
                            <p className="text-xs opacity-70 text-gray-800 ">Your Creative AI companions for a Culture-First Future</p>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

              {/* Hero Section Content */}
              <div className="flex flex-col items-center justify-center flex-1 text-center h-full mt-4 py-7 md:py-2 lg:py-7 px-4 md:px-5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl mx-7">
               
                <h1 className="text-3xl md:text-3xl lg:text-xl font-extrabold text-gray-700 drop-shadow-lg"><span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">WHERE</span> <span className="bg-gradient-to-r from-green-500 to-red-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">AFRICAN</span> <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">CULTURE MEETS</span> <span className="bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">AI</span> </h1>

                <p className="text-lg md:text-2xl lg:text-xl text-gray-500 dark:text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">Personal AI companions crafted and trained to fuel your creativity, unlock cultural knowledge, and connect you deeper to African creativity anytime you ask. Pick your AI companion below and start your conversation! <br /> <ArrowDown className="mx-auto mt-4 text-black text-4xl animate-bounce" /></p>
                
                
              </div>
            

              {/* Main Content - AI Avatar Cards */}
              <div className="flex flex-1 p-4 md:p-1 md:flex-row flex-col justify-center mt-4">
                {/* AI Avatar Cards */}
                
                <div className="flex justify-center p-4 md:p-5 mx-auto w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 w-full">
                    {/* AI Avatar Card components will go here */}

                    {/* Card 1 */}
                    <Link href="/ai/kwame" className="rounded-4xl lg:w-100 lg:h-90 shadow-xl bg-white/30 backdrop-blur-lg border-2 border-white/40 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-60 md:h-100 flex-shrink-0">
                      <div className="relative">
                        <div className="relative w-50 h-50 mx-auto mt-4 rounded-xl overflow-hidden">
                          <img
                            src="/kwame.png"
                            alt="Kwame Avatar"
                            className="relative w-full h-full object-cover"
                            style={{ zIndex: 30 }}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-center text-black">KWAME</h3>
                        <p className="text-black/70 text-center">The Culture Scholar</p>
                        <button className="bg-white/50 text-zinc-900 font-semibold rounded-xl py-2 px-4 block mx-auto mt-4 hover:bg-gray-200 transition-colors duration-800 glowing-button">Talk</button>
                      </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/ai/nandi" className="rounded-4xl lg:w-100 lg:h-90 shadow-xl bg-white/20 backdrop-blur-lg border border-white/30 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-60 md:h-100 flex-shrink-0">
                      <div className="relative">
                        <div className="relative w-50 h-50 mx-auto mt-4 rounded-xl overflow-hidden">
                          <img
                            src="/nandi.png"
                            alt="Nandi Avatar"
                            className="relative w-full h-full object-cover"
                            style={{ zIndex: 30 }}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-black text-center">NANDI</h3>
                        <p className="text-black/70 text-center">The Creative Spark</p>
                        <button className="bg-white/50 text-zinc-900 font-semibold rounded-xl py-2 px-4 block mx-auto mt-4 hover:bg-gray-200 transition-colors duration-800 glowing-button">Talk</button>
                      </div>
                    </Link>

                    {/* Card 3 */}
                    <Link href="/ai/shaba" className="rounded-4xl lg:w-100 lg:h-90 shadow-xl bg-white/20 backdrop-blur-lg border border-white/30 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-60 md:h-100 flex-shrink-0">
                      <div className="relative">
                        <div className="relative w-50 h-50 mx-auto mt-4 rounded-xl overflow-hidden">
                          <img
                            src="/shaba.png"
                            alt="Shaba Avatar"
                            className="relative w-full h-full object-cover"
                            style={{ zIndex: 30 }}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 text-center">SHABA</h3>
                        <p className="text-gray-500 text-center">The Vibe Plug</p>
                        <button className="bg-white/50 text-zinc-900 font-semibold rounded-xl py-2 px-4 block mx-auto mt-4 hover:bg-gray-200 transition-colors duration-800 glowing-button">Talk</button>
                      </div>
                    </Link>

                   
                  </div>
                </div>
                
              </div>
              
          </div>
      </ScrollArea>
    );
}
export const CommunityViewLoading = () => {
  return (
    <LoadingState
      title="LOADING COMMUNITY" 
    />
  );
};

export const CommunityViewError = () => {
  return (
    <ErrorState
      title=":( Error Loading"
      description="Try Refreshing The Page"
    />
  );
};
