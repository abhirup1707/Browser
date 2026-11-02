let audioCtx: AudioContext | null = null;
let crowdGainNode: GainNode | null = null;
let soundEnabled = true;

function getContext(): AudioContext | null {
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

export function setFifaSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (!enabled && crowdGainNode) {
    crowdGainNode.gain.value = 0;
  } else if (enabled && crowdGainNode) {
    crowdGainNode.gain.value = 0.15;
  }
}

/**
 * Authentic referee whistle (dual modulated high frequencies)
 */
export function playWhistle(type: 'short' | 'double' | 'long' = 'short') {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const bursts = type === 'double' ? [0, 0.2] : [0];
  const duration = type === 'long' ? 0.7 : 0.18;

  bursts.forEach((offset) => {
    const now = ctx.currentTime + offset;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2450, now);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2780, now);

    // Whistle bead trill modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(32, now);
    lfoGain.gain.setValueAtTime(45, now);
    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.setValueAtTime(0.35, now + duration - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);
    lfo.stop(now + duration + 0.05);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  });
}

/**
 * Ball kick sound (thud with punch based on shot power)
 */
export function playBallKick(power: number = 0.6) {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const startFreq = 160 + power * 90;
  const endFreq = 38;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.1);

  const vol = Math.min(0.8, 0.25 + power * 0.45);
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

/**
 * Metallic crossbar / post "CLANG!"
 */
export function playPostClang() {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [780, 1420, 2180, 3100];
  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(f, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(f, now);
    filter.Q.setValueAtTime(8, now);

    const decay = 0.6 - idx * 0.1;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + decay + 0.05);
  });
}

/**
 * Net ripple sound (soft swoosh)
 */
export function playNetRattle() {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const dur = 0.28;
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(250, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + dur);
}

/**
 * Crowd Goal Roar & stadium eruption
 */
export function playGoalRoar() {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const dur = 3.5;
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.linearRampToValueAtTime(850, now + 0.6);
  filter.frequency.exponentialRampToValueAtTime(320, now + dur);
  filter.Q.setValueAtTime(1.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.7, now + 0.4);
  gain.gain.setValueAtTime(0.65, now + 1.8);
  gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + dur);
}

/**
 * Crowd "Oooooh!" near miss reaction
 */
export function playCrowdNearMiss() {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const dur = 1.6;
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(700, now);
  filter.frequency.linearRampToValueAtTime(400, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.linearRampToValueAtTime(0.45, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + dur);
}

/**
 * Ambient background crowd murmur loop
 */
export function initAmbientCrowd() {
  if (!soundEnabled) return;
  const ctx = getContext();
  if (!ctx || crowdGainNode) return;

  const dur = 4.0;
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 380;
  filter.Q.value = 1.0;

  crowdGainNode = ctx.createGain();
  crowdGainNode.gain.value = 0.12;

  noise.connect(filter);
  filter.connect(crowdGainNode);
  crowdGainNode.connect(ctx.destination);

  noise.start();
}
