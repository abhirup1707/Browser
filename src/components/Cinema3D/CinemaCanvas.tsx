import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CinemaAuditorium } from './CinemaAuditorium';
import { CinemaScreen3D } from './CinemaScreen3D';
import { CinemaSeats3D } from './CinemaSeats3D';
import { CinemaSurroundSpeakers } from './CinemaSurroundSpeakers';
import { CameraController3D } from './CameraController3D';

export const CinemaCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#050608] select-none overflow-hidden">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080b] z-20">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-red-900/30 border-t-red-500 animate-spin" />
            </div>
            <p className="text-white/80 font-medium tracking-wider text-sm">
              ENTERING 3D AUDITORIUM...
            </p>
          </div>
        }
      >
        <Canvas
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: 'high-performance'
          }}
          camera={{
            position: [0.5, 3.4, 4.25],
            fov: 56,
            near: 0.1,
            far: 100
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Base Ambient Room Lighting */}
          <ambientLight intensity={0.65} color="#2a2e3d" />

          {/* Warm directional fill simulating screen light reflections */}
          <directionalLight
            position={[0, 4.5, -6]}
            intensity={1.3}
            color="#fed7aa"
            target-position={[0, 1.8, 3]}
          />

          {/* Overhead soft fill */}
          <directionalLight
            position={[0, 9, 3]}
            intensity={0.45}
            color="#cbd5e1"
          />

          {/* Curved IMAX Screen Playing the Video */}
          <CinemaScreen3D />

          {/* Realistic Auditorium Interior with Central Aisle Stairs */}
          <CinemaAuditorium />

          {/* High-Mounted Dolby Atmos Surround Speakers on Walls (Not in shadow!) */}
          <CinemaSurroundSpeakers />

          {/* Cinema Seating Grid - Authentic non-square layout */}
          <CinemaSeats3D />

          {/* GSAP Camera Controller & 360° Drag */}
          <CameraController3D />
        </Canvas>
      </Suspense>
    </div>
  );
};
