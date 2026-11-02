import * as THREE from 'three';
import { createProceduralTextures } from '../terrain/terrainTextures';

export class WaterSystem {
  public group: THREE.Group;
  public waterMesh: THREE.Mesh;
  public waterLevel: number;
  private timeUniform: { value: number } = { value: 0 };
  private mistGroup: THREE.Group;

  constructor(waterLevel: number = 2.2, terrainSize: number = 900) {
    this.waterLevel = waterLevel;
    this.group = new THREE.Group();
    this.mistGroup = new THREE.Group();

    const textures = createProceduralTextures();

    // 1. Water Plane Geometry
    const waterGeom = new THREE.PlaneGeometry(terrainSize, terrainSize, 128, 128);
    waterGeom.rotateX(-Math.PI / 2);

    // Custom Water Shader Material with ripples, depth, and edge foam
    const waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: this.timeUniform,
        uWaterColorDeep: { value: new THREE.Color(0x051a14) }, // Dark murky bog water
        uWaterColorShallow: { value: new THREE.Color(0x0e3629) }, // Eerie dark greenish teal
        uSunLightDir: { value: new THREE.Vector3(0.5, 0.7, 0.4).normalize() },
        uSunLightColor: { value: new THREE.Color(0xffd59e) }, // Warm rare sunlight
        uNormalMap: { value: textures.waterNormalMap },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uWaterColorDeep;
        uniform vec3 uWaterColorShallow;
        uniform vec3 uSunLightDir;
        uniform vec3 uSunLightColor;
        uniform sampler2D uNormalMap;

        varying vec3 vWorldPosition;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Animated dual normal ripple sampling
          vec2 uv1 = vWorldPosition.xz * 0.04 + vec2(uTime * 0.02, uTime * 0.015);
          vec2 uv2 = vWorldPosition.xz * 0.035 - vec2(uTime * 0.018, uTime * 0.022);

          vec3 n1 = texture2D(uNormalMap, uv1).rgb * 2.0 - 1.0;
          vec3 n2 = texture2D(uNormalMap, uv2).rgb * 2.0 - 1.0;
          vec3 rippleNormal = normalize(vec3(n1.xy + n2.xy, 1.4));

          // Camera view direction
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Fresnel reflection
          float fresnel = pow(1.0 - max(0.0, dot(viewDir, rippleNormal)), 4.0);
          fresnel = clamp(fresnel, 0.15, 0.85);

          // Specular sun glint
          vec3 halfVector = normalize(uSunLightDir + viewDir);
          float spec = pow(max(0.0, dot(rippleNormal, halfVector)), 64.0);
          vec3 specular = uSunLightColor * spec * 0.8;

          // Water body base gradient
          vec3 baseWater = mix(uWaterColorDeep, uWaterColorShallow, 0.35 + 0.1 * sin(vWorldPosition.x * 0.02));

          // Sky / ambient reflection tint
          vec3 skyReflect = vec3(0.12, 0.16, 0.22);
          vec3 finalColor = mix(baseWater, skyReflect, fresnel * 0.6) + specular;

          gl_FragColor = vec4(finalColor, 0.82);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    this.waterMesh = new THREE.Mesh(waterGeom, waterMat);
    this.waterMesh.position.y = this.waterLevel;
    this.group.add(this.waterMesh);

    // 2. Add floating water lilies and reeds
    this.buildWaterReedsAndPads();

    // 3. Add eerie rolling swamp mist right above the water surface
    this.buildWaterMist(terrainSize);
  }

