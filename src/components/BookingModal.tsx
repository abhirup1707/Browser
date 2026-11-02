import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';

export const BookingModal: React.FC = () => {
  const isBookingModalOpen = useBookingStore((s) => s.isBookingModalOpen);
  const setBookingModalOpen = useBookingStore((s) => s.setBookingModalOpen);
  const selectedMovie = useBookingStore((s) => s.selectedMovie);
  const selectedTheatre = useBookingStore((s) => s.selectedTheatre);
  const selectedDate = useBookingStore((s) => s.selectedDate);
  const selectedTime = useBookingStore((s) => s.selectedTime);
  const selectedSeatIds = useBookingStore((s) => s.selectedSeatIds);
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const completeBooking = useBookingStore((s) => s.completeBooking);
  const getTotalPrice = useBookingStore((s) => s.getTotalPrice);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isBookingModalOpen) return null;

  const seatsToBook =
    selectedSeatIds.length > 0 ? selectedSeatIds : [activeViewingSeatId || 'F10'];
  const basePrice = getTotalPrice();
  const convFee = Math.round(basePrice * 0.1);
  const gst = Math.round(convFee * 0.18 * 100) / 100;
  const grandTotal = Math.round((basePrice + convFee + gst) * 100) / 100;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      completeBooking();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#11131a] border border-white/12 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1d212c] flex items-center justify-between bg-[#151821]">
          <div>
            <h3 className="text-white font-bold text-lg">Booking Summary</h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Review details & complete your order
            </p>
          </div>
          <button
            onClick={() => setBookingModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#1c202b] hover:bg-[#282d3d] text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Movie Summary Box */}
          <div className="p-4 rounded-xl bg-[#171a24] border border-white/8 flex items-center space-x-4">
            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
              className="w-14 h-20 rounded-md object-cover border border-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/reference_layout.png';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-base truncate">
                {selectedMovie.title}
              </h4>
              <p className="text-zinc-400 text-xs mt-1">
                {selectedTheatre.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-zinc-300 mt-1">
                <span>{selectedDate}</span>
                <span>•</span>
                <span className="text-red-400 font-medium">{selectedTime}</span>
                <span>•</span>
                <span className="text-zinc-400">Audi 4 (IMAX 3D)</span>
              </div>
            </div>
          </div>

          {/* Seats Box */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#171a24] border border-white/8">
            <div>
              <span className="text-xs text-zinc-400 block">Selected Seats</span>
              <span className="text-base font-bold text-white tracking-wide">
                {seatsToBook.join(', ')}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold">
              {seatsToBook.length} Seat{seatsToBook.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 rounded-xl bg-[#171a24] border border-white/8 space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-300">
              <span>Ticket Price ({seatsToBook.length}x)</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-xs">
              <span>Convenience Fee</span>
              <span>₹{convFee}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-xs">
              <span>Integrated GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="w-full h-px bg-white/10 pt-1" />
            <div className="flex justify-between text-white font-bold text-base">
              <span>Total Payable</span>
              <span className="text-red-400">₹{grandTotal}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-red-500 bg-red-600/10 text-white'
                    : 'border-white/10 bg-[#171a24] text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-semibold">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-red-500 bg-red-600/10 text-white'
                    : 'border-white/10 bg-[#171a24] text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-semibold">Credit/Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-red-500 bg-red-600/10 text-white'
                    : 'border-white/10 bg-[#171a24] text-zinc-400 hover:text-white'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-xs font-semibold">Net Banking</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. mobile@upi)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171a24] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted Mock Payment Gateway</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#1d212c] bg-[#151821] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block">Grand Total</span>
            <span className="text-xl font-bold text-white">₹{grandTotal}</span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="px-6 py-3 bg-[#e50914] hover:bg-[#f0202c] active:bg-[#c90812] text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-900/30 cursor-pointer flex items-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{grandTotal}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
