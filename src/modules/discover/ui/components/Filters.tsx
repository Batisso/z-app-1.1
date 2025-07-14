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
  works: Array<{
        id: string;
        url: string;
        title?: string;
        medium?: string;
        price?: number;
    }>;
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

        @keyframes circulatingGlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 
              0 0 10px rgba(255, 140, 0, 0.4),
              0 0 20px rgba(255, 140, 0, 0.3),
              0 0 30px rgba(255, 140, 0, 0.2),
              inset 0 0 10px rgba(255, 140, 0, 0.1);
          }
          50% {
            box-shadow: 
              0 0 20px rgba(255, 140, 0, 0.8),
              0 0 40px rgba(255, 140, 0, 0.6),
              0 0 60px rgba(255, 140, 0, 0.4),
              inset 0 0 20px rgba(255, 140, 0, 0.2);
          }
        }

        @keyframes borderWave {
          0% {
            border-image: linear-gradient(0deg, #ff8c00, #ff4500, #ff6b35, #ff8c00) 1;
          }
          25% {
            border-image: linear-gradient(90deg, #ff4500, #ff6b35, #ff8c00, #ff4500) 1;
          }
          50% {
            border-image: linear-gradient(180deg, #ff6b35, #ff8c00, #ff4500, #ff6b35) 1;
          }
          75% {
            border-image: linear-gradient(270deg, #ff8c00, #ff4500, #ff6b35, #ff8c00) 1;
          }
          100% {
            border-image: linear-gradient(360deg, #ff4500, #ff6b35, #ff8c00, #ff4500) 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes energyFlow {
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


        @media (prefers-reduced-motion: reduce) {
          .slider-creators,
          .slider-works,
          .toggle-container,
          .circulating-glow,
          .sparkle-effect {
            animation: none !important;
          }
        }

        /* Enhanced Toggle Container with Multiple Glow Layers */
        .toggle-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border: 3px solid transparent;
          position: relative;
          overflow: visible;
          animation: pulseGlow 4s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-container:hover {
         
          animation: pulseGlow 2s ease-in-out infinite;
        }

      

        /* Inner Background */
        .toggle-inner-bg {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: inherit;
          z-index: -1;
        }

        .toggle-button {
          position: relative;
          z-index: 20;
          font-weight: 600;
          letter-spacing: 0.025em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: transparent;
          overflow: hidden;
        }

        .toggle-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .toggle-button:hover::before {
          left: 100%;
        }

        .toggle-button:focus {
          outline: none;
          box-shadow: 
            0 0 0 3px rgba(255, 140, 0, 0.3),
            0 0 20px rgba(255, 140, 0, 0.2);
        }

        .slider-background {
          position: absolute;
          top: 3px;
          bottom: 3px;
          width: calc(50% - 3px);
          background: linear-gradient(135deg, #ff8c00 0%, #ff4500 50%, #ff6b35 100%);
          background-size: 200% 200%;
          border-radius: 9999px;
          box-shadow: 
            0 4px 15px rgba(255, 69, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.6s cubic-bezier(0.77, 0, 0.175, 1); /* Enhanced swoosh transition */
          z-index: 10;
          animation: energyFlow 3s ease-in-out infinite;
          overflow: hidden;
        }

        .slider-background::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: conic-gradient(
            from 0deg,
            rgba(255, 140, 0, 0.8),
            rgba(255, 69, 0, 1),
            rgba(255, 215, 0, 0.6),
            rgba(255, 140, 0, 0.8)
          );
          border-radius: inherit;
          z-index: -1;
          animation: circulatingGlow 2s linear infinite;
          filter: blur(1px);
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          opacity: 0.95;
          position: relative;
        }

        .logo-circle {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 140, 0, 0.3);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .logo-circle::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 140, 0, 0.3) 50%,
            transparent 100%
          );
          animation: circulatingGlow 4s linear infinite;
        }

        .logo-text {
          position: relative;
          z-index: 2;
          font-weight: bold;
          background: linear-gradient(45deg, #ff8c00, #ff4500, #ff6b35);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: energyFlow 2s ease-in-out infinite;
        }

        /* Sparkle Effects */
        .sparkle-effect {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #fff 0%, rgba(255, 140, 0, 0.8) 100%);
          border-radius: 50%;
          pointer-events: none;
        }

        .sparkle-1 {
          top: 10%;
          left: 20%;
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 80%;
          right: 25%;
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: 0.7s;
        }

        .sparkle-3 {
          top: 30%;
          right: 15%;
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: 1.4s;
        }

        .sparkle-4 {
          bottom: 20%;
          left: 30%;
          animation: sparkle 2s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        /* Mobile optimizations with enhanced effects */
        @media (max-width: 480px) {
          .toggle-container {
            padding: 2px;
            min-width: 200px;
            height: 36px;
          }
          
          .toggle-button {
            padding: 6px 20px;
            font-size: 13px;
            min-width: 95px;
            height: 32px;
          }
          
          .logo-circle {
            width: 18px;
            height: 18px;
          }
          
          .logo-text {
            font-size: 9px;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .toggle-container {
            padding: 2px;
            min-width: 220px;
            height: 38px;
          }
          
          .toggle-button {
            padding: 7px 22px;
            font-size: 14px;
            min-width: 105px;
            height: 34px;
          }
          
          .logo-circle {
            width: 20px;
            height: 20px;
          }
          
          .logo-text {
            font-size: 10px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .toggle-container {
            padding: 3px;
            min-width: 240px;
            height: 40px;
          }
          
          .toggle-button {
            padding: 8px 24px;
            font-size: 15px;
            min-width: 115px;
            height: 34px;
          }
          
          .logo-circle {
            width: 22px;
            height: 22px;
          }
          
          .logo-text {
            font-size: 11px;
          }
        }

        @media (min-width: 769px) {
          .toggle-container {
            padding: 3px;
            min-width: 260px;
            height: 42px;
          }
          
          .toggle-button {
            padding: 9px 26px;
            font-size: 15px;
            min-width: 125px;
            height: 36px;
          }
          
          .logo-circle {
            width: 24px;
            height: 24px;
          }
          
          .logo-text {
            font-size: 12px;
          }
        }

        @media (min-width: 1024px) {
          .toggle-container {
            padding: 3px;
            min-width: 280px;
            height: 44px;
          }
          
          .toggle-button {
            padding: 10px 28px;
            font-size: 16px;
            min-width: 135px;
            height: 38px;
          }
          
          .logo-circle {
            width: 26px;
            height: 26px;
          }
          
          .logo-text {
            font-size: 13px;
          }
        }

        @media (min-width: 1280px) {
          .toggle-container {
            padding: 4px;
            min-width: 300px;
            height: 46px;
          }
          
          .toggle-button {
            padding: 11px 30px;
            font-size: 16px;
            min-width: 145px;
            height: 38px;
          }
          
          .logo-circle {
            width: 28px;
            height: 28px;
          }
          
          .logo-text {
            font-size: 14px;
          }
        }
      `}</style>
      
        <div
          className={`toggle-container relative rounded-full shadow-lg hero-button-size ${className}`}
          role="tablist"
          aria-label="Toggle between Creators and Works"
        >
          {/* Inner Background */}
          <div className="toggle-inner-bg"></div>
          
          {/* Sparkle Effects */}
          <div className="sparkle-effect sparkle-1"></div>
          <div className="sparkle-effect sparkle-2"></div>
          <div className="sparkle-effect sparkle-3"></div>
          <div className="sparkle-effect sparkle-4"></div>
          
          <div className="flex relative h-full">
            {/* Animated Slider Background */}
            <div 
              className="slider-background"
              style={{
                left: isCreatorsActive ? '3px' : '50%',
                transform: isCreatorsActive ? 'translateX(0)' : 'translateX(-3px)'
              }}
            >
              {/* Logo/Icon in the center of the slider */}
              
            </div>

          {/* Creators Button */}
            <button
              onClick={() => handleToggle('Creators')}
              className={`toggle-button rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
                isCreatorsActive 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
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
              className={`toggle-button rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
                isWorksActive 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              role="tab"
              aria-selected={isWorksActive}
              aria-controls="works-panel"
              tabIndex={isWorksActive ? 0 : -1}
            >
              Works
            </button>
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

.card-initial-hidden {
  opacity: 0;
  transform: translateY(20px);
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

// Enhanced CSS Grid masonry styles with span functionality
// Enhanced CSS Grid masonry styles with better responsiveness and visual appeal
const masonryStyles = `
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 8px;
  gap: 16px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Mobile First Approach */
@media (max-width: 480px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
    padding: 12px;
    grid-auto-rows: 6px;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
    padding: 16px;
    grid-auto-rows: 7px;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
    padding: 18px;
    grid-auto-rows: 8px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
    padding: 20px;
    grid-auto-rows: 9px;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .masonry-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
    padding: 24px;
    grid-auto-rows: 10px;
  }
}

@media (min-width: 1281px) and (max-width: 1536px) {
  .masonry-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 7px;
    padding: 28px;
    grid-auto-rows: 10px;
  }
}

@media (min-width: 1537px) {
  .masonry-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
    padding: 32px;
    grid-auto-rows: 12px;
  }
}

.masonry-item {
  grid-column: span 1;
  break-inside: avoid;
  page-break-inside: avoid;
}

.work-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, box-shadow;
  height: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
}

.work-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 140, 0, 0.1),
    0 0 20px rgba(255, 140, 0, 0.2);
  border-color: rgba(255, 140, 0, 0.3);
}

.work-card-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  object-fit: cover;
}

.work-card:hover .work-card-image {
  transform: scale(1.08);
}

.work-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
}

.work-card:hover .work-card-overlay {
  opacity: 1;
}

.work-card-info {
  transform: translateY(20px);
  transition: transform 0.3s ease-in-out;
}

.work-card:hover .work-card-info {
  transform: translateY(0);
}

.work-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
}

.work-card-subtitle {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 400;
}

.work-card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease-in-out;
}

