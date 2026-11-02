import React from 'react';
import type { TeamData, PlayerData, CameraView, GameMode, MatchStats } from '../types/fifa';
import { Volume2, VolumeX, Eye, Users, BarChart3, RotateCcw } from 'lucide-react';

interface ScoreboardHUDProps {
  homeTeam: TeamData;
  awayTeam: TeamData;
  homeScore: number;
  awayScore: number;
  matchMinute: number;
  activePlayer: PlayerData | null;
  stamina: number;
  shotPower: number;
  cameraView: CameraView;
  onCameraChange: (view: CameraView) => void;
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  radarData: {
    home: { x: number; z: number }[];
    away: { x: number; z: number }[];
    ball: { x: number; z: number };
  };
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenTeamSelect: () => void;
  onOpenStats: () => void;
  matchStats: MatchStats;
}

export const ScoreboardHUD: React.FC<ScoreboardHUDProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchMinute,
  activePlayer,
  stamina,
  shotPower,
  cameraView,
  onCameraChange,
  gameMode,
  onGameModeChange,
  radarData,
  soundOn,
  onToggleSound,
  onOpenTeamSelect,
  onOpenStats,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top Bar: EA FC Official Broadcast Scoreboard */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {/* Left: TV Scoreboard Banner */}
        <div className="flex items-center bg-slate-950/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Match Clock */}
          <div className="px-3.5 py-2.5 bg-slate-900 border-r border-white/10 flex flex-col items-center justify-center min-w-[64px]">
            <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">
              {String(matchMinute).padStart(2, '0')}:00
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              1st Half
            </span>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-2 px-3.5 py-2">
            <span className="text-xl">{homeTeam.crest}</span>
            <span className="font-black text-sm sm:text-base tracking-tight text-white">
              {homeTeam.shortName}
            </span>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: homeTeam.primaryColor }}
            />
          </div>

          {/* Score Box */}
          <div className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-950 border-x border-white/10 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-white">{homeScore}</span>
            <span className="text-slate-500 font-bold">-</span>
            <span className="text-xl sm:text-2xl font-black text-white">{awayScore}</span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 px-3.5 py-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: awayTeam.primaryColor }}
            />
            <span className="font-black text-sm sm:text-base tracking-tight text-white">
              {awayTeam.shortName}
            </span>
            <span className="text-xl">{awayTeam.crest}</span>
          </div>
        </div>

        {/* Right: Camera, Controls & Settings */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Game Mode Pill */}
          <button
            onClick={() => onGameModeChange(gameMode === 'USER_VS_AI' ? 'AI_VS_AI' : 'USER_VS_AI')}
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg border ${
              gameMode === 'AI_VS_AI'
                ? 'bg-purple-600/90 border-purple-400 text-white shadow-purple-500/20'
                : 'bg-emerald-600/90 border-emerald-400 text-white shadow-emerald-500/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{gameMode === 'USER_VS_AI' ? '🎮 You vs AI' : '🤖 AI vs AI Sim'}</span>
          </button>

          {/* Camera View Switcher */}
          <div className="flex items-center bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/10 p-1">
            {(['BROADCAST', 'TELE', 'ACTION', 'TOP_DOWN'] as CameraView[]).map((cam) => (
              <button
                key={cam}
                onClick={() => onCameraChange(cam)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  cameraView === cam
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cam === 'TOP_DOWN' ? 'Radar' : cam.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Change Teams Button */}
          <button
            onClick={onOpenTeamSelect}
            className="p-2 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white transition-all shadow-md"
            title="Change Clubs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Match Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-2 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white transition-all shadow-md"
            title="Match Statistics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all shadow-md ${
              soundOn
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950/80 border-white/10 text-slate-500'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Broadcast Watermark / Notification */}
      {gameMode === 'AI_VS_AI' && (
        <div className="self-center bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-2 animate-pulse">
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>Tactical AI Simulation Mode Active &bull; Broadcast Camera</span>
        </div>
      )}

      {/* Bottom Area: Active Player Card + Radar Minimap + Controls Guide */}
      <div className="flex flex-col sm:flex-row items-end justify-between w-full gap-4">
        {/* Bottom Left: EA Sports Active Player Card & Stamina */}
        {activePlayer && gameMode === 'USER_VS_AI' ? (
          <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 min-w-[240px]">
            {/* OVR Rating Badge */}
            <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-700 p-0.5 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg">
              <span className="text-base leading-none">{activePlayer.stats.overall}</span>
              <span className="text-[10px] uppercase font-extrabold">{activePlayer.position}</span>
            </div>

            {/* Name, Squad Number & Bars */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white uppercase tracking-tight">
                  #{activePlayer.number} {activePlayer.shortName}
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  PAC {activePlayer.stats.pace} | SHO {activePlayer.stats.shooting}
                </span>
              </div>

              {/* Sprint Stamina Meter */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-75"
                  style={{ width: `${stamina}%` }}
                />
              </div>

              {/* Shot Power Charging Bar */}
              {shotPower > 0 && (
                <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden border border-orange-500/50">
                  <div
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 h-full transition-all"
                    style={{ width: `${shotPower}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-400">
            AI Spectator Camera
          </div>
        )}

        {/* Bottom Center: 2D Radar Minimap */}
        <div className="relative w-44 h-28 bg-[#183a18]/90 border-2 border-white/30 rounded-xl overflow-hidden shadow-2xl hidden md:block">
          {/* Halfway line & center circle */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full border border-white/40 -translate-x-1/2 -translate-y-1/2" />

          {/* Penalty boxes */}
          <div className="absolute top-1/4 bottom-1/4 left-0 w-6 border-r border-t border-b border-white/40" />
          <div className="absolute top-1/4 bottom-1/4 right-0 w-6 border-l border-t border-b border-white/40" />

          {/* Home Players */}
          {radarData.home.map((pos, idx) => {
            const left = ((pos.x + 52.5) / 105) * 100;
            const top = ((pos.z + 34) / 68) * 100;
            return (
              <div
                key={`h_${idx}`}
                className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: homeTeam.primaryColor,
                  border: '1px solid #ffffff',
                }}
              />
            );
          })}

          {/* Away Players */}
          {radarData.away.map((pos, idx) => {
            const left = ((pos.x + 52.5) / 105) * 100;
            const top = ((pos.z + 34) / 68) * 100;
            return (
              <div
                key={`a_${idx}`}
                className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: awayTeam.primaryColor,
                  border: '1px solid #ffffff',
                }}
              />
            );
          })}

          {/* Ball */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-yellow-400 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-yellow-400 animate-ping"
            style={{
              left: `${((radarData.ball.x + 52.5) / 105) * 100}%`,
              top: `${((radarData.ball.z + 34) / 68) * 100}%`,
            }}
          />
        </div>

        {/* Bottom Right: Quick Key Controls Guide */}
        {gameMode === 'USER_VS_AI' && (
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2.5 text-[11px] text-slate-300 flex flex-col gap-1 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">CONTROLS:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">WASD</kbd> Move
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">SPACE</kbd> Shoot
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">K</kbd> Pass
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">L</kbd> Through Ball
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">SHIFT</kbd> Sprint
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
