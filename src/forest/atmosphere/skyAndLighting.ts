import * as THREE from 'three';
import { TerrainManager } from '../terrain/terrainGenerator';

export type WeatherPreset = 'RARE_SUNLIGHT' | 'TWILIGHT_FOG' | 'MIDNIGHT_EXPEDITION';

export class ForestAtmosphere {
  public group: THREE.Group;
  public dirLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public sunShaftsGroup: THREE.Group;
  public cityGroup: THREE.Group;
  public sporeParticles: THREE.Points;
  public skyMesh: THREE.Mesh;
  private particleGeom: THREE.BufferGeometry;
  private timeUniform: { value: number } = { value: 0 };
  private sceneRef: THREE.Scene;

  constructor(scene: THREE.Scene, terrain: TerrainManager) {
    this.sceneRef = scene;
    this.group = new THREE.Group();
    this.sunShaftsGroup = new THREE.Group();
    this.cityGroup = new THREE.Group();

    // 1. Scene Fog (Eerie atmospheric perspective)
    scene.fog = new THREE.FogExp2(0x0a141a, 0.007);

    // 2. Realistic Sky Dome with Painterly Atmospheric Gradient (PEAK style)
    this.skyMesh = this.buildAtmosphericSkyDome();
    this.group.add(this.skyMesh);

    // 3. Ambient & Sun Lighting
    this.hemiLight = new THREE.HemisphereLight(0x354a54, 0x141e17, 0.85);
    this.group.add(this.hemiLight);

    // Rare golden sunlight breaking through
    this.dirLight = new THREE.DirectionalLight(0xffdfa4, 1.8);
    this.dirLight.position.set(140, 180, 100);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 500;
    this.dirLight.shadow.camera.left = -140;
    this.dirLight.shadow.camera.right = 140;
    this.dirLight.shadow.camera.top = 140;
    this.dirLight.shadow.camera.bottom = -140;
    this.dirLight.shadow.bias = -0.0004;
    this.group.add(this.dirLight);

    // 4. Volumetric Rare Sunlight Shafts (God Rays)
    this.buildRareSunShafts(terrain);
    this.group.add(this.sunShaftsGroup);

    // 5. Distant City Skyline & Beacon (The Destination Goal)
    this.buildDistantCity(terrain);
    this.group.add(this.cityGroup);

    // 6. Mountain Silhouettes on Horizon
    this.buildDistantMountainRidges();

    // 7. Drifting Forest Spores & Fireflies
    const { points, geom } = this.buildForestParticles();
    this.sporeParticles = points;
    this.particleGeom = geom;
    this.group.add(this.sporeParticles);

    // Initial weather setup
    this.setPreset('RARE_SUNLIGHT');
  }

  // Painterly Atmospheric Skydome (Dusky teal, amber horizon glow, deep navy zenith)
  private buildAtmosphericSkyDome(): THREE.Mesh {
    const geom = new THREE.SphereGeometry(650, 32, 24);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTopColor: { value: new THREE.Color(0x060c14) }, // Deep twilight zenith
        uHorizonColor: { value: new THREE.Color(0x283838) }, // Atmospheric haze
        uSunColor: { value: new THREE.Color(0xd49b52) }, // Warm sunset/sunrise golden aura
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uSunColor;
        varying vec3 vWorldPosition;

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y * 3.5, 0.0, 1.0);

          // Sun direction
          vec3 sunDir = normalize(vec3(0.6, 0.4, 0.5));
          float sunDot = max(0.0, dot(dir, sunDir));
          float sunGlow = pow(sunDot, 6.0) * 0.75;

          vec3 sky = mix(uHorizonColor, uTopColor, h);
          sky += uSunColor * sunGlow;

