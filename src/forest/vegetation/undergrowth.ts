import * as THREE from 'three';
import { TerrainManager } from '../terrain/terrainGenerator';
import { createFoliageTextures } from './foliageTextures';

// High-fidelity Forest Undergrowth
// Replaces primitive geometric shapes with alpha-masked foliage cards and smoothed organic rocks

export class ForestUndergrowth {
  public group: THREE.Group;
  public boulderColliders: { center: THREE.Vector2; radius: number }[] = [];

  constructor(terrain: TerrainManager, bushCount: number = 800, boulderCount: number = 260) {
    this.group = new THREE.Group();
    const foliage = createFoliageTextures();
    this.buildRealisticUndergrowth(terrain, foliage, bushCount, boulderCount);
  }

  // 1. Realistic Glacial Boulder Geometry (Sculpted with organic noise & moss top)
  private buildOrganicBoulderGeometry(): THREE.BufferGeometry {
    const geom = new THREE.SphereGeometry(1.6, 12, 10);
    const pos = geom.attributes.position;

    // Sculpt natural organic asymmetry and rock fractures
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Noise displacement
      const noise =
        Math.sin(x * 2.8) * Math.cos(z * 2.5) * 0.35 +
        Math.sin(y * 4.0) * 0.18;

      const flatBottom = y < -0.3 ? 0.65 : 1.0;
      pos.setXYZ(i, (x + noise * 0.4) * 1.3, (y + noise * 0.3) * 0.85 * flatBottom, (z + noise * 0.4) * 1.1);
    }
    geom.computeVertexNormals();