.work-card:hover .work-card-actions {
  opacity: 1;
  transform: translateY(0);
}

.work-card-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.work-card-action-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.work-card-action-btn svg {
  width: 18px;
  height: 18px;
  color: #374151;
}

/* Enhanced Loading skeleton grid */
.pinterest-loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 8px;
  gap: 16px;
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .pinterest-loading-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
    grid-auto-rows: 6px;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 16px;
    grid-auto-rows: 7px;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 18px;
    grid-auto-rows: 8px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    padding: 20px;
    grid-auto-rows: 9px;
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 24px;
    grid-auto-rows: 10px;
  }
}

@media (min-width: 1281px) and (max-width: 1536px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 22px;
    padding: 28px;
    grid-auto-rows: 10px;
  }
}

@media (min-width: 1537px) {
  .pinterest-loading-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
    padding: 32px;
    grid-auto-rows: 12px;
  }
}

.loading-masonry-item {
  grid-column: span 1;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.pinterest-skeleton {
  background: linear-gradient(
    90deg,
    #f8f9fa 25%,
    #e9ecef 50%,
    #f8f9fa 75%
  );
  background-size: 200px 100%;
  animation: pinterest-skeleton-pulse 1.8s infinite ease-in-out;
}

@keyframes pinterest-skeleton-pulse {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Improved fade-in animation */
@keyframes masonry-fade-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.masonry-fade-in {
  animation: masonry-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Staggered animation delays */
.masonry-item:nth-child(1) { animation-delay: 0ms; }
.masonry-item:nth-child(2) { animation-delay: 100ms; }
.masonry-item:nth-child(3) { animation-delay: 200ms; }
.masonry-item:nth-child(4) { animation-delay: 300ms; }
.masonry-item:nth-child(5) { animation-delay: 400ms; }
.masonry-item:nth-child(6) { animation-delay: 500ms; }
.masonry-item:nth-child(n+7) { animation-delay: 600ms; }
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
  const [shuffledCreatorsForDisplay, setShuffledCreatorsForDisplay] = useState<Creator[]>([]); // New state for shuffled creators
  const [shuffledWorksForDisplay, setShuffledWorksForDisplay] = useState<Creator[]>([]); // New state for shuffled works
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

  // Effect to shuffle creators only once on initial load or when activeView changes to 'Creators'
  useEffect(() => {
    if (activeView === 'Creators' && shuffledCreatorsForDisplay.length === 0 && filters.length > 0) {
      const shuffled = [...filters]; // Create a shallow copy
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledCreatorsForDisplay(shuffled);
    } else if (activeView === 'Works' && shuffledCreatorsForDisplay.length > 0) {
      // Clear shuffled creators if we switch back to Works view to save memory
      setShuffledCreatorsForDisplay([]);
    }
  }, [activeView, filters, shuffledCreatorsForDisplay.length]);

  // Filter the creators based on search and filters
  const filteredCreators = (activeView === 'Creators' ? shuffledCreatorsForDisplay : filters)
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
    });
 
  // Get current page creators
  const indexOfLastCreator = currentPage * creatorsPerPage;
  const indexOfFirstCreator = indexOfLastCreator - creatorsPerPage;
  const currentCreators = filteredCreators.slice(0, indexOfLastCreator);
  const hasMoreCreators = filteredCreators.length > indexOfLastCreator;
 
  // Effect to shuffle works only once on initial load or when activeView changes to 'Works'
  useEffect(() => {
    if (activeView === 'Works' && shuffledWorksForDisplay.length === 0 && filters.length > 0) {
      const shuffled = [...filters]; // Create a shallow copy
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledWorksForDisplay(shuffled);
    } else if (activeView === 'Creators' && shuffledWorksForDisplay.length > 0) {
      // Clear shuffled works if we switch back to Creators view to save memory
      setShuffledWorksForDisplay([]);
    }
  }, [activeView, filters, shuffledWorksForDisplay.length]);
 
  // For Works view, use all available creators (not filtered by creator-specific filters)
  const worksData = activeView === 'Works' ?
    shuffledWorksForDisplay.filter(creator => {
      const matchesSearch = searchTerm === '' ||
        creator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.basedIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.styleTags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    }).slice(0, currentPage * creatorsPerPage) : [];

  // Calculate grid row span based on content height
  const calculateRowSpan = (height: number) => {
    const rowHeight = 20; // Base row height in pixels
    const gap = 24; // Gap between items in pixels
    return Math.ceil((height + gap) / rowHeight);
  };

  // Generate consistent heights for items based on their index
  const getItemHeight = (index: number) => {
    const heights = [200, 250, 300, 350, 400, 280, 320, 380, 220, 360];
    return heights[index % heights.length];
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

  // Enhanced Pinterest-style loading skeleton with grid
  const MasonryLoadingSkeleton = () => {
    const totalItems = 20;
    
    return (
      <div className="pinterest-loading-grid">
        {[...Array(totalItems)].map((itemIndex) => {
          const height = getItemHeight(itemIndex);
          const rowSpan = calculateRowSpan(height + 120); // Add padding for content
          
          return (
            <div 
              key={itemIndex} 
              className="loading-masonry-item bg-white rounded-xl shadow-lg overflow-hidden"
              style={{
                gridRowEnd: `span ${rowSpan}`,
                animation: `fade-in-up 0.6s ease-out forwards`,
                animationDelay: `${itemIndex * 50}ms`,
                opacity: 0
              }}
            >
              <div 
                className="w-full pinterest-skeleton" 
                style={{ height: `${height}px` }}
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
          );
        })}
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

  // Enhanced Pinterest-style loading more skeleton with grid
  const MasonryLoadingMoreSkeleton = () => {
    const totalItems = 8;
    
    return (
      <div className="pinterest-loading-grid">
        {[...Array(totalItems)].map((_, index) => {
          const itemIndex = index + 100; // Offset to avoid key conflicts
          const height = getItemHeight(itemIndex);
          const rowSpan = calculateRowSpan(height + 120);
          
          return (
            <div 
              key={itemIndex} 
              className="loading-masonry-item bg-white rounded-xl shadow-lg overflow-hidden"
              style={{
                gridRowEnd: `span ${rowSpan}`,
                animation: `fade-in-up 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0
              }}
            >
              <div 
                className="w-full pinterest-skeleton" 
                style={{ height: `${height}px` }}
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
          );
        })}
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

      <style jsx global>{`
        .hero-button-size {
          font-weight: 200;
          letter-spacing: 0.025em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-left: auto; /* Added for horizontal centering when stacked */
          margin-right: auto; /* Added for horizontal centering when stacked */
        }

        @media (max-width: 480px) {
          .hero-button-size {
            padding: 4px 12px;
            font-size: 12px;
            min-width: 70px;
            height: 28px;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .hero-button-size {
            padding: 5px 14px;
            font-size: 13px;
            min-width: 80px;
            height: 30px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .hero-button-size {
            padding: 6px 20px;
            font-size: 14px;
            min-width: 100px;
            height: 32px;
          }
        }

        @media (min-width: 769px) {
          .hero-button-size {
            padding: 7px 22px;
            font-size: 14px;
            min-width: 110px;
            height: 34px;
          }
        }

        @media (min-width: 1024px) {
          .hero-button-size {
            padding: 8px 24px;
            font-size: 15px;
            min-width: 120px;
            height: 36px;
          }
        }

        @media (min-width: 1280px) {
          .hero-button-size {
            padding: 9px 26px;
            font-size: 15px;
            min-width: 130px;
            height: 36px;
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
        <div className="relative bg-cover bg-center h-60 rounded-lg overflow-hidden mb-8">
          {/* Floating Images */}
          <div className="absolute -left-2 top-1/2  w-45 h-45 rounded-full overflow-hidden shadow-9xl animate-fun-float-1 animate-glow">
            <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz88zkfc07lpaorfkiol" alt="Floating decoration" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -right-2 top-1/2  w-45 h-45 rounded-full overflow-hidden shadow-9xl animate-fun-float-2 animate-glow">
            <img src="https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmbmtgz8nzkfi07lpfxewxjnm" alt="Floating decoration" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-orange-900/70 to-orange-900/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-4xl font-bold mb-2">DISCOVER THE WORLDS BOLDEST CREATORS</h1>
              <p className="text-sm sm:text-lg mb-4">Browse and connect with a new generation of global artists, designers, and culture-makers.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={scrollToFilters}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-green-400 hero-button-size mx-5"
                >
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300"></div>
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p className='font-medium'>Start Exploring</p>
                  </div>
                </button>
                              {/* Toggle Switch */}
        <ToggleSwitch
          onToggle={handleToggleChange}
          defaultState="Creators"
          className="mx-5"
        />
                <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full hover:from-yellow-600 hover:to-amber-700 transition-all duration-500 flex items-center shadow-lg hover:shadow-xl relative group border-2 border-transparent hover:border-orange-200 hero-button-size">
                  <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div>
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                  <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500"></div>
                  <div className="absolute -inset-[4px] rounded-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <p className='font-medium'>Become a Creator</p>
                  </div>
                </button>
              </div>
            
            </div>
          </div>
        </div>

        

        {/* Search and Filter Panel */}
        <div ref={filterPanelRef} className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-2 sm:p-3 z-10 max-w-sm mx-auto lg:max-w-xl rounded-xl border-2 border-transparent hover:border-orange-500 hover:shadow-[0_0_15px_rgba(255,140,0,0.3)] transition-all duration-500 animate-glow">
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
                          <div className="creator-card bg-white/20 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-white/60 card-initial-hidden">
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
                // Works view with enhanced CSS Grid masonry
                <>
                  <div className="masonry-grid">
                    {worksData.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No works found matching your criteria</p>
                      </div>
                    ) : (
                      <>
                        {worksData.map((creatorProfile, index) => {
                          const height = getItemHeight(index);
                          const rowSpan = calculateRowSpan(height + 120); // Add padding for content
                          
                          return (
                            <div 
                              key={`work-${creatorProfile.id}-${index}`} 
                              className="masonry-item"
                              style={{
                                gridRowEnd: `span ${rowSpan}`
                              }}
                            >
                              <Link href={`/discover/details/${creatorProfile.id}`}>
                                <div className="work-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-orange-300 card-initial-hidden">
                                  <div className="relative overflow-hidden">
                                    <img
                                      src={creatorProfile.works[0]?.url}
                                      alt={`Work by ${creatorProfile.fullName}`}
                                      className="work-card-image w-full object-cover"
                                      style={{ height: `${height}px` }}
                                    />
                                    {/* Overlay with creator info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="font-semibold text-sm mb-1">{creatorProfile.fullName}</h3>
                                        <p className="text-xs opacity-90">{creatorProfile.discipline}</p>
                                      </div>
                                    </div>
                                  </div>
                                 
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                  {isLoadingMore && <MasonryLoadingMoreSkeleton />}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Filters
