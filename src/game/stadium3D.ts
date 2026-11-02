import * as THREE from 'three';

export interface Stadium3D {
  group: THREE.Group;
  goalHome: { x: number; y: number; z: number; width: number; height: number };
  goalAway: { x: number; y: number; z: number; width: number; height: number };
}

export const PITCH_WIDTH = 68; // Z axis (-34 to 34)
export const PITCH_LENGTH = 105; // X axis (-52.5 to 52.5)
export const GOAL_WIDTH = 7.32;
export const GOAL_HEIGHT = 2.44;

/**
 * Creates dynamic grass turf texture with authentic alternating mow stripes
 */
function createPitchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base green grass
    ctx.fillStyle = '#225522';
    ctx.fillRect(0, 0, 1024, 1024);

    // Alternating lawn-mower stripes across length
    const stripes = 16;
    const stripeW = 1024 / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#266326' : '#1f4e1f';
      ctx.fillRect(i * stripeW, 0, stripeW, 1024);
    }

    // Grass blade speckle noise
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1024;
      ctx.fillStyle = Math.random() > 0.5 ? '#2f7a2f' : '#173d17';
      ctx.fillRect(rx, ry, 2, 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStadium(): Stadium3D {
  const group = new THREE.Group();
  group.name = 'stadium';

  // 1. Pitch Ground Plane
  const pitchTexture = createPitchTexture();
  const pitchMat = new THREE.MeshStandardMaterial({
    map: pitchTexture,
    roughness: 0.85,
    metalness: 0.05,
  });

  const pitchGeo = new THREE.PlaneGeometry(PITCH_LENGTH + 12, PITCH_WIDTH + 12);
  const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
  pitchMesh.rotation.x = -Math.PI / 2;
  pitchMesh.receiveShadow = true;
  group.add(pitchMesh);

  // 2. White Chalk Pitch Markings
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const lineElevation = 0.03;
  const lw = 0.22; // Line width

  const linesGroup = new THREE.Group();
  linesGroup.position.y = lineElevation;
  group.add(linesGroup);

  const addLine = (x: number, z: number, w: number, h: number) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const m = new THREE.Mesh(geo, lineMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0, z);
    linesGroup.add(m);
  };

  // Outer Touchlines & Goal Lines
  addLine(0, -PITCH_WIDTH / 2, PITCH_LENGTH, lw); // Top sideline
  addLine(0, PITCH_WIDTH / 2, PITCH_LENGTH, lw);  // Bottom sideline
  addLine(-PITCH_LENGTH / 2, 0, lw, PITCH_WIDTH); // Left goal line
  addLine(PITCH_LENGTH / 2, 0, lw, PITCH_WIDTH);  // Right goal line

  // Halfway Line
  addLine(0, 0, lw, PITCH_WIDTH);

  // Center Circle
  const centerCircleGeo = new THREE.RingGeometry(9.15 - lw / 2, 9.15 + lw / 2, 48);
  const centerCircle = new THREE.Mesh(centerCircleGeo, lineMat);
  centerCircle.rotation.x = -Math.PI / 2;
  linesGroup.add(centerCircle);

  // Center Spot
  const spotGeo = new THREE.CircleGeometry(0.35, 16);
  const centerSpot = new THREE.Mesh(spotGeo, lineMat);
  centerSpot.rotation.x = -Math.PI / 2;
  linesGroup.add(centerSpot);

  // Penalty Boxes (16.5m deep, 40.3m wide)
  const penDepth = 16.5;
  const penWidth = 40.3;

  // Left Penalty Box
  addLine(-PITCH_LENGTH / 2 + penDepth / 2, -penWidth / 2, penDepth, lw);
  addLine(-PITCH_LENGTH / 2 + penDepth / 2, penWidth / 2, penDepth, lw);
  addLine(-PITCH_LENGTH / 2 + penDepth, 0, lw, penWidth);

  // Right Penalty Box
  addLine(PITCH_LENGTH / 2 - penDepth / 2, -penWidth / 2, penDepth, lw);
  addLine(PITCH_LENGTH / 2 - penDepth / 2, penWidth / 2, penDepth, lw);
  addLine(PITCH_LENGTH / 2 - penDepth, 0, lw, penWidth);

  // 6-Yard Boxes (5.5m deep, 18.3m wide)
  const sixDepth = 5.5;
  const sixWidth = 18.3;
  addLine(-PITCH_LENGTH / 2 + sixDepth / 2, -sixWidth / 2, sixDepth, lw);
  addLine(-PITCH_LENGTH / 2 + sixDepth / 2, sixWidth / 2, sixDepth, lw);
  addLine(-PITCH_LENGTH / 2 + sixDepth, 0, lw, sixWidth);

  addLine(PITCH_LENGTH / 2 - sixDepth / 2, -sixWidth / 2, sixDepth, lw);
  addLine(PITCH_LENGTH / 2 - sixDepth / 2, sixWidth / 2, sixDepth, lw);
  addLine(PITCH_LENGTH / 2 - sixDepth, 0, lw, sixWidth);

  // Penalty Spots (11m from goal line)
  const penSpotL = new THREE.Mesh(spotGeo, lineMat);
  penSpotL.rotation.x = -Math.PI / 2;
  penSpotL.position.set(-PITCH_LENGTH / 2 + 11, 0, 0);
  linesGroup.add(penSpotL);

  const penSpotR = new THREE.Mesh(spotGeo, lineMat);
  penSpotR.rotation.x = -Math.PI / 2;
  penSpotR.position.set(PITCH_LENGTH / 2 - 11, 0, 0);
  linesGroup.add(penSpotR);

  // 3. Goalposts & 3D Nets
  const goalPostMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.7,
  });

  const netMat = new THREE.MeshBasicMaterial({
    color: 0xdddddd,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });

  const createGoal = (x: number, rotationY: number) => {
    const goal = new THREE.Group();
    goal.position.set(x, 0, 0);
    goal.rotation.y = rotationY;

    const postRadius = 0.1;

    // Posts
    const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, GOAL_HEIGHT, 12);
    const postL = new THREE.Mesh(postGeo, goalPostMat);
    postL.position.set(0, GOAL_HEIGHT / 2, -GOAL_WIDTH / 2);
    postL.castShadow = true;
    goal.add(postL);

    const postR = new THREE.Mesh(postGeo, goalPostMat);
    postR.position.set(0, GOAL_HEIGHT / 2, GOAL_WIDTH / 2);
    postR.castShadow = true;
    goal.add(postR);

    // Crossbar
    const crossbarGeo = new THREE.CylinderGeometry(postRadius, postRadius, GOAL_WIDTH, 12);
    const crossbar = new THREE.Mesh(crossbarGeo, goalPostMat);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(0, GOAL_HEIGHT, 0);
    crossbar.castShadow = true;
    goal.add(crossbar);

    // Rear Stanchions
    const netDepth = 2.4;
    const rearBarGeo = new THREE.CylinderGeometry(0.06, 0.06, netDepth * 1.3, 8);
    const stanchionL = new THREE.Mesh(rearBarGeo, goalPostMat);
    stanchionL.position.set(-netDepth / 2, GOAL_HEIGHT / 2, -GOAL_WIDTH / 2);
    stanchionL.rotation.z = 0.6;
    goal.add(stanchionL);

    const stanchionR = new THREE.Mesh(rearBarGeo, goalPostMat);
    stanchionR.position.set(-netDepth / 2, GOAL_HEIGHT / 2, GOAL_WIDTH / 2);
    stanchionR.rotation.z = 0.6;
    goal.add(stanchionR);

    // 3D Goal Net Box
    const netBoxGeo = new THREE.BoxGeometry(netDepth, GOAL_HEIGHT, GOAL_WIDTH, 8, 6, 12);
    const netMesh = new THREE.Mesh(netBoxGeo, netMat);
    netMesh.position.set(-netDepth / 2, GOAL_HEIGHT / 2, 0);
    goal.add(netMesh);

    return goal;
  };

  const goalHome = createGoal(-PITCH_LENGTH / 2, Math.PI); // Facing right
  const goalAway = createGoal(PITCH_LENGTH / 2, 0);       // Facing left
  group.add(goalHome);
  group.add(goalAway);

  // 4. Advertising LED Boards
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const ledLongGeo = new THREE.BoxGeometry(PITCH_LENGTH + 6, 1.0, 0.4);
  const ledTop = new THREE.Mesh(ledLongGeo, ledMat);
  ledTop.position.set(0, 0.5, -PITCH_WIDTH / 2 - 3.5);
  group.add(ledTop);

  const ledBottom = new THREE.Mesh(ledLongGeo, ledMat);
  ledBottom.position.set(0, 0.5, PITCH_WIDTH / 2 + 3.5);
  group.add(ledBottom);

  // 5. Grandstand Seating
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
  });

  const crowdMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.9,
  });

  const createStand = (x: number, z: number, w: number, d: number, rotY: number) => {
    const stand = new THREE.Group();
    stand.position.set(x, 0, z);
    stand.rotation.y = rotY;

    // 3 Tiers of stepped seats
    for (let tier = 0; tier < 3; tier++) {
      const tierGeo = new THREE.BoxGeometry(w, 4 + tier * 3, d);
      const tierMesh = new THREE.Mesh(tierGeo, standMat);
      tierMesh.position.set(0, (tier * 3.5) / 2 + 2, -tier * (d * 0.85));
      stand.add(tierMesh);

      // Colorful crowd supporter blocks
      const crowdGeo = new THREE.BoxGeometry(w * 0.96, 0.6, d * 0.7);
      const crowdMesh = new THREE.Mesh(crowdGeo, crowdMat);
      crowdMesh.position.set(0, (tier * 3.5) / 2 + 3.8 + tier * 1.5, -tier * (d * 0.85));
      stand.add(crowdMesh);
    }

    return stand;
  };

  group.add(createStand(0, -PITCH_WIDTH / 2 - 14, PITCH_LENGTH + 20, 10, 0));
  group.add(createStand(0, PITCH_WIDTH / 2 + 14, PITCH_LENGTH + 20, 10, Math.PI));
  group.add(createStand(-PITCH_LENGTH / 2 - 16, 0, PITCH_WIDTH + 20, 10, Math.PI / 2));
  group.add(createStand(PITCH_LENGTH / 2 + 16, 0, PITCH_WIDTH + 20, 10, -Math.PI / 2));

  // 6. Massive 4-Corner Floodlight Towers
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.5,
    metalness: 0.7,
  });

  const createTower = (x: number, z: number) => {
    const tower = new THREE.Group();
    tower.position.set(x, 0, z);

    // Lattice Pylon
    const pylonGeo = new THREE.CylinderGeometry(0.8, 1.8, 35, 6);
    const pylon = new THREE.Mesh(pylonGeo, towerMat);
    pylon.position.y = 17.5;
    tower.add(pylon);

    // Headlight bank
    const headGeo = new THREE.BoxGeometry(6, 4, 1.5);
    const headMesh = new THREE.Mesh(headGeo, towerMat);
    headMesh.position.set(0, 35, 0);
    headMesh.lookAt(0, 0, 0);
    tower.add(headMesh);

    // Glowing Spotlights
    const light = new THREE.SpotLight(0xfff8ee, 1800, 120, Math.PI / 4, 0.5, 1.2);
    light.position.set(0, 35, 0);
    light.target.position.set(0, 0, 0);
    tower.add(light);
    tower.add(light.target);

    return tower;
  };

  group.add(createTower(-PITCH_LENGTH / 2 - 8, -PITCH_WIDTH / 2 - 8));
  group.add(createTower(PITCH_LENGTH / 2 + 8, -PITCH_WIDTH / 2 - 8));
  group.add(createTower(-PITCH_LENGTH / 2 - 8, PITCH_WIDTH / 2 + 8));
  group.add(createTower(PITCH_LENGTH / 2 + 8, PITCH_WIDTH / 2 + 8));

  return {
    group,
    goalHome: { x: -PITCH_LENGTH / 2, y: GOAL_HEIGHT / 2, z: 0, width: GOAL_WIDTH, height: GOAL_HEIGHT },
    goalAway: { x: PITCH_LENGTH / 2, y: GOAL_HEIGHT / 2, z: 0, width: GOAL_WIDTH, height: GOAL_HEIGHT },
  };
}
