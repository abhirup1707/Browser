import React, { useState } from 'react';
import type { TeamData, GameMode } from '../types/fifa';
import { TEAMS } from '../data/fifaTeams';
import { Play, Users, Gamepad2, Shield, X } from 'lucide-react';

interface TeamSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (home: TeamData, away: TeamData, mode: GameMode) => void;
  currentHome: TeamData;
  currentAway: TeamData;
  currentMode: GameMode;
}

export const TeamSelectModal: React.FC<TeamSelectModalProps> = ({
  isOpen,
  onClose,
  onStartMatch,
  currentHome,
  currentAway,
  currentMode,
}) => {
  const [selectedHomeId, setSelectedHomeId] = useState<string>(currentHome.id);
  const [selectedAwayId, setSelectedAwayId] = useState<string>(currentAway.id);
  const [mode, setMode] = useState<GameMode>(currentMode);

  if (!isOpen) return null;

  const homeTeam = TEAMS.find((t) => t.id === selectedHomeId) || TEAMS[0];
  const awayTeam = TEAMS.find((t) => t.id === selectedAwayId) || TEAMS[1];

  const handleStart = () => {
    onStartMatch(homeTeam, awayTeam, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              ⚽
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                EA SPORTS FC &bull; Match Setup
              </h2>
              <p className="text-xs text-slate-400">
                Select clubs, preview starting XI superstar cards, and choose your gameplay mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Select Game Experience:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMode('USER_VS_AI')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                mode === 'USER_VS_AI'
                  ? 'bg-emerald-950/50 border-emerald-500/80 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  mode === 'USER_VS_AI' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>🎮 Play Yourself (User vs AI)</span>
                  {mode === 'USER_VS_AI' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full direct control! Dribble, charge power shots, pass, and sprint with keyboard/mouse.
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode('AI_VS_AI')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                mode === 'AI_VS_AI'
                  ? 'bg-purple-950/50 border-purple-500/80 ring-2 ring-purple-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  mode === 'AI_VS_AI' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>🤖 Full Tactical AI Simulation</span>
                  {mode === 'AI_VS_AI' && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      SPECTATOR
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sit back with popcorn! Watch two powerhouse clubs play with realistic tactics &amp; broadcast camera.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Team Selection: Home vs Away */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Club Selection */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Home Club:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEAMS.map((t) => (
                <button
                  key={`home_${t.id}`}
                  onClick={() => setSelectedHomeId(t.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedHomeId === t.id
                      ? 'bg-slate-800 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">{t.crest}</span>
                  <span className="text-xs font-bold text-center line-clamp-1">{t.name}</span>
                </button>
              ))}
            </div>

            {/* Home Starting Stars */}
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 mb-2 block">
                Top Starting Stars &bull; {homeTeam.name}:
              </span>
              <div className="flex flex-col gap-1.5">
                {homeTeam.players.slice(7, 11).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                        {p.stats.overall}
                      </span>
                      <span className="font-extrabold text-white">#{p.number} {p.name}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      PAC {p.stats.pace} | SHO {p.stats.shooting}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Away Club Selection */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Away Club:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEAMS.map((t) => (
                <button
                  key={`away_${t.id}`}
                  onClick={() => setSelectedAwayId(t.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedAwayId === t.id
                      ? 'bg-slate-800 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">{t.crest}</span>
                  <span className="text-xs font-bold text-center line-clamp-1">{t.name}</span>
                </button>
              ))}
            </div>

            {/* Away Starting Stars */}
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 mb-2 block">
                Top Starting Stars &bull; {awayTeam.name}:
              </span>
              <div className="flex flex-col gap-1.5">
                {awayTeam.players.slice(7, 11).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">
                        {p.stats.overall}
                      </span>
                      <span className="font-extrabold text-white">#{p.number} {p.name}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      PAC {p.stats.pace} | SHO {p.stats.shooting}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Kickoff Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>KICK OFF MATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
