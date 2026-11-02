import React from 'react';
import type { TeamData, MatchStats } from '../types/fifa';
import { X, BarChart2 } from 'lucide-react';

interface MatchStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeTeam: TeamData;
  awayTeam: TeamData;
  stats: MatchStats;
}

export const MatchStatsModal: React.FC<MatchStatsModalProps> = ({
  isOpen,
  onClose,
  homeTeam,
  awayTeam,
  stats,
}) => {
  if (!isOpen) return null;

  const statRows = [
    { label: 'Goals', home: stats.homeGoals, away: stats.awayGoals },
    { label: 'Possession %', home: stats.homePossession, away: stats.awayPossession, isPercent: true },
    { label: 'Total Shots', home: stats.homeShots, away: stats.awayShots },
    { label: 'Shots on Target', home: stats.homeShotsOnTarget, away: stats.awayShotsOnTarget },
    { label: 'Passes Completed', home: stats.homePasses, away: stats.awayPasses },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-white text-lg">Match Statistics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Club Comparison Header */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{homeTeam.crest}</span>
            <span className="font-extrabold text-sm text-white">{homeTeam.name}</span>
          </div>
          <span className="text-2xl font-black text-amber-400">
            {stats.homeGoals} - {stats.awayGoals}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">{awayTeam.name}</span>
            <span className="text-2xl">{awayTeam.crest}</span>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="flex flex-col gap-4">
          {statRows.map((row, idx) => {
            const total = (row.home + row.away) || 1;
            const homeWidth = row.isPercent ? row.home : Math.round((row.home / total) * 100);
            return (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{row.home}{row.isPercent ? '%' : ''}</span>
                  <span className="text-slate-400 uppercase tracking-wider text-[11px]">{row.label}</span>
                  <span className="text-white">{row.away}{row.isPercent ? '%' : ''}</span>
                </div>
                {/* Dual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 flex overflow-hidden border border-slate-800">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${homeWidth}%`, backgroundColor: homeTeam.primaryColor }}
                  />
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${100 - homeWidth}%`, backgroundColor: awayTeam.primaryColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
        >
          Resume Match
        </button>
      </div>
    </div>
  );
};
