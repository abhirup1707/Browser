import * as THREE from 'three';
import { TerrainManager } from '../terrain/terrainGenerator';
import { WaterSystem } from '../environment/waterSystem';
import { ScaryForestVegetation } from '../vegetation/scaryTrees';
import { ForestUndergrowth } from '../vegetation/undergrowth';

export interface PlayerState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  isMoving: boolean;
  isSprinting: boolean;
  isCrouching: boolean;
  isGrounded: boolean;
  isInWater: boolean;
  stamina: number;
  flashlightOn: boolean;
  isZooming: boolean;
  speed: number;
}

export class FirstPersonController {
  public camera: THREE.PerspectiveCamera;
  public state: PlayerState;
  public flashlight: THREE.SpotLight;
  public flashlightTarget: THREE.Object3D;
  private flashlightFill: THREE.PointLight;

  // Movement parameters
  private walkSpeed = 4.4;
  private sprintSpeed = 7.8;
  private crouchSpeed = 2.2;
  private waterSpeedFactor = 0.65;
  private jumpForce = 6.2;
  private gravity = 18.0;

  // State variables
  private velocity = new THREE.Vector3();
  private verticalVelocity = 0;
  private pitch = 0;
  private yaw = 0;
  private normalEyeHeight = 1.75;
  private crouchEyeHeight = 1.05;
  private currentEyeHeight = 1.75;
  private headBobTimer = 0;
  private lastClientX = 0;
  private lastClientY = 0;

  // Input states
  private keys: Record<string, boolean> = {};
  public isLocked = false;
  private onStepCallback?: (surface: 'dirt' | 'water' | 'rock') => void;

  // External systems
  private terrain: TerrainManager;
  private water: WaterSystem;
  private trees: ScaryForestVegetation;
  private undergrowth: ForestUndergrowth;
  private domElement: HTMLElement;

  constructor(
    domElement: HTMLElement,
    terrain: TerrainManager,
    water: WaterSystem,
    trees: ScaryForestVegetation,
    undergrowth: ForestUndergrowth
  ) {
    this.domElement = domElement;
    this.terrain = terrain;
    this.water = water;
    this.trees = trees;
    this.undergrowth = undergrowth;

    // Spawn player in the South-West forest edge looking toward North-East
    const spawnX = -280;
    const spawnZ = 280;
    const spawnY = terrain.getHeightAt(spawnX, spawnZ);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(spawnX, spawnY + this.normalEyeHeight, spawnZ);
    this.camera.rotation.order = 'YXZ';

    // Face North-East (-Z, +X)
    this.yaw = -Math.PI * 0.75;
    this.pitch = 0.05;

    // Handheld Scout Flashlight
    this.flashlight = new THREE.SpotLight(0xfff4d6, 3.5, 65, Math.PI / 5.5, 0.45, 1.2);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 1024;
    this.flashlight.shadow.mapSize.height = 1024;
    this.flashlight.shadow.bias = -0.001;

    this.flashlightTarget = new THREE.Object3D();
    this.flashlight.target = this.flashlightTarget;

    // Soft ambient fill light around the flashlight bulb
    this.flashlightFill = new THREE.PointLight(0xffeedd, 0.6, 6);

    this.state = {
      position: this.camera.position.clone(),
      rotation: this.camera.rotation.clone(),
      isMoving: false,
      isSprinting: false,
      isCrouching: false,
      isGrounded: true,
      isInWater: false,
      stamina: 100,
      flashlightOn: true,
      isZooming: false,
      speed: 0,
    };

    this.bindEvents();
  }

  public setOnStepCallback(cb: (surface: 'dirt' | 'water' | 'rock') => void): void {
    this.onStepCallback = cb;
  }

  public requestLock(): void {
    try {
      const res = this.domElement.requestPointerLock() as any;
      if (res && typeof res.catch === 'function') {
        res.catch((err: any) => {
          console.warn('Pointer lock failed, using manual look:', err);
          this.isLocked = true;
        });
      }
    } catch (e) {
      console.warn('Pointer lock exception:', e);
    }
    this.isLocked = true;
  }

  public unlock(): void {
    if (document.exitPointerLock) {
      try {
        document.exitPointerLock();
      } catch (e) {
        // ignore
      }
    }
    this.isLocked = false;
    this.lastClientX = 0;
    this.lastClientY = 0;
  }

