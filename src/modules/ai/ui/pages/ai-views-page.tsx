"use client"

import Companion1 from "@/modules/ai/ui/pages/companion1";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, Plus, AtomIcon, MessageCircle, Search, Bell, User, ArrowBigDown, ArrowDown } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chatbot from "@/components/Chatbot";

export const AiView = () => {
    const trpc = useTRPC();
    const { data, isLoading} = useQuery(trpc.ai.getMany.queryOptions());


    return (
      <ScrollArea className="h-screen">
        
        <div className="relative flex flex-col rounded-xxl text-white transition-all duration-300 overflow-hidden lg:h-[100vh]">
          {/* Background image with rotation */}
          <div className="absolute w-[500vw] h-[500vh] md:w-[200vw] md:h-[200vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat bg-center animate-rotate-orb" style={{ backgroundImage: 'url("/orb.png")', backgroundAttachment: 'fixed' }}></div>
          {/* Floating Circle 1 */}
          <div className="hidden md:block absolute top-1/4 left-10 w-44 h-34 rounded-full bg-cover animate-float-1 z-10" style={{ backgroundImage: 'url("/backImage.png")' }}></div>
          {/* Floating Circle 2 */}
          <div className="hidden md:block absolute top-1/3 right-10 w-28 h-28 rounded-full bg-cover animate-float-2 z-10" style={{ backgroundImage: 'url("/backImage12.png")' }}></div>
          
            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-md">
                  <div className="max-w-7xl mx-auto px-6 py-3">
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
            <div className="flex flex-col items-center justify-center flex-1 text-center h-full mt-4 py-7 px-4 md:px-24 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 md:mx-auto max-w-7xl">
             
              <h1 className="text-3xl md:text-2xl font-extrabold text-gray-700 drop-shadow-lg"><span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">WHERE</span> <span className="bg-gradient-to-r from-green-500 to-red-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">AFRICAN</span> <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">CULTURE MEETS</span> <span className="bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">AI</span> </h1>

              <p className="text-lg md:text-lg text-gray-500 dark:text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">Personal AI companions crafted and trained to fuel your creativity, unlock cultural knowledge, and connect you deeper to African creativity anytime you ask. Pick your AI companion below and start your conversation! <br /> <ArrowDown className="mx-auto mt-4 text-black text-4xl animate-bounce" /></p>
              
              
            </div>
          

            {/* Main Content - AI Avatar Cards */}
            <div className="flex flex-1 p-4 md:p-1 md:flex-row flex-col justify-center mt-4">
              {/* AI Avatar Cards */}
              
              <div className="flex justify-center p-4 md:p-5 mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 max-w-7xl mx-auto lg:max-w-screen-5xl">
                  {/* AI Avatar Card components will go here */}

                  {/* Card 1 */}
                  <Link href="/ai/kwame" className="rounded-4xl shadow-xl bg-white/30 backdrop-blur-lg border-2 border-white/40 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-96 flex-shrink-0">
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
                  <Link href="/ai/nandi" className="rounded-4xl shadow-xl bg-white/20 backdrop-blur-lg border border-white/30 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-96 flex-shrink-0">
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
                  <Link href="/ai/shaba" className="rounded-4xl shadow-xl bg-white/20 backdrop-blur-lg border border-white/30 hover:ring-2 ring-amber-500 transition-all duration-800 hover:scale-105 w-full md:w-96 flex-shrink-0">
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
          
          .glowing-button {
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .glowing-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg,
              transparent 0%,
              transparent 30%,
              #ffcc00 50%,
              transparent 70%,
              transparent 100%
            );
            animation: glow 4s linear infinite;
            z-index: -1;
          }
          .glowing-button::after {
            content: '';
            position: absolute;
            inset: 2px;
            background: inherit; /* Use the button's background */
            border-radius: 0.75rem; /* Match button's rounded-xl */
            z-index: -1;
          }
          @keyframes glow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes float-1 {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-10px) translateX(5px) rotate(5deg); }
            50% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            75% { transform: translateY(10px) translateX(-5px) rotate(-5deg); }
            100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          }

          @keyframes float-2 {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(15px) translateX(-8px) rotate(-7deg); }
            50% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            75% { transform: translateY(-15px) translateX(8px) rotate(7deg); }
            100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          }

          .animate-float-1 {
            animation: float-1 10s ease-in-out infinite;
          }

          .animate-float-2 {
            animation: float-2 10s ease-in-out infinite reverse;
          }

          

         @keyframes rotate-orb {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
         }

         .animate-rotate-orb {
           animation: rotate-orb 60s linear infinite; /* Adjust duration as needed */
         }

          @keyframes gradient-glow {
            0% {
              filter: brightness(100%) drop-shadow(0 0 2px rgba(255, 75, 43, 0.5));
            }
            50% {
              filter: brightness(150%) drop-shadow(0 0 8px rgba(255, 75, 43, 0.8));
            }
            100% {
              filter: brightness(100%) drop-shadow(0 0 2px rgba(255, 75, 43, 0.5));
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(0);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
        `}</style>
      </ScrollArea>
    );
}
export { Companion1 };
