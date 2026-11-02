import React from 'react';
import type { HumorStyle, StyleOption } from '../types/joke';
import { Flame, Smile, Brain, Search, Cat, Mic, Sliders } from 'lucide-react';

interface StyleSelectorProps {
  currentStyle: HumorStyle;
  onSelectStyle: (style: HumorStyle) => void;
  spiceLevel: number;
  onChangeSpice: (spice: number) => void;
}

export const STYLE_OPTIONS: (StyleOption & { iconComponent: React.ComponentType<{ className?: string }> })[] = [
  {
    id: 'roast',
    name: 'Savage Roast',
    tagline: 'Emotional damage guaranteed',
    icon: '🔥',
    badge: 'Spicy',
    color: 'from-orange-500 to-rose-600',
    defaultSpice: 85,
    iconComponent: Flame,
  },
  {
    id: 'dad',
    name: 'Dad Jokes & Puns',
    tagline: '100% groan factor & wordplay',
    icon: '👨',
    badge: 'Wholesome',
    color: 'from-blue-500 to-cyan-500',
    defaultSpice: 40,
    iconComponent: Smile,
  },
  {
    id: 'brainrot',
    name: 'Gen-Z / Brainrot',
    tagline: 'Bro thinks he is him & NPC aura',
    icon: '🧠',
    badge: 'Chaotic',
    color: 'from-purple-500 to-pink-500',
    defaultSpice: 80,
    iconComponent: Brain,
  },
  {
    id: 'detective',
    name: 'CSI Detective',
    tagline: 'Absurd Sherlock forensic theories',
    icon: '🕵️',
    badge: 'Analytical',
    color: 'from-emerald-500 to-teal-600',
    defaultSpice: 65,
    iconComponent: Search,
  },
  {
    id: 'pet',
    name: 'Pet / Object POV',
    tagline: 'What the cat or furniture thinks',
    icon: '🐾',
    badge: 'Sassy',
    color: 'from-amber-500 to-orange-500',
    defaultSpice: 60,
    iconComponent: Cat,
  },
  {
    id: 'standup',
    name: 'Stand-up Routine',
    tagline: 'Late night comedy club monologue',
    icon: '🎤',
    badge: 'Observational',
    color: 'from-indigo-500 to-purple-600',
    defaultSpice: 75,
    iconComponent: Mic,
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onSelectStyle,
  spiceLevel,
  onChangeSpice,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎭</span> Choose Your Comedy Persona
          </h2>
          <p className="text-xs text-slate-400">
            How should the AI dissect and determine jokes for your photo?
          </p>
        </div>

        {/* Spice meter indicator */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400">Spice:</span>
          <span className="font-bold text-orange-400">{spiceLevel}%</span>
          <span className="text-[10px] text-slate-500">
            {spiceLevel < 45 ? '(Gentle)' : spiceLevel < 75 ? '(Sizzling)' : '(Nuclear)'}
          </span>
        </div>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = currentStyle === opt.id;
          const IconComp = opt.iconComponent;
          return (
            <button
              key={opt.id}
              onClick={() => {
                onSelectStyle(opt.id);
                onChangeSpice(opt.defaultSpice);
              }}
              className={`relative flex flex-col items-start text-left p-3 rounded-xl border transition-all duration-200 group overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-orange-500/70 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40 translate-y-[-2px]'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Highlight gradient line if selected */}
              {isSelected && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${opt.color}`}
                />
              )}

              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isSelected
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-slate-800/60 text-slate-500'
                  }`}
                >
                  {opt.badge}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                {opt.name}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {opt.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Spice Range Slider */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
          🔥 Roast Intensity:
        </span>
        <input
          type="range"
          min="20"
          max="100"
          value={spiceLevel}
          onChange={(e) => onChangeSpice(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <span className="text-xs font-mono font-bold text-orange-400 w-10 text-right">
          {spiceLevel}%
        </span>
      </div>
    </div>
  );
};