  private buildWaterReedsAndPads(): void {
    // Clustered near riverbanks and swamp zones
    const reedGeom = new THREE.CylinderGeometry(0.04, 0.08, 2.2, 4);
    reedGeom.translate(0, 1.1, 0);
    const reedMat = new THREE.MeshStandardMaterial({
      color: 0x1f2e1a,
      roughness: 0.9,
    });

    const padGeom = new THREE.CircleGeometry(0.65, 7);
    padGeom.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x1b3b22,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });

    const reedCount = 450;
    const reedMesh = new THREE.InstancedMesh(reedGeom, reedMat, reedCount);
    const dummy = new THREE.Object3D();

    let reedIdx = 0;
    // Distribute along river and lake coordinates
    for (let i = 0; i < reedCount; i++) {
      // Place around the river curve or swamp lake (-80, -20)
      const isLake = Math.random() > 0.4;
      let x = 0;
      let z = 0;

      if (isLake) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 65 + 10;
        x = -80 + Math.cos(angle) * rad;
        z = -20 + Math.sin(angle) * rad;
      } else {
        z = (Math.random() - 0.5) * 600;
        const riverCurve = Math.sin(z * 0.008) * 110;
        x = riverCurve + (Math.random() - 0.5) * 45;
      }

      dummy.position.set(x, this.waterLevel - 0.4, z);
      dummy.scale.set(1 + Math.random() * 0.5, 0.8 + Math.random() * 0.8, 1 + Math.random() * 0.5);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.2,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.2
      );
      dummy.updateMatrix();
      reedMesh.setMatrixAt(reedIdx++, dummy.matrix);
    }
    reedMesh.instanceMatrix.needsUpdate = true;
    this.group.add(reedMesh);

    // Lily pads in the quiet swamp lake
    const padCount = 120;
    const padMesh = new THREE.InstancedMesh(padGeom, padMat, padCount);
    let padIdx = 0;
    for (let i = 0; i < padCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 55 + 5;
      const x = -80 + Math.cos(angle) * rad;
      const z = -20 + Math.sin(angle) * rad;

      dummy.position.set(x, this.waterLevel + 0.03, z);
      const sc = Math.random() * 0.6 + 0.7;
      dummy.scale.set(sc, 1, sc);
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
      dummy.updateMatrix();
      padMesh.setMatrixAt(padIdx++, dummy.matrix);
    }
    padMesh.instanceMatrix.needsUpdate = true;
    this.group.add(padMesh);
  }

  private buildWaterMist(terrainSize: number): void {
    // Soft low-lying mist billboards hovering over the water level
    const mistCount = 60;
    const mistGeom = new THREE.PlaneGeometry(35, 12);
    const mistCanvas = document.createElement('canvas');
    mistCanvas.width = 128;
    mistCanvas.height = 64;
    const mCtx = mistCanvas.getContext('2d')!;
    const grad = mCtx.createRadialGradient(64, 32, 4, 64, 32, 60);
    grad.addColorStop(0, 'rgba(180, 205, 215, 0.25)');
    grad.addColorStop(0.6, 'rgba(150, 180, 195, 0.1)');
    grad.addColorStop(1, 'rgba(100, 140, 160, 0)');
    mCtx.fillStyle = grad;
    mCtx.fillRect(0, 0, 128, 64);

    const mistTex = new THREE.CanvasTexture(mistCanvas);
    const mistMat = new THREE.MeshBasicMaterial({
      map: mistTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < mistCount; i++) {
      const mistPlane = new THREE.Mesh(mistGeom, mistMat);
      // Position over river or lake
      const z = (Math.random() - 0.5) * (terrainSize * 0.7);
      const riverCurve = Math.sin(z * 0.008) * 110;
      const x = riverCurve + (Math.random() - 0.5) * 50;

      mistPlane.position.set(x, this.waterLevel + Math.random() * 1.8 + 0.6, z);
      mistPlane.rotation.y = Math.random() * Math.PI * 2;
      this.mistGroup.add(mistPlane);
    }
    this.group.add(this.mistGroup);
  }

  public update(delta: number): void {
    this.timeUniform.value += delta;

    // Gently drift the mist planes
    for (const mist of this.mistGroup.children) {
      mist.position.x += Math.sin(this.timeUniform.value * 0.2 + mist.position.z) * 0.02;
    }
  }

  public isWaterAt(_x: number, y: number, _z: number): boolean {
    return y < this.waterLevel;
  }

  public getWaterDepth(y: number): number {
    return Math.max(0, this.waterLevel - y);
  }
}
