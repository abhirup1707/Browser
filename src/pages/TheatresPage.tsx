import React from 'react';
import { Navbar } from '../components/Navbar';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { THEATRES } from '../data/movies';
import { useBookingStore } from '../store/bookingStore';

export const TheatresPage: React.FC = () => {
  const setSelectedTheatre = useBookingStore((s) => s.setSelectedTheatre);
  const setCurrentView = useBookingStore((s) => s.setCurrentView);

  const handleSelectTheatre = (theatre: typeof THEATRES[0]) => {
    setSelectedTheatre(theatre);
    setCurrentView('experience');
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0c10] overflow-y-auto select-none font-sans text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10 w-full space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PREMIUM AUDITORIUMS & IMAX EXPERIENCES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Cinemas & Theatres</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Experience movies in laser projection, Dolby Atmos 64-channel audio, and 3D seating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEATRES.map((theatre) => (
            <div
              key={theatre.id}
              className="bg-[#12141c] border border-white/8 hover:border-red-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white leading-snug">
                      {theatre.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-zinc-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{theatre.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300">
                    {theatre.distance}
                  </span>
                </div>

                {/* Available Screens */}
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                    Available Screens:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {theatre.screens.map((sc) => (
                      <span
                        key={sc}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1a1d28] text-zinc-300 border border-white/5"
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                    Amenities:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-zinc-300">
                    {theatre.facilities.map((fac) => (
                      <div key={fac} className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[11px] truncate">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5">
                <button
                  onClick={() => handleSelectTheatre(theatre)}
                  className="w-full py-2.5 px-4 bg-[#e50914] hover:bg-[#f0202c] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-red-900/30 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Select Theatre & View Seats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
