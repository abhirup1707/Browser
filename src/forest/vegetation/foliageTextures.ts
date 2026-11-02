import * as THREE from 'three';

// High-resolution alpha-masked foliage & leaf textures
// Created dynamically with HTML5 Canvas to provide realistic game-engine foliage cards
// (similar to AAA game foliage cards: alpha cutout, detailed leaves, translucent veins)

export function createFoliageTextures() {
  const size = 512;

  // -------------------------------------------------------------
  // 1. Pine Needle Branch Card (Alpha-cutout evergreen needles)
  // -------------------------------------------------------------
  const pineCanvas = document.createElement('canvas');
  pineCanvas.width = size;
  pineCanvas.height = size;
  const pCtx = pineCanvas.getContext('2d')!;

  // Transparent background
  pCtx.clearRect(0, 0, size, size);

  // Central dark woody branch stem
  pCtx.strokeStyle = '#2b2118';
  pCtx.lineWidth = 14;
  pCtx.lineCap = 'round';
  pCtx.beginPath();
  pCtx.moveTo(size / 2, size);
  pCtx.bezierCurveTo(size / 2 - 10, size * 0.6, size / 2 + 15, size * 0.3, size / 2, 20);
  pCtx.stroke();

  // Dense, layered pine needles radiating outwards
  for (let y = size - 30; y > 30; y -= 4) {
    const progress = 1.0 - y / size; // 0 at bottom, 1 at top
    const branchWidth = (1.0 - Math.pow(progress - 0.3, 2)) * 180 + 40;
    const needleCount = 35;

    for (let i = 0; i < needleCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const angle = (Math.random() * 0.7 + 0.3) * side;
      const length = (Math.random() * 0.4 + 0.6) * (branchWidth / 2);
      const startX = size / 2 + (Math.random() - 0.5) * 12;

      // Color variation: dark forest green with subtle sunlit tips
      const shade = Math.floor(Math.random() * 25 + 30);
      const isTip = Math.random() > 0.7;
      pCtx.strokeStyle = isTip ? `rgb(${shade - 5}, ${shade + 35}, ${shade - 10})` : `rgb(${shade - 15}, ${shade + 15}, ${shade - 20})`;
      pCtx.lineWidth = Math.random() * 2.2 + 1.2;

      pCtx.beginPath();
      pCtx.moveTo(startX, y);
      const endX = startX + Math.sin(angle) * length;
      const endY = y - Math.cos(angle) * length * 0.65;
      pCtx.lineTo(endX, endY);
      pCtx.stroke();
    }
  }

  // -------------------------------------------------------------
  // 2. Dark Deciduous Oak Leaf Spray Card (Gnarled oak foliage)
  // -------------------------------------------------------------
  const oakCanvas = document.createElement('canvas');
  oakCanvas.width = size;
  oakCanvas.height = size;
  const oCtx = oakCanvas.getContext('2d')!;
  oCtx.clearRect(0, 0, size, size);

  // Gnarled branching stems
  oCtx.strokeStyle = '#221914';
  oCtx.lineWidth = 10;
  oCtx.lineCap = 'round';
  oCtx.beginPath();
  oCtx.moveTo(size / 2, size);
  oCtx.lineTo(size / 2 - 20, size * 0.65);
  oCtx.lineTo(size / 2 + 10, size * 0.35);
  oCtx.lineTo(size / 2 - 5, 40);
  oCtx.stroke();

  // Secondary twig splits
  const twigs = [
    { x1: size / 2 - 20, y1: size * 0.65, x2: 90, y2: size * 0.45 },
    { x1: size / 2 + 10, y1: size * 0.35, x2: 410, y2: size * 0.25 },
    { x1: size / 2 - 15, y1: size * 0.5, x2: 120, y2: size * 0.3 },
  ];
  oCtx.lineWidth = 5;
  twigs.forEach((tw) => {
    oCtx.beginPath();
    oCtx.moveTo(tw.x1, tw.y1);
    oCtx.lineTo(tw.x2, tw.y2);
    oCtx.stroke();
  });

  // Clustered dark oak leaves with lobes
  const drawLeaf = (cx: number, cy: number, rot: number, leafSize: number) => {
    oCtx.save();
    oCtx.translate(cx, cy);
    oCtx.rotate(rot);

    oCtx.beginPath();
    oCtx.moveTo(0, 0);
    oCtx.bezierCurveTo(-leafSize * 0.5, -leafSize * 0.3, -leafSize * 0.6, -leafSize * 0.7, 0, -leafSize);
    oCtx.bezierCurveTo(leafSize * 0.6, -leafSize * 0.7, leafSize * 0.5, -leafSize * 0.3, 0, 0);

    const green = Math.floor(Math.random() * 30 + 40);
    oCtx.fillStyle = `rgb(${green - 18}, ${green + 10}, ${green - 20})`;
    oCtx.fill();

    // Leaf vein
    oCtx.strokeStyle = 'rgba(15, 35, 15, 0.6)';
    oCtx.lineWidth = 1.5;
    oCtx.beginPath();
    oCtx.moveTo(0, 0);
    oCtx.lineTo(0, -leafSize * 0.9);
    oCtx.stroke();

    oCtx.restore();
  };

  for (let i = 0; i < 90; i++) {
    const lx = Math.random() * (size * 0.8) + size * 0.1;
    const ly = Math.random() * (size * 0.75) + 30;
    const rot = (Math.random() - 0.5) * 2.5;
    const lSize = Math.random() * 28 + 22;
    drawLeaf(lx, ly, rot, lSize);
  }

  // -------------------------------------------------------------
  // 3. Delicate Forest Fern Frond Card (Realistic pinnate frond)
  // -------------------------------------------------------------
  const fernCanvas = document.createElement('canvas');
  fernCanvas.width = size;
  fernCanvas.height = size;
  const fCtx = fernCanvas.getContext('2d')!;
  fCtx.clearRect(0, 0, size, size);

  // Central arching rachis/stem
  fCtx.strokeStyle = '#2d4726';
  fCtx.lineWidth = 8;
  fCtx.lineCap = 'round';
  fCtx.beginPath();
  fCtx.moveTo(size / 2, size - 10);
  fCtx.bezierCurveTo(size / 2 - 20, size * 0.6, size / 2 + 10, size * 0.25, size / 2 - 40, 20);
  fCtx.stroke();

  // Pinnae (leaflets) branching off both sides
  for (let y = size - 40; y > 35; y -= 9) {
    const prog = 1.0 - y / size;
    const pinnaLen = (1.0 - Math.pow(prog - 0.25, 2)) * 140 + 20;

    for (const side of [-1, 1]) {
      const angle = (0.75 + Math.random() * 0.15) * side;
      const startX = size / 2 + (Math.sin(prog * 3) * 15);

      fCtx.save();
      fCtx.translate(startX, y);
      fCtx.rotate(angle);

      // Serrated pinna blade
      fCtx.beginPath();
      fCtx.moveTo(0, 0);
      fCtx.bezierCurveTo(8, -pinnaLen * 0.3, 6, -pinnaLen * 0.7, 0, -pinnaLen);
      fCtx.bezierCurveTo(-6, -pinnaLen * 0.7, -8, -pinnaLen * 0.3, 0, 0);

      const fg = Math.floor(Math.random() * 25 + 65);
      fCtx.fillStyle = `rgb(${fg - 35}, ${fg}, ${fg - 40})`;
      fCtx.fill();

      fCtx.restore();
    }
  }

  // -------------------------------------------------------------
  // 4. Forest Grass Clump Card (Lush wild grass blades)
  // -------------------------------------------------------------
  const grassCanvas = document.createElement('canvas');
  grassCanvas.width = 256;
  grassCanvas.height = 256;
  const gCtx = grassCanvas.getContext('2d')!;
  gCtx.clearRect(0, 0, 256, 256);

  for (let i = 0; i < 45; i++) {
    const startX = 128 + (Math.random() - 0.5) * 50;
    const height = Math.random() * 140 + 70;
    const curve = (Math.random() - 0.5) * 75;

    gCtx.strokeStyle = Math.random() > 0.4 ? '#2e4c27' : '#3c6232';
    gCtx.lineWidth = Math.random() * 3 + 1.2;
    gCtx.lineCap = 'round';

    gCtx.beginPath();
    gCtx.moveTo(startX, 250);
    gCtx.quadraticCurveTo(startX + curve * 0.4, 250 - height * 0.5, startX + curve, 250 - height);
    gCtx.stroke();
  }

  // Wrap into Three.js textures with alpha testing
  const toTexture = (canvas: HTMLCanvasElement) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  return {
    pineTexture: toTexture(pineCanvas),
    oakTexture: toTexture(oakCanvas),
    fernTexture: toTexture(fernCanvas),
    grassTexture: toTexture(grassCanvas),
  };
}
