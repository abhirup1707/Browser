import React, { useMemo } from 'react';
import * as THREE from 'three';

interface CinemaExitDoorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const CinemaExitDoor: React.FC<CinemaExitDoorProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
  // Procedural Canvas Texture for the illuminated green EXIT sign
  const exitSignTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background - Authentic deep emergency green
    ctx.fillStyle = '#03412a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle inner gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    grad.addColorStop(0.5, 'rgba(5, 150, 105, 0.05)');
    grad.addColorStop(1, 'rgba(4, 120, 87, 0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Double illuminated green border
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // Glowing Green "EXIT" Typography
    ctx.fillStyle = '#f0fdf4';
    ctx.font = '900 110px "Inter", "Arial Black", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Soft neon glow
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 32;
    ctx.fillText('EXIT', canvas.width / 2, canvas.height / 2);

    // Second crisp text pass
    ctx.shadowBlur = 0;
    ctx.fillText('EXIT', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  const materials = useMemo(() => {
    return {
      frame: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0b0e14'),
        roughness: 0.65,
        metalness: 0.3
      }),
      doorLeaf: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141824'),
        roughness: 0.8,
        metalness: 0.1
      }),
      doorJamb: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#07090d'),
        roughness: 0.9
      }),
      pushBarRed: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b91c1c'),
        roughness: 0.4,
        metalness: 0.2
      }),
      pushBarMetal: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#64748b'),
        roughness: 0.3,
        metalness: 0.85
      }),
      signHousing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#090c12'),
        roughness: 0.5,
        metalness: 0.4
      }),
      thresholdLight: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#10b981'),
        emissive: new THREE.Color('#10b981'),
        emissiveIntensity: 1.8,
        roughness: 0.2
      })
    };
  }, []);

  const doorWidth = 1.18;
  const doorHeight = 2.4;

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Recessed Door Reveal / Jamb Cavity */}
      <mesh position={[-0.01, doorHeight / 2, 0]}>
        <boxGeometry args={[0.04, doorHeight + 0.08, doorWidth + 0.12]} />
        <primitive object={materials.doorJamb} attach="material" />
      </mesh>

      {/* 2. Heavy Cinema Acoustic Door Leaf */}
      <mesh position={[-0.025, doorHeight / 2, 0]}>
        <boxGeometry args={[0.03, doorHeight, doorWidth]} />
        <primitive object={materials.doorLeaf} attach="material" />
      </mesh>

      {/* 3. Door Frame Trim (Surround Architrave) */}
      {/* Left Vertical Frame */}
      <mesh position={[-0.04, doorHeight / 2, -doorWidth / 2 - 0.03]}>
        <boxGeometry args={[0.03, doorHeight + 0.06, 0.06]} />
        <primitive object={materials.frame} attach="material" />
      </mesh>
      {/* Right Vertical Frame */}
      <mesh position={[-0.04, doorHeight / 2, doorWidth / 2 + 0.03]}>
        <boxGeometry args={[0.03, doorHeight + 0.06, 0.06]} />
        <primitive object={materials.frame} attach="material" />
      </mesh>
      {/* Top Header Lintel */}
      <mesh position={[-0.04, doorHeight + 0.03, 0]}>
        <boxGeometry args={[0.03, 0.06, doorWidth + 0.12]} />
        <primitive object={materials.frame} attach="material" />
      </mesh>

      {/* 4. Panic Push Bar (Emergency Crash Bar at Waist Height ~1.05m) */}
      <group position={[-0.06, 1.05, 0]}>
        {/* Horizontal Push Bar */}
        <mesh>
          <boxGeometry args={[0.03, 0.07, doorWidth - 0.24]} />
          <primitive object={materials.pushBarRed} attach="material" />
        </mesh>
        {/* Mounting Brackets */}
        {[-doorWidth / 2 + 0.14, doorWidth / 2 - 0.14].map((zPos, idx) => (
          <mesh key={`bracket-${idx}`} position={[0.02, 0, zPos]}>
            <boxGeometry args={[0.035, 0.12, 0.04]} />
            <primitive object={materials.pushBarMetal} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 5. ILLUMINATED GREEN "EXIT" SIGN (Mounted directly above the door) */}
      <group position={[-0.05, doorHeight + 0.26, 0]}>
        {/* Housing Enclosure Box */}
        <mesh position={[0.015, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.65]} />
          <primitive object={materials.signHousing} attach="material" />
        </mesh>

        {/* Glowing Face Plate with "EXIT" in Green */}
        {exitSignTexture && (
          <mesh position={[-0.012, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.62, 0.26]} />
            <meshBasicMaterial
              map={exitSignTexture}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Dedicated Green Emergency Glow Light */}
        <pointLight
          color="#10b981"
          intensity={2.4}
          distance={4.8}
          decay={1.9}
          position={[-0.45, -0.05, 0]}
        />
      </group>

      {/* 6. Green Illuminated Floor Egress Guide Strip */}
      <mesh position={[-0.04, 0.01, 0]}>
        <boxGeometry args={[0.08, 0.02, doorWidth + 0.1]} />
        <primitive object={materials.thresholdLight} attach="material" />
      </mesh>
    </group>
  );
};
