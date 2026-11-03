import React, { useMemo } from 'react';
import * as THREE from 'three';

// Deterministic hash based on seatId to ensure each seat gets a persistent, unique persona
function hashSeatId(seatId: string): number {
  let hash = 0;
  for (let i = 0; i < seatId.length; i++) {
    hash = (hash << 5) - hash + seatId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-random number generator [0, 1) from seed & index
function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 997 + index * 1337) * 43758.5453;
  return x - Math.floor(x);
}

// Authentic cinema wardrobe palette (rich dark tones that catch ambient projector glow)
const WARDROBE_PALETTE = [
  '#1e2530', // Deep navy hoodie
  '#2a1c22', // Burgundy crewneck
  '#1b2720', // Forest slate jacket
  '#2a2622', // Espresso sweater
  '#222634', // Indigo dusk jacket
  '#2c1e1e', // Dark mahogany flannel
  '#19232c', // Midnight denim
  '#2c2833', // Deep heather violet
  '#34302a', // Warm charcoal bomber
  '#181a20', // Jet black track jacket
  '#282c35'  // Slate grey windbreaker
];

// Natural human skin tone spectrum
const SKIN_PALETTE = [
  '#f0cfc0', // Fair ivory
  '#e2b499', // Warm peach
  '#c79173', // Golden bronze
  '#9d6849', // Warm chestnut
  '#744830', // Deep cocoa
  '#533221'  // Rich espresso
];

// Natural hair colors
const HAIR_PALETTE = [
  '#121214', // Jet black
  '#241d19', // Dark brown
  '#38291f', // Chocolate brown
  '#4a3729', // Chestnut auburn
  '#1c1a1a', // Soft black
  '#2d241e'  // Deep mocha
];

// Shared materials across all audience members for high performance (60 FPS)
const sharedMaterials = {
  skin: SKIN_PALETTE.map(
    (c) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(c),
        roughness: 0.65,
        metalness: 0.05
      })
  ),
  wardrobe: WARDROBE_PALETTE.map(
    (c) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(c),
        roughness: 0.82,
        metalness: 0.04
      })
  ),
  hair: HAIR_PALETTE.map(
    (c) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(c),
        roughness: 0.9,
        metalness: 0.02
      })
  ),
  pants: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#14171f'), // Dark denim/black jeans
    roughness: 0.85
  }),
  glassesFrame: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0a0d14'),
    roughness: 0.4,
    metalness: 0.3
  }),
  glassesLens: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1e3a5f'),
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.75
  }),
  drinkCup: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b91c1c'), // Classic cinema red cup
    roughness: 0.5
  }),
  drinkLid: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e2e8f0'),
    roughness: 0.4
  }),
  popcornBucket: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ca8a04'), // Butter popcorn yellow
    roughness: 0.8
  })
};

interface AudienceMember3DProps {
  seatId: string;
  isFormat3D?: boolean;
}

