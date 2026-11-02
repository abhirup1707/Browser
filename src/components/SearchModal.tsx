import React from 'react';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { MOVIES, THEATRES } from '../data/movies';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useBookingStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useBookingStore((s) => s.setIsSearchOpen);
  const searchQuery = useBookingStore((s) => s.searchQuery);
  const setSearchQuery = useBookingStore((s) => s.setSearchQuery);
  const setSelectedMovie = useBookingStore((s) => s.setSelectedMovie);
  const setSelectedTheatre = useBookingStore((s) => s.setSelectedTheatre);
  const setCurrentView = useBookingStore((s) => s.setCurrentView);

  if (!isSearchOpen) return null;

  const matchedMovies = MOVIES.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const matchedTheatres = THEATRES.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#11131a] border border-white/12 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1c1f2a] flex items-center space-x-3 bg-[#151722]">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, genres, cinemas (e.g. Ramayana, IMAX, Acropolis)..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-7 h-7 rounded-full bg-[#1e2230] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Movies Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Movies ({matchedMovies.length})
            </span>
            <div className="space-y-1.5">
              {matchedMovies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setCurrentView('experience');
                    setIsSearchOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-[#1a1d29] flex items-center space-x-3 text-left transition-all cursor-pointer group"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-10 h-14 rounded object-cover border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/reference_layout.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white group-hover:text-red-400 block truncate">
                      {movie.title}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {movie.language} • {movie.formats.join(', ')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Theatres Section */}
          {matchedTheatres.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Cinemas ({matchedTheatres.length})
              </span>
              <div className="space-y-1.5">
                {matchedTheatres.map((theatre) => (
                  <button
                    key={theatre.id}
                    onClick={() => {
                      setSelectedTheatre(theatre);
                      setCurrentView('experience');
                      setIsSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#1a1d29] flex items-center space-x-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#202534] flex items-center justify-center text-red-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white group-hover:text-red-400 block truncate">
                        {theatre.name}
                      </span>
                      <span className="text-xs text-zinc-400 truncate block">
                        {theatre.location}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
