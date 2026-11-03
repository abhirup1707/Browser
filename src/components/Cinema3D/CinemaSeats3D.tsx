import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useBookingStore } from '../../store/bookingStore';
import { BEST_SWEET_SPOT_SEATS } from '../../utils/seatCoordinates';
import { AudienceMember3D } from './AudienceMember3D';
import type { SeatInfo } from '../../types/cinema';

export const CinemaSeats3D: React.FC = () => {
  const seats = useBookingStore((s) => s.seats);
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const selectedSeatIds = useBookingStore((s) => s.selectedSeatIds);
  const viewMode = useBookingStore((s) => s.viewMode);
  const interactionMode = useBookingStore((s) => s.interactionMode);
  const bestSeatsFilter = useBookingStore((s) => s.bestSeatsFilter);
  const isAudienceVisible = useBookingStore((s) => s.isAudienceVisible);
  const selectedFormat = useBookingStore((s) => s.selectedFormat);
  const toggleSeat = useBookingStore((s) => s.toggleSeat);
  const setActiveViewingSeat = useBookingStore((s) => s.setActiveViewingSeat);

  const materials = useMemo(() => {
    return {
      velvetRed: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#940a1b'), // Rich crimson red cinema velvet
        roughness: 0.72,
        metalness: 0.05
      }),
      velvetSelected: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e50914'),
        emissive: new THREE.Color('#e50914'),
        emissiveIntensity: 0.9,
        roughness: 0.4
      }),
      velvetViewing: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0284c7'), // Electric cyan/blue for active previewed seat
        emissive: new THREE.Color('#0284c7'),
        emissiveIntensity: 0.8,
        roughness: 0.4
      }),
      velvetSweetSpot: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d97706'), // Warm golden velvet for sweet spot recommendations
        emissive: new THREE.Color('#b45309'),
        emissiveIntensity: 0.6,
        roughness: 0.5
      }),
      velvetBooked: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#222632'),
        roughness: 0.85,
        metalness: 0.08
      }),
      armrestDark: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#10131a'),
        roughness: 0.75
      }),
      cupholder: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#06070a'),
        roughness: 0.4,
        metalness: 0.3
      })
    };
  }, []);

  const handleSeatClick = (seat: SeatInfo, e: any) => {
    e.stopPropagation();
    if (seat.status === 'booked' && interactionMode === 'select') return;

    if (interactionMode === 'preview') {
      // In preview mode: view from any seat without adding to bill
      setActiveViewingSeat(seat.id);
    } else {
      // In select mode: direct selection for billing
      toggleSeat(seat.id);
      setActiveViewingSeat(seat.id);
    }
  };

  return (
    <group>
      {seats.map((seat) => {
        const isSelected = selectedSeatIds.includes(seat.id);
        const isViewing = activeViewingSeatId === seat.id;
        const isBooked = seat.status === 'booked';
        const isSweetSpot = BEST_SWEET_SPOT_SEATS.has(seat.id);
        const shouldHighlightSweetSpot =
          bestSeatsFilter === 'sweetspot' && isSweetSpot && !isBooked;

        // In first-person seat view, don't render the headrest/backrest of the camera seat to prevent clipping
        const isCameraSeatInSeatView = isViewing && viewMode === 'seat';
        const shouldRenderAudience = isBooked && isAudienceVisible && !isCameraSeatInSeatView;

        let mat = materials.velvetRed;
        if (isSelected) {
          mat = materials.velvetSelected;
        } else if (isViewing) {
          mat = materials.velvetViewing;
        } else if (shouldHighlightSweetSpot) {
          mat = materials.velvetSweetSpot;
        } else if (isBooked) {
          mat = materials.velvetBooked;
        }

        const [x, y, z] = seat.position3D;

        return (
          <group
            key={seat.id}
            position={[x, y, z]}
            rotation={[0, seat.rotationY, 0]}
            onClick={(e) => handleSeatClick(seat, e)}
          >
            {/* 1. Contoured Backrest (Facing Screen -Z, back is at +Z) */}
            {!isCameraSeatInSeatView && (
              <>
                <mesh position={[0, 0.44, 0.1]} rotation={[0.08, 0, 0]}>
                  <boxGeometry args={[0.43, 0.50, 0.1]} />
                  <primitive object={mat} attach="material" />
                </mesh>

                {/* 2. Rounded Headrest */}
                <group position={[0, 0.74, 0.12]} rotation={[0.1, 0, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.38, 20]} />
                    <primitive object={mat} attach="material" />
                  </mesh>
                </group>
              </>
            )}

            {/* 3. Seat Cushion (Extends forward toward -Z) */}
            <mesh position={[0, 0.2, -0.08]} rotation={[-0.05, 0, 0]}>
              <boxGeometry args={[0.43, 0.1, 0.44]} />
              <primitive object={mat} attach="material" />
            </mesh>

            {/* 4. Pedestal & Metal Base */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.035, 0.045, 0.2, 12]} />
              <primitive object={materials.armrestDark} attach="material" />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.14, 0.16, 0.03, 14]} />
              <primitive object={materials.armrestDark} attach="material" />
            </mesh>

            {/* 5. Left Armrest with Cup Holder */}
            <group position={[-0.23, 0.34, -0.04]}>
              <mesh>
                <boxGeometry args={[0.06, 0.07, 0.42]} />
                <primitive object={materials.armrestDark} attach="material" />
              </mesh>
              {/* Cup holder at front tip (-Z) */}
              <mesh position={[0, 0.035, -0.15]}>
                <cylinderGeometry args={[0.032, 0.028, 0.06, 16]} />
                <primitive object={materials.cupholder} attach="material" />
              </mesh>
            </group>

            {/* 6. Right Armrest with Cup Holder */}
            <group position={[0.23, 0.34, -0.04]}>
              <mesh>
                <boxGeometry args={[0.06, 0.07, 0.42]} />
                <primitive object={materials.armrestDark} attach="material" />
              </mesh>
              {/* Cup holder at front tip (-Z) */}
              <mesh position={[0, 0.035, -0.15]}>
                <cylinderGeometry args={[0.032, 0.028, 0.06, 16]} />
                <primitive object={materials.cupholder} attach="material" />
              </mesh>
            </group>

            {/* 7. Highlight Beacon for Selected / Viewing Seat */}
            {(isViewing || isSelected) && viewMode !== 'seat' && (
              <group position={[0, 1.05, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.22, 0.28, 32]} />
                  <meshBasicMaterial
                    color={isSelected ? '#e50914' : '#38bdf8'}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                <pointLight
                  color={isSelected ? '#e50914' : '#38bdf8'}
                  intensity={1.5}
                  distance={2.5}
                  decay={2}
                />
              </group>
            )}

            {/* 8. 3D Person sitting in this seat (Audience Density Simulation) */}
            {shouldRenderAudience && (
              <AudienceMember3D
                seatId={seat.id}
                isFormat3D={selectedFormat !== '2D'}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
