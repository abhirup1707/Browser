import * as THREE from 'three';
import { SimplexNoise } from '../math/noise';
import { createProceduralTextures } from './terrainTextures';

export interface TerrainConfig {
  size: number;
  segments: number;
  seed: number;
  waterLevel: number;
  cityPos: THREE.Vector3;
}

export class TerrainManager {
  public mesh: THREE.Mesh;
  public config: TerrainConfig;
  private noise: SimplexNoise;
  private textures: ReturnType<typeof createProceduralTextures>;
  public heightGrid: Float32Array;
  public gridRes: number;

  constructor(config?: Partial<TerrainConfig>) {
    this.config = {
      size: 900, // 900m x 900m expansive forest world
      segments: 220, // 221x221 vertices = ~48,000 smooth organic vertices
      seed: config?.seed ?? 1337,
      waterLevel: 2.2, // Water surface level
      cityPos: new THREE.Vector3(340, 48, -340), // Far North-East goal
      ...config,
    };

    this.gridRes = this.config.segments + 1;
    this.heightGrid = new Float32Array(this.gridRes * this.gridRes);
    this.noise = new SimplexNoise(this.config.seed);
    this.textures = createProceduralTextures();

    this.mesh = this.buildTerrainMesh();
  }

  // Calculate height value at any world coordinates (x, z)
  public calculateRawHeight(x: number, z: number): number {
    // Distance to city (North-East: +x, -z)
    const dxCity = x - this.config.cityPos.x;
    const dzCity = z - this.config.cityPos.z;
    const distToCity = Math.sqrt(dxCity * dxCity + dzCity * dzCity);

    // Large-scale continental terrain shapes
    const continent = this.noise.fbm2D(x * 0.0012, z * 0.0012, 4, 2.1, 0.48);
    
    // Mountain ridges flanking the valley
    const ridgeNoise = this.noise.ridgeNoise2D(x * 0.003 + 12.3, z * 0.003 - 4.1, 4, 2.0, 0.5);

    // Deep winding river valley (sinuous curve cutting from North to South)
    const riverCurve = Math.sin(z * 0.008 + this.noise.fbm2D(z * 0.004, 0, 2) * 3.5) * 110;
    const distToRiver = Math.abs(x - riverCurve);
    // River carving profile
    let riverCarve = 0;
    if (distToRiver < 55) {
      const riverT = distToRiver / 55;
      riverCarve = (1.0 - Math.cos(riverT * Math.PI)) * 0.5; // 0 at center, 1 at edge
      riverCarve = (1.0 - riverCarve) * 9.5; // cut down up to 9.5m
    }

    // High mountains along borders to keep the player inside the mysterious forest
    const half = this.config.size * 0.48;
    const distToBorder = Math.max(
      0,
      Math.max(Math.abs(x) - half * 0.72, Math.abs(z) - half * 0.72)
    );
    const borderCliffs = Math.pow(distToBorder / 80, 2.0) * 45;

    // Forest floor rolling mounds, gullies and micro-relief
    const forestHills = this.noise.fbm2D(x * 0.007, z * 0.007, 4, 2.0, 0.45) * 8.5;
    const microRelief = this.noise.noise2D(x * 0.025, z * 0.025) * 1.6;

    // Mountain pass near the city plateau
    let cityPlateau = 0;
    if (distToCity < 140) {
      const cityT = Math.max(0, 1.0 - distToCity / 140);
      cityPlateau = cityT * cityT * 26.0;
    }

    // Total combined height
    let h = 10.0 + continent * 22.0 + ridgeNoise * 14.0 + forestHills + microRelief + borderCliffs + cityPlateau - riverCarve;

    // Create a natural sunken swamp/lake basin around x: -80, z: -20
    const dxLake = x - (-80);
    const dzLake = z - (-20);
    const distLake = Math.sqrt(dxLake * dxLake + dzLake * dzLake);
    if (distLake < 75) {
      const lakeT = 1.0 - distLake / 75;
      h -= lakeT * lakeT * 8.0;
    }

    return h;
  }

