// Procedural Simplex & Fractional Brownian Motion Noise Generator
// Deterministic seeded pseudo-random number generator and gradient noise

export class SimplexNoise {
  private p: Uint8Array = new Uint8Array(256);
  private perm: Uint8Array = new Uint8Array(512);
  private permMod12: Uint8Array = new Uint8Array(512);

  constructor(seed: number = 42) {
    this.reseed(seed);
  }

  public reseed(seed: number): void {
    // Park-Miller / Lehmer LCG to generate seed table
    let s = Math.abs(seed) % 2147483647;
    if (s <= 0) s += 2147483646;

    const nextRandom = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    for (let i = 0; i < 256; i++) {
      this.p[i] = i;
    }

    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      const tmp = this.p[i];
      this.p[i] = this.p[j];
      this.p[j] = tmp;
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  // 2D Simplex Noise
  public noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1 = 0;
    let j1 = 0;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

    const grad3 = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1]
    ];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }

  // Fractional Brownian Motion (fBm)
  public fbm2D(
    x: number,
    y: number,
    octaves: number = 6,
    lacunarity: number = 2.0,
    gain: number = 0.5
  ): number {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  // Ridge Noise (sharp crags & ridges)
  public ridgeNoise2D(
    x: number,
    y: number,
    octaves: number = 4,
    lacunarity: number = 2.0,
    gain: number = 0.5
  ): number {
    let total = 0;
    let frequency = 1.0;
    let amplitude = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      let n = Math.abs(this.noise2D(x * frequency, y * frequency));
      n = 1.0 - n; // invert
      n = n * n; // sharpen
      total += n * amplitude;
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  // Domain Warped Noise (for organic geological folds and winding streams)
  public domainWarpFbm2D(x: number, y: number, warpScale: number = 0.005, warpAmp: number = 40): number {
    const qx = this.fbm2D(x * warpScale, y * warpScale, 3);
    const qy = this.fbm2D((x + 5.2) * warpScale, (y + 1.3) * warpScale, 3);

    return this.fbm2D((x + warpAmp * qx) * 0.003, (y + warpAmp * qy) * 0.003, 5);
  }
}