          gl_FragColor = vec4(sky, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });

    return new THREE.Mesh(geom, mat);
  }

  // Distant Mountain Ridges framing the valley (PEAK style silhouettes)
  private buildDistantMountainRidges(): void {
    const ridgeGeom = new THREE.CylinderGeometry(560, 560, 120, 36, 1, true);
    const pos = ridgeGeom.attributes.position;

    // Sculpt craggy mountain peaks
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const angle = Math.atan2(z, x);
        const peakNoise =
          Math.sin(angle * 6.0) * 28.0 +
          Math.sin(angle * 14.0) * 14.0 +
          Math.sin(angle * 2.0) * 35.0;
        pos.setY(i, y + peakNoise);
      }
    }
    ridgeGeom.computeVertexNormals();

    const ridgeMat = new THREE.MeshBasicMaterial({
      color: 0x0c161c, // Dark atmospheric silhouette
      side: THREE.BackSide,
      fog: false,
    });

    const ridgeMesh = new THREE.Mesh(ridgeGeom, ridgeMat);
    ridgeMesh.position.y = 20;
    this.group.add(ridgeMesh);
  }

  // Generates rare volumetric sunlight shafts angling through canopy gaps
  private buildRareSunShafts(terrain: TerrainManager): void {
    const shaftGeom = new THREE.CylinderGeometry(1.5, 9.5, 48.0, 12, 1, true);
    shaftGeom.translate(0, -24.0, 0);

    const shaftMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xffe2a4) },
        uTime: this.timeUniform,
      },
      vertexShader: `
        varying vec3 vWorldPos;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vWorldPos;
        varying vec2 vUv;
        void main() {
          float verticalFade = sin(vUv.y * 3.14159);
          float flicker = 0.82 + 0.18 * sin(uTime * 1.6 + vWorldPos.x * 0.1);
          float alpha = clamp(verticalFade * 0.32 * flicker, 0.0, 0.4);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Positions for rare sun shafts breaking through forest canopy
    const sunPositions = [
      new THREE.Vector2(-40, 20),
      new THREE.Vector2(30, -50),
      new THREE.Vector2(-120, -60),
      new THREE.Vector2(70, 50),
      new THREE.Vector2(-15, -110),
      new THREE.Vector2(130, -120),
    ];

    sunPositions.forEach((pos) => {
      const shaft = new THREE.Mesh(shaftGeom, shaftMat);
      const groundY = terrain.getHeightAt(pos.x, pos.y);
      shaft.position.set(pos.x, groundY + 40.0, pos.y);

      shaft.rotation.x = 0.32;
      shaft.rotation.z = -0.38;
      this.sunShaftsGroup.add(shaft);

      // Warm ground patch
      const groundPatchGeom = new THREE.CircleGeometry(7.0, 14);
      groundPatchGeom.rotateX(-Math.PI / 2);
      const patchMat = new THREE.MeshBasicMaterial({
        color: 0xffd17a,
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const patch = new THREE.Mesh(groundPatchGeom, patchMat);
      patch.position.set(pos.x + 12.0, groundY + 0.12, pos.y - 10.0);
      this.sunShaftsGroup.add(patch);
    });
  }

  // Generates the distant glowing City with illuminated window textures
  private buildDistantCity(terrain: TerrainManager): void {
    const cityCenter = terrain.config.cityPos;

    // Procedural glowing city skyscraper facade texture
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 256;
    cCanvas.height = 512;
    const ctx = cCanvas.getContext('2d')!;

    ctx.fillStyle = '#0f1722';
    ctx.fillRect(0, 0, 256, 512);

    // Glowing warm windows grid
    ctx.fillStyle = '#ffb347';
    for (let y = 20; y < 490; y += 14) {
      for (let x = 16; x < 240; x += 12) {
        if (Math.random() > 0.35) {
          ctx.fillRect(x, y, 7, 8);
        }
      }
    }

    const bTex = new THREE.CanvasTexture(cCanvas);
    bTex.wrapS = THREE.RepeatWrapping;
    bTex.wrapT = THREE.RepeatWrapping;

    const bMat = new THREE.MeshStandardMaterial({
      map: bTex,
      roughness: 0.4,
      metalness: 0.8,
      emissive: 0x442a10,
    });

    const buildingCount = 32;
    const bGeom = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < buildingCount; i++) {
      const bMesh = new THREE.Mesh(bGeom, bMat);
      const bx = cityCenter.x + (Math.random() - 0.5) * 85;
      const bz = cityCenter.z + (Math.random() - 0.5) * 85;
      const height = Math.random() * 65 + 30;
      const width = Math.random() * 14 + 10;
      const depth = Math.random() * 14 + 10;

      bMesh.scale.set(width, height, depth);
      bMesh.position.set(bx, cityCenter.y + height / 2, bz);
      this.cityGroup.add(bMesh);

      // Spires with blinking beacon lights
      if (height > 55) {
        const spireGeom = new THREE.CylinderGeometry(0.1, 0.4, 12, 4);
        spireGeom.translate(0, 6, 0);
        const spire = new THREE.Mesh(spireGeom, new THREE.MeshBasicMaterial({ color: 0x444444 }));
        spire.position.set(bx, cityCenter.y + height, bz);
        this.cityGroup.add(spire);

        const beaconGeom = new THREE.SphereGeometry(1.1, 6, 6);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(bx, cityCenter.y + height + 12, bz);
        this.cityGroup.add(beacon);
      }
    }

    // Skyward Searchlight Beams
    const beamGeom = new THREE.CylinderGeometry(0.8, 12.0, 180.0, 8, 1, true);
    beamGeom.translate(0, 90.0, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    for (let i = 0; i < 4; i++) {
      const beam = new THREE.Mesh(beamGeom, beamMat);
      beam.position.set(cityCenter.x + (i - 1.5) * 22, cityCenter.y + 15, cityCenter.z + (i % 2 === 0 ? 12 : -12));
      beam.rotation.z = (Math.random() - 0.5) * 0.25;
      beam.rotation.x = (Math.random() - 0.5) * 0.25;
      this.cityGroup.add(beam);
    }

    // Atmospheric warm city halo
    const cityGlowGeom = new THREE.SphereGeometry(85, 16, 16);
    const cityGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff9922,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const cityGlow = new THREE.Mesh(cityGlowGeom, cityGlowMat);
    cityGlow.position.copy(cityCenter).add(new THREE.Vector3(0, 25, 0));
    this.cityGroup.add(cityGlow);
  }

  // Floating forest particles (spores & fireflies)
  private buildForestParticles(): { points: THREE.Points; geom: THREE.BufferGeometry } {
    const particleCount = 750;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 350;
      pos[i * 3 + 1] = Math.random() * 24 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 350;

      const isFirefly = Math.random() > 0.45;
      if (isFirefly) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.3;
      } else {
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.85;
      }
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { points: new THREE.Points(geom, mat), geom };
  }

  public setPreset(preset: WeatherPreset): void {
    if (preset === 'RARE_SUNLIGHT') {
      this.sceneRef.fog = new THREE.FogExp2(0x0a161c, 0.007);
      this.dirLight.intensity = 1.8;
      this.dirLight.color.setHex(0xffdfa4);
      this.hemiLight.color.setHex(0x354a54);
      this.hemiLight.groundColor.setHex(0x141e17);
      this.sunShaftsGroup.visible = true;
    } else if (preset === 'TWILIGHT_FOG') {
      this.sceneRef.fog = new THREE.FogExp2(0x060f16, 0.011);
      this.dirLight.intensity = 0.55;
      this.dirLight.color.setHex(0x60809b);
      this.hemiLight.color.setHex(0x1e2c38);
      this.hemiLight.groundColor.setHex(0x0a100d);
      this.sunShaftsGroup.visible = false;
    } else if (preset === 'MIDNIGHT_EXPEDITION') {
      this.sceneRef.fog = new THREE.FogExp2(0x03060a, 0.014);
      this.dirLight.intensity = 0.15;
      this.dirLight.color.setHex(0x304860);
      this.hemiLight.color.setHex(0x0e1620);
      this.hemiLight.groundColor.setHex(0x030605);
      this.sunShaftsGroup.visible = false;
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    this.timeUniform.value += delta;

    this.sporeParticles.position.x = playerPos.x;
    this.sporeParticles.position.z = playerPos.z;

    this.skyMesh.position.x = playerPos.x;
    this.skyMesh.position.z = playerPos.z;

    const pos = this.particleGeom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let py = pos.getY(i) + Math.sin(this.timeUniform.value * 1.5 + i) * 0.018;
      if (py > 25) py = 1;
      pos.setY(i, py);
    }
    pos.needsUpdate = true;
  }
}