  private buildTerrainMesh(): THREE.Mesh {
    const geom = new THREE.PlaneGeometry(
      this.config.size,
      this.config.size,
      this.config.segments,
      this.config.segments
    );
    // Rotate to horizontal plane XZ
    geom.rotateX(-Math.PI / 2);

    const posAttr = geom.attributes.position;
    const half = this.config.size / 2;
    const seg = this.config.segments;
    const step = this.config.size / seg;

    const colors = new Float32Array(posAttr.count * 3);

    // Populate heights
    let idx = 0;
    for (let j = 0; j <= seg; j++) {
      for (let i = 0; i <= seg; i++) {
        const x = -half + i * step;
        const z = -half + j * step;
        const y = this.calculateRawHeight(x, z);

        posAttr.setY(idx, y);
        this.heightGrid[j * this.gridRes + i] = y;
        idx++;
      }
    }

    geom.computeVertexNormals();

    // Populate vertex colors based on height and slope
    const normAttr = geom.attributes.normal;
    for (let k = 0; k < posAttr.count; k++) {
      const y = posAttr.getY(k);
      const ny = normAttr.getY(k); // Y normal component: 1.0 = flat ground, 0.0 = sheer cliff

      // Base: dark forest earth / moss
      let r = 0.12;
      let g = 0.16;
      let b = 0.11;

      // Steep rock cliffs (ny < 0.78)
      if (ny < 0.78) {
        const rockFactor = Math.min(1.0, (0.78 - ny) / 0.35);
        r = THREE.MathUtils.lerp(r, 0.22, rockFactor);
        g = THREE.MathUtils.lerp(g, 0.21, rockFactor);
        b = THREE.MathUtils.lerp(b, 0.23, rockFactor);
      } else {
        // Rich mossy forest floor variations
        const mossiness = Math.sin(posAttr.getX(k) * 0.1) * Math.cos(posAttr.getZ(k) * 0.1);
        if (mossiness > 0.2) {
          g += 0.05;
          r += 0.01;
        }
      }

      // Shoreline damp mud / pebbles near water level
      if (y < this.config.waterLevel + 1.2) {
        const wetFactor = Math.max(0, 1.0 - (y - this.config.waterLevel) / 1.2);
        r = THREE.MathUtils.lerp(r, 0.08, wetFactor);
        g = THREE.MathUtils.lerp(g, 0.07, wetFactor);
        b = THREE.MathUtils.lerp(b, 0.06, wetFactor);
      }

      colors[k * 3] = r;
      colors[k * 3 + 1] = g;
      colors[k * 3 + 2] = b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader-enhanced Standard Material
    const material = new THREE.MeshStandardMaterial({
      map: this.textures.forestGroundMap,
      normalMap: this.textures.forestGroundNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.85,
      metalness: 0.05,
      vertexColors: true,
      flatShading: false,
    });

    // Custom shader hook to blend rock cliff texture onto steep slopes
    material.onBeforeCompile = (shader) => {
      shader.uniforms.rockMap = { value: this.textures.rockCliffMap };
      shader.uniforms.rockNormal = { value: this.textures.rockCliffNormal };

      shader.vertexShader = `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        ${shader.vertexShader}
      `.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        `
      );

      shader.fragmentShader = `
        uniform sampler2D rockMap;
        uniform sampler2D rockNormal;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        ${shader.fragmentShader}
      `.replace(
        '#include <map_fragment>',
        `
        vec4 texGround = texture2D(map, vUv * 35.0);
        vec4 texRock = texture2D(rockMap, vWorldPosition.xz * 0.06);

        // Slope factor: 1.0 = vertical cliff, 0.0 = flat ground
        float slope = 1.0 - vWorldNormal.y;
        float rockBlend = smoothstep(0.25, 0.55, slope);

        // Subtly tint by vertex color
        vec4 baseColor = mix(texGround, texRock, rockBlend);
        diffuseColor = baseColor * vec4(vColor, 1.0) * 1.7;
        `
      );
    };

    const mesh = new THREE.Mesh(geom, material);
    mesh.receiveShadow = true;
    mesh.castShadow = false;

    return mesh;
  }

  // Fast bicubic/bilinear height sampling at any point in the world
  public getHeightAt(x: number, z: number): number {
    const half = this.config.size / 2;
    const seg = this.config.segments;
    const step = this.config.size / seg;

    const u = (x + half) / step;
    const v = (z + half) / step;

    if (u < 0 || u >= seg || v < 0 || v >= seg) {
      return this.calculateRawHeight(x, z);
    }

    const i0 = Math.floor(u);
    const j0 = Math.floor(v);
    const i1 = Math.min(seg, i0 + 1);
    const j1 = Math.min(seg, j0 + 1);

    const fx = u - i0;
    const fz = v - j0;

    const h00 = this.heightGrid[j0 * this.gridRes + i0];
    const h10 = this.heightGrid[j0 * this.gridRes + i1];
    const h01 = this.heightGrid[j1 * this.gridRes + i0];
    const h11 = this.heightGrid[j1 * this.gridRes + i1];

    // Bilinear interpolation
    const hTop = h00 * (1 - fx) + h10 * fx;
    const hBot = h01 * (1 - fx) + h11 * fx;

    return hTop * (1 - fz) + hBot * fz;
  }

  // Calculate terrain normal for physics slope / walking
  public getNormalAt(x: number, z: number): THREE.Vector3 {
    const eps = 0.5;
    const hL = this.getHeightAt(x - eps, z);
    const hR = this.getHeightAt(x + eps, z);
    const hD = this.getHeightAt(x, z - eps);
    const hU = this.getHeightAt(x, z + eps);

    const normal = new THREE.Vector3(hL - hR, 2 * eps, hD - hU);
    normal.normalize();
    return normal;
  }

  public reseed(newSeed: number): void {
    this.config.seed = newSeed;
    this.noise.reseed(newSeed);
    
    // Recompute heights
    const geom = this.mesh.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position;
    const half = this.config.size / 2;
    const seg = this.config.segments;
    const step = this.config.size / seg;

    let idx = 0;
    for (let j = 0; j <= seg; j++) {
      for (let i = 0; i <= seg; i++) {
        const x = -half + i * step;
        const z = -half + j * step;
        const y = this.calculateRawHeight(x, z);

        posAttr.setY(idx, y);
        this.heightGrid[j * this.gridRes + i] = y;
        idx++;
      }
    }

    posAttr.needsUpdate = true;
    geom.computeVertexNormals();
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}
