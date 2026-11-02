import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import {
  Play,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Music,
  Trophy,
  Ticket,
  MapPin,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { MOVIES, THEATRES } from '../data/movies';
import type { Movie, EventCategory, MovieFormat, SortOption } from '../types/cinema';

export const Home: React.FC = () => {
  const setSelectedMovie = useBookingStore((s) => s.setSelectedMovie);
  const setCurrentView = useBookingStore((s) => s.setCurrentView);
  const setSelectedTheatre = useBookingStore((s) => s.setSelectedTheatre);
  const setSelectedFormat = useBookingStore((s) => s.setSelectedFormat);

  // 4 Featured Hero Blockbusters
  const heroMovies = MOVIES.slice(0, 4);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  // Filters & Sorting for Event Hub
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | MovieFormat>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<Movie | null>(null);

  // Auto-cycle hero every 6 seconds unless user manually interacts
  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoCycling, heroMovies.length]);

  const activeHero = heroMovies[currentHeroIndex];

  const handleBookNow = (movie: Movie, preferredFormat?: MovieFormat) => {
    setSelectedMovie(movie);
    if (preferredFormat) {
      setSelectedFormat(preferredFormat);
    }
    // Default to Mall A (Central IMAX Arena)
    setSelectedTheatre(THEATRES[0]);
    setCurrentView('experience');
  };

  // Filter & Sort Logic
  const filteredEvents = MOVIES.filter((m) => {
    // 1. Category filter
    if (selectedCategory !== 'all') {
      if (m.category !== selectedCategory) return false;
    }
    // 2. Format filter
    if (formatFilter !== 'all') {
      if (!m.formats.some((f) => f.includes(formatFilter))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOption === 'price-asc') {
      return (a.basePrice || 200) - (b.basePrice || 200);
    }
    if (sortOption === 'price-desc') {
      return (b.basePrice || 200) - (a.basePrice || 200);
    }
    if (sortOption === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // 'featured' order
  });

  return (
    <div className="w-screen h-screen flex flex-col bg-[#08090d] overflow-y-auto select-none font-sans text-white">
      <Navbar />

      {/* 1. DYNAMIC MULTI-MOVIE HERO CAROUSEL */}
      <div
        className="relative w-full h-[540px] md:h-[600px] shrink-0 overflow-hidden bg-black"
        onMouseEnter={() => setIsAutoCycling(false)}
        onMouseLeave={() => setIsAutoCycling(true)}
      >
        {/* Background Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out brightness-[0.65] scale-105"
          style={{ backgroundImage: `url(${activeHero.backdrop})` }}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/75 to-transparent" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-end p-6 md:p-12 pb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/25 border border-red-500/40 text-red-300 text-xs font-bold mb-3.5 w-fit backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="tracking-wide uppercase">
              {activeHero.category === 'concert'
                ? 'LIVE CONCERT CINEMA BROADCAST'
                : activeHero.category === 'sports'
                ? 'STADIUM SCREENING'
                : 'NOW SHOWING IN IMMERSIVE 3D & IMAX'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {activeHero.title}
          </h1>

          {/* Metadata badges & ratings */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-300 mt-3 font-semibold">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
              {activeHero.certificate}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
              {activeHero.language}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
              IMAX 3D Laser
            </span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{activeHero.rating} / 10</span>
            </div>
            <div className="flex items-center space-x-1 text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeHero.duration}</span>
            </div>
            <span className="text-zinc-400">·</span>
            <span className="text-emerald-400 font-bold">
              From ₹{activeHero.basePrice || 200}
            </span>
          </div>

          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-3.5 leading-relaxed line-clamp-2 md:line-clamp-3">
            {activeHero.synopsis}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3.5 mt-5">
            <button
              onClick={() => handleBookNow(activeHero, 'IMAX')}
              className="px-6 sm:px-8 py-3 bg-[#e50914] hover:bg-[#ff2430] active:bg-[#c90812] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-red-950/70 cursor-pointer flex items-center space-x-2 group"
            >
              <span>Book 3D Seats</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setSelectedMovieForModal(activeHero)}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all border border-white/10 backdrop-blur-md cursor-pointer flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Details & Trailer</span>
            </button>
          </div>
        </div>

        {/* Hero Navigation Thumbnails / Switcher Bar */}
        <div className="absolute bottom-4 left-6 right-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {heroMovies.map((m, idx) => {
              const isActive = idx === currentHeroIndex;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setCurrentHeroIndex(idx);
                    setIsAutoCycling(false);
                  }}
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-left transition-all cursor-pointer backdrop-blur-md border ${
                    isActive
                      ? 'bg-red-600/30 border-red-500 text-white shadow-lg shadow-red-950/60 scale-105'
                      : 'bg-[#12151e]/75 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-bold truncate max-w-[100px] sm:max-w-[140px]">
                    {m.title}
                  </div>
                  <div className="text-[8px] sm:text-[9px] opacity-75 hidden xs:block">
                    {m.formats.join(' · ')}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prev / Next Arrows */}
          <div className="hidden sm:flex items-center space-x-1.5">
            <button
              onClick={() => {
                setCurrentHeroIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
                setIsAutoCycling(false);
              }}
              className="w-8 h-8 rounded-full bg-[#12151e]/80 hover:bg-[#1e2330] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
                setIsAutoCycling(false);
              }}
              className="w-8 h-8 rounded-full bg-[#12151e]/80 hover:bg-[#1e2330] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MULTI-EVENT ENTERTAINMENT DISCOVERY SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full space-y-7">
        {/* Category Tabs: Movies, Live Concerts, Stadium Sports, Special Premieres */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b1e28] pb-5">
          <div>
            <div className="flex items-center space-x-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Multi-Event Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Explore Events & Cinema
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5">
              Select any event to preview the 3D auditorium perspective and reserve seats in Mall A, B, C, D & E
            </p>
          </div>

          {/* Event Category Switcher */}
          <div className="flex items-center p-1 bg-[#121520] rounded-xl border border-white/10 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>All Events ({MOVIES.length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('movie')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'movie'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setSelectedCategory('concert')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'concert'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Live Concerts</span>
            </button>
            <button
              onClick={() => setSelectedCategory('sports')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'sports'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Stadium Sports</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#11131a] p-3 rounded-2xl border border-white/8 text-xs">
          {/* Format Filter (2D, 3D, IMAX) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-zinc-400 text-[11px] font-semibold mr-1">Format:</span>
            <button
              onClick={() => setFormatFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formatFilter === 'all'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFormatFilter('2D')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formatFilter === '2D'
                  ? 'bg-purple-600/80 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              2D Standard
            </button>
            <button
              onClick={() => setFormatFilter('3D')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formatFilter === '3D'
                  ? 'bg-sky-600/80 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3D RealD
            </button>
            <button
              onClick={() => setFormatFilter('IMAX')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formatFilter === 'IMAX'
                  ? 'bg-cyan-600/90 text-white font-bold shadow-md shadow-cyan-950/50'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              IMAX Laser
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 text-[11px] font-semibold">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[#181c28] text-zinc-200 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3. EVENT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="group bg-[#11131b] border border-white/8 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/30 flex flex-col justify-between"
            >
              {/* Poster Image with Badges */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/reference_layout.png';
                  }}
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-transparent to-black/40" />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 flex items-center space-x-1 text-xs font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>

                {/* Category Badge */}
                {item.category && item.category !== 'movie' && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-md">
                    {item.category}
                  </div>
                )}

                {/* Formats pill at bottom of poster */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                  {item.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#141824]/90 text-zinc-300 border border-white/10"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                    {item.tagline || item.synopsis}
                  </p>

                  {/* Venue: Generic Mall Listing */}
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-400 mt-2.5">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">Mall A & B Multiplex</span>
                  </div>
                </div>

                {/* Price and Book Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Starting from</span>
                    <span className="text-sm font-bold text-white">
                      ₹{item.basePrice || 200}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookNow(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-md shadow-red-950/50 cursor-pointer"
                  >
                    <span>3D Seats</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CINEMATIC DETAILS MODAL */}
      {selectedMovieForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#11131a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedMovieForModal.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedMovieForModal.genre.join(', ')} · {selectedMovieForModal.duration}
                </p>
              </div>
              <button
                onClick={() => setSelectedMovieForModal(null)}
                className="w-8 h-8 rounded-full bg-[#1e2230] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm mt-4 leading-relaxed">
              {selectedMovieForModal.synopsis}
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-zinc-300 space-y-1">
              <p>
                <strong className="text-zinc-400">Director:</strong> {selectedMovieForModal.director}
              </p>
              <p>
                <strong className="text-zinc-400">Cast:</strong> {selectedMovieForModal.cast.join(', ')}
              </p>
              <p>
                <strong className="text-zinc-400">Available At:</strong> Mall A, Mall B, Mall C, Mall D, Mall E
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedMovieForModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const m = selectedMovieForModal;
                  setSelectedMovieForModal(null);
                  handleBookNow(m);
                }}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-950/60"
              >
                Launch 3D Seat View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
