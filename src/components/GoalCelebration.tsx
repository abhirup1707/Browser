import React, { useEffect } from 'react';
import type { PlayerData, TeamData } from '../types/fifa';
import confetti from 'canvas-confetti';

interface GoalCelebrationProps {
  scorer: PlayerData | null;
  team: TeamData | null;
}

export const GoalCelebration: React.FC<GoalCelebrationProps> = ({ scorer, team }) => {
  useEffect(() => {
    if (scorer) {
      // Massive stadium confetti cannons
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: [team?.primaryColor || '#facc15', '#ffffff', '#fbbf24', '#f43f5e'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
        });
      }, 400);
    }
  }, [scorer, team]);

  if (!scorer || !team) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-50">
      {/* Golden Glowing GOAL Banner */}
      <div className="animate-bounce flex flex-col items-center">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-[0_10px_35px_rgba(245,158,11,0.7)] uppercase">
          G O A L !
        </h1>

        {/* Scorer Info Box */}
        <div className="mt-4 px-6 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/40 shadow-2xl flex items-center gap-4 animate-pulse">
          <span className="text-4xl">{team.crest}</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              {team.name}
            </span>
            <span className="text-2xl font-black text-white uppercase tracking-tight">
              #{scorer.number} {scorer.name}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            {scorer.stats.overall}
          </div>
        </div>
      </div>
    </div>
  );
};