  private bindEvents(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);

    this.domElement.addEventListener('click', () => {
      this.requestLock();
    });

    document.addEventListener('pointerlockchange', () => {
      const locked = document.pointerLockElement === this.domElement || document.pointerLockElement === document.body;
      this.isLocked = locked;
      if (!locked) {
        this.lastClientX = 0;
        this.lastClientY = 0;
      }
    });

    document.addEventListener('pointerlockerror', (err) => {
      console.warn('Pointer lock error, maintaining manual look:', err);
      this.isLocked = true;
    });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;

    // Toggle Flashlight (F)
    if (e.code === 'KeyF') {
      this.state.flashlightOn = !this.state.flashlightOn;
      this.flashlight.visible = this.state.flashlightOn;
      this.flashlightFill.visible = this.state.flashlightOn;
    }

    if (e.code === 'Escape') {
      this.unlock();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
      // Right Mouse Button: Scout Zoom / Monocular
      this.state.isZooming = true;
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 2) {
      this.state.isZooming = false;
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isLocked) return;

    let movementX = e.movementX;
    let movementY = e.movementY;

    // Fallback if movementX/Y is zero or undefined when pointer lock is not fully granted
    if (movementX === undefined || (movementX === 0 && movementY === 0 && !document.pointerLockElement)) {
      if (this.lastClientX !== 0 && this.lastClientY !== 0) {
        movementX = e.clientX - this.lastClientX;
        movementY = e.clientY - this.lastClientY;
      } else {
        movementX = 0;
        movementY = 0;
      }
    }
    this.lastClientX = e.clientX;
    this.lastClientY = e.clientY;

    const sens = this.state.isZooming ? 0.0009 : 0.0022;
    this.yaw -= movementX * sens;
    this.pitch -= movementY * sens;

