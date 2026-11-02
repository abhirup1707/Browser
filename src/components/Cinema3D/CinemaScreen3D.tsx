import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBookingStore } from '../../store/bookingStore';

export const CinemaScreen3D: React.FC = () => {
  const isVideoMuted = useBookingStore((s) => s.isVideoMuted);
  const isVideoPlaying = useBookingStore((s) => s.isVideoPlaying);
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const selectedFormat = useBookingStore((s) => s.selectedFormat);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    // 1. Create HTML5 Video Element (Stream only)
    const video = document.createElement('video');
    video.src = '/ramayana-trailer.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.playsInline = true;
    video.muted = true; // Video element is always muted to comply with browser autoplay
    video.autoplay = true;

    // 2. Create High-Definition Audio Element (Dolby Atmos Audio Track)
    const audio = new Audio();
    audio.src = '/ramayana-trailer.f251.webm';
    audio.loop = true;
    audio.muted = isVideoMuted;
    audio.crossOrigin = 'anonymous';
    audio.onerror = () => {
      audio.src = '/ramayana-audio.m4a';
    };

    video.play().catch(() => {});

    // Sync audio to video time
    const syncInterval = setInterval(() => {
      if (video && audio && Math.abs(video.currentTime - audio.currentTime) > 0.15) {
        audio.currentTime = video.currentTime;
      }
    }, 500);

    // Three.js VideoTexture
    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    videoRef.current = video;
    audioRef.current = audio;
    setVideoTexture(texture);

    // Setup Web Audio API on first user gesture
    const initAudioGraph = () => {
      if (!audioCtxRef.current && audio) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          const source = ctx.createMediaElementSource(audio);

          // Cinematic Theater Subwoofer Bass Boost (85Hz, +6dB)
          const bassBoost = ctx.createBiquadFilter();
          bassBoost.type = 'lowshelf';
          bassBoost.frequency.value = 85;
          bassBoost.gain.value = 6.0;

          // Spatial Stereo Panner for Hall Positioning
          const panner = ctx.createStereoPanner();
          pannerRef.current = panner;

          source.connect(bassBoost);
          bassBoost.connect(panner);
          panner.connect(ctx.destination);
        } catch {
          // Fallback to standard audio element playback
        }
      }
    };

    window.addEventListener('click', initAudioGraph, { once: true });
    window.addEventListener('pointerdown', initAudioGraph, { once: true });

    return () => {
      clearInterval(syncInterval);
      video.pause();
      video.src = '';
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      texture.dispose();
      videoRef.current = null;
      audioRef.current = null;
    };
  }, []);

  // Spatial audio panning based on seat position in the hall
  useEffect(() => {
    if (pannerRef.current) {
      const seatNum = parseInt(activeViewingSeatId.slice(1), 10);
      if (!isNaN(seatNum)) {
        const panValue = Math.max(-0.6, Math.min(0.6, (seatNum - 16) / 14));
        pannerRef.current.pan.setTargetAtTime(
          panValue,
          audioCtxRef.current?.currentTime || 0,
          0.1
        );
      }
    }
  }, [activeViewingSeatId]);

  // Handle Mute / Unmute State
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isVideoMuted;
      if (!isVideoMuted) {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isVideoMuted]);

  // Handle Play / Pause
  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play().catch(() => {});
        if (!isVideoMuted) {
          audioRef.current.play().catch(() => {});
        }
      } else {
        videoRef.current.pause();
        audioRef.current.pause();
      }
    }
  }, [isVideoPlaying, isVideoMuted]);

  // DYNAMIC SCREEN SIZING BASED ON SELECTED FORMAT (2D, 3D, IMAX)
  // IMAX screens expand to towering 17.2m x 8.6m with dramatic curvature
  const { screenGeometry, frameGeometry, posY, badgeText, badgeColor } = useMemo(() => {
    let width = 15.6;
    let height = 6.8;
    let curvature = 1.15;
    let posY = 4.55;
    let badgeText = 'REALD 3D';
    let badgeColor = '#38bdf8';

    if (selectedFormat === 'IMAX') {
      width = 17.2;
      height = 8.6; // Massive IMAX 1.90:1 floor-to-ceiling scale
      curvature = 1.30;
      posY = 4.9;
      badgeText = 'IMAX with LASER';
      badgeColor = '#00e5ff';
    } else if (selectedFormat === '2D') {
      width = 14.5;
      height = 6.1; // Cinemascope standard 2.39:1 widescreen
      curvature = 0.85;
      posY = 4.35;
      badgeText = 'CINEMASCOPE 4K';
      badgeColor = '#a855f7';
    }

    const segmentsX = 48;
    const segmentsY = 18;

    const geom = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const normalizedX = x / (width / 2);
      const zOffset = Math.pow(normalizedX, 2) * curvature;
      pos.setZ(i, zOffset);
    }
    geom.computeVertexNormals();

    const frame = new THREE.PlaneGeometry(width + 0.45, height + 0.35, segmentsX, 2);
    const framePos = frame.attributes.position;
    for (let i = 0; i < framePos.count; i++) {
      const x = framePos.getX(i);
      const normalizedX = x / ((width + 0.45) / 2);
      const zOffset = Math.pow(normalizedX, 2) * curvature - 0.03;
      framePos.setZ(i, zOffset);
    }
    frame.computeVertexNormals();

    return {
      screenGeometry: geom,
      frameGeometry: frame,
      posY,
      badgeText,
      badgeColor,
      screenHeight: height
    };
  }, [selectedFormat]);

  // Procedural canvas badge above screen
  const badgeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    ctx.fillStyle = badgeColor;
    ctx.font = 'bold 36px "Inter", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [badgeText, badgeColor]);

  return (
    <group position={[0, posY, -10.7]}>
      {/* Matte Black Screen Bezel Frame (Mounted flush to front wall) */}
      <mesh geometry={frameGeometry}>
        <meshStandardMaterial
          color="#06070a"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Movie Screen Surface with Live Playing Video */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.02]}>
        {videoTexture ? (
          <meshBasicMaterial
            map={videoTexture}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial color="#1a1c24" roughness={0.5} />
        )}
      </mesh>

      {/* Format Badge atop screen (IMAX / 3D / 2D) */}
      {badgeTexture && (
        <mesh position={[0, (selectedFormat === 'IMAX' ? 4.55 : 3.65), 0]}>
          <planeGeometry args={[1.5, 0.38]} />
          <meshBasicMaterial map={badgeTexture} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Dynamic Screen Projection Glow into Auditorium */}
      <pointLight
        position={[0, 0, 1.2]}
        intensity={selectedFormat === 'IMAX' ? 4.2 : 3.2}
        distance={26}
        color="#ffa347"
        decay={1.8}
      />
      <pointLight
        position={[0, -1.2, 2.8]}
        intensity={2.0}
        distance={20}
        color="#ea580c"
        decay={2.0}
      />
    </group>
  );
};
