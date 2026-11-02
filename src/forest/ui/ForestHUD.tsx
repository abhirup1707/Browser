import React, { useState, useEffect, useRef } from 'react';
import type { GameEngineStats } from '../gameEngine';
import type { WeatherPreset } from '../atmosphere/skyAndLighting';
import {
  Map as MapIcon,
  Sun,
  Moon,
  CloudFog,
  Volume2,
  VolumeX,
  Shuffle,
  Eye,
  Flashlight,
  Navigation2,
  Radio,
  Users,
  Info,
  X
} from 'lucide-react';

interface ForestHUDProps {
  stats: GameEngineStats | null;
  onWeatherChange: (w: WeatherPreset) => void;
  onReseed: (seed?: number) => void;
  onToggleAudio: () => boolean;
  onInitAudio: () => void;
  onRequestLock: () => void;
  isAudioMuted: boolean;
}

export const ForestHUD: React.FC<ForestHUDProps> = ({
  stats,
  onWeatherChange,
  onReseed,
  onToggleAudio,
  onInitAudio,
  onRequestLock,
  isAudioMuted,
}) => {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [customSeedInput, setCustomSeedInput] = useState<string>('');
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Toggle map on 'M' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        setShowMap((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Draw Topographical Scout Map
  useEffect(() => {
    if (!showMap || !mapCanvasRef.current || !stats) return;
    const canvas = mapCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = canvas.width;

    // Dark parchment background
    ctx.fillStyle = '#141c19';
    ctx.fillRect(0, 0, size, size);

    // Grid coordinates
    ctx.strokeStyle = 'rgba(74, 94, 84, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // World bounds: -450 to +450 mapped to [0, size]
    const worldToMap = (wx: number, wz: number) => {
      const x = ((wx + 450) / 900) * size;
      const y = ((wz + 450) / 900) * size;
      return { x, y };
    };

    // River curve
    ctx.strokeStyle = '#1e4854';
    ctx.lineWidth = 12;
    ctx.beginPath();
    for (let wz = -400; wz <= 400; wz += 20) {
      const wx = Math.sin(wz * 0.008) * 110;
      const pt = worldToMap(wx, wz);
      if (wz === -400) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Swamp Lake at (-80, -20)
    const lakePt = worldToMap(-80, -20);
    ctx.fillStyle = '#173f38';
    ctx.beginPath();
    ctx.arc(lakePt.x, lakePt.y, 35, 0, Math.PI * 2);
    ctx.fill();

    // Destination City at (340, -340)
    const cityPt = worldToMap(340, -340);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.arc(cityPt.x, cityPt.y, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cityPt.x, cityPt.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText('SANCTUARY CITY (GOAL)', cityPt.x, cityPt.y - 14);

    // Player position
    const pPt = worldToMap(stats.playerPos.x, stats.playerPos.z);

    // Trail line from player to city
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pPt.x, pPt.y);
    ctx.lineTo(cityPt.x, cityPt.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player icon
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pPt.x, pPt.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Player heading cone
    const headingRad = (stats.headingDeg * Math.PI) / 180;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.moveTo(pPt.x, pPt.y);
    ctx.arc(pPt.x, pPt.y, 24, headingRad - 0.45, headingRad + 0.45);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText('YOU', pPt.x, pPt.y + 20);
  }, [showMap, stats]);

  if (!stats) return null;

  // Calculate compass markers
  const heading = stats.headingDeg;
  // Calculate angle to city (340, -340)
  const dxCity = 340 - stats.playerPos.x;
  const dzCity = -340 - stats.playerPos.z;
  let angleToCityDeg = (Math.atan2(dxCity, -dzCity) * 180) / Math.PI;
  if (angleToCityDeg < 0) angleToCityDeg += 360;

  // Relative bearing to city (-180 to +180)
  let relBearing = angleToCityDeg - heading;
  while (relBearing > 180) relBearing -= 360;
  while (relBearing < -180) relBearing += 360;

  return (
    <div className="absolute inset-0 pointer-events-none select-none text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* 1. VR / First-Person Center Reticle & Scout Monocular Zoom Overlay */}
      {stats.isZooming ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Scout Binocular / Monocular Vignette */}
          <div className="w-[520px] h-[520px] rounded-full border-8 border-black/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.88)] relative flex items-center justify-center overflow-hidden">
            {/* Reticle crosshairs and range scale */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-950/15 to-black/50" />
            <div className="w-full h-[1px] bg-amber-400/50 absolute" />
            <div className="h-full w-[1px] bg-amber-400/50 absolute" />
            {/* Range ticks */}
            <div className="w-16 h-[2px] bg-amber-400/80 absolute top-[30%]" />
            <div className="w-24 h-[2px] bg-amber-400/80 absolute top-[40%]" />
            <div className="w-24 h-[2px] bg-amber-400/80 absolute bottom-[40%]" />
            <div className="w-16 h-[2px] bg-amber-400/80 absolute bottom-[30%]" />
            <div className="absolute bottom-12 text-xs font-mono tracking-widest text-amber-400/90 font-bold">
              SCOUT MONOCULAR &bull; {stats.distToCity}m TO CITY
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Minimal organic scout crosshair */}
          <div className="w-2 h-2 rounded-full border border-white/60 bg-white/20 backdrop-blur-xs" />
        </div>
      )}

      {/* 2. Top Header: Scout Compass Ribbon & Goal Tracker */}
      <header className="w-full pt-4 px-6 flex flex-col items-center pointer-events-auto">
        {/* Compass Ribbon */}
        <div className="relative w-96 h-12 bg-slate-950/80 backdrop-blur-md rounded-full border border-slate-700/60 shadow-2xl flex items-center justify-center overflow-hidden px-4">
          {/* Compass ticks banner */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((offset) => {
              const deg = (heading + offset + 360) % 360;
              let label = `${deg}°`;
              if (deg >= 345 || deg < 15) label = 'N';
              else if (deg >= 30 && deg < 60) label = 'NE';
              else if (deg >= 75 && deg < 105) label = 'E';
              else if (deg >= 120 && deg < 150) label = 'SE';
              else if (deg >= 165 && deg < 195) label = 'S';
              else if (deg >= 210 && deg < 240) label = 'SW';
              else if (deg >= 255 && deg < 285) label = 'W';
              else if (deg >= 300 && deg < 330) label = 'NW';

              const isCardinal = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].includes(label);

              return (
                <div
                  key={offset}
                  className={`absolute flex flex-col items-center transition-all ${
                    isCardinal ? 'text-amber-400 font-bold text-xs' : 'text-slate-400 text-[10px]'
                  }`}
                  style={{ transform: `translateX(${offset * 1.5}px)` }}
                >
                  <span>{label}</span>
                  <div className={`w-[1px] ${isCardinal ? 'h-2 bg-amber-400' : 'h-1 bg-slate-500'}`} />
                </div>
              );
            })}
          </div>

          {/* Center Marker Line */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10" />

          {/* City Goal Waypoint Needle */}
          <div
            className="absolute top-1 z-20 transition-transform duration-100 flex flex-col items-center"
            style={{
              transform: `translateX(${Math.max(-160, Math.min(160, relBearing * 1.5))}px)`,
            }}
          >
            <Navigation2 className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-[9px] font-black tracking-wider text-amber-300">CITY</span>
          </div>
        </div>

        {/* Objective Pill */}
        <div className="mt-2.5 px-4 py-1.5 bg-slate-900/85 backdrop-blur-md rounded-full border border-amber-500/40 shadow-lg flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold tracking-wide">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>EXPEDITION OBJECTIVE:</span>
          </div>
          <span className="text-slate-300">Cross Blackwood Forest to Sanctuary City</span>
          <span className="text-amber-300 font-mono font-bold bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-600/40">
            {stats.distToCity}m
          </span>
        </div>
      </header>

      {/* 3. Top-Right: Controls & World Seed Quick Bar */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 pointer-events-auto">
        {/* Weather Selector */}
        <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-lg space-x-1">
          <button
            onClick={() => onWeatherChange('RARE_SUNLIGHT')}
            title="Rare Sunlight Morning"
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 font-medium transition ${
              stats.weather === 'RARE_SUNLIGHT'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Sunlight</span>
          </button>
          <button
            onClick={() => onWeatherChange('TWILIGHT_FOG')}
            title="Twilight Fog"
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 font-medium transition ${
              stats.weather === 'TWILIGHT_FOG'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudFog className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Fog</span>
          </button>
          <button
            onClick={() => onWeatherChange('MIDNIGHT_EXPEDITION')}
            title="Midnight Crossing"
            className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 font-medium transition ${
              stats.weather === 'MIDNIGHT_EXPEDITION'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Night</span>
          </button>
        </div>

        {/* Randomize World Seed */}
        <button
          onClick={() => onReseed()}
          title="Regenerate Random World Seed"
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700/60 shadow-lg flex items-center space-x-1.5 text-xs font-medium transition active:scale-95"
        >
          <Shuffle className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Random World</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            onInitAudio();
            onToggleAudio();
          }}
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700/60 shadow-lg transition active:scale-95"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
        </button>

        {/* Topo Map Toggle */}
        <button
          onClick={() => setShowMap(!showMap)}
          title="Open Scout Topographic Map [M]"
          className={`p-2 rounded-xl border shadow-lg transition active:scale-95 flex items-center space-x-1 ${
            showMap
              ? 'bg-amber-500/30 text-amber-300 border-amber-500'
              : 'bg-slate-900/80 text-slate-200 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <MapIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold hidden sm:inline">[M]</span>
        </button>

        {/* Help Toggle */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          title="Controls & Guide"
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700/60 shadow-lg transition active:scale-95"
        >
          <Info className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      {/* 4. Bottom-Left: Scout Status, Stamina, Flashlight & Water Warning */}
      <footer className="w-full pb-4 px-6 flex justify-between items-end pointer-events-auto">
        <div className="flex flex-col space-y-2">
          {/* Water wading badge */}
          {stats.isInWater && (
            <div className="bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 w-max animate-bounce">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Wading in swamp water (movement slowed)</span>
            </div>
          )}

          <div className="bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 shadow-2xl flex items-center space-x-4">
            {/* Stamina Meter */}
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>STAMINA</span>
                <span className="text-amber-400 font-bold">{stats.stamina}%</span>
              </div>
              <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className={`h-full transition-all duration-100 ${
                    stats.stamina > 40
                      ? 'bg-emerald-500'
                      : stats.stamina > 15
                      ? 'bg-amber-500'
                      : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${stats.stamina}%` }}
                />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />

            {/* Flashlight Status */}
            <div className="flex items-center space-x-2">
              <Flashlight
                className={`w-5 h-5 ${
                  stats.flashlightOn ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-slate-600'
                }`}
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono">TORCH [F]</span>
                <span
                  className={`text-xs font-bold ${stats.flashlightOn ? 'text-emerald-400' : 'text-slate-500'}`}
                >
                  {stats.flashlightOn ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />

            {/* Teammates Squad Status */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono">SQUAD</span>
                <span className="text-xs font-bold text-slate-200">3 Scouts Nearby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right: FPS & Coordinate telemetry */}
        <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800/80 shadow-lg text-[11px] font-mono text-slate-400 flex items-center space-x-3">
          <span>{stats.fps} FPS</span>
          <span className="text-slate-600">&bull;</span>
          <span>
            POS: {Math.round(stats.playerPos.x)}, {Math.round(stats.playerPos.z)}
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>SEED: {stats.seed}</span>
        </div>
      </footer>

      {/* 5. Click-to-Enter VR / First-Person Overlay (When pointer is unlocked) */}
      {!stats.isLocked && (
        <div
          onClick={() => {
            onInitAudio();
            onRequestLock();
          }}
          className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-auto cursor-pointer z-40 transition-opacity"
        >
          <div
            onClick={() => {
              // Clicking inside also triggers entry
              onInitAudio();
              onRequestLock();
            }}
            className="bg-slate-900/95 border border-amber-500/40 p-8 rounded-3xl shadow-2xl max-w-md text-center flex flex-col items-center space-y-4 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Eye className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-wider text-slate-100 uppercase">
                PEAK: BLACKWOOD EXPEDITION
              </h1>
              <p className="text-xs text-amber-400/90 font-medium tracking-wide mt-1">
                First-Person Atmospheric Dark Forest Survival
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Stranded on the edge of the dark wilderness, your expedition must cross the misty, scary forest, scale
              mountain ridges, and reach the glowing <strong className="text-amber-400">Sanctuary City</strong> on the horizon.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 w-full pt-1">
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">WASD / Arrows</span>: Hike
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">Mouse Look</span>: 360° VR View
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">Shift</span>: Sprint / Climb
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">Right Click</span>: Monocular Zoom
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">F</span>: Flashlight Beam
              </div>
              <div className="bg-slate-800/70 p-2 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 font-bold">E</span>: Ping Teammates
              </div>
            </div>

            <div className="w-full pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInitAudio();
                  onRequestLock();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-95 cursor-pointer text-slate-950 font-black text-sm rounded-xl tracking-wider uppercase transition shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2"
              >
                <span>CLICK TO ENTER FIRST-PERSON VIEW</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Topographical Map Modal (Toggle M) */}
      {showMap && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center max-w-xl w-full">
            <div className="w-full flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <MapIcon className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-slate-100">SCOUT EXPEDITION MAP</h2>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <canvas
              ref={mapCanvasRef}
              width={480}
              height={480}
              className="rounded-2xl border-2 border-slate-700/70 shadow-inner w-full max-w-[480px] aspect-square"
            />

            <div className="w-full mt-4 flex justify-between items-center text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-sky-400" />
                  <span>You</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Sanctuary City (Goal)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-700" />
                  <span>Blackwood River & Bog</span>
                </div>
              </div>
              <span className="font-mono">{stats.distToCity}m to destination</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Help & Controls Modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Info className="w-5 h-5 text-amber-400" />
                <span>EXPEDITION GUIDE & CONTROLS</span>
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Welcome to <strong>Outrun the Dark: The Crossing</strong>. You and your scout squad must traverse
                an organic, procedural 3D dark forest to reach the illuminated city beacon on the far horizon.
              </p>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">Mouse:</span>
                  <span>Look in any direction (360° VR view)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">WASD / Arrows:</span>
                  <span>Walk across the terrain</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">Left Shift:</span>
                  <span>Sprint (consumes stamina)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">Spacebar:</span>
                  <span>Jump over fallen logs & rocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">C / Left Ctrl:</span>
                  <span>Crouch through low foliage</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">Right Mouse Button:</span>
                  <span>Scout Monocular / Binocular Zoom</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">F:</span>
                  <span>Toggle Handheld Flashlight</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">E:</span>
                  <span>Ping Waypoint Beacon for Squad</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-amber-400">M:</span>
                  <span>Toggle Topographical Scout Map</span>
                </div>
              </div>

              {/* Custom Seed Input */}
              <div className="pt-2 flex flex-col space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">CUSTOM WORLD SEED</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Enter seed (e.g. 98412)"
                    value={customSeedInput}
                    onChange={(e) => setCustomSeedInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => {
                      const seedNum = parseInt(customSeedInput, 10);
                      if (!isNaN(seedNum)) {
                        onReseed(seedNum);
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
