import React, { useState, useEffect } from 'react';
import type { JokeResult, HumorStyle, MemeFormat, SubjectCategory } from '../types/joke';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Flame,
  Laugh,
  Eye,
  Share2,
  ImageIcon,
  Send,
} from 'lucide-react';
import {
  playRimshot,
  playLaugh,
  playSadTrombone,
  playCheer,
  speakJoke,
  stopSpeaking,
} from '../services/soundEffects';
import { createMemeImage, downloadImage } from '../services/memeGenerator';
import confetti from 'canvas-confetti';

interface JokeDisplayProps {
  imageSrc: string;
  joke: JokeResult;
  humorStyle: HumorStyle;
  onReroll: () => void;
  onReset: () => void;
  onStyleChange: (style: HumorStyle) => void;
  onCategoryChange: (category: SubjectCategory) => void;
  onCustomContextSubmit: (context: string) => void;
  currentCategory?: SubjectCategory;
  isGenerating: boolean;
}

const CATEGORY_TAGS: { id: SubjectCategory; label: string; icon: string }[] = [
  { id: 'pet_cat', label: 'Cat / Feline', icon: '🐱' },
  { id: 'pet_dog', label: 'Dog / Canine', icon: '🐶' },
  { id: 'selfie_portrait', label: 'Selfie / Person', icon: '👤' },
  { id: 'tech_programmer', label: 'Code / Tech Screen', icon: '💻' },
  { id: 'food_chaos', label: 'Food / Cooking', icon: '🍳' },
  { id: 'gym_fail', label: 'Gym / Fitness', icon: '🏋️' },
  { id: 'diy_fail', label: 'DIY / Repair', icon: '🛠️' },
  { id: 'car_vehicle', label: 'Car / Vehicle', icon: '🚗' },
  { id: 'cluttered_chaos', label: 'Messy Room / Desk', icon: '📦' },
  { id: 'scenic_nature', label: 'Nature / Outdoor', icon: '🌿' },
];

