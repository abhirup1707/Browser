import React, { useState } from 'react';
import {
  Armchair,
  X,
  ChevronLeft,
  ChevronRight,
  Rotate3d,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Check,
  Users
} from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { getSeatRating } from '../utils/seatCoordinates';

export const SeatControlsOverlay: React.FC = () => {
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const selectedSeatIds = useBookingStore((s) => s.selectedSeatIds);
  const viewMode = useBookingStore((s) => s.viewMode);
  const is360Active = useBookingStore((s) => s.is360Active);
  const activeThumbnailIndex = useBookingStore((s) => s.activeThumbnailIndex);
  const isVideoMuted = useBookingStore((s) => s.isVideoMuted);
  const isVideoPlaying = useBookingStore((s) => s.isVideoPlaying);
  const audienceDensity = useBookingStore((s) => s.audienceDensity);
  const isAudienceVisible = useBookingStore((s) => s.isAudienceVisible);
  const seats = useBookingStore((s) => s.seats);

  const setViewMode = useBookingStore((s) => s.setViewMode);
  const toggle360 = useBookingStore((s) => s.toggle360);
  const setActiveThumbnailIndex = useBookingStore((s) => s.setActiveThumbnailIndex);
  const setCurrentView = useBookingStore((s) => s.setCurrentView);
  const toggleVideoMute = useBookingStore((s) => s.toggleVideoMute);
  const toggleVideoPlay = useBookingStore((s) => s.toggleVideoPlay);
  const addSeatToBooking = useBookingStore((s) => s.addSeatToBooking);
  const removeSeatFromBooking = useBookingStore((s) => s.removeSeatFromBooking);
  const setAudienceDensity = useBookingStore((s) => s.setAudienceDensity);
  const toggleAudienceVisibility = useBookingStore((s) => s.toggleAudienceVisibility);

  const [isCrowdMenuOpen, setIsCrowdMenuOpen] = useState(false);

  const isSelected = selectedSeatIds.includes(activeViewingSeatId);
  const seatRating = getSeatRating(activeViewingSeatId || 'H17');
  const bookedSeatsCount = seats.filter((s) => s.status === 'booked').length;

  const angles = [
    {
      id: 'seat-view',
      title: 'Seat View',
      thumb: '/thumb-seat.jpg',
      fallback: '/ramayana-screen.jpg',
      mode: 'seat' as const
    },
    {
      id: 'theatre-overview',
      title: 'Auditorium',
      thumb: '/thumb-wide.jpg',
      fallback: '/reference_layout.png',
      mode: 'theatre' as const
    },
    {
      id: 'side-angle',
      title: 'Angled View',
      thumb: '/thumb-side.jpg',
      fallback: '/reference_layout.png',
      mode: 'side' as const
    }
  ];

  const handlePrevThumb = () => {
    const nextIdx = (activeThumbnailIndex - 1 + angles.length) % angles.length;
    setActiveThumbnailIndex(nextIdx);
  };

  const handleNextThumb = () => {
    const nextIdx = (activeThumbnailIndex + 1) % angles.length;
    setActiveThumbnailIndex(nextIdx);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 z-10">
      {/* TOP ROW: Video Controls (Left), Seat View Status Pill + Direct Select (Center), Close Button (Right) */}
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left: Video Sound & Play Controls */}
        <div className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2">
          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleVideoMute}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full flex items-center space-x-1 sm:space-x-1.5 text-[10px] sm:text-xs font-semibold backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
              isVideoMuted
                ? 'bg-red-600/30 border-red-500/40 text-red-200 hover:bg-red-600/40'
                : 'bg-emerald-600/80 border-emerald-400 text-white shadow-emerald-950/50'
            }`}
            title={isVideoMuted ? 'Click to Unmute Movie Audio' : 'Mute Audio'}
          >
            {isVideoMuted ? (
              <>
                <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-300" />
                <span className="hidden xs:inline">Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                <span className="hidden xs:inline">Dolby Audio</span>
              </>
            )}
          </button>

          {/* Video Play/Pause */}
          <button
            onClick={toggleVideoPlay}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#11131a]/80 hover:bg-[#1f232e] text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-md"
            title={isVideoPlaying ? 'Pause Trailer' : 'Play Trailer'}
          >
            {isVideoPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>

          {/* AUDIENCE DENSITY SIMULATOR BUTTON & POPOVER */}
          <div className="relative">
            <button
              onClick={() => setIsCrowdMenuOpen((prev) => !prev)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
                isAudienceVisible && audienceDensity > 0
                  ? 'bg-purple-900/60 border-purple-400/60 text-purple-200 hover:bg-purple-900/80 shadow-purple-950/40'
                  : 'bg-[#11131a]/80 hover:bg-[#1f232e] border-white/10 text-zinc-300'
              }`}
              title="Audience Density Simulator: View 3D crowd in booked seats"
            >
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
              <span className="hidden xs:inline">
                {isAudienceVisible ? `Crowd: ${audienceDensity}%` : 'Crowd: Off'}
              </span>
              <span className="xs:hidden font-bold">{audienceDensity}%</span>
            </button>

            {/* Glassmorphism Simulator Menu */}
            {isCrowdMenuOpen && (
              <div className="absolute top-11 left-0 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 text-white space-y-3 pointer-events-auto">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs tracking-wide">Audience Simulator</span>
                  </div>
                  <button
                    onClick={() => setIsCrowdMenuOpen(false)}
                    className="text-zinc-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl text-xs">
                  <span className="text-zinc-300 font-medium">3D Viewers in Seats</span>
                  <button
                    onClick={toggleAudienceVisibility}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isAudienceVisible
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {isAudienceVisible ? 'Visible ✓' : 'Hidden ✕'}
                  </button>
                </div>

                {/* Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Audience Occupancy</span>
                    <span className="font-bold text-purple-300">
                      {audienceDensity}% ({bookedSeatsCount} Booked)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={audienceDensity}
                    onChange={(e) => setAudienceDensity(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
                  />
                </div>

                {/* Presets */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[
                    { label: 'Empty', pct: 0 },
                    { label: 'Matinee', pct: 25 },
                    { label: 'Evening', pct: 55 },
                    { label: 'Housefull', pct: 85 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setAudienceDensity(preset.pct)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border ${
                        audienceDensity === preset.pct
                          ? 'bg-purple-600 border-purple-400 text-white font-bold shadow-md shadow-purple-950'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-[9px] opacity-75">{preset.pct}%</div>
                    </button>
                  ))}
                </div>

                <p className="text-[9px] text-zinc-400 leading-relaxed italic border-t border-white/5 pt-2">
                  💡 Real 3D people sit in booked seats to preview authentic sightline clearance and view obstruction from your seat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center Pill: "Seat F10 — View from your seat" + Interactive Direct Select Option */}
        <div className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#11131a]/90 backdrop-blur-md border border-white/15 shadow-2xl text-white">
          <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 shrink-0" />
          <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs">
            <span>
              Seat <strong className="font-bold text-white">{activeViewingSeatId}</strong>
            </span>
            <span className="hidden sm:inline text-zinc-400">—</span>
            <span className="hidden sm:inline text-zinc-300">
              {viewMode === 'seat' ? 'View from seat' : 'Auditorium'}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
              {seatRating.score}%
            </span>
          </div>

          {/* Direct "Select this Seat" Button right inside 3D overlay! */}
          {viewMode === 'seat' && (
            isSelected ? (
              <button
                onClick={() => removeSeatFromBooking(activeViewingSeatId)}
                className="ml-1 sm:ml-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-600/30 hover:bg-red-600/40 text-emerald-300 hover:text-red-200 border border-emerald-400/50 font-semibold text-[9px] sm:text-[10px] flex items-center space-x-1 transition-all cursor-pointer"
                title="Seat is selected. Click to remove from billing."
              >
                <Check className="w-3 h-3" />
                <span className="hidden xs:inline">Selected</span>
              </button>
            ) : (
              <button
                onClick={() => addSeatToBooking(activeViewingSeatId)}
                className="ml-1 sm:ml-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#e50914] hover:bg-[#ff2430] text-white font-bold text-[9px] sm:text-[10px] flex items-center space-x-1 shadow-md shadow-red-950/60 transition-all cursor-pointer"
                title="Select this seat for billing"
              >
                <Plus className="w-3 h-3" />
                <span>Select Seat</span>
              </button>
            )
          )}
        </div>

        {/* Top Right Close Button (X) */}
        <button
          onClick={() => setCurrentView('catalog')}
          className="pointer-events-auto w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#11131a]/80 hover:bg-[#1f232e] text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-lg shrink-0"
          title="Exit to Movies Catalog"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* RIGHT SIDE FLOATING CONTROLS */}
      <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 sm:space-y-3 pointer-events-auto">
        {/* 1. Circular "360°" Look Around Button */}
        <button
          onClick={toggle360}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-md border shadow-2xl ${
            is360Active
              ? 'bg-red-600/90 border-red-400 text-white shadow-red-900/50 scale-105'
              : 'bg-[#12151c]/80 hover:bg-[#1c202a] border-white/15 text-zinc-200 hover:text-white'
          }`}
          title="Toggle 360° Look Around (Drag mouse or touch to explore auditorium)"
        >
          <span className="text-[10px] sm:text-[11px] font-bold tracking-tighter leading-none">
            360°
          </span>
          <Rotate3d className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 opacity-80" />
        </button>

        {/* 2. Oval "Theatre View" / "View From My Seat" Toggle Button */}
        <button
          onClick={() => {
            if (viewMode === 'theatre') {
              setViewMode('seat');
            } else {
              setViewMode('theatre');
            }
          }}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer backdrop-blur-md border shadow-2xl text-center min-w-[64px] sm:min-w-[76px] ${
            viewMode === 'theatre'
              ? 'bg-red-600/90 border-red-400 text-white shadow-red-900/50'
              : 'bg-[#12151c]/80 hover:bg-[#1c202a] border-white/15 text-zinc-200 hover:text-white'
          }`}
          title="Toggle between Auditorium Overview and Seat View"
        >
          <Armchair className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
          <span className="text-[9px] sm:text-[10px] font-medium leading-tight">
            {viewMode === 'theatre' ? 'Seat View' : 'Theatre View'}
          </span>
        </button>

        {/* 3. Quick Audience Crowd Toggle Button */}
        <button
          onClick={toggleAudienceVisibility}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer backdrop-blur-md border shadow-2xl text-center min-w-[64px] sm:min-w-[76px] ${
            isAudienceVisible && audienceDensity > 0
              ? 'bg-purple-900/80 border-purple-400 text-purple-200 shadow-purple-950/50'
              : 'bg-[#12151c]/80 hover:bg-[#1c202a] border-white/15 text-zinc-400'
          }`}
          title="Toggle 3D Audience Viewers"
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 text-purple-300" />
          <span className="text-[9px] sm:text-[10px] font-medium leading-tight">
            {isAudienceVisible ? `Crowd ${audienceDensity}%` : 'Crowd Off'}
          </span>
        </button>
      </div>

      {/* BOTTOM CENTER CAROUSEL / ANGLE SWITCHER */}
      <div className="w-full flex items-center justify-center space-x-2 sm:space-x-3 pointer-events-auto pb-1">
        <button
          onClick={handlePrevThumb}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#11131a]/85 hover:bg-[#1e2330] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-md"
          title="Previous view angle"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {angles.map((ang, idx) => {
            const isActive = activeThumbnailIndex === idx;

            return (
              <button
                key={ang.id}
                onClick={() => setActiveThumbnailIndex(idx)}
                className={`relative w-[68px] sm:w-[84px] h-[38px] sm:h-[48px] rounded-md overflow-hidden transition-all duration-200 cursor-pointer bg-zinc-900 ${
                  isActive
                    ? 'ring-2 ring-[#e50914] shadow-lg shadow-red-950/60 scale-105'
                    : 'opacity-65 hover:opacity-100 ring-1 ring-white/15'
                }`}
                title={ang.title}
              >
                <img
                  src={ang.thumb}
                  alt={ang.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ang.fallback;
                  }}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextThumb}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#11131a]/85 hover:bg-[#1e2330] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-md"
          title="Next view angle"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