    // Clamp vertical look angle (-85 deg to +85 deg)
    const maxPitch = (Math.PI / 2) * 0.94;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
  };

  public update(delta: number): void {
    // 1. Process movement inputs
    const forward = (this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0) - (this.keys['KeyS'] || this.keys['ArrowDown'] ? 1 : 0);
    const strafe = (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0) - (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0);
    const sprintKey = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const crouchKey = this.keys['KeyC'] || this.keys['ControlLeft'];
    const jumpKey = this.keys['Space'];

    // Stamina logic
    if (sprintKey && forward > 0 && this.state.stamina > 5) {
      this.state.isSprinting = true;
      this.state.stamina = Math.max(0, this.state.stamina - delta * 22);
    } else {
      this.state.isSprinting = false;
      this.state.stamina = Math.min(100, this.state.stamina + delta * 14);
    }

    this.state.isCrouching = crouchKey;

    // Determine current speed
    let targetSpeed = this.walkSpeed;
    if (this.state.isSprinting) targetSpeed = this.sprintSpeed;
    else if (this.state.isCrouching) targetSpeed = this.crouchSpeed;

    // Check if player is wading in water
    const currentY = this.camera.position.y - this.currentEyeHeight;
    this.state.isInWater = this.water.isWaterAt(this.camera.position.x, currentY, this.camera.position.z);
    if (this.state.isInWater) {
      targetSpeed *= this.waterSpeedFactor;
    }

    // Move direction relative to camera yaw
    const moveDir = new THREE.Vector3();
    if (forward !== 0 || strafe !== 0) {
      const angle = this.yaw + Math.atan2(strafe, forward);
      moveDir.set(Math.sin(angle), 0, Math.cos(angle)).normalize();
    }

    // Smooth horizontal acceleration & friction
    const accel = this.state.isGrounded ? 12.0 : 3.0;
    this.velocity.x += (moveDir.x * targetSpeed - this.velocity.x) * Math.min(1, accel * delta);
    this.velocity.z += (moveDir.z * targetSpeed - this.velocity.z) * Math.min(1, accel * delta);

    // 2. Jumping & Gravity
    const groundHeight = this.terrain.getHeightAt(this.camera.position.x, this.camera.position.z);
    const currentFeetY = this.camera.position.y - this.currentEyeHeight;

    if (currentFeetY <= groundHeight + 0.05) {
      this.state.isGrounded = true;
      if (this.verticalVelocity < 0) this.verticalVelocity = 0;

      if (jumpKey && this.state.stamina > 10) {
        this.verticalVelocity = this.jumpForce;
        this.state.isGrounded = false;
        this.state.stamina = Math.max(0, this.state.stamina - 12);
      }
    } else {
      this.state.isGrounded = false;
      this.verticalVelocity -= this.gravity * delta;
    }

    // 3. New proposed position & Collisions
    const nextX = this.camera.position.x + this.velocity.x * delta;
    const nextZ = this.camera.position.z + this.velocity.z * delta;

    // Check tree and boulder collisions
    const hitTree = this.trees.checkCollision(nextX, nextZ, 0.45);
    let hitBoulder = false;
    for (const b of this.undergrowth.boulderColliders) {
      const dx = nextX - b.center.x;
      const dz = nextZ - b.center.y;
      if (dx * dx + dz * dz < (b.radius + 0.45) * (b.radius + 0.45)) {
        hitBoulder = true;
        break;
      }
    }

    if (!hitTree && !hitBoulder) {
      this.camera.position.x = nextX;
      this.camera.position.z = nextZ;
    }

    // Vertical position resolution
    const newGroundY = this.terrain.getHeightAt(this.camera.position.x, this.camera.position.z);
    let newFeetY = currentFeetY + this.verticalVelocity * delta;

    if (newFeetY < newGroundY) {
      newFeetY = newGroundY;
      this.verticalVelocity = 0;
      this.state.isGrounded = true;
    }

    // Smooth crouch transition
    const targetEyeHeight = this.state.isCrouching ? this.crouchEyeHeight : this.normalEyeHeight;
    this.currentEyeHeight += (targetEyeHeight - this.currentEyeHeight) * Math.min(1, 10 * delta);

    // 4. Head Bobbing & Footsteps
    const horizontalSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    this.state.speed = horizontalSpeed;
    this.state.isMoving = horizontalSpeed > 0.5 && this.state.isGrounded;

    let bobOffset = 0;
    if (this.state.isMoving) {
      const bobFreq = this.state.isSprinting ? 12.0 : 8.5;
      const prevTimer = this.headBobTimer;
      this.headBobTimer += delta * bobFreq;

      const bobAmp = this.state.isSprinting ? 0.08 : 0.045;
      bobOffset = Math.sin(this.headBobTimer) * bobAmp;

      // Trigger footstep sound at bottom of bob cycle
      if (Math.sin(prevTimer) > 0 && Math.sin(this.headBobTimer) <= 0) {
        if (this.onStepCallback) {
          if (this.state.isInWater) {
            this.onStepCallback('water');
          } else {
            const normal = this.terrain.getNormalAt(this.camera.position.x, this.camera.position.z);
            this.onStepCallback(normal.y < 0.75 ? 'rock' : 'dirt');
          }
        }
      }
    } else {
      this.headBobTimer = 0;
    }

    this.camera.position.y = newFeetY + this.currentEyeHeight + bobOffset;

    // 5. Camera orientation with subtle strafe tilt
    const strafeTilt = -strafe * 0.02;
    this.camera.rotation.set(this.pitch, this.yaw, strafeTilt, 'YXZ');

    // 6. Smooth Zoom FOV transition
    const targetFOV = this.state.isZooming ? 28 : 75;
    this.camera.fov += (targetFOV - this.camera.fov) * Math.min(1, 12 * delta);
    this.camera.updateProjectionMatrix();

    // 7. Update Flashlight position & orientation
    if (this.state.flashlightOn) {
      // Flashlight attached near right hip/shoulder with subtle sway
      const right = new THREE.Vector3(0.28, -0.22, -0.3).applyEuler(this.camera.rotation);
      this.flashlight.position.copy(this.camera.position).add(right);
      this.flashlightFill.position.copy(this.flashlight.position);

      const forwardLook = new THREE.Vector3(0, 0, -10).applyEuler(this.camera.rotation);
      this.flashlightTarget.position.copy(this.camera.position).add(forwardLook);
    }

    // Sync state
    this.state.position.copy(this.camera.position);
    this.state.rotation.copy(this.camera.rotation);
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}
