import { create } from 'zustand';
import type {
  Movie,
  Theatre,
  SeatInfo,
  BookingDetails,
  ViewAngleMode,
  MovieFormat,
  SortOption,
  EventCategory
} from '../types/cinema';
import { MOVIES, THEATRES } from '../data/movies';
import { generateInitialSeats, getTierPrice } from '../utils/seatCoordinates';

export type InteractionMode = 'preview' | 'select';
export type BestSeatsFilter = 'all' | 'sweetspot' | 'balcony' | 'premium';
export type MobileViewMode = 'split' | '3d' | 'seats';

interface BookingStoreState {
  currentView: 'experience' | 'catalog' | 'theatres' | 'offers';
  selectedMovie: Movie;
  selectedTheatre: Theatre;
  selectedDate: string;
  selectedTime: string;
  seats: SeatInfo[];
  selectedSeatIds: string[];
  activeViewingSeatId: string;
  viewMode: ViewAngleMode;
  is360Active: boolean;
  activeThumbnailIndex: number;
  isBookingModalOpen: boolean;
  confirmedBooking: BookingDetails | null;
  searchQuery: string;
  isSearchOpen: boolean;

  // Formats (2D, 3D, IMAX) & Pricing
  selectedFormat: MovieFormat;
  setSelectedFormat: (format: MovieFormat) => void;

  // Sorting & Filtering for Events and Movies
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  eventCategory: EventCategory;
  setEventCategory: (cat: EventCategory) => void;

  // View and Select Mode: Explore seats without billing vs Direct Select
  interactionMode: InteractionMode;
  bestSeatsFilter: BestSeatsFilter;

  // Mobile layout state
  mobileViewMode: MobileViewMode;

  // Video playback controls
  isVideoMuted: boolean;
  isVideoPlaying: boolean;

  // Actions
  setCurrentView: (view: 'experience' | 'catalog' | 'theatres' | 'offers') => void;
  setSelectedMovie: (movie: Movie) => void;
  setSelectedTheatre: (theatre: Theatre) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  toggleSeat: (seatId: string) => void;
  setActiveViewingSeat: (seatId: string) => void;
  setViewMode: (mode: ViewAngleMode) => void;
  toggle360: () => void;
  setActiveThumbnailIndex: (index: number) => void;
  setBookingModalOpen: (open: boolean) => void;
  completeBooking: () => void;
  resetBooking: () => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  toggleVideoMute: () => void;
  toggleVideoPlay: () => void;
  getTotalPrice: () => number;

  // Actions for View & Select + Best Seats
  setInteractionMode: (mode: InteractionMode) => void;
  setBestSeatsFilter: (filter: BestSeatsFilter) => void;
  setMobileViewMode: (mode: MobileViewMode) => void;
  toggleSeatSelection: (seatId: string) => void;
  addSeatToBooking: (seatId: string) => void;
  removeSeatFromBooking: (seatId: string) => void;
  selectBestSweetSpotSeat: () => void;
}

