import * as THREE from 'three';
import { TerrainManager } from '../terrain/terrainGenerator';

export interface ScoutData {
  id: string;
  name: string;
  color: string;
  position: THREE.Vector3;
  targetPos: THREE.Vector3;
  rotation: THREE.Euler;
  isMoving: boolean;
  speed: number;
  flashlightOn: boolean;
}

export class ScoutMultiplayer {
  public group: THREE.Group;
  public scouts: Map<string, { data: ScoutData; mesh: THREE.Group; light: THREE.SpotLight; legs: THREE.Mesh[]; arms: THREE.Mesh[]; animTime: number }> = new Map();
  public pingBeacons: THREE.Group;
  private terrain: TerrainManager;
  private socket: WebSocket | null = null;
  public isConnected: boolean = false;

  constructor(terrain: TerrainManager) {
    this.terrain = terrain;
    this.group = new THREE.Group();
    this.pingBeacons = new THREE.Group();
    this.group.add(this.pingBeacons);

    // Initialize expedition scout companions (like the nature scouts in PEAK)
    this.initFellowScouts();

    // Attempt WebSocket connection to server
    this.connectWebSocket();
  }

  // Build stylized 3D Scout Character Model (PEAK style)
  private createScoutMesh(name: string, colorHex: string): { mesh: THREE.Group; light: THREE.SpotLight; legs: THREE.Mesh[]; arms: THREE.Mesh[] } {
    const root = new THREE.Group();

    const matCoat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.7,
      metalness: 0.1,
    });
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0xf6d7b0,
      roughness: 0.5,
    });
    const matPants = new THREE.MeshStandardMaterial({
      color: 0x273549,
      roughness: 0.8,
    });
    const matBackpack = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b, // Leather brown hiker pack
      roughness: 0.9,
    });

    // 1. Torso
    const torsoGeom = new THREE.CylinderGeometry(0.3, 0.28, 0.8, 8);
    torsoGeom.translate(0, 0.4, 0);
    const torso = new THREE.Mesh(torsoGeom, matCoat);
    root.add(torso);

    // 2. Head & Scout Hat
    const headGeom = new THREE.SphereGeometry(0.24, 10, 10);
    headGeom.translate(0, 0.98, 0);
    const head = new THREE.Mesh(headGeom, matSkin);
    root.add(head);

    // Scout Cap
    const hatBrimGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.05, 12);
    hatBrimGeom.translate(0, 1.15, 0);
    const hatDomeGeom = new THREE.SphereGeometry(0.26, 8, 8);
    hatDomeGeom.translate(0, 1.22, 0);
    const hatMesh = new THREE.Mesh(hatBrimGeom, matCoat);
    hatMesh.add(new THREE.Mesh(hatDomeGeom, matCoat));
    root.add(hatMesh);

    // 3. Hiker Backpack
    const packGeom = new THREE.BoxGeometry(0.38, 0.55, 0.26);
    packGeom.translate(0, 0.55, -0.26);
    const pack = new THREE.Mesh(packGeom, matBackpack);
    // Rolled sleeping mat on top
    const rollGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.42, 8);
    rollGeom.rotateZ(Math.PI / 2);
    rollGeom.translate(0, 0.88, -0.26);
    const roll = new THREE.Mesh(rollGeom, new THREE.MeshStandardMaterial({ color: 0x22c55e }));
    pack.add(roll);
    root.add(pack);

    // 4. Arms
    const armGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.55, 6);
    armGeom.translate(0, -0.25, 0);

    const leftArm = new THREE.Mesh(armGeom, matCoat);
    leftArm.position.set(-0.38, 0.72, 0);
    root.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, matCoat);
    rightArm.position.set(0.38, 0.72, 0);
    root.add(rightArm);

    // 5. Handheld Scout Flashlight
    const torchGeom = new THREE.CylinderGeometry(0.04, 0.06, 0.28, 6);
    torchGeom.rotateX(Math.PI / 2);
    torchGeom.translate(0, 0, 0.14);
    const torch = new THREE.Mesh(torchGeom, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 }));
    rightArm.add(torch);

    const spotLight = new THREE.SpotLight(0xffecd1, 2.5, 45, Math.PI / 6, 0.5, 1.5);
    spotLight.position.set(0, 0, 0.28);
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, -0.2, 8);
    rightArm.add(spotLight);
    rightArm.add(lightTarget);
    spotLight.target = lightTarget;

    // 6. Legs & Hiking Boots
    const legGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.65, 6);
    legGeom.translate(0, -0.32, 0);

    const leftLeg = new THREE.Mesh(legGeom, matPants);
    leftLeg.position.set(-0.16, 0.35, 0);
    root.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, matPants);
    rightLeg.position.set(0.16, 0.35, 0);
    root.add(rightLeg);

    // 7. Floating 3D Name Tag Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(10, 10, 236, 44, 12);
    ctx.fill();
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(name, 128, 40);

    const nameTex = new THREE.CanvasTexture(canvas);
    const nameSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: nameTex, depthTest: false })
    );
    nameSprite.position.set(0, 1.65, 0);
    nameSprite.scale.set(1.8, 0.45, 1);
    root.add(nameSprite);

    return {
      mesh: root,
      light: spotLight,
      legs: [leftLeg, rightLeg],
      arms: [leftArm, rightArm],
    };
  }

  // Populate expedition teammates (like the scouts in PEAK)
  private initFellowScouts(): void {
    const scoutConfigs = [
      { id: 'scout_ember', name: 'Scout Ember', color: '#f97316', startOffset: new THREE.Vector2(-12, 8) },
      { id: 'scout_violet', name: 'Scout Violet', color: '#a855f7', startOffset: new THREE.Vector2(14, -6) },
      { id: 'scout_sage', name: 'Scout Sage', color: '#22c55e', startOffset: new THREE.Vector2(-8, -14) },
    ];

    const playerSpawn = new THREE.Vector2(-280, 280);

    scoutConfigs.forEach((cfg) => {
      const spawnX = playerSpawn.x + cfg.startOffset.x;
      const spawnZ = playerSpawn.y + cfg.startOffset.y;
      const spawnY = this.terrain.getHeightAt(spawnX, spawnZ);

      const built = this.createScoutMesh(cfg.name, cfg.color);
      built.mesh.position.set(spawnX, spawnY, spawnZ);
      this.group.add(built.mesh);

      const data: ScoutData = {
        id: cfg.id,
        name: cfg.name,
        color: cfg.color,
        position: new THREE.Vector3(spawnX, spawnY, spawnZ),
        targetPos: new THREE.Vector3(spawnX, spawnY, spawnZ),
        rotation: new THREE.Euler(0, -Math.PI * 0.75, 0),
        isMoving: false,
        speed: 3.5,
        flashlightOn: true,
      };

      this.scouts.set(cfg.id, {
        data,
        mesh: built.mesh,
        light: built.light,
        legs: built.legs,
        arms: built.arms,
        animTime: 0,
      });
    });
  }

  private connectWebSocket(): void {
    try {
      this.socket = new WebSocket('ws://localhost:3001');
      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('[Multiplayer] Connected to expedition lobby server');
      };
      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleNetworkMessage(msg);
        } catch (e) {
          console.error(e);
        }
      };
      this.socket.onerror = () => {
        this.isConnected = false;
      };
      this.socket.onclose = () => {
        this.isConnected = false;
      };
    } catch (e) {
      this.isConnected = false;
    }
  }

  private handleNetworkMessage(msg: any): void {
    if (msg.type === 'player_update') {
      const existing = this.scouts.get(msg.id);
      if (existing) {
        existing.data.targetPos.set(msg.x, msg.y, msg.z);
        existing.data.rotation.y = msg.yaw;
      }
    } else if (msg.type === 'ping_beacon') {
      this.spawnPingBeacon(new THREE.Vector3(msg.x, msg.y, msg.z), msg.senderName);
    }
  }

  // Spawn an illuminated 3D waypoint beacon when a scout pings (Press E)
  public spawnPingBeacon(pos: THREE.Vector3, _sender: string = 'You'): void {
    const beaconGroup = new THREE.Group();

    // Upward beam of light
    const beamGeom = new THREE.CylinderGeometry(0.12, 1.2, 35.0, 8);
    beamGeom.translate(0, 17.5, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beaconGroup.add(beam);

    // Glowing diamond icon
    const diamondGeom = new THREE.OctahedronGeometry(0.9, 0);
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const diamond = new THREE.Mesh(diamondGeom, diamondMat);
    diamond.position.y = 3.5;
    beaconGroup.add(diamond);

    beaconGroup.position.copy(pos);
    this.pingBeacons.add(beaconGroup);

    // Animate and self-remove after 8 seconds
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 0.05;
      diamond.rotation.y += 0.08;
      diamond.position.y = 3.5 + Math.sin(elapsed * 4) * 0.4;
      beamMat.opacity = Math.max(0, 0.65 * (1.0 - elapsed / 8.0));

      if (elapsed >= 8.0) {
        clearInterval(interval);
        this.pingBeacons.remove(beaconGroup);
        beamGeom.dispose();
        diamondGeom.dispose();
      }
    }, 50);
  }

  // Broadcast player's current position to teammates
  public broadcastLocalPlayer(pos: THREE.Vector3, rot: THREE.Euler, name: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'player_update',
          x: pos.x,
          y: pos.y,
          z: pos.z,
          yaw: rot.y,
          name,
        })
      );
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    const cityGoal = this.terrain.config.cityPos;

    // Update fellow expedition scouts
    this.scouts.forEach((scout) => {
      // Natural hiking AI towards player and city goal
      const toPlayer = new THREE.Vector2(playerPos.x - scout.data.position.x, playerPos.z - scout.data.position.z);
      const distToPlayer = toPlayer.length();

      // If playing with AI scouts, lead the expedition toward the city while staying in cohesive squad range
      if (!this.isConnected) {
        if (distToPlayer > 30) {
          // Catch up to player
          toPlayer.normalize();
          scout.data.position.x += toPlayer.x * 5.2 * delta;
          scout.data.position.z += toPlayer.y * 5.2 * delta;
          scout.data.isMoving = true;
          scout.data.rotation.y = Math.atan2(toPlayer.x, toPlayer.y);
        } else if (distToPlayer > 8) {
          // Hike together towards distant city
          const toCity = new THREE.Vector2(cityGoal.x - scout.data.position.x, cityGoal.z - scout.data.position.z).normalize();
          scout.data.position.x += toCity.x * 3.8 * delta;
          scout.data.position.z += toCity.y * 3.8 * delta;
          scout.data.isMoving = true;
          scout.data.rotation.y = Math.atan2(toCity.x, toCity.y);
        } else {
          scout.data.isMoving = false;
        }

        // Clamp to terrain height
        scout.data.position.y = this.terrain.getHeightAt(scout.data.position.x, scout.data.position.z);
      }

      // Sync mesh transform
      scout.mesh.position.copy(scout.data.position);
      scout.mesh.rotation.y = scout.data.rotation.y;

      // Limb animation when moving
      if (scout.data.isMoving) {
        scout.animTime += delta * 9.0;
        const swing = Math.sin(scout.animTime) * 0.55;
        scout.legs[0].rotation.x = swing;
        scout.legs[1].rotation.x = -swing;
        scout.arms[0].rotation.x = -swing * 0.7;
        scout.arms[1].rotation.x = swing * 0.3; // Flashlight arm stays somewhat raised
      } else {
        scout.legs[0].rotation.x = 0;
        scout.legs[1].rotation.x = 0;
        scout.arms[0].rotation.x = 0;
        scout.arms[1].rotation.x = 0;
      }
    });
  }
}
