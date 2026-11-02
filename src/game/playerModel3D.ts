import * as THREE from 'three';
import type { PlayerData, TeamData } from '../types/fifa';

export interface Player3DRig {
  root: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftLowerLeg: THREE.Group;
  rightLowerLeg: THREE.Group;
  leftBoot: THREE.Mesh;
  rightBoot: THREE.Mesh;
  numberMesh: THREE.Mesh;
  isGoalkeeper: boolean;
  data: PlayerData;
  team: TeamData;
  animState: {
    runCycle: number;
    kickTimer: number;
    diveTimer: number;
    diveDir: number;
    tackleTimer: number;
    celebrateTimer: number;
  };
}

/**
 * Creates dynamic canvas texture for player back with squad number & name
 */
function createJerseyTexture(number: number, name: string, bgHex: string, numHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle jersey collar / seam
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 236, 236);

    // Player Name
    ctx.fillStyle = numHex;
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.toUpperCase(), 128, 55);

    // Big Squad Number
    ctx.font = '900 120px -apple-system, Impact, sans-serif';
    ctx.fillText(String(number), 128, 155);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHumanoidPlayer(player: PlayerData, team: TeamData, isGoalkeeper: boolean): Player3DRig {
  const root = new THREE.Group();
  root.name = `player_${player.id}`;

  const skinMat = new THREE.MeshStandardMaterial({
    color: player.skinTone,
    roughness: 0.6,
    metalness: 0.1,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: player.hairColor,
    roughness: 0.8,
  });

  const kitColor = isGoalkeeper ? team.keeperColor : team.primaryColor;
  const shortsColor = isGoalkeeper ? '#18181b' : team.secondaryColor;
  const socksColor = isGoalkeeper ? team.keeperColor : team.socksColor;

  const jerseyTexture = createJerseyTexture(
    player.number,
    player.shortName,
    kitColor,
    isGoalkeeper ? '#ffffff' : team.numbersColor
  );

  const jerseyMat = new THREE.MeshStandardMaterial({
    map: jerseyTexture,
    roughness: 0.5,
  });

  const shortsMat = new THREE.MeshStandardMaterial({
    color: shortsColor,
    roughness: 0.6,
  });

  const socksMat = new THREE.MeshStandardMaterial({
    color: socksColor,
    roughness: 0.5,
  });

  const bootMat = new THREE.MeshStandardMaterial({
    color: isGoalkeeper ? '#ea580c' : '#0284c7', // Neon accent football boots
    roughness: 0.3,
    metalness: 0.2,
  });

  // Hips / Pelvis center anchor
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.95;
  root.add(pelvis);

  // Shorts (Pelvis mesh)
  const shortsGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.32, 12);
  const shortsMesh = new THREE.Mesh(shortsGeo, shortsMat);
  shortsMesh.position.y = 0.05;
  pelvis.add(shortsMesh);

  // Torso / Chest (tapered athletic shape)
  const torsoGeo = new THREE.BoxGeometry(0.44, 0.55, 0.26);
  const torso = new THREE.Mesh(torsoGeo, jerseyMat);
  torso.position.y = 0.42;
  torso.castShadow = true;
  pelvis.add(torso);

  // Neck & Head
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 10);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = 0.32;
  torso.add(neck);

  const head = new THREE.Group();
  head.position.y = 0.18;
  neck.add(head);

  // Anatomical Head (jaw + cranium)
  const headGeo = new THREE.SphereGeometry(0.14, 16, 14);
  headGeo.scale(1.0, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Hair style geometry
  const hairGroup = new THREE.Group();
  if (player.hairStyle === 'flow' || player.hairStyle === 'dreads') {
    const hairGeo = new THREE.SphereGeometry(0.155, 12, 10);
    hairGeo.scale(1.04, 0.95, 1.25);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.05, -0.02);
    hairGroup.add(hairMesh);
  } else if (player.hairStyle !== 'bald') {
    const hairGeo = new THREE.SphereGeometry(0.148, 12, 10);
    hairGeo.scale(1.02, 0.85, 1.08);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.06, -0.01);
    hairGroup.add(hairMesh);
  }
  head.add(hairGroup);

  // Subtle facial features (visor / brow line)
  const browGeo = new THREE.BoxGeometry(0.18, 0.04, 0.06);
  const browMesh = new THREE.Mesh(browGeo, hairMat);
  browMesh.position.set(0, 0.04, 0.12);
  head.add(browMesh);

  // Left Arm (Shoulder pivot)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.28, 0.22, 0);
  torso.add(leftArm);

  const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.28, 8);
  const upperArmMesh = new THREE.Mesh(upperArmGeo, jerseyMat);
  upperArmMesh.position.y = -0.14;
  leftArm.add(upperArmMesh);

  const leftForearm = new THREE.Group();
  leftForearm.position.y = -0.28;
  leftArm.add(leftForearm);

  const lowerArmGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.26, 8);
  const lowerArmMesh = new THREE.Mesh(lowerArmGeo, skinMat);
  lowerArmMesh.position.y = -0.13;
  leftForearm.add(lowerArmMesh);

  // Glove or hand
  const leftHandGeo = new THREE.SphereGeometry(0.055, 8, 8);
  const leftHandMat = isGoalkeeper
    ? new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 })
    : skinMat;
  const leftHand = new THREE.Mesh(leftHandGeo, leftHandMat);
  leftHand.position.y = -0.26;
  leftForearm.add(leftHand);

  // Right Arm (Shoulder pivot)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.28, 0.22, 0);
  torso.add(rightArm);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, jerseyMat);
  rightUpperArm.position.y = -0.14;
  rightArm.add(rightUpperArm);

  const rightForearm = new THREE.Group();
  rightForearm.position.y = -0.28;
  rightArm.add(rightForearm);

  const rightLowerArm = new THREE.Mesh(lowerArmGeo, skinMat);
  rightLowerArm.position.y = -0.13;
  rightForearm.add(rightLowerArm);

  const rightHand = new THREE.Mesh(leftHandGeo, leftHandMat);
  rightHand.position.y = -0.26;
  rightForearm.add(rightHand);

  // Left Leg (Hip pivot)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.13, -0.1, 0);
  pelvis.add(leftLeg);

  const thighGeo = new THREE.CylinderGeometry(0.095, 0.08, 0.38, 10);
  const thighMesh = new THREE.Mesh(thighGeo, shortsMat);
  thighMesh.position.y = -0.19;
  thighMesh.castShadow = true;
  leftLeg.add(thighMesh);

  const leftLowerLeg = new THREE.Group();
  leftLowerLeg.position.y = -0.38;
  leftLeg.add(leftLowerLeg);

  const shinGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.40, 10);
  const shinMesh = new THREE.Mesh(shinGeo, socksMat);
  shinMesh.position.y = -0.20;
  shinMesh.castShadow = true;
  leftLowerLeg.add(shinMesh);

  // Football Boot (Cleat)
  const bootGeo = new THREE.BoxGeometry(0.11, 0.09, 0.22);
  const leftBoot = new THREE.Mesh(bootGeo, bootMat);
  leftBoot.position.set(0, -0.42, 0.05);
  leftBoot.castShadow = true;
  leftLowerLeg.add(leftBoot);

  // Right Leg (Hip pivot)
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.13, -0.1, 0);
  pelvis.add(rightLeg);

  const rightThighMesh = new THREE.Mesh(thighGeo, shortsMat);
  rightThighMesh.position.y = -0.19;
  rightThighMesh.castShadow = true;
  rightLeg.add(rightThighMesh);

  const rightLowerLeg = new THREE.Group();
  rightLowerLeg.position.y = -0.38;
  rightLeg.add(rightLowerLeg);

  const rightShinMesh = new THREE.Mesh(shinGeo, socksMat);
  rightShinMesh.position.y = -0.20;
  rightShinMesh.castShadow = true;
  rightLowerLeg.add(rightShinMesh);

  const rightBoot = new THREE.Mesh(bootGeo, bootMat);
  rightBoot.position.set(0, -0.42, 0.05);
  rightBoot.castShadow = true;
  rightLowerLeg.add(rightBoot);

  // Shadow disc on pitch
  const shadowGeo = new THREE.CircleGeometry(0.35, 12);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  return {
    root,
    torso,
    head,
    leftArm,
    rightArm,
    leftForearm,
    rightForearm,
    leftLeg,
    rightLeg,
    leftLowerLeg,
    rightLowerLeg,
    leftBoot,
    rightBoot,
    numberMesh: torso,
    isGoalkeeper,
    data: player,
    team,
    animState: {
      runCycle: Math.random() * Math.PI * 2,
      kickTimer: 0,
      diveTimer: 0,
      diveDir: 0,
      tackleTimer: 0,
      celebrateTimer: 0,
    },
  };
}

