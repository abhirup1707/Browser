import React from 'react';
import { Columns, Eye, Armchair } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SeatMap2D } from '../components/SeatMap2D';
import { CinemaCanvas } from '../components/Cinema3D/CinemaCanvas';
import { SeatControlsOverlay } from '../components/SeatControlsOverlay';
import { BookingModal } from '../components/BookingModal';
import { TicketConfirmationModal } from '../components/TicketConfirmationModal';
import { useBookingStore } from '../store/bookingStore';

export const CinemaExperience: React.FC = () => {
  const mobileViewMode = useBookingStore((s) => s.mobileViewMode);
  const setMobileViewMode = useBookingStore((s) => s.setMobileViewMode);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0c0d12]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Experience Layout: Responsive Flex */}
      <div className="relative flex-1 w-full h-[calc(100vh-56px)] overflow-hidden">
        {/* DESKTOP LAYOUT (Screen >= 1024px) */}
        <div className="hidden lg:flex w-full h-full">
          {/* Left Sidebar (420px Fixed Width) */}
          <div className="w-[420px] min-w-[420px] max-w-[420px] h-full shrink-0 overflow-y-auto">
            <SeatMap2D />
          </div>

          {/* Right 3D Viewport */}
          <div className="flex-1 h-full relative overflow-hidden bg-[#050608]">
            <CinemaCanvas />
            <SeatControlsOverlay />
          </div>
        </div>

        {/* MOBILE / TABLET LAYOUT (Screen < 1024px) */}
        <div className="flex lg:hidden flex-col w-full h-full relative">
          {/* 1. Split View Mode */}
          {mobileViewMode === 'split' && (
            <>
              {/* Top: 3D Cinema Canvas (42% height) */}
              <div className="w-full h-[42%] min-h-[220px] relative overflow-hidden bg-[#050608] border-b border-[#1b1e28]">
                <CinemaCanvas />
                <SeatControlsOverlay />
              </div>

              {/* Bottom: 2D Seating Matrix (58% height) */}
              <div className="w-full h-[58%] overflow-y-auto bg-[#0d0f14] pb-14">
                <SeatMap2D />
              </div>
            </>
          )}

          {/* 2. Fullscreen 3D View Mode */}
          {mobileViewMode === '3d' && (
            <div className="w-full h-full relative overflow-hidden bg-[#050608]">
              <CinemaCanvas />
              <SeatControlsOverlay />
            </div>
          )}

          {/* 3. Fullscreen Seating Chart Mode */}
          {mobileViewMode === 'seats' && (
            <div className="w-full h-full overflow-y-auto bg-[#0d0f14] pb-14">
              <SeatMap2D />
            </div>
          )}

          {/* Floating Mobile Switcher Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center p-1 bg-[#12151f]/95 backdrop-blur-lg rounded-full border border-white/15 shadow-2xl">
            <button
              onClick={() => setMobileViewMode('split')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                mobileViewMode === 'split'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setMobileViewMode('3d')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                mobileViewMode === '3d'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D View</span>
            </button>
            <button
              onClick={() => setMobileViewMode('seats')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                mobileViewMode === 'seats'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Armchair className="w-3.5 h-3.5" />
              <span>Seats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout and Confirmation Modals */}
      <BookingModal />
      <TicketConfirmationModal />
    </div>
  );
};
