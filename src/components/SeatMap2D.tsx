import React from 'react';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Plus,
  Check,
  Film
} from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import {
  CINEMA_SEAT_CONFIG,
  BEST_SWEET_SPOT_SEATS,
  getSeatRating,
  getTierPrice
} from '../utils/seatCoordinates';
import type { MovieFormat } from '../types/cinema';

export const SeatMap2D: React.FC = () => {
  const selectedMovie = useBookingStore((s) => s.selectedMovie);
  const selectedTheatre = useBookingStore((s) => s.selectedTheatre);
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const selectedTime = useBookingStore((s) => s.selectedTime);
  const seats = useBookingStore((s) => s.seats);
  const selectedSeatIds = useBookingStore((s) => s.selectedSeatIds);
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const interactionMode = useBookingStore((s) => s.interactionMode);
  const bestSeatsFilter = useBookingStore((s) => s.bestSeatsFilter);
  const selectedFormat = useBookingStore((s) => s.selectedFormat);

  const toggleSeat = useBookingStore((s) => s.toggleSeat);
  const setActiveViewingSeat = useBookingStore((s) => s.setActiveViewingSeat);
  const setBookingModalOpen = useBookingStore((s) => s.setBookingModalOpen);
  const getTotalPrice = useBookingStore((s) => s.getTotalPrice);
  const setInteractionMode = useBookingStore((s) => s.setInteractionMode);
  const setBestSeatsFilter = useBookingStore((s) => s.setBestSeatsFilter);
  const setSelectedFormat = useBookingStore((s) => s.setSelectedFormat);
  const addSeatToBooking = useBookingStore((s) => s.addSeatToBooking);
  const removeSeatFromBooking = useBookingStore((s) => s.removeSeatFromBooking);
  const selectBestSweetSpotSeat = useBookingStore((s) => s.selectBestSweetSpotSeat);

  const totalPrice = getTotalPrice();
  const currentSeatRating = getSeatRating(activeViewingSeatId || 'H17');
  const isViewingSeatSelected = selectedSeatIds.includes(activeViewingSeatId);

  // Dynamic Tier Pricing according to Format (2D, 3D, IMAX)
  const balconyPrice = getTierPrice('recliner', selectedFormat);
  const premiumPrice = getTierPrice('premium', selectedFormat);
  const dressCirclePrice = getTierPrice('standard', selectedFormat);

  // Three authentic tiers: Balcony (Top), Premium (Middle), Dress Circle (Bottom)
  const balconyRows = CINEMA_SEAT_CONFIG.filter((r) => r.section === 'Balcony');
  const premiumRows = CINEMA_SEAT_CONFIG.filter((r) => r.section === 'Premium');
  const dressCircleRows = CINEMA_SEAT_CONFIG.filter((r) => r.section === 'Dress Circle');

  const handleSeatClick = (seatId: string) => {
    if (interactionMode === 'preview') {
      setActiveViewingSeat(seatId);
    } else {
      toggleSeat(seatId);
      setActiveViewingSeat(seatId);
    }
  };

  const renderRow = (rowConfig: (typeof CINEMA_SEAT_CONFIG)[number]) => {
    const { row, leftSeats, rightSeats, tier } = rowConfig;
    const dynamicPrice = getTierPrice(tier, selectedFormat);

    return (
      <div key={row} className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Row Letter */}
        <span className="w-3 text-zinc-500 font-bold text-center text-[10px]">
          {row}
        </span>

        {/* Left Block Seats */}
        <div className="flex-1 flex justify-end space-x-0.5 sm:space-x-1">
          {leftSeats.map((seatNum) => {
            const seatId = `${row}${seatNum}`;
            const seat = seats.find((s) => s.id === seatId);
            const isSelected = selectedSeatIds.includes(seatId);
            const isViewing = activeViewingSeatId === seatId;
            const isBooked = seat?.status === 'booked';
            const isSweetSpot = BEST_SWEET_SPOT_SEATS.has(seatId);
            const shouldHighlightSweetSpot =
              bestSeatsFilter === 'sweetspot' && isSweetSpot && !isBooked;

            let style =
              'border border-emerald-500/70 bg-[#0c1511] text-emerald-400 hover:border-emerald-300';

            if (isSelected) {
              style =
                'bg-[#e50914] border border-[#ff3b47] text-white font-bold shadow-md shadow-red-600/50 scale-105 z-10';
            } else if (isViewing) {
              style =
                'bg-blue-600 border-2 border-cyan-300 text-white font-bold ring-2 ring-cyan-400/60 scale-110 z-10 animate-pulse';
            } else if (shouldHighlightSweetSpot) {
              style =
                'border-2 border-amber-400 bg-amber-500/25 text-amber-300 font-bold ring-1 ring-amber-400/80 shadow-sm shadow-amber-950';
            } else if (isBooked) {
              style =
                'bg-amber-500/85 border border-amber-400/90 text-zinc-950 font-bold cursor-not-allowed opacity-60';
            }

            return (
              <button
                key={seatId}
                type="button"
                disabled={isBooked}
                onClick={() => handleSeatClick(seatId)}
                title={`Seat ${seatId} (${rowConfig.section} · ${selectedFormat} - ₹${dynamicPrice}) ${
                  isSweetSpot ? '⭐ Optimal Sweet Spot' : ''
                }`}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] text-[7px] sm:text-[8px] flex items-center justify-center transition-all cursor-pointer ${style}`}
              >
                {seatNum}
              </button>
            );
          })}
        </div>

        {/* CENTRAL WALKING AISLE (Visual Gap) */}
        <div className="w-2.5 sm:w-3 flex items-center justify-center">
          <div className="w-px h-3 bg-zinc-800" />
        </div>

        {/* Right Block Seats */}
        <div className="flex-1 flex justify-start space-x-0.5 sm:space-x-1">
          {rightSeats.map((seatNum) => {
            const seatId = `${row}${seatNum}`;
            const seat = seats.find((s) => s.id === seatId);
            const isSelected = selectedSeatIds.includes(seatId);
            const isViewing = activeViewingSeatId === seatId;
            const isBooked = seat?.status === 'booked';
            const isSweetSpot = BEST_SWEET_SPOT_SEATS.has(seatId);
            const shouldHighlightSweetSpot =
              bestSeatsFilter === 'sweetspot' && isSweetSpot && !isBooked;

            let style =
              'border border-emerald-500/70 bg-[#0c1511] text-emerald-400 hover:border-emerald-300';

            if (isSelected) {
              style =
                'bg-[#e50914] border border-[#ff3b47] text-white font-bold shadow-md shadow-red-600/50 scale-105 z-10';
            } else if (isViewing) {
              style =
                'bg-blue-600 border-2 border-cyan-300 text-white font-bold ring-2 ring-cyan-400/60 scale-110 z-10 animate-pulse';
            } else if (shouldHighlightSweetSpot) {
              style =
                'border-2 border-amber-400 bg-amber-500/25 text-amber-300 font-bold ring-1 ring-amber-400/80 shadow-sm shadow-amber-950';
            } else if (isBooked) {
              style =
                'bg-amber-500/85 border border-amber-400/90 text-zinc-950 font-bold cursor-not-allowed opacity-60';
            }

            return (
              <button
                key={seatId}
                type="button"
                disabled={isBooked}
                onClick={() => handleSeatClick(seatId)}
                title={`Seat ${seatId} (${rowConfig.section} · ${selectedFormat} - ₹${dynamicPrice}) ${
                  isSweetSpot ? '⭐ Optimal Sweet Spot' : ''
                }`}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] text-[7px] sm:text-[8px] flex items-center justify-center transition-all cursor-pointer ${style}`}
              >
                {seatNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#0d0f14] border-r border-[#1a1d25] flex flex-col justify-between p-3 sm:p-4 select-none overflow-y-auto">
      {/* TOP SECTION: Movie Information & Controls */}
      <div className="space-y-2.5">
        {/* Movie Info Header */}
        <div className="flex items-start space-x-3">
          {/* Movie Poster Thumbnail */}
          <div className="w-12 h-16 sm:w-13 sm:h-19 rounded-md overflow-hidden bg-zinc-800 shadow-md shrink-0 border border-white/10">
            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/reference_layout.png';
              }}
            />
          </div>

          {/* Title & Generic Mall Information */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xs sm:text-sm tracking-tight truncate leading-tight">
              {selectedMovie.title}
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-[#1a1d26] text-zinc-300 border border-white/10">
                {selectedMovie.certificate}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-[#1a1d26] text-zinc-300 border border-white/10">
                {selectedMovie.language}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                {selectedFormat} Screen
              </span>
            </div>

            {/* Anonymized Generic Mall Location */}
            <div className="flex items-center space-x-1 text-zinc-400 text-[10px] sm:text-[11px] mt-1 truncate">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="truncate font-medium text-zinc-300">{selectedTheatre.name}</span>
            </div>
            <div className="flex items-center space-x-1 text-zinc-400 text-[10px] sm:text-[11px] mt-0.5">
              <Calendar className="w-3 h-3 text-zinc-500 shrink-0" />
              <span>{selectedDate} · {selectedTime}</span>
            </div>
          </div>
        </div>

        {/* 1. DYNAMIC FORMAT SELECTOR (2D, 3D, IMAX) */}
        <div className="p-1.5 bg-[#12151f] rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 px-1 mb-1">
            <span className="flex items-center space-x-1">
              <Film className="w-3 h-3 text-cyan-400" />
              <span>Format & Screen Size:</span>
            </span>
            <span className="text-cyan-400 text-[9px]">Adjusts 3D Dimension</span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {(['2D', '3D', 'IMAX'] as MovieFormat[]).map((fmt) => {
              const isActive = selectedFormat === fmt;
              const startPrice = getTierPrice('standard', fmt);

              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-950/60 scale-[1.02]'
                      : 'bg-[#181c28] hover:bg-[#202535] text-zinc-300 hover:text-white border border-white/5'
                  }`}
                >
                  <div className="text-[11px] font-extrabold tracking-tight leading-tight">
                    {fmt}
                  </div>
                  <div className="text-[8px] opacity-80 mt-0.5">
                    From ₹{startPrice}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. INTERACTION MODE SWITCH: View & Explore vs Select for Billing */}
        <div className="flex items-center p-1 bg-[#131620] rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setInteractionMode('preview')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              interactionMode === 'preview'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px]">View & Explore</span>
          </button>
          <button
            onClick={() => setInteractionMode('select')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              interactionMode === 'select'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Select & Bill</span>
          </button>
        </div>

        {/* 3. BEST SEATS / SWEET SPOT FILTER BAR */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-0.5 text-[10px] scrollbar-none">
          <button
            onClick={() => setBestSeatsFilter('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer border ${
              bestSeatsFilter === 'all'
                ? 'bg-white/10 border-white/20 text-white font-bold'
                : 'bg-transparent border-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Seats
          </button>
          <button
            onClick={() => {
              setBestSeatsFilter('sweetspot');
              selectBestSweetSpotSeat();
            }}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-semibold flex items-center space-x-1 transition-all cursor-pointer border ${
              bestSeatsFilter === 'sweetspot'
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm shadow-amber-950/50'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>⭐ Best Sweet Spots</span>
          </button>
          <button
            onClick={() => setBestSeatsFilter('balcony')}
            className={`px-2 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer border ${
              bestSeatsFilter === 'balcony'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                : 'bg-transparent border-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Balcony VIP
          </button>
          <button
            onClick={() => setBestSeatsFilter('premium')}
            className={`px-2 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer border ${
              bestSeatsFilter === 'premium'
                ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                : 'bg-transparent border-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Prime Rows
          </button>
        </div>

        {/* 4. ACTIVE VIEWING SEAT BANNER */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#151824] to-[#10131c] border border-white/10 flex items-center justify-between text-xs shadow-md">
          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-xs sm:text-sm">
                Seat {activeViewingSeatId}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300 truncate">
                {currentSeatRating.badge} · {currentSeatRating.score}%
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 truncate max-w-[200px]">
              {currentSeatRating.description}
            </p>
          </div>

          {/* Quick Select / Deselect for Billing */}
          {isViewingSeatSelected ? (
            <button
              onClick={() => removeSeatFromBooking(activeViewingSeatId)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 hover:bg-red-600/30 hover:border-red-500/50 hover:text-red-300 font-semibold text-[10px] sm:text-[11px] flex items-center space-x-1 transition-all cursor-pointer shrink-0"
              title="Click to remove from billing"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Selected ✓</span>
            </button>
          ) : (
            <button
              onClick={() => addSeatToBooking(activeViewingSeatId)}
              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-[10px] sm:text-[11px] flex items-center space-x-1 shadow-md shadow-red-950/50 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Seat</span>
            </button>
          )}
        </div>

        {/* Legend Row */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded border border-emerald-500 bg-[#0e1713]" />
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-blue-600 ring-1 ring-cyan-300" />
            <span>Viewing</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-[#e50914] shadow-sm shadow-red-900/50" />
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400" />
            <span>Sweet Spot</span>
          </div>
        </div>

        {/* 2D SEATING CHART (Balcony at Top -> Premium in Middle -> Dress Circle at Bottom) */}
        <div className="space-y-1 pt-1 text-[9px] overflow-x-auto pb-1">
          {/* SECTION 1: BALCONY (Top Side, Rows L, K, J) */}
          <div className="space-y-0.5">
            <div className="pb-0.5 flex items-center space-x-2">
              <div className="flex-1 h-px bg-zinc-800/80" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-purple-400">
                ₹{balconyPrice} Balcony (Recliner · {selectedFormat})
              </span>
              <div className="flex-1 h-px bg-zinc-800/80" />
            </div>
            {[...balconyRows].reverse().map(renderRow)}
          </div>

          {/* SECTION 2: PREMIUM (Middle Section, Rows I, H, G, F, E) */}
          <div className="space-y-0.5 pt-1">
            <div className="py-0.5 flex items-center space-x-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-400">
                ₹{premiumPrice} Premium (Prime View · {selectedFormat})
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            {[...premiumRows].reverse().map(renderRow)}
          </div>

          {/* SECTION 3: DRESS CIRCLE (Bottom Section, Rows D, C, B, A) */}
          <div className="space-y-0.5 pt-1">
            <div className="py-0.5 flex items-center space-x-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-zinc-400">
                ₹{dressCirclePrice} Dress Circle (Front · {selectedFormat})
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            {[...dressCircleRows].reverse().map(renderRow)}
          </div>
        </div>

        {/* FLIPPED TO THE BOTTOM: Curved Screen Indicator right below Row A */}
        <div className="relative pt-1 pb-0.5 text-center">
          <svg className="w-full h-4 sm:h-5" viewBox="0 0 320 20" fill="none">
            <path
              d="M 15 4 Q 160 18 305 4"
              stroke="url(#screenGradBottom)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="screenGradBottom" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#374151" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#374151" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-cyan-400 font-semibold block mt-0.5">
            All eyes this way ({selectedFormat} Curved Screen)
          </span>
        </div>
      </div>

      {/* BOTTOM SECTION: Seat & Price Summary + Proceed Button */}
      <div className="pt-2 sm:pt-3 border-t border-[#1a1d25] space-y-2 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {selectedSeatIds.length > 0
                ? selectedSeatIds.join(', ')
                : `Previewing ${activeViewingSeatId}`}
            </div>
            <div className="text-[10px] text-zinc-400">
              {selectedSeatIds.length > 0
                ? `${selectedSeatIds.length} Seat${selectedSeatIds.length > 1 ? 's' : ''} in ${selectedFormat}`
                : 'Tap "Select Seat" to add to billing'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              ₹{totalPrice}
            </div>
            <div className="text-[10px] text-zinc-400">{selectedFormat} Total Price</div>
          </div>
        </div>

        {/* PROCEED TO PAY BUTTON */}
        <button
          onClick={() => {
            if (selectedSeatIds.length === 0 && activeViewingSeatId) {
              addSeatToBooking(activeViewingSeatId);
            }
            setBookingModalOpen(true);
          }}
          className="w-full py-2.5 px-4 bg-[#e50914] hover:bg-[#f0202c] active:bg-[#c90812] text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-900/30 cursor-pointer group"
        >
          <span>
            {selectedSeatIds.length > 0
              ? `Proceed to Pay (₹${totalPrice})`
              : `Select ${activeViewingSeatId} & Proceed`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