    // Vertex colors: Dark granite on sides/bottom, rich green moss on upward-facing top
    const colors = new Float32Array(pos.count * 3);
    const norm = geom.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
      const ny = norm.getY(i); // Upward normal
      if (ny > 0.45) {
        // Mossy top
        colors[i * 3] = 0.16;
        colors[i * 3 + 1] = 0.28;
        colors[i * 3 + 2] = 0.14;
      } else {
        // Dark wet granite
        const shade = 0.18 + Math.random() * 0.05;
        colors[i * 3] = shade;
        colors[i * 3 + 1] = shade + 0.02;
        colors[i * 3 + 2] = shade + 0.04;
      }
    }
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }

  // 2. Realistic Bramble Bush Geometry (Tri-card cross arrangement with alpha leaf cutout)
  private buildBrambleGeometry(): THREE.BufferGeometry {
    const cardGeom = new THREE.PlaneGeometry(2.2, 1.8);
    cardGeom.translate(0, 0.9, 0);

    const merged = new THREE.Group();
    // 4 intersecting cards in a dome pattern
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(cardGeom);
      m.rotation.y = (i * Math.PI) / 4;
      m.rotation.x = (Math.random() - 0.5) * 0.2;
      m.updateMatrix();
      merged.add(m);
    }

    const geometries: THREE.BufferGeometry[] = [];
    merged.children.forEach((c) => {
      geometries.push((c as THREE.Mesh).geometry.clone().applyMatrix4(c.matrix));
    });

    let totalPos = 0, totalNorm = 0, totalUv = 0;
    geometries.forEach((g) => {
      totalPos += g.attributes.position.array.length;
      if (g.attributes.normal) totalNorm += g.attributes.normal.array.length;
      if (g.attributes.uv) totalUv += g.attributes.uv.array.length;
    });

    const pos = new Float32Array(totalPos);
    const norm = new Float32Array(totalNorm);
    const uv = new Float32Array(totalUv);

    let pOff = 0, nOff = 0, uOff = 0;
    geometries.forEach((g) => {
      pos.set(g.attributes.position.array, pOff);
      pOff += g.attributes.position.array.length;
      if (g.attributes.normal) {
        norm.set(g.attributes.normal.array, nOff);
        nOff += g.attributes.normal.array.length;
      }
      if (g.attributes.uv) {
        uv.set(g.attributes.uv.array, uOff);
        uOff += g.attributes.uv.array.length;
      }
    });

    const outGeom = new THREE.BufferGeometry();
    outGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    if (totalNorm > 0) outGeom.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    if (totalUv > 0) outGeom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    outGeom.computeVertexNormals();
    return outGeom;
  }

  // 3. Bioluminescent Foxfire Mushrooms (Organic umbrella clusters)
  private buildFoxfireMushroomModel(): THREE.Group {
    const group = new THREE.Group();

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x3d3835,
      roughness: 0.8,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.35,
    });

    // 4 curved mushroom stems with umbrella caps
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const stemCurve = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(ang) * 0.15, 0.25, Math.sin(ang) * 0.15),
        new THREE.Vector3(Math.cos(ang) * 0.25, 0.55, Math.sin(ang) * 0.25),
      ];
      const stemGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stemCurve), 5, 0.035, 5, false);
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      group.add(stemMesh);

      // Umbrella cap
      const capGeom = new THREE.SphereGeometry(0.18, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const capMesh = new THREE.Mesh(capGeom, capMat);
      capMesh.position.copy(stemCurve[2]);
      capMesh.scale.set(1.1, 0.55, 1.1);
      group.add(capMesh);
    }

    return group;
  }

  private buildRealisticUndergrowth(
    terrain: TerrainManager,
    foliage: ReturnType<typeof createFoliageTextures>,
    bushCount: number,
    boulderCount: number
  ): void {
    const boulderGeom = this.buildOrganicBoulderGeometry();
    const boulderMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.08,
    });

    const brambleGeom = this.buildBrambleGeometry();
    const brambleMat = new THREE.MeshStandardMaterial({
      map: foliage.oakTexture,
      transparent: true,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      roughness: 0.85,
      color: 0x2d3f23, // Deep dark bramble green
    });

    const boulderMesh = new THREE.InstancedMesh(boulderGeom, boulderMat, boulderCount);
    const brambleMesh = new THREE.InstancedMesh(brambleGeom, brambleMat, bushCount);

    boulderMesh.castShadow = true;
    boulderMesh.receiveShadow = true;
    brambleMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const half = terrain.config.size * 0.45;

    // Distribute Boulders
    let rIdx = 0;
    for (let i = 0; i < boulderCount; i++) {
      const x = (Math.random() - 0.5) * 2 * half;
      const z = (Math.random() - 0.5) * 2 * half;
      const y = terrain.getHeightAt(x, z);

      dummy.position.set(x, y + 0.25, z);
      const sc = Math.random() * 0.8 + 0.9;
      dummy.scale.set(sc * (Math.random() * 0.4 + 0.8), sc * (Math.random() * 0.3 + 0.7), sc);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.2,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.2
      );
      dummy.updateMatrix();
      boulderMesh.setMatrixAt(rIdx++, dummy.matrix);
      this.boulderColliders.push({ center: new THREE.Vector2(x, z), radius: 1.3 * sc });
    }
    boulderMesh.instanceMatrix.needsUpdate = true;
    this.group.add(boulderMesh);

    // Distribute Bramble Bushes
    let bIdx = 0;
    for (let i = 0; i < bushCount; i++) {
      const x = (Math.random() - 0.5) * 2 * half;
      const z = (Math.random() - 0.5) * 2 * half;
      const y = terrain.getHeightAt(x, z);

      if (y > terrain.config.waterLevel + 0.4) {
        dummy.position.set(x, y - 0.1, z);
        const sc = Math.random() * 0.6 + 0.8;
        dummy.scale.set(sc, sc * (Math.random() * 0.3 + 0.8), sc);
        dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
        dummy.updateMatrix();
        brambleMesh.setMatrixAt(bIdx++, dummy.matrix);
      }
    }
    brambleMesh.instanceMatrix.needsUpdate = true;
    this.group.add(brambleMesh);

    // Bioluminescent Mushrooms in dark hollows
    const shroomProto = this.buildFoxfireMushroomModel();
    const shroomBatch = new THREE.Group();
    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 2 * (half * 0.8);
      const z = (Math.random() - 0.5) * 2 * (half * 0.8);
      const y = terrain.getHeightAt(x, z);
      if (y > terrain.config.waterLevel + 0.5) {
        const shroom = shroomProto.clone(true);
        shroom.position.set(x, y, z);
        shroom.scale.setScalar(Math.random() * 0.5 + 0.8);
        shroom.rotation.y = Math.random() * Math.PI * 2;
        shroomBatch.add(shroom);
      }
    }
    this.group.add(shroomBatch);
  }
}
