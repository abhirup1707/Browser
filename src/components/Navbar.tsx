import React from 'react';
import { Search, User } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';

export const Navbar: React.FC = () => {
  const currentView = useBookingStore((s) => s.currentView);
  const setCurrentView = useBookingStore((s) => s.setCurrentView);
  const setIsSearchOpen = useBookingStore((s) => s.setIsSearchOpen);

  return (
    <header className="w-full h-14 bg-[#0c0d11] border-b border-[#1b1e26] px-3 sm:px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand Logo & Nav Links */}
      <div className="flex items-center space-x-3 sm:space-x-8">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('experience')}
          className="flex items-center space-x-1 text-left focus:outline-none group cursor-pointer"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#ef3038] group-hover:brightness-110 transition-all font-sans">
            CineBook
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setCurrentView('catalog')}
            className={`cursor-pointer transition-colors ${
              currentView === 'catalog'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setCurrentView('theatres')}
            className={`cursor-pointer transition-colors ${
              currentView === 'theatres'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Theatres
          </button>
          <button
            onClick={() => setCurrentView('offers')}
            className={`cursor-pointer transition-colors ${
              currentView === 'offers'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Offers
          </button>
        </nav>
      </div>

      {/* Right Controls: Search & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#181a22] hover:bg-[#222530] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
          title="Search movies and theatres"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setCurrentView('catalog')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#202430] hover:bg-[#2a3040] text-zinc-200 flex items-center justify-center transition-all cursor-pointer border border-white/10"
          title="User Account"
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
};