/**
 * Updates procedural humanoid skeletal animations (run cycle, kick, dive, tackle)
 */
export function updatePlayerAnimation(
  rig: Player3DRig,
  speed: number, // 0 to 1
  delta: number,
  isKicking: boolean = false,
  isDiving: number = 0 // -1 left, 1 right, 0 none
) {
  const { animState } = rig;

  // Handle kick trigger
  if (isKicking && animState.kickTimer <= 0) {
    animState.kickTimer = 0.35; // Kick duration in seconds
  }

  // Handle goalkeeper dive trigger
  if (isDiving !== 0 && animState.diveTimer <= 0) {
    animState.diveTimer = 0.9;
    animState.diveDir = isDiving;
  }

  // 1. Kick Animation override
  if (animState.kickTimer > 0) {
    animState.kickTimer -= delta;
    const progress = 1 - animState.kickTimer / 0.35; // 0 to 1

    if (progress < 0.35) {
      // Wind-up: Right leg pulls back, torso leans
      rig.rightLeg.rotation.x = 0.9;
      rig.rightLowerLeg.rotation.x = -1.1;
      rig.leftLeg.rotation.x = -0.3;
      rig.torso.rotation.x = -0.2;
      rig.leftArm.rotation.x = 0.6;
      rig.rightArm.rotation.x = -0.5;
    } else {
      // Explosive snap forward
      rig.rightLeg.rotation.x = -1.2;
      rig.rightLowerLeg.rotation.x = 0.2;
      rig.torso.rotation.x = 0.25;
      rig.leftArm.rotation.x = -0.8;
      rig.rightArm.rotation.x = 0.8;
    }
    return;
  }

  // 2. Goalkeeper Dive Animation
  if (animState.diveTimer > 0) {
    animState.diveTimer -= delta;
    const progress = 1 - animState.diveTimer / 0.9;
    const side = animState.diveDir; // -1 or 1

    rig.root.position.y = Math.sin(progress * Math.PI) * 1.2;
    rig.root.rotation.z = side * Math.sin(progress * Math.PI) * 1.4;

    // Arms stretch out horizontally
    rig.leftArm.rotation.z = side < 0 ? -1.6 : 0.4;
    rig.rightArm.rotation.z = side > 0 ? 1.6 : -0.4;
    rig.leftLeg.rotation.z = side * 0.4;
    rig.rightLeg.rotation.z = side * 0.4;
    return;
  }

  // Reset roll and elevation if not diving
  rig.root.rotation.z = THREE.MathUtils.lerp(rig.root.rotation.z, 0, 0.15);
  rig.root.position.y = 0;

  // 3. Running / Sprinting Kinematics
  if (speed > 0.05) {
    const cycleFreq = 12 * (0.8 + speed * 0.7);
    animState.runCycle += delta * cycleFreq;
    const s = Math.sin(animState.runCycle);
    const c = Math.cos(animState.runCycle);

    const legAmp = 0.85 * Math.min(1, speed * 1.2);
    const armAmp = 0.9 * Math.min(1, speed * 1.2);

    // Natural forward torso lean when running
    rig.torso.rotation.x = 0.15 + speed * 0.18;

    // Alternating leg stride
    rig.leftLeg.rotation.x = s * legAmp;
    rig.rightLeg.rotation.x = -s * legAmp;

    // Knee bending during backswing
    rig.leftLowerLeg.rotation.x = s > 0 ? 0.1 : -Math.abs(s) * 1.1;
    rig.rightLowerLeg.rotation.x = s < 0 ? 0.1 : -Math.abs(s) * 1.1;

    // Arms swing in opposition to legs
    rig.leftArm.rotation.x = -s * armAmp;
    rig.rightArm.rotation.x = s * armAmp;

    // Elbows bent naturally
    rig.leftForearm.rotation.x = -0.5 - Math.abs(c) * 0.4;
    rig.rightForearm.rotation.x = -0.5 - Math.abs(c) * 0.4;

    // Slight vertical bounce
    rig.torso.position.y = 0.42 + Math.abs(s) * 0.04;
  } else {
    // 4. Idle Stance (gentle breathing)
    animState.runCycle += delta * 2.0;
    const breath = Math.sin(animState.runCycle) * 0.04;

    rig.torso.rotation.x = THREE.MathUtils.lerp(rig.torso.rotation.x, 0.05, 0.1);
    rig.torso.position.y = 0.42 + breath;

    rig.leftLeg.rotation.x = THREE.MathUtils.lerp(rig.leftLeg.rotation.x, 0.08, 0.1);
    rig.rightLeg.rotation.x = THREE.MathUtils.lerp(rig.rightLeg.rotation.x, -0.08, 0.1);
    rig.leftLowerLeg.rotation.x = THREE.MathUtils.lerp(rig.leftLowerLeg.rotation.x, 0, 0.1);
    rig.rightLowerLeg.rotation.x = THREE.MathUtils.lerp(rig.rightLowerLeg.rotation.x, 0, 0.1);

    rig.leftArm.rotation.x = THREE.MathUtils.lerp(rig.leftArm.rotation.x, -0.1 + breath, 0.1);
    rig.rightArm.rotation.x = THREE.MathUtils.lerp(rig.rightArm.rotation.x, 0.1 - breath, 0.1);
    rig.leftForearm.rotation.x = THREE.MathUtils.lerp(rig.leftForearm.rotation.x, -0.2, 0.1);
    rig.rightForearm.rotation.x = THREE.MathUtils.lerp(rig.rightForearm.rotation.x, -0.2, 0.1);
  }
}
