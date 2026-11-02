import React from 'react';
import { HelpCircle, X, Sparkles, Flame, Volume2, Download, Camera } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white text-base">
              How LaughLens AI Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Camera className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">1. Upload Any Picture</strong>
              Drag &amp; drop photos, paste from your clipboard with <kbd className="px-1 py-0.5 bg-slate-800 rounded text-amber-300 font-mono text-[10px]">Ctrl+V</kbd>, or snap a live webcam selfie.
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">2. Pick Your Humor Persona</strong>
              Choose between Savage Roasts, Wholesome Dad Jokes &amp; Puns, Gen-Z Brainrot Meme commentary, CSI Detective forensics, Pet POVs, or Stand-up routines. Adjust the spice slider to control the heat.
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">3. Voice Narration &amp; Soundboard</strong>
              Tap &quot;Narrate Joke&quot; to hear a comedian voice read your punchline aloud, and hit the sound effects board for rimshots (Ba-dum-tss), sitcom laughs, and sad trombones!
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Download className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">4. Generate &amp; Download Memes</strong>
              Export formatted image memes in Classic Impact, Modern Social Card, or Polaroid styles to share straight to social media or group chats.
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Dual AI Engine Support</strong>
              Works 100% offline out-of-the-box with the Built-in Intelligent Vision Engine. You can also plug in your Google Gemini API key to activate Gemini 2.5 Flash multimodal vision!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all"
        >
          Got It, Let&apos;s Roast!
        </button>
      </div>
    </div>
  );
};
