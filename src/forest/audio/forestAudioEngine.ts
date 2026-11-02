// Procedural Spatial Web Audio Engine for Dark Forest Expedition
// Zero external asset dependencies - synthesized dynamically in real time

export class ForestAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  // Sound nodes
  private windGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  constructor() {}

  public init(): void {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupAmbientWind();
      this.setupDarkForestDrone();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  // Pink noise generator for realistic wind whistling through branches
  private setupAmbientWind(): void {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 380;
    this.windFilter.Q.value = 1.6;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.28;

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);
    whiteNoise.start();

    // Subtle wind gusts modulation
    setInterval(() => {
      if (!this.windFilter || !this.ctx) return;
      const t = this.ctx.currentTime;
      const targetFreq = 220 + Math.random() * 380;
      this.windFilter.frequency.exponentialRampToValueAtTime(targetFreq, t + 3.0);
    }, 4000);
  }

  // Ominous sub-bass forest drone
  private setupDarkForestDrone(): void {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 52.0; // Deep drone

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 95.0;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.2;

    osc.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);
    osc.start();
  }

  // Dynamic footstep sound matching the walking surface
  public playFootstep(surface: 'dirt' | 'water' | 'rock'): void {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    if (surface === 'water') {
      // Water splash / slosh
      const splash = this.ctx.createOscillator();
      splash.type = 'triangle';
      splash.frequency.setValueAtTime(140 + Math.random() * 60, t);
      splash.frequency.exponentialRampToValueAtTime(40, t + 0.18);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      splash.connect(gain);
      gain.connect(this.ctx.destination);
      splash.start(t);
      splash.stop(t + 0.18);
    } else if (surface === 'rock') {
      // Sharp clack on stone
      const click = this.ctx.createOscillator();
      click.type = 'sine';
      click.frequency.setValueAtTime(320 + Math.random() * 120, t);
      click.frequency.exponentialRampToValueAtTime(80, t + 0.08);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      click.connect(gain);
      gain.connect(this.ctx.destination);
      click.start(t);
      click.stop(t + 0.08);
    } else {
      // Crunchy leaf / twig / dirt step
      const noise = this.ctx.createBuffer(1, 0.07 * this.ctx.sampleRate, this.ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }

      const src = this.ctx.createBufferSource();
      src.buffer = noise;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 550 + Math.random() * 200;
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(t);
    }
  }

  // Flashlight click sound
  public playFlashlightClick(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  // Eerie distant raven/crow caw echoing through the dark forest
  public playEerieCrow(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.linearRampToValueAtTime(560, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 850;
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  // Scout ping sound
  public playPing(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.windGain && this.droneGain) {
      const v = this.isMuted ? 0 : 0.25;
      this.windGain.gain.value = v;
      this.droneGain.gain.value = this.isMuted ? 0 : 0.2;
    }
    return this.isMuted;
  }
}
