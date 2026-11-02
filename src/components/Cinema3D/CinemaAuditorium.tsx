import React from 'react';
import * as THREE from 'three';
import { CinemaExitDoor } from './CinemaExitDoor';

export const CinemaAuditorium: React.FC = () => {
  const roomLength = 32.0;
  const roomHeight = 10.5;

  // Risers for 12 rows (A to L)
  // Rows A-D: Dress Circle (Front)
  // Rows E-I: Premium (Middle)
  // Rows J-L: Balcony (Elevated Top)
  const riserSteps = [
    // Dress Circle (Front)
    { zStart: -4.0, height: 0.35 },
    { zStart: -2.65, height: 0.67 },
    { zStart: -1.3, height: 0.99 },
    { zStart: 0.05, height: 1.31 },
    // Premium (Middle Sweet Spot)
    { zStart: 1.9, height: 1.85 },
    { zStart: 3.28, height: 2.2 },
    { zStart: 4.66, height: 2.55 },
    { zStart: 6.04, height: 2.9 },
    { zStart: 7.42, height: 3.25 },
    // Balcony (Top Tier)
    { zStart: 9.2, height: 3.8 },
    { zStart: 10.62, height: 4.22 },
    { zStart: 12.04, height: 4.64 }
  ];

  return (
    <group>
      {/* 1. Main Base Floor with Carpet Texture Color */}
      <mesh position={[0, -0.2, 3]}>
        <boxGeometry args={[20.0, 0.4, roomLength + 6]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.92} />
      </mesh>

      {/* 2. Stepped Seating Risers (Separated into Left Platform, Right Platform, and Center Stairs) */}
      {riserSteps.map((step, idx) => {
        const stepDepth = 1.35;

        return (
          <group key={`riser-${idx}`}>
            {/* Left Seating Platform (x < -0.65) */}
            <mesh position={[-4.75, step.height / 2, step.zStart + stepDepth / 2]}>
              <boxGeometry args={[8.2, step.height, stepDepth]} />
              <meshStandardMaterial color="#10131b" roughness={0.9} metalness={0.05} />
            </mesh>

            {/* Right Seating Platform (x > +0.65) */}
            <mesh position={[4.75, step.height / 2, step.zStart + stepDepth / 2]}>
              <boxGeometry args={[8.2, step.height, stepDepth]} />
              <meshStandardMaterial color="#10131b" roughness={0.9} metalness={0.05} />
            </mesh>

            {/* Central Aisle Staircase Step */}
            <mesh position={[0, step.height / 2, step.zStart + stepDepth / 2]}>
              <boxGeometry args={[1.3, step.height, stepDepth]} />
              <meshStandardMaterial color="#141724" roughness={0.88} />
            </mesh>

            {/* STAIRCASE LIGHT: STRICTLY CONFINED TO CENTRAL AISLE (Width 1.2m - Never cuts through chairs!) */}
            <mesh position={[0, step.height + 0.012, step.zStart + 0.03]}>
              <boxGeometry args={[1.2, 0.02, 0.035]} />
              <meshStandardMaterial
                color="#ea580c"
                emissive="#ea580c"
                emissiveIntensity={2.0}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* 3. Ceiling with Recessed Downlights */}
      <mesh position={[0, roomHeight, 3]}>
        <boxGeometry args={[20.0, 0.2, roomLength + 6]} />
        <meshStandardMaterial color="#0f1118" roughness={0.95} />
      </mesh>

      {/* Ceiling Downlight Spots */}
      {[-4.0, 0, 4.0].map((x, xi) =>
        [-5.0, 0.0, 5.0, 10.0].map((z, zi) => (
          <group key={`downlight-${xi}-${zi}`} position={[x, roomHeight - 0.06, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.09, 0.18, 24]} />
              <meshBasicMaterial color="#222633" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.01, 0]}>
              <circleGeometry args={[0.08, 24]} />
              <meshBasicMaterial color="#ffedd5" />
            </mesh>
            <pointLight
              color="#fed7aa"
              intensity={0.65}
              distance={8.5}
              decay={2}
              position={[0, -0.2, 0]}
            />
          </group>
        ))
      )}

      {/* 4. LEFT AUDITORIUM WALL (Tapered / angled slightly inward toward screen) */}
      <group position={[-8.5, roomHeight / 2, 3]} rotation={[0, 0.035, 0]}>
        {/* Main Acoustic Wall Slab */}
        <mesh>
          <boxGeometry args={[0.3, roomHeight, roomLength + 6]} />
          <meshStandardMaterial color="#131620" roughness={0.88} />
        </mesh>

        {/* Acoustic Rib Panels */}
        {[-8, -4, 0, 4, 8, 12].map((pz, pi) => (
          <mesh key={`l-panel-${pi}`} position={[0.16, 0, pz]}>
            <boxGeometry args={[0.04, roomHeight - 1, 3.0]} />
            <meshStandardMaterial color="#181c28" roughness={0.85} />
          </mesh>
        ))}

        {/* SIGNATURE FRONT AMBER LED LIGHT STRIP (Visible framing the screen!) */}
        <group position={[0.18, 0, -8.5]}>
          {/* Vertical LED Strip running from floor to ceiling */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 8.5, 0.08]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          {/* Horizontal ceiling return bend */}
          <mesh position={[-0.45, 4.25, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[1.6, 0.08, 0.08]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          {/* Warm Ambient Wall Illumination */}
          <pointLight
            color="#ff8c1a"
            intensity={3.2}
            distance={12}
            decay={1.8}
            position={[0.8, 1.0, 0]}
          />
        </group>

        {/* Secondary Mid-Auditorium Amber Accent Pillar */}
        <group position={[0.18, 0, 1.5]}>
          <mesh>
            <boxGeometry args={[0.06, 7.5, 0.06]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          <pointLight
            color="#ff8c1a"
            intensity={2.2}
            distance={10}
            decay={1.8}
            position={[0.6, 0.5, 0]}
          />
        </group>

        {/* Secondary Rear Amber Accent Pillar */}
        <group position={[0.18, 0.5, 9.5]}>
          <mesh>
            <boxGeometry args={[0.06, 6.8, 0.06]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          <pointLight
            color="#ff8c1a"
            intensity={1.8}
            distance={8}
            decay={1.8}
            position={[0.6, 0.5, 0]}
          />
        </group>
      </group>

      {/* 5. RIGHT AUDITORIUM WALL (Tapered / angled slightly inward toward screen) */}
      <group position={[8.5, roomHeight / 2, 3]} rotation={[0, -0.035, 0]}>
        {/* Main Acoustic Wall Slab */}
        <mesh>
          <boxGeometry args={[0.3, roomHeight, roomLength + 6]} />
          <meshStandardMaterial color="#131620" roughness={0.88} />
        </mesh>

        {/* Acoustic Rib Panels (excluding front section to accommodate exit door) */}
        {[-4, 0, 4, 8, 12].map((pz, pi) => (
          <mesh key={`r-panel-${pi}`} position={[-0.16, 0, pz]}>
            <boxGeometry args={[0.04, roomHeight - 1, 3.0]} />
            <meshStandardMaterial color="#181c28" roughness={0.85} />
          </mesh>
        ))}

        {/* EMERGENCY EXIT DOOR WITH GREEN "EXIT" SIGN (Right of the screen, angled alongside the wall) */}
        <CinemaExitDoor position={[-0.15, -roomHeight / 2, -10.8]} />

        {/* SIGNATURE FRONT AMBER LED LIGHT STRIP (Visible framing the screen!) */}
        <group position={[-0.18, 0, -8.5]}>
          {/* Vertical LED Strip running from floor to ceiling */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 8.5, 0.08]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          {/* Horizontal ceiling return bend */}
          <mesh position={[0.45, 4.25, 0.8]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[1.6, 0.08, 0.08]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          {/* Warm Ambient Wall Illumination */}
          <pointLight
            color="#ff8c1a"
            intensity={3.2}
            distance={12}
            decay={1.8}
            position={[-0.8, 1.0, 0]}
          />
        </group>

        {/* Secondary Mid-Auditorium Amber Accent Pillar */}
        <group position={[-0.18, 0, 1.5]}>
          <mesh>
            <boxGeometry args={[0.06, 7.5, 0.06]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          <pointLight
            color="#ff8c1a"
            intensity={2.2}
            distance={10}
            decay={1.8}
            position={[-0.6, 0.5, 0]}
          />
        </group>

        {/* Secondary Rear Amber Accent Pillar */}
        <group position={[-0.18, 0.5, 9.5]}>
          <mesh>
            <boxGeometry args={[0.06, 6.8, 0.06]} />
            <meshBasicMaterial color="#ff921a" />
          </mesh>
          <pointLight
            color="#ff8c1a"
            intensity={1.8}
            distance={8}
            decay={1.8}
            position={[-0.6, 0.5, 0]}
          />
        </group>
      </group>

      {/* 6. Front Proscenium Stage Wall (Screen Mounting Wall) */}
      <group position={[0, roomHeight / 2, -10.95]}>
        {/* Main Solid Front Wall Structure */}
        <mesh>
          <boxGeometry args={[20.0, roomHeight, 0.4]} />
          <meshStandardMaterial color="#08090d" roughness={0.94} metalness={0.05} />
        </mesh>

        {/* Acoustic Paneling / Screen Surround Baffle framing the screen */}
        <mesh position={[0, 0, 0.22]}>
          <boxGeometry args={[18.0, 9.2, 0.05]} />
          <meshStandardMaterial color="#040507" roughness={0.96} />
        </mesh>
      </group>

      {/* Front Cinema Stage Apron / Screen Base (Elevation Platform under screen) */}
      <mesh position={[0, 0.35, -9.8]}>
        <boxGeometry args={[17.5, 0.7, 2.6]} />
        <meshStandardMaterial color="#0d0f14" roughness={0.9} />
      </mesh>

      {/* 7. Back Wall */}
      <mesh position={[0, roomHeight / 2, 17]}>
        <boxGeometry args={[20.0, roomHeight, 0.3]} />
        <meshStandardMaterial color="#0e1017" roughness={0.92} />
      </mesh>
    </group>
  );
};