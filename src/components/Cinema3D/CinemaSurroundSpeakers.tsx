import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useBookingStore } from '../../store/bookingStore';

export const CinemaSurroundSpeakers: React.FC = () => {
  const isVideoPlaying = useBookingStore((s) => s.isVideoPlaying);
  const isVideoMuted = useBookingStore((s) => s.isVideoMuted);

  const materials = useMemo(() => {
    return {
      cabinet: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#222834'), // Visible dark slate cabinet
        roughness: 0.6,
        metalness: 0.25
      }),
      grille: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#384252'),
        roughness: 0.75
      }),
      wooferCone: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#526078'),
        roughness: 0.45,
        metalness: 0.4
      }),
      tweeterHorn: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#7888a2'),
        roughness: 0.3,
        metalness: 0.6
      }),
      // Dolby Atmos illuminated active status ring
      dolbyLed: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38bdf8') // Vivid Dolby Cyan LED
      }),
      dolbyLedMuted: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ea580c') // Warm amber standby LED
      })
    };
  }, []);

  const ledMaterial = !isVideoMuted && isVideoPlaying ? materials.dolbyLed : materials.dolbyLedMuted;

  // Speakers mounted at the top of the side walls
  const wallY = 8.4;
  const leftX = -8.2;
  const rightX = 8.2;
  const speakerZPositions = [-7.5, -3.0, 2.0, 7.0, 12.0];

  return (
    <group>
      {/* 1. LEFT WALL TOP SURROUND SPEAKERS */}
      {speakerZPositions.map((z, idx) => (
        <group
          key={`l-speaker-${idx}`}
          position={[leftX, wallY, z]}
          rotation={[0.3, -0.32, 0.1]} // Angled downward & inward toward audience
        >
          {/* Main Speaker Cabinet */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.65, 0.48]} />
            <primitive object={materials.cabinet} attach="material" />
          </mesh>

          {/* Front Grille Bezel */}
          <mesh position={[0.22, 0, 0]}>
            <boxGeometry args={[0.03, 0.6, 0.44]} />
            <primitive object={materials.grille} attach="material" />
          </mesh>

          {/* Upper Compression Horn Tweeter */}
          <mesh position={[0.24, 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.11, 0.04, 16]} />
            <primitive object={materials.tweeterHorn} attach="material" />
          </mesh>

          {/* Lower High-Excursion Woofer Cone */}
          <mesh position={[0.24, -0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.13, 0.1, 0.04, 24]} />
            <primitive object={materials.wooferCone} attach="material" />
          </mesh>

          {/* Glowing Dolby Atmos LED Accent Indicator Ring */}
          <mesh position={[0.245, 0, 0.16]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <primitive object={ledMaterial} attach="material" />
          </mesh>

          {/* Dedicated Spotlight Illuminating the Speaker (Prevents it from being in shadow!) */}
          <pointLight
            color="#bae6fd"
            intensity={1.4}
            distance={5.0}
            decay={1.8}
            position={[0.7, -0.1, 0]}
          />
        </group>
      ))}

      {/* 2. RIGHT WALL TOP SURROUND SPEAKERS */}
      {speakerZPositions.map((z, idx) => (
        <group
          key={`r-speaker-${idx}`}
          position={[rightX, wallY, z]}
          rotation={[0.3, 0.32, -0.1]} // Angled downward & inward toward audience
        >
          {/* Main Speaker Cabinet */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.65, 0.48]} />
            <primitive object={materials.cabinet} attach="material" />
          </mesh>

          {/* Front Grille Bezel */}
          <mesh position={[-0.22, 0, 0]}>
            <boxGeometry args={[0.03, 0.6, 0.44]} />
            <primitive object={materials.grille} attach="material" />
          </mesh>

          {/* Upper Compression Horn Tweeter */}
          <mesh position={[-0.24, 0.16, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.11, 0.04, 16]} />
            <primitive object={materials.tweeterHorn} attach="material" />
          </mesh>

          {/* Lower High-Excursion Woofer Cone */}
          <mesh position={[-0.24, -0.14, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.13, 0.1, 0.04, 24]} />
            <primitive object={materials.wooferCone} attach="material" />
          </mesh>

          {/* Glowing Dolby Atmos LED Accent Indicator Ring */}
          <mesh position={[-0.245, 0, 0.16]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <primitive object={ledMaterial} attach="material" />
          </mesh>

          {/* Dedicated Spotlight Illuminating the Speaker (Prevents it from being in shadow!) */}
          <pointLight
            color="#bae6fd"
            intensity={1.4}
            distance={5.0}
            decay={1.8}
            position={[-0.7, -0.1, 0]}
          />
        </group>
      ))}

      {/* 3. REAR WALL TOP SURROUND SPEAKERS */}
      {[-5.0, -1.8, 1.8, 5.0].map((x, idx) => (
        <group
          key={`rear-speaker-${idx}`}
          position={[x, wallY, 16.2]}
          rotation={[0.35, Math.PI, 0]} // Angled downward and forward toward audience
        >
          <mesh>
            <boxGeometry args={[0.48, 0.65, 0.38]} />
            <primitive object={materials.cabinet} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.44, 0.6, 0.03]} />
            <primitive object={materials.grille} attach="material" />
          </mesh>
          <mesh position={[0, -0.12, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.09, 0.03, 20]} />
            <primitive object={materials.wooferCone} attach="material" />
          </mesh>
          <mesh position={[0, 0.16, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 0.03, 16]} />
            <primitive object={materials.tweeterHorn} attach="material" />
          </mesh>
          <pointLight
            color="#bae6fd"
            intensity={1.1}
            distance={4.5}
            decay={1.8}
            position={[0, -0.2, 0.6]}
          />
        </group>
      ))}
    </group>
  );
};