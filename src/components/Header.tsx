import React from 'react';
import { Volume2, VolumeX, Sparkles, Key, HelpCircle } from 'lucide-react';
import { setSoundEnabled } from '../services/soundEffects';

interface HeaderProps {
  hasGeminiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenHelpModal: () => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasGeminiKey,
  onOpenApiKeyModal,
  onOpenHelpModal,
  soundOn,
  setSoundOn,
}) => {
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/30">
            <span className="text-2xl" role="img" aria-label="laughing-face">
              🤣
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                LaughLens
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 text-sm font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30">
                  AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn any picture into hilarious roasts, memes &amp; jokes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Mute comedic sound effects' : 'Enable comedic sound effects'}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              soundOn
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title={soundOn ? 'Sound Effects Active' : 'Sound Effects Muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundOn ? 'SFX On' : 'Muted'}</span>
          </button>

          {/* AI Engine Status & Key Modal */}
          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              hasGeminiKey
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60 shadow-sm shadow-purple-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            {hasGeminiKey ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span className="hidden sm:inline">Gemini Vision Pro</span>
                <span className="sm:hidden">Gemini</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Instant AI (Built-in)</span>
                <span className="sm:hidden">AI Mode</span>
              </>
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelpModal}
            aria-label="How it works"
            className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="How LaughLens Works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
