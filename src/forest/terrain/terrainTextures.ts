import * as THREE from 'three';

// Procedurally generates realistic textures for terrain layers:
// 1. Forest Floor (damp rich soil, decomposing leaves/needles, vibrant moss clumps)
// 2. Steep Rock Cliffs (dark stratified granite, cracks, mineral streaks)
// 3. Shoreline Mud / Silt (dark wet earth, small pebbles)
// 4. Detailed normal maps for dynamic light and flashlight glint

export function createProceduralTextures(): {
  forestGroundMap: THREE.CanvasTexture;
  forestGroundNormal: THREE.CanvasTexture;
  rockCliffMap: THREE.CanvasTexture;
  rockCliffNormal: THREE.CanvasTexture;
  mudShoreMap: THREE.CanvasTexture;
  waterNormalMap: THREE.CanvasTexture;
} {
  const size = 512;

  // 1. Forest Floor Texture
  const groundCanvas = document.createElement('canvas');
  groundCanvas.width = size;
  groundCanvas.height = size;
  const gCtx = groundCanvas.getContext('2d')!;

  // Base dark loam
  gCtx.fillStyle = '#1c1b18';
  gCtx.fillRect(0, 0, size, size);

  // Mottled soil and decaying organic matter
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 4 + 1;
    const shade = Math.floor(Math.random() * 25 + 20);
    gCtx.fillStyle = `rgb(${shade + 5}, ${shade}, ${shade - 5})`;
    gCtx.beginPath();
    gCtx.arc(x, y, r, 0, Math.PI * 2);
    gCtx.fill();
  }

  // Decomposing pine needles & dark twigs
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = Math.random() * 12 + 4;
    const angle = Math.random() * Math.PI * 2;
    gCtx.strokeStyle = Math.random() > 0.4 ? 'rgba(50, 42, 30, 0.7)' : 'rgba(30, 24, 18, 0.8)';
    gCtx.lineWidth = Math.random() * 1.5 + 0.5;
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gCtx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    gCtx.stroke();
  }

  // Patches of dark forest velvet moss
  for (let i = 0; i < 150; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rad = Math.random() * 35 + 10;
    const grad = gCtx.createRadialGradient(cx, cy, 2, cx, cy, rad);
    const gVal = Math.floor(Math.random() * 30 + 45);
    grad.addColorStop(0, `rgba(28, ${gVal + 15}, 22, 0.85)`);
    grad.addColorStop(0.7, `rgba(20, ${gVal}, 15, 0.4)`);
    grad.addColorStop(1, 'rgba(20, 30, 15, 0)');
    gCtx.fillStyle = grad;
    gCtx.beginPath();
    gCtx.arc(cx, cy, rad, 0, Math.PI * 2);
    gCtx.fill();
  }

  // 2. Ground Normal Map
  const gNormCanvas = document.createElement('canvas');
  gNormCanvas.width = size;
  gNormCanvas.height = size;
  const gnCtx = gNormCanvas.getContext('2d')!;
  gnCtx.fillStyle = '#8080ff'; // Neutral normal [0, 0, 1]
  gnCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 3 + 1;
    const nx = Math.floor(Math.random() * 60 + 98);
    const ny = Math.floor(Math.random() * 60 + 98);
    gnCtx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
    gnCtx.beginPath();
    gnCtx.arc(x, y, r, 0, Math.PI * 2);
    gnCtx.fill();
  }

  // 3. Steep Rock Cliff Texture
  const rockCanvas = document.createElement('canvas');
  rockCanvas.width = size;
  rockCanvas.height = size;
  const rCtx = rockCanvas.getContext('2d')!;

  rCtx.fillStyle = '#252627';
  rCtx.fillRect(0, 0, size, size);

  // Horizontal geological strata
  for (let y = 0; y < size; y += 4) {
    const darkness = Math.sin(y * 0.15) * 20 + (Math.random() - 0.5) * 15;
    const val = Math.max(15, Math.min(65, Math.floor(35 + darkness)));
    rCtx.fillStyle = `rgb(${val}, ${val + 2}, ${val + 4})`;
    rCtx.fillRect(0, y, size, 4);
  }

  // Vertical rock fissures / cracks
  for (let i = 0; i < 60; i++) {
    let rx = Math.random() * size;
    let ry = 0;
    rCtx.strokeStyle = 'rgba(10, 11, 12, 0.85)';
    rCtx.lineWidth = Math.random() * 2 + 1;
    rCtx.beginPath();
    rCtx.moveTo(rx, ry);
    while (ry < size) {
      rx += (Math.random() - 0.5) * 12;
      ry += Math.random() * 25 + 10;
      rCtx.lineTo(rx, ry);
    }
    rCtx.stroke();
  }

  // Lichen spots on rock
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 15 + 4;
    rCtx.fillStyle = Math.random() > 0.5 ? 'rgba(40, 52, 38, 0.4)' : 'rgba(65, 62, 50, 0.35)';
    rCtx.beginPath();
    rCtx.arc(x, y, r, 0, Math.PI * 2);
    rCtx.fill();
  }

  // 4. Rock Normal Map
  const rNormCanvas = document.createElement('canvas');
  rNormCanvas.width = size;
  rNormCanvas.height = size;
  const rnCtx = rNormCanvas.getContext('2d')!;
  rnCtx.fillStyle = '#8080ff';
  rnCtx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 8) {
    const ny = Math.floor(128 + Math.sin(y * 0.2) * 50);
    rnCtx.fillStyle = `rgb(128, ${ny}, 255)`;
    rnCtx.fillRect(0, y, size, 4);
  }

  // 5. Shoreline Mud / Silt
  const mudCanvas = document.createElement('canvas');
  mudCanvas.width = size;
  mudCanvas.height = size;
  const mCtx = mudCanvas.getContext('2d')!;
  mCtx.fillStyle = '#151412';
  mCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 4 + 1;
    mCtx.fillStyle = `rgba(35, 32, 28, ${Math.random() * 0.7 + 0.3})`;
    mCtx.beginPath();
    mCtx.arc(x, y, r, 0, Math.PI * 2);
    mCtx.fill();
  }

  // 6. Water Ripple Normal Map
  const wNormCanvas = document.createElement('canvas');
  wNormCanvas.width = size;
  wNormCanvas.height = size;
  const wnCtx = wNormCanvas.getContext('2d')!;
  wnCtx.fillStyle = '#8080ff';
  wnCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 30 + 10;
    const grad = wnCtx.createRadialGradient(x, y, 1, x, y, r);
    grad.addColorStop(0, 'rgba(160, 160, 255, 0.5)');
    grad.addColorStop(0.5, 'rgba(100, 100, 255, 0.4)');
    grad.addColorStop(1, 'rgba(128, 128, 255, 0)');
    wnCtx.fillStyle = grad;
    wnCtx.beginPath();
    wnCtx.arc(x, y, r, 0, Math.PI * 2);
    wnCtx.fill();
  }

  // Wrap into Three.js textures
  const makeTex = (canvas: HTMLCanvasElement, repeat: number = 32) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  return {
    forestGroundMap: makeTex(groundCanvas, 32),
    forestGroundNormal: makeTex(gNormCanvas, 32),
    rockCliffMap: makeTex(rockCanvas, 24),
    rockCliffNormal: makeTex(rNormCanvas, 24),
    mudShoreMap: makeTex(mudCanvas, 20),
    waterNormalMap: makeTex(wNormCanvas, 12),
  };
}
