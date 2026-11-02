import * as THREE from 'three';
import { createStadium, PITCH_LENGTH, PITCH_WIDTH, GOAL_HEIGHT, GOAL_WIDTH } from './stadium3D';
import { createHumanoidPlayer, updatePlayerAnimation, type Player3DRig } from './playerModel3D';
import type { TeamData, GameMode, CameraView, MatchPhase, MatchStats, PlayerData } from '../types/fifa';
import {
  playBallKick,
  playWhistle,
  playPostClang,
  playNetRattle,
  playGoalRoar,
  playCrowdNearMiss,
  initAmbientCrowd,
} from '../audio/fifaAudio';

export interface EngineCallbacks {
  onScoreChange: (homeGoals: number, awayGoals: number) => void;
  onActivePlayerChange: (player: PlayerData | null, stamina: number, shotPower: number) => void;
  onGoalScored: (scorer: PlayerData, team: TeamData) => void;
  onMatchStatsUpdate: (stats: MatchStats) => void;
  onRadarUpdate: (homePositions: { x: number; z: number }[], awayPositions: { x: number; z: number }[], ballPos: { x: number; z: number }) => void;
}

export class FifaEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private isDestroyed = false;

  private homeTeam: TeamData;
  private awayTeam: TeamData;
  private homeRigs: Player3DRig[] = [];
  private awayRigs: Player3DRig[] = [];

  // Ball
  private ballMesh!: THREE.Mesh;
  private ballPos = new THREE.Vector3(0, 0.22, 0);
  private ballVel = new THREE.Vector3(0, 0, 0);
  private ballSpin = new THREE.Vector3(0, 0, 0);
  private ballRadius = 0.22;
  private ballPossessor: Player3DRig | null = null;

  // Match State
  private gameMode: GameMode = 'USER_VS_AI';
  private cameraView: CameraView = 'BROADCAST';
  private matchPhase: MatchPhase = 'KICKOFF';
  private matchTimer = 0; // In simulated match minutes (0 to 90)
  private homeScore = 0;
  private awayScore = 0;
  private homeShots = 0;
  private awayShots = 0;
  private homeShotsOnTarget = 0;
  private awayShotsOnTarget = 0;
  private homePassCount = 0;
  private awayPassCount = 0;
  private homePossessionTicks = 0;
  private awayPossessionTicks = 0;

  // User input
  private keys: Record<string, boolean> = {};
  private controlledRig: Player3DRig | null = null;
  private userShotPowerCharging = false;
  private userShotPower = 0;
  private userStamina = 100;
  private activeIndicatorMesh!: THREE.Mesh;

  private callbacks: EngineCallbacks;
  private lastTime = performance.now();

  constructor(
    container: HTMLElement,
    homeTeam: TeamData,
    awayTeam: TeamData,
    gameMode: GameMode,
    callbacks: EngineCallbacks
  ) {
    this.container = container;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.gameMode = gameMode;
    this.callbacks = callbacks;

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020617);
    this.scene.fog = new THREE.FogExp2(0x020617, 0.007);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 2. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    dirLight.position.set(20, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -65;
    dirLight.shadow.camera.right = 65;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);

    // 3. Stadium
    const stadium = createStadium();
    this.scene.add(stadium.group);

    // 4. Ball
    this.createBall();

    // 5. Active Player Indicator Ring
    const ringGeo = new THREE.RingGeometry(0.55, 0.72, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.activeIndicatorMesh = new THREE.Mesh(ringGeo, ringMat);
    this.activeIndicatorMesh.rotation.x = -Math.PI / 2;
    this.activeIndicatorMesh.position.y = 0.04;
    this.scene.add(this.activeIndicatorMesh);

    // 6. Spawn Teams
    this.spawnTeams();

    // 7. Event Listeners
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    // Sound
    initAmbientCrowd();
    playWhistle('short');

    // Kickoff positions
    this.resetToKickoff(true);

    // Animation Loop
    this.animate();
  }

  private createBall() {
    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = 256;
    ballCanvas.height = 256;
    const ctx = ballCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);
      // Classic soccer hex pattern
      ctx.fillStyle = '#0f172a';
      const spots = [
        [64, 64], [192, 64], [128, 128], [64, 192], [192, 192]
      ];
      spots.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fill();
      });
      // Gold seam accents
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      spots.forEach(([x, y]) => {
        ctx.strokeRect(x - 30, y - 30, 60, 60);
      });
    }

    const ballTex = new THREE.CanvasTexture(ballCanvas);
    ballTex.colorSpace = THREE.SRGBColorSpace;
    const ballGeo = new THREE.SphereGeometry(this.ballRadius, 24, 20);
    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTex,
      roughness: 0.35,
      metalness: 0.15,
    });

    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.ballMesh.receiveShadow = true;
    this.scene.add(this.ballMesh);
  }

  private spawnTeams() {
    // Clear any previous rigs
    this.homeRigs.forEach((r) => this.scene.remove(r.root));
    this.awayRigs.forEach((r) => this.scene.remove(r.root));
    this.homeRigs = [];
    this.awayRigs = [];

    // Home Team (left to right, attacks right)
    this.homeTeam.players.forEach((player, idx) => {
      const isGk = idx === 0;
      const rig = createHumanoidPlayer(player, this.homeTeam, isGk);
      this.homeRigs.push(rig);
      this.scene.add(rig.root);
    });

    // Away Team (right to left, attacks left)
    this.awayTeam.players.forEach((player, idx) => {
      const isGk = idx === 0;
      const rig = createHumanoidPlayer(player, this.awayTeam, isGk);
      this.awayRigs.push(rig);
      this.scene.add(rig.root);
    });

    // Default user controls home team forward (Mbappé or striker)
    this.controlledRig = this.homeRigs[9] || this.homeRigs[1];
  }

  public resetToKickoff(homeHasBall: boolean = true) {
    this.matchPhase = 'KICKOFF';
    this.ballPos.set(0, this.ballRadius, 0);
    this.ballVel.set(0, 0, 0);
    this.ballSpin.set(0, 0, 0);
    this.ballPossessor = null;

    // Standard 4-3-3 Home Formations
    const homeCoords = [
      { x: -49, z: 0 },    // GK
      { x: -36, z: 22 },   // RB
      { x: -38, z: 7 },    // CB
      { x: -38, z: -7 },   // CB
      { x: -36, z: -22 },  // LB
      { x: -26, z: 0 },    // CDM
      { x: -16, z: 12 },   // CM
      { x: -16, z: -12 },  // CAM
      { x: -6, z: 22 },    // RW
      { x: -1.5, z: 0 },   // ST (Kickoff)
      { x: -6, z: -22 },   // LW
    ];

    // Mirror for Away team
    const awayCoords = homeCoords.map((c) => ({ x: -c.x, z: -c.z }));

    this.homeRigs.forEach((rig, idx) => {
      const target = homeCoords[idx] || { x: -20, z: 0 };
      rig.root.position.set(target.x, 0, target.z);
      rig.root.rotation.y = Math.PI / 2; // Facing right towards away goal
    });

    this.awayRigs.forEach((rig, idx) => {
      const target = awayCoords[idx] || { x: 20, z: 0 };
      rig.root.position.set(target.x, 0, target.z);
      rig.root.rotation.y = -Math.PI / 2; // Facing left towards home goal
    });

    if (homeHasBall) {
      this.ballPossessor = this.homeRigs[9]; // Striker takes kickoff
      this.controlledRig = this.homeRigs[9];
    } else {
      this.ballPossessor = this.awayRigs[9];
    }

    setTimeout(() => {
      if (this.matchPhase === 'KICKOFF') {
        this.matchPhase = 'PLAYING';
      }
    }, 1200);
  }

  // Input Handling
  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true;
    this.keys[e.code] = true;

    // Space / Shoot charging
    if ((e.code === 'Space' || e.key === ' ') && !this.userShotPowerCharging) {
      this.userShotPowerCharging = true;
      this.userShotPower = 0;
    }

    // Pass (K / X)
    if (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'x') {
      this.executeUserPass(false);
    }

    // Through Ball (L / C)
    if (e.key.toLowerCase() === 'l' || e.key.toLowerCase() === 'c') {
      this.executeUserPass(true);
    }

    // Switch Player (E / Q) on defense
    if (e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'q') {
      this.switchClosestDefender();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
    this.keys[e.code] = false;

    // Release shot
    if ((e.code === 'Space' || e.key === ' ') && this.userShotPowerCharging) {
      this.executeUserShot();
      this.userShotPowerCharging = false;
      this.userShotPower = 0;
    }
  };

  private executeUserPass(isThroughBall: boolean) {
    if (!this.controlledRig || this.ballPossessor !== this.controlledRig) return;

    // Find best teammate in front of player
    const myPos = this.controlledRig.root.position;
    const forward = new THREE.Vector3(1, 0, 0).applyEuler(this.controlledRig.root.rotation);

    let bestTeammate: Player3DRig | null = null;
    let bestScore = -999;

    this.homeRigs.forEach((mate) => {
      if (mate === this.controlledRig) return;
      const matePos = mate.root.position;
      const dirToMate = new THREE.Vector3().subVectors(matePos, myPos);
      const dist = dirToMate.length();
      if (dist < 4 || dist > 45) return;

      dirToMate.normalize();
      const dot = forward.dot(dirToMate); // Direction alignment
      if (dot > 0.1) {
        const score = dot * 10 - dist * 0.15 + (isThroughBall ? matePos.x * 0.1 : 0);
        if (score > bestScore) {
          bestScore = score;
          bestTeammate = mate;
        }
      }
    });

    if (bestTeammate) {
      this.ballPossessor = null;
      const passTarget = (bestTeammate as Player3DRig).root.position.clone();
      if (isThroughBall) {
        passTarget.x += 4.5; // Lead the pass forward
      }

      const passDir = new THREE.Vector3().subVectors(passTarget, this.ballPos);
      const dist = passDir.length();
      passDir.normalize();

      const passSpeed = Math.min(26, 14 + dist * 0.4);
      this.ballVel.copy(passDir.multiplyScalar(passSpeed));
      this.ballVel.y = isThroughBall ? 1.5 : 0.4;

      this.controlledRig.animState.kickTimer = 0.35;
      playBallKick(0.5);
      this.homePassCount++;

      // Switch control to receiver
      this.controlledRig = bestTeammate;
    }
  }

  private executeUserShot() {
    if (!this.controlledRig || this.ballPossessor !== this.controlledRig) return;

    this.ballPossessor = null;
    const power = Math.max(0.3, Math.min(1.0, this.userShotPower / 100));

    // Target the corners of the away goal (x: 52.5)
    const goalX = PITCH_LENGTH / 2;
    const targetZ = (Math.random() - 0.5) * (GOAL_WIDTH * 0.85);
    const targetY = 0.5 + power * (GOAL_HEIGHT * 0.75);

    const shotDir = new THREE.Vector3(goalX - this.ballPos.x, targetY - this.ballPos.y, targetZ - this.ballPos.z).normalize();
    const speed = 20 + power * 18 * (this.controlledRig.data.stats.shooting / 100);

    this.ballVel.copy(shotDir.multiplyScalar(speed));
    this.controlledRig.animState.kickTimer = 0.4;
    playBallKick(power);

    this.homeShots++;
    if (Math.abs(targetZ) < GOAL_WIDTH / 2) {
      this.homeShotsOnTarget++;
    }
  }

  private switchClosestDefender() {
    let closest: Player3DRig | null = null;
    let minDist = 999;
    this.homeRigs.forEach((rig) => {
      if (rig.isGoalkeeper) return;
      const dist = rig.root.position.distanceTo(this.ballPos);
      if (dist < minDist) {
        minDist = dist;
        closest = rig;
      }
    });
    if (closest) {
      this.controlledRig = closest;
    }
  }

  // Main Simulation Loop
  private animate = () => {
    if (this.isDestroyed) return;
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Match clock progression (90 simulated mins in ~5 minutes real time)
    if (this.matchPhase === 'PLAYING') {
      this.matchTimer += dt * 0.35;
      if (this.matchTimer >= 90) {
        this.matchPhase = 'FULLTIME';
        playWhistle('long');
      }
    }

    // Charge shot power if user holding key
    if (this.userShotPowerCharging) {
      this.userShotPower = Math.min(100, this.userShotPower + dt * 140);
    }

    // Update Player & AI Behavior
    this.updateUserControl(dt);
    this.updateAI(dt);

    // Update Ball Physics
    this.updateBallPhysics(dt);

    // Goal Detection
    this.checkGoalCollision();

    // Update Camera
    this.updateCamera(dt);

    // Update Active Player Ring position
    if (this.controlledRig && this.gameMode === 'USER_VS_AI') {
      this.activeIndicatorMesh.visible = true;
      this.activeIndicatorMesh.position.x = this.controlledRig.root.position.x;
      this.activeIndicatorMesh.position.z = this.controlledRig.root.position.z;
    } else {
      this.activeIndicatorMesh.visible = false;
    }

    // Broadcast UI Callbacks
    this.broadcastCallbacks();

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  private updateUserControl(dt: number) {
    if (this.gameMode !== 'USER_VS_AI' || !this.controlledRig) return;
    const rig = this.controlledRig;

    // Direction vector from WASD / Arrows
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (this.keys['w'] || this.keys['arrowup']) moveDir.x -= 0.6; // camera broadcast angle
    if (this.keys['s'] || this.keys['arrowdown']) moveDir.x += 0.6;
    if (this.keys['a'] || this.keys['arrowleft']) moveDir.z -= 1.0;
    if (this.keys['d'] || this.keys['arrowright']) moveDir.z += 1.0;

    // Invert X/Z to match TV broadcast camera view orientation
    const moveX = (this.keys['d'] || this.keys['arrowright'] ? 1 : 0) - (this.keys['a'] || this.keys['arrowleft'] ? 1 : 0);
    const moveZ = (this.keys['s'] || this.keys['arrowdown'] ? 1 : 0) - (this.keys['w'] || this.keys['arrowup'] ? 1 : 0);

    const isMoving = moveX !== 0 || moveZ !== 0;
    const isSprinting = (this.keys['shift'] || this.keys['shiftleft']) && this.userStamina > 5;

    if (isSprinting && isMoving) {
      this.userStamina = Math.max(0, this.userStamina - dt * 18);
    } else {
      this.userStamina = Math.min(100, this.userStamina + dt * 12);
    }

    const baseSpeed = 7.5 * (rig.data.stats.pace / 100);
    const speedMultiplier = isSprinting ? 1.45 : 1.0;
    const currentSpeed = isMoving ? baseSpeed * speedMultiplier : 0;

    if (isMoving) {
      const targetAngle = Math.atan2(moveZ, moveX);
      rig.root.rotation.y = THREE.MathUtils.lerp(rig.root.rotation.y, targetAngle, 0.25);

      rig.root.position.x += Math.cos(targetAngle) * currentSpeed * dt;
      rig.root.position.z += Math.sin(targetAngle) * currentSpeed * dt;

      // Keep inside pitch boundaries
      rig.root.position.x = Math.max(-PITCH_LENGTH / 2, Math.min(PITCH_LENGTH / 2, rig.root.position.x));
      rig.root.position.z = Math.max(-PITCH_WIDTH / 2, Math.min(PITCH_WIDTH / 2, rig.root.position.z));
    }

    // Ball Dribble Magnet
    if (this.ballPossessor === rig) {
      const frontOffset = new THREE.Vector3(0.65, 0, 0).applyEuler(rig.root.rotation);
      this.ballPos.x = rig.root.position.x + frontOffset.x;
      this.ballPos.z = rig.root.position.z + frontOffset.z;
      this.ballVel.set(0, 0, 0);
    }

    updatePlayerAnimation(rig, isMoving ? (isSprinting ? 1.0 : 0.6) : 0, dt);
  }

  private updateAI(dt: number) {
    const allRigs = [...this.homeRigs, ...this.awayRigs];

    // Determine possession
    let nearestDist = 999;
    let nearestRig: Player3DRig | null = null;

    allRigs.forEach((rig) => {
      const d = rig.root.position.distanceTo(this.ballPos);
      if (d < nearestDist) {
        nearestDist = d;
        nearestRig = rig;
      }
    });

    // Trap / Tackle ball
    if (nearestDist < 1.1 && !this.ballPossessor) {
      this.ballPossessor = nearestRig;
      if (this.gameMode === 'USER_VS_AI' && this.homeRigs.includes(nearestRig!)) {
        this.controlledRig = nearestRig;
      }
    }

    // Possession tracker for match stats
    if (this.ballPossessor) {
      if (this.homeRigs.includes(this.ballPossessor)) this.homePossessionTicks++;
      else this.awayPossessionTicks++;
    }

    // AI Team Simulation Loop
    allRigs.forEach((rig) => {
      // Skip player-controlled rig in USER_VS_AI mode
      if (this.gameMode === 'USER_VS_AI' && rig === this.controlledRig) return;

      const isHome = this.homeRigs.includes(rig);
      const isAttacking = isHome ? (this.ballPossessor && this.homeRigs.includes(this.ballPossessor)) : (this.ballPossessor && this.awayRigs.includes(this.ballPossessor));
      const opponentGoalX = isHome ? PITCH_LENGTH / 2 : -PITCH_LENGTH / 2;
      const ownGoalX = isHome ? -PITCH_LENGTH / 2 : PITCH_LENGTH / 2;

      // 1. Goalkeeper AI
      if (rig.isGoalkeeper) {
        const goalLineX = ownGoalX + (isHome ? 2.5 : -2.5);
        rig.root.position.x = goalLineX;
        // Track ball Z position bounded within goal width
        const targetZ = Math.max(-GOAL_WIDTH / 2, Math.min(GOAL_WIDTH / 2, this.ballPos.z * 0.4));
        rig.root.position.z = THREE.MathUtils.lerp(rig.root.position.z, targetZ, 0.08);

        // Face ball
        rig.root.lookAt(this.ballPos.x, 0, this.ballPos.z);

        // Diving save if shot is incoming
        const distToBall = rig.root.position.distanceTo(this.ballPos);
        const ballComingFast = (isHome && this.ballVel.x < -8) || (!isHome && this.ballVel.x > 8);
        if (distToBall < 4.5 && ballComingFast && this.ballPos.y > 0.4) {
          const diveDir = this.ballPos.z > rig.root.position.z ? 1 : -1;
          updatePlayerAnimation(rig, 0, dt, false, diveDir);

          // Parrying the shot!
          if (distToBall < 1.4) {
            this.ballVel.x *= -0.5;
            this.ballVel.z += (Math.random() - 0.5) * 15;
            playBallKick(0.8);
            playCrowdNearMiss();
          }
        } else {
          updatePlayerAnimation(rig, 0, dt);
        }
        return;
      }

      // 2. Field Player AI
      if (this.ballPossessor === rig) {
        // Rig has ball: Decide between Dribble forward, Shoot, or Pass
        const distToOppGoal = Math.abs(opponentGoalX - rig.root.position.x);

        // Shoot Condition: Within 28m and good angle
        if (distToOppGoal < 28 && Math.abs(rig.root.position.z) < 18 && Math.random() < 0.04) {
          this.executeAIShot(rig, opponentGoalX);
          return;
        }

        // Pass Condition: Teammate open forward
        if (Math.random() < 0.035) {
          this.executeAIPass(rig, isHome);
          return;
        }

        // Dribble forward toward opponent goal
        const targetX = opponentGoalX;
        const targetZ = rig.root.position.z * 0.85; // converge toward center
        const moveDir = new THREE.Vector3(targetX - rig.root.position.x, 0, targetZ - rig.root.position.z).normalize();

        const speed = 7.0 * (rig.data.stats.pace / 100);
        rig.root.position.x += moveDir.x * speed * dt;
        rig.root.position.z += moveDir.y * speed * dt;

        rig.root.rotation.y = Math.atan2(moveDir.z, moveDir.x);

        // Keep ball at feet
        const ballOffset = new THREE.Vector3(0.6, 0, 0).applyEuler(rig.root.rotation);
        this.ballPos.x = rig.root.position.x + ballOffset.x;
        this.ballPos.z = rig.root.position.z + ballOffset.z;
        this.ballVel.set(0, 0, 0);

        updatePlayerAnimation(rig, 0.75, dt);
      } else {
        // Rig does not have ball
        let targetX = 0;
        let targetZ = 0;

        if (isAttacking) {
          // Attacking run: push forward into space
          targetX = isHome ? this.ballPos.x + 8 : this.ballPos.x - 8;
          targetZ = rig.root.position.z;
        } else {
          // Defending: Press ball if closest, or maintain defensive line
          const distToBall = rig.root.position.distanceTo(this.ballPos);
          if (distToBall < 12) {
            // Press ball carrier
            targetX = this.ballPos.x;
            targetZ = this.ballPos.z;

            // Attempt tackle if close
            if (distToBall < 1.3 && this.ballPossessor) {
              if (Math.random() < 0.05 * (rig.data.stats.defending / 100)) {
                this.ballPossessor = rig; // Successful tackle!
                playBallKick(0.4);
              }
            }
          } else {
            // Drop back into shape
            targetX = ownGoalX * 0.45;
            targetZ = rig.root.position.z * 0.9;
          }
        }

        const dir = new THREE.Vector3(targetX - rig.root.position.x, 0, targetZ - rig.root.position.z);
        const dist = dir.length();
        if (dist > 1.5) {
          dir.normalize();
          const speed = 5.5 * (rig.data.stats.pace / 100);
          rig.root.position.x += dir.x * speed * dt;
          rig.root.position.z += dir.z * speed * dt;
          rig.root.rotation.y = THREE.MathUtils.lerp(rig.root.rotation.y, Math.atan2(dir.z, dir.x), 0.15);
          updatePlayerAnimation(rig, 0.6, dt);
        } else {
          updatePlayerAnimation(rig, 0, dt);
        }
      }
    });
  }

  private executeAIShot(rig: Player3DRig, goalX: number) {
    this.ballPossessor = null;
    const targetZ = (Math.random() - 0.5) * (GOAL_WIDTH * 0.8);
    const targetY = 0.5 + Math.random() * (GOAL_HEIGHT * 0.8);

    const shotDir = new THREE.Vector3(goalX - this.ballPos.x, targetY - this.ballPos.y, targetZ - this.ballPos.z).normalize();
    const speed = 21 + (rig.data.stats.shooting / 100) * 14;

    this.ballVel.copy(shotDir.multiplyScalar(speed));
    rig.animState.kickTimer = 0.35;
    playBallKick(0.8);

    if (this.homeRigs.includes(rig)) {
      this.homeShots++;
      this.homeShotsOnTarget++;
    } else {
      this.awayShots++;
      this.awayShotsOnTarget++;
    }
  }

  private executeAIPass(rig: Player3DRig, isHome: boolean) {
    const mates = isHome ? this.homeRigs : this.awayRigs;
    const openMate = mates.find((m) => m !== rig && !m.isGoalkeeper && Math.random() > 0.4);

    if (openMate) {
      this.ballPossessor = null;
      const passDir = new THREE.Vector3().subVectors(openMate.root.position, this.ballPos);
      const dist = passDir.length();
      passDir.normalize();

      const speed = 15 + dist * 0.35;
      this.ballVel.copy(passDir.multiplyScalar(speed));
      this.ballVel.y = 0.3;
      rig.animState.kickTimer = 0.3;
      playBallKick(0.5);

      if (isHome) this.homePassCount++;
      else this.awayPassCount++;
    }
  }

  private updateBallPhysics(dt: number) {
    if (this.ballPossessor) return; // Ball is controlled at player's feet

    // Gravity
    this.ballVel.y -= 22 * dt;

    // Position integration
    this.ballPos.x += this.ballVel.x * dt;
    this.ballPos.y += this.ballVel.y * dt;
    this.ballPos.z += this.ballVel.z * dt;

    // Pitch bounce & friction
    if (this.ballPos.y <= this.ballRadius) {
      this.ballPos.y = this.ballRadius;
      this.ballVel.y = -this.ballVel.y * 0.65; // restitution
      if (Math.abs(this.ballVel.y) < 0.4) this.ballVel.y = 0;

      // Ground rolling friction
      this.ballVel.x *= 0.965;
      this.ballVel.z *= 0.965;
    }

    // Ball Mesh Transform
    this.ballMesh.position.copy(this.ballPos);

    // Ball rotation from velocity
    const speed = Math.sqrt(this.ballVel.x ** 2 + this.ballVel.z ** 2);
    if (speed > 0.2) {
      this.ballMesh.rotation.x += this.ballVel.z * dt * 4;
      this.ballMesh.rotation.z -= this.ballVel.x * dt * 4;
    }
  }

  private checkGoalCollision() {
    // Check Left Goal (Away scores against Home)
    if (this.ballPos.x <= -PITCH_LENGTH / 2) {
      if (Math.abs(this.ballPos.z) < GOAL_WIDTH / 2 && this.ballPos.y < GOAL_HEIGHT && this.ballPos.y > 0) {
        if (this.matchPhase === 'PLAYING') {
          this.triggerGoal(false); // Away scored
        }
      } else if (Math.abs(this.ballPos.x) < PITCH_LENGTH / 2 + 1.5 && Math.abs(this.ballPos.z) < GOAL_WIDTH / 2 + 0.5) {
        // Hit post
        playPostClang();
        this.ballVel.x *= -0.7;
      }
    }

    // Check Right Goal (Home scores against Away)
    if (this.ballPos.x >= PITCH_LENGTH / 2) {
      if (Math.abs(this.ballPos.z) < GOAL_WIDTH / 2 && this.ballPos.y < GOAL_HEIGHT && this.ballPos.y > 0) {
        if (this.matchPhase === 'PLAYING') {
          this.triggerGoal(true); // Home scored
        }
      } else if (Math.abs(this.ballPos.x) < PITCH_LENGTH / 2 + 1.5 && Math.abs(this.ballPos.z) < GOAL_WIDTH / 2 + 0.5) {
        // Hit post
        playPostClang();
        this.ballVel.x *= -0.7;
      }
    }
  }

  private triggerGoal(homeScored: boolean) {
    this.matchPhase = 'GOAL';
    playNetRattle();
    playWhistle('double');
    playGoalRoar();

    if (homeScored) {
      this.homeScore++;
      const scorer = this.homeRigs.find((r) => r.data.stats.shooting > 80)?.data || this.homeRigs[9].data;
      this.callbacks.onGoalScored(scorer, this.homeTeam);
    } else {
      this.awayScore++;
      const scorer = this.awayRigs.find((r) => r.data.stats.shooting > 80)?.data || this.awayRigs[9].data;
      this.callbacks.onGoalScored(scorer, this.awayTeam);
    }

    this.callbacks.onScoreChange(this.homeScore, this.awayScore);

    // Reset to center circle kickoff after 4.5s celebration
    setTimeout(() => {
      if (!this.isDestroyed) {
        this.resetToKickoff(!homeScored);
      }
    }, 4500);
  }

  private updateCamera(_dt: number) {
    const target = this.ballPos;

    if (this.cameraView === 'BROADCAST') {
      // Classic Side TV Broadcast with pitch tracking
      const camX = target.x * 0.75;
      const camY = 32;
      const camZ = 52;
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, camX, 0.08);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, camY, 0.08);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, camZ, 0.08);
      this.camera.lookAt(target.x * 0.85, 1.5, target.z * 0.4);
    } else if (this.cameraView === 'TELE') {
      // Higher tactical bird's eye view
      const camX = target.x * 0.65;
      const camY = 48;
      const camZ = 45;
      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(target.x, 0, 0);
    } else if (this.cameraView === 'ACTION' && this.controlledRig) {
      // Behind controlled player
      const p = this.controlledRig.root.position;
      const behind = new THREE.Vector3(-12, 6, 0).applyEuler(this.controlledRig.root.rotation);
      this.camera.position.lerp(new THREE.Vector3(p.x + behind.x, p.y + behind.y, p.z + behind.z), 0.1);
      this.camera.lookAt(target.x, target.y + 1, target.z);
    } else {
      // Top-Down
      this.camera.position.set(target.x * 0.5, 75, 0.01);
      this.camera.lookAt(target.x * 0.5, 0, 0);
    }
  }

  private broadcastCallbacks() {
    // Active player HUD
    if (this.controlledRig) {
      this.callbacks.onActivePlayerChange(this.controlledRig.data, this.userStamina, this.userShotPower);
    } else {
      this.callbacks.onActivePlayerChange(null, 100, 0);
    }

    // Match Stats
    const totalPoss = Math.max(1, this.homePossessionTicks + this.awayPossessionTicks);
    const homePossPercent = Math.round((this.homePossessionTicks / totalPoss) * 100);
    this.callbacks.onMatchStatsUpdate({
      homeGoals: this.homeScore,
      awayGoals: this.awayScore,
      homeShots: this.homeShots,
      awayShots: this.awayShots,
      homeShotsOnTarget: this.homeShotsOnTarget,
      awayShotsOnTarget: this.awayShotsOnTarget,
      homePossession: homePossPercent,
      awayPossession: 100 - homePossPercent,
      homePasses: this.homePassCount,
      awayPasses: this.awayPassCount,
    });

    // Radar Minimap (22 players + ball)
    const homePos = this.homeRigs.map((r) => ({ x: r.root.position.x, z: r.root.position.z }));
    const awayPos = this.awayRigs.map((r) => ({ x: r.root.position.x, z: r.root.position.z }));
    this.callbacks.onRadarUpdate(homePos, awayPos, { x: this.ballPos.x, z: this.ballPos.z });
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  // Public Controls
  public setCameraView(view: CameraView) {
    this.cameraView = view;
  }

  public setGameMode(mode: GameMode) {
    this.gameMode = mode;
  }

  public setTeams(home: TeamData, away: TeamData) {
    this.homeTeam = home;
    this.awayTeam = away;
    this.homeScore = 0;
    this.awayScore = 0;
    this.matchTimer = 0;
    this.spawnTeams();
    this.resetToKickoff(true);
  }

  public getMatchMinute(): number {
    return Math.floor(this.matchTimer);
  }

  public getMatchPhase(): MatchPhase {
    return this.matchPhase;
  }

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
