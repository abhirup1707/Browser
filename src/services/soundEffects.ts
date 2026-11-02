// Synthesized sound effects using the Web Audio API (Zero external assets needed!)

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Classic stand-up comedian rimshot: "Ba-dum Tsss!"
 */
export function playRimshot() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Kick thump (Ba)
  const kickOsc = ctx.createOscillator();
  const kickGain = ctx.createGain();
  kickOsc.type = 'sine';
  kickOsc.frequency.setValueAtTime(130, now);
  kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
  kickGain.gain.setValueAtTime(0.7, now);
  kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  kickOsc.connect(kickGain);
  kickGain.connect(ctx.destination);
  kickOsc.start(now);
  kickOsc.stop(now + 0.13);

  // 2. Snare tap (dum) at +0.13s
  const snareTime = now + 0.13;
  const snareOsc = ctx.createOscillator();
  const snareGain = ctx.createGain();
  snareOsc.type = 'triangle';
  snareOsc.frequency.setValueAtTime(180, snareTime);
  snareOsc.frequency.exponentialRampToValueAtTime(80, snareTime + 0.1);
  snareGain.gain.setValueAtTime(0.6, snareTime);
  snareGain.gain.exponentialRampToValueAtTime(0.001, snareTime + 0.1);
  snareOsc.connect(snareGain);
  snareGain.connect(ctx.destination);
  snareOsc.start(snareTime);
  snareOsc.stop(snareTime + 0.11);

  // Snare snap noise
  createNoiseBurst(ctx, snareTime, 0.08, 0.3, 1200);

  // 3. Cymbal crash (Tssss!) at +0.27s
  const cymbalTime = now + 0.27;
  createCymbalCrash(ctx, cymbalTime, 1.2, 0.45);
}

/**
 * Cartoon / Sitcom Laugh Track simulation (rhythmic vowel chuckles)
 */
export function playLaugh() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime;
  const chuckles = [
    { delay: 0.0, freq: 360, dur: 0.12 },
    { delay: 0.14, freq: 410, dur: 0.12 },
    { delay: 0.27, freq: 390, dur: 0.14 },
    { delay: 0.42, freq: 450, dur: 0.13 },
    { delay: 0.56, freq: 420, dur: 0.15 },
    { delay: 0.72, freq: 380, dur: 0.16 },
    { delay: 0.90, freq: 340, dur: 0.20 },
  ];

  chuckles.forEach((c) => {
    const t = startTime + c.delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(c.freq, t);
    osc.frequency.exponentialRampToValueAtTime(c.freq * 0.85, t + c.dur);

    // Formant filtering for "ha-ha" voice quality
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + c.dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + c.dur + 0.05);
  });
}

/**
 * Classic Sad Trombone: "Wah-wah-wah-waaaah"
 */
export function playSadTrombone() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 233.08, delay: 0.0, dur: 0.35 },  // Bb3
    { freq: 220.00, delay: 0.38, dur: 0.35 }, // A3
    { freq: 207.65, delay: 0.76, dur: 0.35 }, // Ab3
    { freq: 196.00, delay: 1.15, dur: 0.9, slideTo: 175.0 }, // G3 sliding down
  ];

  notes.forEach((n) => {
    const t = now + n.delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(n.freq, t);

    if (n.slideTo) {
      // Long wavering sad slide
      osc.frequency.setValueAtTime(n.freq, t + 0.2);
      osc.frequency.exponentialRampToValueAtTime(n.slideTo, t + n.dur);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    // Envelope for brass "wah"
    filter.frequency.linearRampToValueAtTime(1200, t + 0.08);
    filter.frequency.exponentialRampToValueAtTime(450, t + n.dur);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + n.dur + 0.05);
  });
}

/**
 * Cartoon spring boing sound
 */
export function playBoing() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(650, now + 0.3);

  // Modulation for spring twang
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(25, now);
  lfoGain.gain.setValueAtTime(30, now);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  lfo.start(now);
  osc.start(now);
  lfo.stop(now + 0.45);
  osc.stop(now + 0.45);
}

/**
 * Crowd Cheer & Victory chime
 */
export function playCheer() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Chord fanfare
  const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
  chord.forEach((freq, idx) => {
    const t = now + idx * 0.07;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.85);
  });

  // Crowd applause noise
  createNoiseBurst(ctx, now + 0.25, 1.2, 0.25, 2500);
}

function createNoiseBurst(ctx: AudioContext, time: number, duration: number, gainAmount: number, filterFreq: number) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, time);
  filter.Q.setValueAtTime(2, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainAmount, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(time);
  noise.stop(time + duration);
}

function createCymbalCrash(ctx: AudioContext, time: number, duration: number, gainAmount: number) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(6500, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainAmount, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  noise.connect(highpass);
  highpass.connect(gain);
  gain.connect(ctx.destination);

  noise.start(time);
  noise.stop(time + duration);
}

/**
 * Text-to-Speech comedy narration with pitch/rate tweaks
 */
export function speakJoke(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05;
  utterance.pitch = 1.08;

  // Prefer natural English voices if available
  const voices = window.speechSynthesis.getVoices();
  const comedicVoice =
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha'))) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0];

  if (comedicVoice) {
    utterance.voice = comedicVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
