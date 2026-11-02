import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';

export const OffersPage: React.FC = () => {
  const setCurrentView = useBookingStore((s) => s.setCurrentView);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const offers = [
    {
      code: 'CINELIGHT',
      discount: '25% OFF',
      title: 'First 3D Booking Discount',
      desc: 'Get flat 25% discount up to ₹150 on your first booking with 3D seat preview.',
      validUntil: '31 Dec 2026'
    },
    {
      code: 'IMAXPASS',
      discount: '₹100 FLAT',
      title: 'IMAX Laser Weekend Special',
      desc: 'Book 2 or more tickets for any IMAX 3D show and save ₹100 instantly.',
      validUntil: '24 Jul 2026'
    },
    {
      code: 'RAMAYANA50',
      discount: '50% OFF F&B',
      title: 'Ramayana Premiere Combo',
      desc: 'Complimentary gourmet popcorn and beverage combo on Gold & Recliner tickets.',
      validUntil: '30 Jul 2026'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0c10] overflow-y-auto select-none font-sans text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE DISCOUNTS & CASHBACK</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Cinema Offers & Promos</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Apply these coupon codes during checkout to avail special discounts on your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="bg-[#12141d] border border-white/8 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-red-500/40 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold">
                    {offer.discount}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Expires {offer.validUntil}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{offer.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{offer.desc}</p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 text-amber-300 tracking-wider">
                  {offer.code}
                </span>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-black border border-red-900/40 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">
              Ready to experience Ramayana (2026)?
            </h3>
            <p className="text-zinc-400 text-xs mt-1">
              Select your favorite seat in our procedural 3D auditorium now.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('experience')}
            className="px-6 py-3 bg-[#e50914] hover:bg-[#f0202c] text-white font-semibold text-xs rounded-xl shadow-lg shadow-red-900/30 cursor-pointer"
          >
            Go to 3D Cinema
          </button>
        </div>
      </div>
    </div>
  );
};
