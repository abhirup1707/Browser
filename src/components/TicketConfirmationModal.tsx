import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, Check, QrCode, Ticket } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';

export const TicketConfirmationModal: React.FC = () => {
  const confirmedBooking = useBookingStore((s) => s.confirmedBooking);
  const resetBooking = useBookingStore((s) => s.resetBooking);

  useEffect(() => {
    if (confirmedBooking) {
      // Trigger joyful celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [confirmedBooking]);

  if (!confirmedBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-[#0f1118] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-center text-white relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <Check className="w-7 h-7 text-white stroke-[3]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs text-white/80 mt-1">
            Your seats are reserved in 3D IMAX Audi
          </p>
        </div>

        {/* Digital Ticket Body */}
        <div className="p-6 space-y-5 bg-[#12141d]">
          {/* Movie & Booking Code */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                Official Digital Pass
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 leading-snug">
                {confirmedBooking.movie.title}
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                {confirmedBooking.theatre.name}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block">Booking ID</span>
              <span className="text-xs font-mono font-bold text-zinc-200 bg-[#1e2230] px-2 py-1 rounded border border-white/10 inline-block mt-0.5">
                {confirmedBooking.bookingId}
              </span>
            </div>
          </div>

          {/* Ticket Specs Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#181b26] border border-white/8 text-center text-xs">
            <div>
              <span className="text-zinc-400 text-[10px] block">Date</span>
              <span className="font-semibold text-white mt-0.5 block">
                {confirmedBooking.date}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block">Time</span>
              <span className="font-semibold text-red-400 mt-0.5 block">
                {confirmedBooking.time}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block">Seats</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">
                {confirmedBooking.seats.join(', ')}
              </span>
            </div>
          </div>

          {/* Ticket Perforation Tear-Line */}
          <div className="relative py-2 flex items-center justify-between">
            <div className="w-5 h-5 rounded-full bg-[#0f1118] -ml-8.5" />
            <div className="flex-1 border-b-2 border-dashed border-zinc-700 mx-2" />
            <div className="w-5 h-5 rounded-full bg-[#0f1118] -mr-8.5" />
          </div>

          {/* QR Code and Barcode Section */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white text-black">
            <div className="flex items-center space-x-3">
              <QrCode className="w-12 h-12 text-black" />
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Scan at Entrance
                </span>
                <span className="text-xs font-mono font-bold text-black tracking-wider">
                  IMAX-AUDI-4
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block">Amount Paid</span>
              <span className="text-base font-bold text-black">
                ₹{confirmedBooking.grandTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-[#0d0e14] border-t border-white/10 flex items-center space-x-3">
          <button
            onClick={() => {
              alert('Downloading offline ticket pass PDF...');
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1d212c] hover:bg-[#282d3c] text-zinc-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Ticket</span>
          </button>

          <button
            onClick={resetBooking}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#e50914] hover:bg-[#f0202c] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-red-900/30"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Another</span>
          </button>
        </div>
      </div>
    </div>
  );
};
