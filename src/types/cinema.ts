export type SeatStatus = 'available' | 'selected' | 'booked';
export type SeatTier = 'standard' | 'premium' | 'recliner';
export type MovieFormat = '2D' | '3D' | 'IMAX';
export type EventCategory = 'all' | 'movie' | 'concert' | 'sports' | 'premiere';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export interface SeatInfo {
  id: string; // e.g. "F10"
  row: string; // "A" - "L"
  col: number;
  rowIndex: number;
  colIndex: number;
  status: SeatStatus;
  tier: SeatTier;
  price: number;
  position3D: [number, number, number];
  rotationY: number;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  certificate: string;
  language: string;
  formats: ('2D' | '3D' | 'IMAX' | string)[];
  duration: string;
  genre: string[];
  rating: number;
  poster: string;
  screenImage: string;
  backdrop: string;
  synopsis: string;
  director: string;
  cast: string[];
  category?: 'movie' | 'concert' | 'sports' | 'premiere';
  basePrice?: number;
  tagline?: string;
  eventDate?: string;
}

export interface Theatre {
  id: string;
  name: string;
  city: string;
  location: string;
  screens: string[];
  facilities: string[];
  distance: string;
}

export interface Showtime {
  id: string;
  time: string;
  theatreId: string;
  screenType: string;
  language: string;
  price?: number;
}

export interface BookingDetails {
  bookingId: string;
  movie: Movie;
  theatre: Theatre;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  convenienceFee: number;
  gst: number;
  grandTotal: number;
  qrCodeUrl?: string;
  bookedAt: string;
}

export type ViewAngleMode = 'seat' | 'theatre' | 'side' | 'front';