export const JokeDisplay: React.FC<JokeDisplayProps> = ({
  imageSrc,
  joke,
  onReroll,
  onReset,
  onCategoryChange,
  onCustomContextSubmit,
  currentCategory,
  isGenerating,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | 'meme'>('photo');
  const [selectedFormat, setSelectedFormat] = useState<MemeFormat>('classic');
  const [memePreviewUrl, setMemePreviewUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [customContextInput, setCustomContextInput] = useState('');

  // Generate meme canvas preview whenever format or joke changes
  useEffect(() => {
    let active = true;
    createMemeImage({
      imageSrc,
      topText: joke.memeTop,
      bottomText: joke.memeBottom,
      headline: joke.headline,
      vibeTag: joke.vibeTag,
      format: selectedFormat,
    }).then((url) => {
      if (active) setMemePreviewUrl(url);
    });
    return () => {
      active = false;
    };
  }, [imageSrc, joke, selectedFormat]);

  // Subtle confetti burst only when spice is high (no loud automatic sounds!)
  useEffect(() => {
    if (joke.roastMeter > 85) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f97316', '#fbbf24', '#f43f5e'],
      });
    }
  }, [joke]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const narration = `${joke.headline}. Also, ${joke.subJokes[0] || ''}`;
    setIsSpeaking(true);
    speakJoke(
      narration,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(true);
    setTimeout(() => setCopiedHeadline(false), 2000);
  };

  const handleDownloadMeme = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await createMemeImage({
        imageSrc,
        topText: joke.memeTop,
        bottomText: joke.memeBottom,
        headline: joke.headline,
        vibeTag: joke.vibeTag,
        format: selectedFormat,
      });
      downloadImage(dataUrl, `laughlens-${selectedFormat}-meme.png`);
      playCheer();
    } catch (err) {
      console.error('Failed to export meme:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customContextInput.trim()) {
      onCustomContextSubmit(customContextInput.trim());
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Top Bar with Back and Reroll */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Photo</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReroll}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Reroll Roast</span>
          </button>
        </div>
      </div>

      {/* Subject Override & Custom Context Pill Bar */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="text-orange-400">🎯 Detected Subject:</span>
            <span className="text-slate-100 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              {joke.categoryDetected}
            </span>
            <span className="text-slate-400 font-normal hidden sm:inline">(Tap to change subject)</span>
          </div>

          {/* Quick context text input */}
          <form onSubmit={handleContextSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add photo clue (e.g. 'friend asleep on sofa')..."
              value={customContextInput}
              onChange={(e) => setCustomContextInput(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 w-full sm:w-64"
            />
            <button
              type="submit"
              disabled={!customContextInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40"
            >
              <Send className="w-3 h-3" />
              <span>Roast</span>
            </button>
          </form>
        </div>

        {/* Scrollable category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_TAGS.map((tag) => {
            const isCurrent = currentCategory === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onCategoryChange(tag.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Photo Preview + Punchline Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image with View Switcher */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* View mode toggle: Clean Photo vs Meme Card */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('photo')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'photo'
                  ? 'bg-slate-800 text-orange-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Clean Photo</span>
            </button>
            <button
              onClick={() => setViewMode('meme')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'meme'
                  ? 'bg-slate-800 text-orange-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Meme Card View</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group flex items-center justify-center min-h-[320px]">
            {viewMode === 'meme' && memePreviewUrl ? (
              <img
                src={memePreviewUrl}
                alt="Meme representation"
                className="w-full h-auto max-h-[480px] object-contain mx-auto"
              />
            ) : (
              <img
                src={imageSrc}
                alt="Analyzed subject"
                className="w-full h-auto max-h-[480px] object-contain mx-auto"
              />
            )}

            {/* Badge overlay on top corner */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-orange-400">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{joke.categoryDetected}</span>
            </div>

            {/* Source badge */}
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/85 border border-slate-700 text-slate-300 backdrop-blur-sm">
              {joke.source === 'gemini' ? '✨ Gemini Vision' : '⚡ Smart Heuristic AI'}
            </div>
          </div>

          {/* Meme Format Selectors & Download */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-orange-400" /> Meme Format:
              </span>
              <div className="flex gap-1">
                {(['classic', 'modern', 'polaroid'] as MemeFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setSelectedFormat(fmt);
                      setViewMode('meme');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all ${
                      selectedFormat === fmt && viewMode === 'meme'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Meme Button */}
            <button
              onClick={handleDownloadMeme}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 hover:border-orange-500/50 shadow-md"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Download Meme Image</span>
            </button>
          </div>
        </div>

        {/* Right Column: Roast Cards & Soundboard */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Hero Punchline Box */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-orange-500/30 shadow-2xl shadow-orange-500/5">
            {/* Top metadata tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm shadow-orange-500/20">
                  {joke.vibeTag}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-orange-400 border border-slate-700 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Roast Meter: {joke.roastMeter}%
                </span>
              </div>

              {/* Copy punchline */}
              <button
                onClick={() => handleCopy(joke.headline)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs flex items-center gap-1"
                title="Copy punchline"
              >
                {copiedHeadline ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Giant Punchline Text */}
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 leading-snug tracking-tight mb-5">
              &ldquo;{joke.headline}&rdquo;
            </blockquote>

            {/* Action Bar: TTS Narrator + Comedy Soundboard */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              {/* Comedian Voice Narration */}
              <button
                onClick={handleSpeak}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-orange-500/15 border border-orange-500/40 text-orange-300 hover:bg-orange-500/25'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-orange-400" />
                    <span>Narrate Joke 🎙️</span>
                  </>
                )}
              </button>

              {/* Comedic Sound FX Board */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 hidden sm:inline mr-1">
                  SFX:
                </span>
                <button
                  onClick={playRimshot}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                  title="Drumroll & Crash"
                >
                  🥁 Ba-dum-tss!
                </button>
                <button
                  onClick={playLaugh}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                  title="Audience Laugh"
                >
                  <Laugh className="w-3.5 h-3.5 text-yellow-400" /> Ha-ha!
                </button>
                <button
                  onClick={playSadTrombone}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                  title="Sad Trombone"
                >
                  🎺 Wah-wah
                </button>
              </div>
            </div>
          </div>

          {/* AI Forensic Detective Observations */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                AI Visual Crime Scene Observations:
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {joke.observations.map((obs, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">#{idx + 1}</span>
                  <span className="leading-relaxed">{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Alternative Jokes & Puns */}
          <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                Bonus Angles &amp; Alternative Puns:
              </h4>
            </div>
            <div className="flex flex-col gap-2.5">
              {joke.subJokes.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 text-xs sm:text-sm text-slate-300 flex items-center justify-between gap-3 group transition-all"
                >
                  <span className="leading-relaxed">&bull; {sub}</span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopy(sub)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                      title="Copy joke"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => speakJoke(sub)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                      title="Speak joke"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtag Cloud */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Hashtags:</span>
            {joke.suggestedHashtags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
