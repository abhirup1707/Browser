import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useBookingStore } from '../../store/bookingStore';
import { getSeatCameraView, CAMERA_PRESETS } from '../../utils/seatCoordinates';

export const CameraController3D: React.FC = () => {
  const { camera, gl } = useThree();
  const activeViewingSeatId = useBookingStore((s) => s.activeViewingSeatId);
  const viewMode = useBookingStore((s) => s.viewMode);
  const is360Active = useBookingStore((s) => s.is360Active);

  const currentTarget = useRef(new THREE.Vector3(0, 4.3, -10.7));
  const desiredTarget = useRef(new THREE.Vector3(0, 4.3, -10.7));

  const lookOffset = useRef({ yaw: 0, pitch: 0 });
  const targetLookOffset = useRef({ yaw: 0, pitch: 0 });
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let targetPos: [number, number, number];
    let lookTarget: [number, number, number];
    let targetFov = 56;

    if (viewMode === 'seat') {
      const view = getSeatCameraView(activeViewingSeatId);
      targetPos = view.cameraPosition;
      lookTarget = view.targetPosition;
      targetFov = view.fov;
    } else if (viewMode === 'theatre') {
      targetPos = CAMERA_PRESETS.theatreOverview.cameraPosition;
      lookTarget = CAMERA_PRESETS.theatreOverview.targetPosition;
      targetFov = CAMERA_PRESETS.theatreOverview.fov;
    } else if (viewMode === 'side') {
      targetPos = CAMERA_PRESETS.sideAngle.cameraPosition;
      lookTarget = CAMERA_PRESETS.sideAngle.targetPosition;
      targetFov = CAMERA_PRESETS.sideAngle.fov;
    } else {
      targetPos = CAMERA_PRESETS.wideRear.cameraPosition;
      lookTarget = CAMERA_PRESETS.wideRear.targetPosition;
      targetFov = CAMERA_PRESETS.wideRear.fov;
    }

    gsap.to(targetLookOffset.current, {
      yaw: 0,
      pitch: 0,
      duration: 0.6,
      ease: 'power2.out'
    });

    desiredTarget.current.set(...lookTarget);

    gsap.to(camera.position, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1.2,
      ease: 'power3.inOut'
    });

    gsap.to(currentTarget.current, {
      x: lookTarget[0],
      y: lookTarget[1],
      z: lookTarget[2],
      duration: 1.2,
      ease: 'power3.inOut'
    });

    if ('fov' in camera) {
      const perspCamera = camera as THREE.PerspectiveCamera;
      gsap.to(perspCamera, {
        fov: targetFov,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => perspCamera.updateProjectionMatrix()
      });
    }
  }, [activeViewingSeatId, viewMode, camera]);

  // Pointer drag for interactive look-around
  useEffect(() => {
    const domElement = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      const sensitivity = is360Active ? 0.0035 : 0.002;

      targetLookOffset.current.yaw -= dx * sensitivity;
      targetLookOffset.current.pitch -= dy * sensitivity;

      targetLookOffset.current.pitch = Math.max(
        -0.5,
        Math.min(0.5, targetLookOffset.current.pitch)
      );

      if (viewMode === 'seat' && !is360Active) {
        targetLookOffset.current.yaw = Math.max(
          -0.8,
          Math.min(0.8, targetLookOffset.current.yaw)
        );
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, is360Active, viewMode]);

  useFrame(() => {
    lookOffset.current.yaw += (targetLookOffset.current.yaw - lookOffset.current.yaw) * 0.12;
    lookOffset.current.pitch += (targetLookOffset.current.pitch - lookOffset.current.pitch) * 0.12;

    const finalTarget = currentTarget.current.clone();
    const forward = finalTarget.clone().sub(camera.position);
    const distance = forward.length();

    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), lookOffset.current.yaw);

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    forward.applyAxisAngle(right, lookOffset.current.pitch);

    finalTarget.copy(camera.position).add(forward.normalize().multiplyScalar(distance));
    camera.lookAt(finalTarget);
  });

  return null;
};