export const AudienceMember3D: React.FC<AudienceMember3DProps> = ({
  seatId,
  isFormat3D = true
}) => {
  const seed = useMemo(() => hashSeatId(seatId), [seatId]);

  // Deterministic persona attributes
  const persona = useMemo(() => {
    const skinIdx = Math.floor(pseudoRandom(seed, 1) * SKIN_PALETTE.length);
    const outfitIdx = Math.floor(pseudoRandom(seed, 2) * WARDROBE_PALETTE.length);
    const hairIdx = Math.floor(pseudoRandom(seed, 3) * HAIR_PALETTE.length);
    const hairStyle = Math.floor(pseudoRandom(seed, 4) * 4); // 0: Crop, 1: Wavy, 2: Bun/Ponytail, 3: Cap
    const heightScale = 0.93 + pseudoRandom(seed, 5) * 0.14; // ±7% natural height variation
    const shoulderWidth = 0.33 + pseudoRandom(seed, 6) * 0.05; // 0.33m to 0.38m
    const headTiltY = (pseudoRandom(seed, 7) - 0.5) * 0.1; // Natural slight head rotation towards screen
    const leanZ = (pseudoRandom(seed, 8) - 0.5) * 0.04; // Natural posture tilt
    const wear3DGlasses = isFormat3D && pseudoRandom(seed, 9) > 0.2; // 80% wear 3D glasses in 3D/IMAX
    const hasCup = pseudoRandom(seed, 10) > 0.6; // 40% have a soda cup in their cupholder
    const hasPopcorn = !hasCup && pseudoRandom(seed, 11) > 0.7; // Some hold popcorn bucket in lap

    return {
      skinMat: sharedMaterials.skin[skinIdx],
      wardrobeMat: sharedMaterials.wardrobe[outfitIdx],
      hairMat: sharedMaterials.hair[hairIdx],
      hairStyle,
      heightScale,
      shoulderWidth,
      headTiltY,
      leanZ,
      wear3DGlasses,
      hasCup,
      hasPopcorn
    };
  }, [seed, isFormat3D]);

  const {
    skinMat,
    wardrobeMat,
    hairMat,
    hairStyle,
    heightScale,
    shoulderWidth,
    headTiltY,
    leanZ,
    wear3DGlasses,
    hasCup,
    hasPopcorn
  } = persona;

  return (
    <group scale={[1, heightScale, 1]} position={[0, 0, 0]}>
      {/* 1. LOWER BODY: Thighs resting on seat cushion extending toward -Z */}
      <group position={[0, 0.22, -0.09]}>
        <mesh>
          <boxGeometry args={[0.32, 0.09, 0.32]} />
          <primitive object={sharedMaterials.pants} attach="material" />
        </mesh>
      </group>

      {/* 2. LOWER LEGS / SHINS: Dropping from front of cushion toward floor */}
      <group position={[0, 0.11, -0.23]}>
        {/* Left Leg */}
        <mesh position={[-0.09, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.2, 12]} />
          <primitive object={sharedMaterials.pants} attach="material" />
        </mesh>
        {/* Right Leg */}
        <mesh position={[0.09, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.2, 12]} />
          <primitive object={sharedMaterials.pants} attach="material" />
        </mesh>
      </group>

      {/* 3. TORSO / HOODIE: Leaning slightly back into backrest at +Z */}
      <group position={[0, 0.46, 0.04]} rotation={[0.07, 0, leanZ]}>
        {/* Main Chest & Torso */}
        <mesh>
          <boxGeometry args={[shoulderWidth, 0.38, 0.18]} />
          <primitive object={wardrobeMat} attach="material" />
        </mesh>

        {/* Shoulders Contouring */}
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, shoulderWidth, 16]} />
          <primitive object={wardrobeMat} attach="material" />
        </mesh>

        {/* 4. ARMS: Resting along chair armrests */}
        {/* Left Arm */}
        <group position={[-shoulderWidth / 2 - 0.03, 0.04, -0.06]}>
          <mesh rotation={[0.3, 0, 0.1]}>
            <cylinderGeometry args={[0.04, 0.035, 0.28, 12]} />
            <primitive object={wardrobeMat} attach="material" />
          </mesh>
          {/* Forearm resting on armrest */}
          <mesh position={[-0.01, -0.11, -0.08]} rotation={[-0.5, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.03, 0.22, 12]} />
            <primitive object={wardrobeMat} attach="material" />
          </mesh>
          {/* Hand on armrest */}
          <mesh position={[-0.01, -0.13, -0.18]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[shoulderWidth / 2 + 0.03, 0.04, -0.06]}>
          <mesh rotation={[0.3, 0, -0.1]}>
            <cylinderGeometry args={[0.04, 0.035, 0.28, 12]} />
            <primitive object={wardrobeMat} attach="material" />
          </mesh>
          {/* Forearm resting on armrest */}
          <mesh position={[0.01, -0.11, -0.08]} rotation={[-0.5, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.03, 0.22, 12]} />
            <primitive object={wardrobeMat} attach="material" />
          </mesh>
          {/* Hand on armrest */}
          <mesh position={[0.01, -0.13, -0.18]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
        </group>

        {/* Popcorn Bucket in Lap (if selected) */}
        {hasPopcorn && (
          <group position={[0, -0.05, -0.18]} rotation={[-0.1, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.09, 0.065, 0.14, 16]} />
              <primitive object={sharedMaterials.popcornBucket} attach="material" />
            </mesh>
            {/* Popcorn top cluster */}
            <mesh position={[0, 0.075, 0]}>
              <sphereGeometry args={[0.075, 12, 10]} />
              <primitive object={sharedMaterials.popcornBucket} attach="material" />
            </mesh>
          </group>
        )}

        {/* 5. NECK */}
        <mesh position={[0, 0.22, 0.01]}>
          <cylinderGeometry args={[0.05, 0.055, 0.09, 14]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* 6. HEAD & FACE: Oriented towards the screen with subtle tilt */}
        <group position={[0, 0.32, 0.01]} rotation={[0.02, headTiltY, 0]}>
          {/* Head Shape */}
          <mesh scale={[0.88, 1.05, 0.95]}>
            <sphereGeometry args={[0.095, 20, 20]} />
            <primitive object={skinMat} attach="material" />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.088, 0, 0]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
          <mesh position={[0.088, 0, 0]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>

          {/* 7. HAIRSTYLE / HEADWEAR */}
          {hairStyle === 0 && (
            /* Short textured crop */
            <mesh position={[0, 0.035, 0.01]} scale={[0.92, 0.88, 0.98]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <primitive object={hairMat} attach="material" />
            </mesh>
          )}

          {hairStyle === 1 && (
            /* Voluminous wavy hair */
            <group position={[0, 0.04, 0.01]}>
              <mesh scale={[1.02, 0.95, 1.05]}>
                <sphereGeometry args={[0.105, 16, 16]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
              {/* Hair volume behind neck */}
              <mesh position={[0, -0.06, 0.04]} scale={[0.9, 0.7, 0.7]}>
                <sphereGeometry args={[0.09, 14, 14]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
            </group>
          )}

          {hairStyle === 2 && (
            /* Hair Bun / Topknot */
            <group position={[0, 0.035, 0.01]}>
              <mesh scale={[0.92, 0.88, 0.98]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
              {/* Top Bun */}
              <mesh position={[0, 0.095, 0.03]}>
                <sphereGeometry args={[0.045, 14, 14]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
            </group>
          )}

          {hairStyle === 3 && (
            /* Baseball Cap / Cinema Beanie */
            <group position={[0, 0.04, 0]}>
              {/* Cap Dome */}
              <mesh scale={[0.95, 0.75, 0.95]}>
                <sphereGeometry args={[0.105, 16, 16]} />
                <primitive object={wardrobeMat} attach="material" />
              </mesh>
              {/* Cap Visor (pointing forward toward -Z) */}
              <mesh position={[0, -0.01, -0.09]} rotation={[-0.15, 0, 0]}>
                <boxGeometry args={[0.12, 0.012, 0.08]} />
                <primitive object={wardrobeMat} attach="material" />
              </mesh>
            </group>
          )}

          {/* 8. 3D GLASSES (For 3D and IMAX Formats!) */}
          {wear3DGlasses && (
            <group position={[0, 0.01, -0.085]}>
              {/* Glasses frame bar */}
              <mesh>
                <boxGeometry args={[0.13, 0.022, 0.018]} />
                <primitive object={sharedMaterials.glassesFrame} attach="material" />
              </mesh>
              {/* Left Lens */}
              <mesh position={[-0.035, 0, -0.005]}>
                <boxGeometry args={[0.042, 0.024, 0.005]} />
                <primitive object={sharedMaterials.glassesLens} attach="material" />
              </mesh>
              {/* Right Lens */}
              <mesh position={[0.035, 0, -0.005]}>
                <boxGeometry args={[0.042, 0.024, 0.005]} />
                <primitive object={sharedMaterials.glassesLens} attach="material" />
              </mesh>
              {/* Left frame arm */}
              <mesh position={[-0.065, 0.005, 0.045]} rotation={[0, 0.1, 0]}>
                <boxGeometry args={[0.006, 0.012, 0.09]} />
                <primitive object={sharedMaterials.glassesFrame} attach="material" />
              </mesh>
              {/* Right frame arm */}
              <mesh position={[0.065, 0.005, 0.045]} rotation={[0, -0.1, 0]}>
                <boxGeometry args={[0.006, 0.012, 0.09]} />
                <primitive object={sharedMaterials.glassesFrame} attach="material" />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* 9. DRINK CUP IN RIGHT ARMREST CUPHOLDER (at x = 0.23, y = 0.34, z = -0.15) */}
      {hasCup && (
        <group position={[0.23, 0.39, -0.15]}>
          {/* Soda Cup Body */}
          <mesh>
            <cylinderGeometry args={[0.035, 0.026, 0.12, 14]} />
            <primitive object={sharedMaterials.drinkCup} attach="material" />
          </mesh>
          {/* White Plastic Lid */}
          <mesh position={[0, 0.062, 0]}>
            <cylinderGeometry args={[0.037, 0.037, 0.012, 14]} />
            <primitive object={sharedMaterials.drinkLid} attach="material" />
          </mesh>
          {/* Straw */}
          <mesh position={[0, 0.095, 0]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.08, 8]} />
            <primitive object={sharedMaterials.drinkLid} attach="material" />
          </mesh>
        </group>
      )}
    </group>
  );
};