export const useBookingStore = create<BookingStoreState>((set, get) => {
  const initialSeats = generateInitialSeats();

  return {
    currentView: 'experience',
    selectedMovie: MOVIES[0],
    selectedTheatre: THEATRES[0], // Mall A (Central IMAX Arena)
    selectedDate: 'Fri, 17 Jul',
    selectedTime: '7:30 PM',
    seats: initialSeats,
    selectedSeatIds: [], // 0 seats initially so user explores freely without billing!
    activeViewingSeatId: 'H17',
    viewMode: 'seat',
    is360Active: false,
    activeThumbnailIndex: 0,
    isBookingModalOpen: false,
    confirmedBooking: null,
    searchQuery: '',
    isSearchOpen: false,

    // Formats & Dynamic Pricing
    selectedFormat: 'IMAX',
    sortOption: 'featured',
    eventCategory: 'all',

    interactionMode: 'preview', // Default to preview mode: explore any seat view without billing!
    bestSeatsFilter: 'all',
    mobileViewMode: 'split',

    isVideoMuted: true, // Starts muted for browser autoplay policies
    isVideoPlaying: true,

    setCurrentView: (view) => set({ currentView: view }),

    setSelectedMovie: (movie) => {
      // Pick best matching format for the movie
      const hasIMAX = movie.formats.some((f) => f.includes('IMAX'));
      const format: MovieFormat = hasIMAX ? 'IMAX' : movie.formats.includes('3D') ? '3D' : '2D';
      
      const nextSeats = get().seats.map((s) => ({
        ...s,
        price: getTierPrice(s.tier, format)
      }));

      set({
        selectedMovie: movie,
        selectedFormat: format,
        seats: nextSeats,
        currentView: 'experience'
      });
    },

    setSelectedTheatre: (theatre) => set({ selectedTheatre: theatre }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedTime: (time) => set({ selectedTime: time }),

    setSelectedFormat: (format: MovieFormat) => {
      const nextSeats = get().seats.map((s) => ({
        ...s,
        price: getTierPrice(s.tier, format)
      }));
      set({ selectedFormat: format, seats: nextSeats });
    },

    setSortOption: (sort) => set({ sortOption: sort }),
    setEventCategory: (cat) => set({ eventCategory: cat }),

    toggleSeat: (seatId: string) => {
      const { seats, selectedSeatIds } = get();
      const targetSeat = seats.find((s) => s.id === seatId);

      if (!targetSeat || targetSeat.status === 'booked') {
        return;
      }

      const isAlreadySelected = selectedSeatIds.includes(seatId);

      let nextSelectedIds: string[];
      if (isAlreadySelected) {
        nextSelectedIds = selectedSeatIds.filter((id) => id !== seatId);
      } else {
        nextSelectedIds = [...selectedSeatIds, seatId];
      }

      const nextSeats = seats.map((s) => {
        if (s.status === 'booked') return s;
        const isSel = nextSelectedIds.includes(s.id);
        return {
          ...s,
          status: isSel ? ('selected' as const) : ('available' as const)
        };
      });

      let nextViewingSeat = get().activeViewingSeatId;
      if (!isAlreadySelected) {
        nextViewingSeat = seatId;
      } else if (seatId === nextViewingSeat) {
        nextViewingSeat = nextSelectedIds[nextSelectedIds.length - 1] || 'H17';
      }

      set({
        seats: nextSeats,
        selectedSeatIds: nextSelectedIds,
        activeViewingSeatId: nextViewingSeat,
        viewMode: 'seat',
        activeThumbnailIndex: 0
      });
    },

    setActiveViewingSeat: (seatId: string) => {
      set({
        activeViewingSeatId: seatId,
        viewMode: 'seat',
        activeThumbnailIndex: 0
      });
    },

    setViewMode: (mode) => {
      let thumbIdx = 0;
      if (mode === 'seat') thumbIdx = 0;
      else if (mode === 'theatre') thumbIdx = 1;
      else if (mode === 'side') thumbIdx = 2;

      set({
        viewMode: mode,
        activeThumbnailIndex: thumbIdx
      });
    },

    toggle360: () => set((state) => ({ is360Active: !state.is360Active })),

    setActiveThumbnailIndex: (index: number) => {
      const modes: ViewAngleMode[] = ['seat', 'theatre', 'side'];
      const targetMode = modes[index] || 'seat';
      set({
        activeThumbnailIndex: index,
        viewMode: targetMode
      });
    },

    setBookingModalOpen: (open: boolean) => set({ isBookingModalOpen: open }),

    completeBooking: () => {
      const { selectedMovie, selectedTheatre, selectedDate, selectedTime, selectedSeatIds, getTotalPrice } = get();
      const bookingId = `CB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const totalPrice = getTotalPrice();
      const convenienceFee = selectedSeatIds.length * 35;
      const gst = Math.round(convenienceFee * 0.18);
      const grandTotal = totalPrice + convenienceFee + gst;

      const details: BookingDetails = {
        bookingId,
        movie: selectedMovie,
        theatre: selectedTheatre,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeatIds,
        totalPrice,
        convenienceFee,
        gst,
        grandTotal,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      set({
        confirmedBooking: details,
        isBookingModalOpen: false
      });
    },

    resetBooking: () => {
      set({
        confirmedBooking: null,
        selectedSeatIds: [],
        activeViewingSeatId: 'H17',
        seats: generateInitialSeats()
      });
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
    setIsSearchOpen: (open) => set({ isSearchOpen: open }),

    toggleVideoMute: () => set((state) => ({ isVideoMuted: !state.isVideoMuted })),
    toggleVideoPlay: () => set((state) => ({ isVideoPlaying: !state.isVideoPlaying })),

    getTotalPrice: () => {
      const { seats, selectedSeatIds, selectedFormat } = get();
      return selectedSeatIds.reduce((sum, seatId) => {
        const seat = seats.find((s) => s.id === seatId);
        if (!seat) return sum;
        return sum + getTierPrice(seat.tier, selectedFormat);
      }, 0);
    },

    // New Actions for View & Select + Best Seats
    setInteractionMode: (mode) => set({ interactionMode: mode }),
    setBestSeatsFilter: (filter) => set({ bestSeatsFilter: filter }),
    setMobileViewMode: (mode) => set({ mobileViewMode: mode }),

    toggleSeatSelection: (seatId: string) => {
      const { selectedSeatIds } = get();
      if (selectedSeatIds.includes(seatId)) {
        get().removeSeatFromBooking(seatId);
      } else {
        get().addSeatToBooking(seatId);
      }
    },

    addSeatToBooking: (seatId: string) => {
      const { seats, selectedSeatIds } = get();
      const targetSeat = seats.find((s) => s.id === seatId);
      if (!targetSeat || targetSeat.status === 'booked' || selectedSeatIds.includes(seatId)) return;

      const nextSelectedIds = [...selectedSeatIds, seatId];
      const nextSeats = seats.map((s) => {
        if (s.status === 'booked') return s;
        return {
          ...s,
          status: nextSelectedIds.includes(s.id) ? ('selected' as const) : ('available' as const)
        };
      });

      set({
        seats: nextSeats,
        selectedSeatIds: nextSelectedIds,
        activeViewingSeatId: seatId
      });
    },

    removeSeatFromBooking: (seatId: string) => {
      const { seats, selectedSeatIds } = get();
      const nextSelectedIds = selectedSeatIds.filter((id) => id !== seatId);
      const nextSeats = seats.map((s) => {
        if (s.status === 'booked') return s;
        return {
          ...s,
          status: nextSelectedIds.includes(s.id) ? ('selected' as const) : ('available' as const)
        };
      });

      set({
        seats: nextSeats,
        selectedSeatIds: nextSelectedIds
      });
    },

    selectBestSweetSpotSeat: () => {
      set({
        activeViewingSeatId: 'H17',
        viewMode: 'seat',
        bestSeatsFilter: 'sweetspot',
        activeThumbnailIndex: 0
      });
    }
  };
});
