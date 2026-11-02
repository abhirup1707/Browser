import * as THREE from 'three';
import { TerrainManager } from './terrain/terrainGenerator';
import { WaterSystem } from './environment/waterSystem';
import { ScaryForestVegetation } from './vegetation/scaryTrees';
import { ForestUndergrowth } from './vegetation/undergrowth';
import { ForestAtmosphere, type WeatherPreset } from './atmosphere/skyAndLighting';
import { FirstPersonController } from './player/firstPersonController';
import { ForestAudioEngine } from './audio/forestAudioEngine';
import { ScoutMultiplayer } from './multiplayer/scoutMultiplayer';

export interface GameEngineStats {
  fps: number;
  playerPos: THREE.Vector3;
  headingDeg: number;
  distToCity: number;
  stamina: number;
  flashlightOn: boolean;
  isInWater: boolean;
  isZooming: boolean;
  weather: WeatherPreset;
  seed: number;
  isLocked: boolean;
}

export class ForestGameEngine {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public terrain: TerrainManager;
  public water: WaterSystem;
  public trees: ScaryForestVegetation;
  public undergrowth: ForestUndergrowth;
  public atmosphere: ForestAtmosphere;
  public controller: FirstPersonController;
  public audio: ForestAudioEngine;
  public multiplayer: ScoutMultiplayer;

  private clock = new THREE.Clock();
  private animationId: number = 0;
  private isRunning = false;
  private onStatsCallback?: (stats: GameEngineStats) => void;

  private frameCount = 0;
  private lastFpsTime = 0;
  private currentFps = 60;
  public currentSeed = 1337;
  public currentWeather: WeatherPreset = 'RARE_SUNLIGHT';

  constructor(container: HTMLElement) {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1216);

    // 2. High-performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 3. Audio Engine
    this.audio = new ForestAudioEngine();

    // 4. Procedural Terrain (Organic 3D)
    this.terrain = new TerrainManager({ seed: this.currentSeed });
    this.scene.add(this.terrain.mesh);

    // 5. Water Bodies (Rivers, Swamps, Lakes)
    this.water = new WaterSystem(this.terrain.config.waterLevel, this.terrain.config.size);
    this.scene.add(this.water.group);

    // 6. Scary Trees & Fallen Timber
    this.trees = new ScaryForestVegetation(this.terrain, 1200);
    this.scene.add(this.trees.group);

    // 7. Dense Undergrowth (Brambles, Boulders, Glowing Fungi)
    this.undergrowth = new ForestUndergrowth(this.terrain, 800, 260);
    this.scene.add(this.undergrowth.group);

    // 8. Atmosphere, Volumetric Rare Sunlight, Distant City Skyline
    this.atmosphere = new ForestAtmosphere(this.scene, this.terrain);
    this.scene.add(this.atmosphere.group);

    // 9. First Person VR-style Controller
    this.controller = new FirstPersonController(
      this.renderer.domElement,
      this.terrain,
      this.water,
      this.trees,
      this.undergrowth
    );
    this.scene.add(this.controller.camera);
    this.scene.add(this.controller.flashlight);
    this.scene.add(this.controller.flashlightTarget);

    // Wire footsteps into procedural audio
    this.controller.setOnStepCallback((surface) => {
      this.audio.playFootstep(surface);
    });

    // 10. Scout Multiplayer & Fellow Scouts
    this.multiplayer = new ScoutMultiplayer(this.terrain);
    this.scene.add(this.multiplayer.group);

    // Window Resize Handling
    window.addEventListener('resize', this.onWindowResize);

    // Random eerie crow / sound effects
    setInterval(() => {
      if (Math.random() > 0.45 && this.isRunning) {
        this.audio.playEerieCrow();
      }
    }, 18000);

    // Key listener for Ping (E)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' && this.controller.isLocked) {
        this.multiplayer.spawnPingBeacon(this.controller.camera.position.clone(), 'You');
        this.audio.playPing();
      }
    });

    this.start();
  }

  public setOnStatsCallback(cb: (stats: GameEngineStats) => void): void {
    this.onStatsCallback = cb;
  }

  public requestLock(): void {
    this.controller.requestLock();
  }

  public unlock(): void {
    this.controller.unlock();
  }

  public setWeather(preset: WeatherPreset): void {
    this.currentWeather = preset;
    this.atmosphere.setPreset(preset);
  }

  // Regenerate world with a fresh random seed
  public regenerateSeed(newSeed?: number): void {
    const seed = newSeed ?? Math.floor(Math.random() * 999999 + 1);
    this.currentSeed = seed;

    // Reseed terrain
    this.terrain.reseed(seed);

    // Remove old trees & undergrowth and rebuild with new distribution
    this.scene.remove(this.trees.group);
    this.scene.remove(this.undergrowth.group);

    this.trees = new ScaryForestVegetation(this.terrain, 1200);
    this.scene.add(this.trees.group);

    this.undergrowth = new ForestUndergrowth(this.terrain, 800, 260);
    this.scene.add(this.undergrowth.group);

    // Reposition player onto safe dry ground
    const spawnY = this.terrain.getHeightAt(this.controller.camera.position.x, this.controller.camera.position.z);
    this.controller.camera.position.y = spawnY + 1.75;
  }

  private onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.controller.camera.aspect = width / height;
    this.controller.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
  }

  private animate = () => {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const now = performance.now();

    // FPS calculation
    this.frameCount++;
    if (now - this.lastFpsTime >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    // 1. Update First Person Controls
    this.controller.update(delta);

    // 2. Update Water Shader Animations
    this.water.update(delta);

    // 3. Update Atmosphere & Particle Drift around player
    this.atmosphere.update(delta, this.controller.camera.position);

    // 4. Update Multiplayer & Fellow Scouts
    this.multiplayer.update(delta, this.controller.camera.position);

    // 5. Render Scene
    this.renderer.render(this.scene, this.controller.camera);

    // 6. Emit stats to HUD
    if (this.onStatsCallback) {
      const pPos = this.controller.camera.position;
      const cityPos = this.terrain.config.cityPos;
      const dist = Math.round(
        Math.sqrt(Math.pow(pPos.x - cityPos.x, 2) + Math.pow(pPos.z - cityPos.z, 2))
      );

      // Heading in degrees (0 = North, 90 = East, 180 = South, 270 = West)
      let heading = ((-this.controller.camera.rotation.y * 180) / Math.PI) % 360;
      if (heading < 0) heading += 360;

      this.onStatsCallback({
        fps: this.currentFps,
        playerPos: pPos.clone(),
        headingDeg: Math.round(heading),
        distToCity: dist,
        stamina: Math.round(this.controller.state.stamina),
        flashlightOn: this.controller.state.flashlightOn,
        isInWater: this.controller.state.isInWater,
        isZooming: this.controller.state.isZooming,
        weather: this.currentWeather,
        seed: this.currentSeed,
        isLocked: this.controller.isLocked,
      });
    }
  };

  public dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    this.controller.dispose();
    this.terrain.dispose();
    this.renderer.dispose();
  }
}
