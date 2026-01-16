
import React from 'react';
import { PhotoboothSettings } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onGallery: () => void;
  onAdmin: () => void;
  settings: PhotoboothSettings;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onGallery, onAdmin, settings }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen relative p-6 md:p-10 text-center">
      <button 
        onClick={onAdmin} 
        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors uppercase text-[10px] md:text-sm tracking-widest z-50"
      >
        Admin
      </button>

      <div className="mb-12 md:mb-16 animate-pulse px-4">
        <h1 className="text-4xl md:text-7xl font-heading font-black neon-text text-white tracking-tighter italic leading-tight mb-4">
          {settings.eventName}
        </h1>
        <h2 className="text-sm md:text-xl tracking-[0.3em] md:tracking-[0.5em] text-purple-400 font-bold uppercase">
          {settings.eventDescription}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-md md:max-w-none justify-center">
        <button 
          onClick={onStart}
          className="group relative px-8 md:px-12 py-5 md:py-6 bg-purple-600 hover:bg-purple-500 transition-all rounded-none font-heading text-lg md:text-2xl tracking-widest neon-border overflow-hidden"
        >
          <span className="relative z-10">MULAI SEKARANG</span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
        </button>

        <button 
          onClick={onGallery}
          className="group relative px-8 md:px-12 py-5 md:py-6 border-2 border-white/20 hover:border-white transition-all rounded-none font-heading text-lg md:text-2xl tracking-widest overflow-hidden"
        >
          <span className="relative z-10">GALLERY</span>
        </button>
      </div>

      <div className="mt-16 md:absolute md:bottom-10 text-[8px] md:text-xs text-gray-500 tracking-widest uppercase opacity-50 px-4">
        AI POWERED - CORO.AI 2025 AI GENERATIVE
      </div>
    </div>
  );
};

export default LandingPage;