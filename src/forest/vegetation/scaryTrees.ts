import * as THREE from 'three';
import { TerrainManager } from '../terrain/terrainGenerator';
import { createFoliageTextures } from './foliageTextures';

// High-fidelity Organic Forest Trees & Vegetation
// Built with realistic AAA branch cards & alpha cutouts (no stacked cones or cheap primitives!)

export class ScaryForestVegetation {
  public group: THREE.Group;
  public treeColliders: { center: THREE.Vector2; radius: number }[] = [];
  private foliageTextures: ReturnType<typeof createFoliageTextures>;

  constructor(terrain: TerrainManager, totalTrees: number = 1800) {
    this.group = new THREE.Group();
    this.foliageTextures = createFoliageTextures();
    this.buildRealisticForest(terrain, totalTrees);
  }

  // 1. Procedural Seamless Bark Texture (Realistic dark textured pine and oak bark)
  private createBarkTexture(isDarkPine: boolean): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base dark bark
    ctx.fillStyle = isDarkPine ? '#1c1510' : '#221b16';
    ctx.fillRect(0, 0, size, size);

    // Deep vertical bark grooves & crevices
    for (let x = 0; x < size; x += 4) {
      const shade = Math.floor(Math.random() * 25 + (isDarkPine ? 15 : 22));
      ctx.fillStyle = `rgb(${shade + 4}, ${shade}, ${shade - 6})`;
      ctx.fillRect(x, 0, 3, size);
    }

    // Rough fissure shadows
    for (let i = 0; i < 90; i++) {
      let x = Math.random() * size;
      ctx.strokeStyle = '#090605';
      ctx.lineWidth = Math.random() * 2.5 + 1.0;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      for (let y = 0; y < size; y += 15) {
        x += (Math.random() - 0.5) * 5;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Velvet moss clinging to the damp bark side
    for (let i = 0; i < 40; i++) {
      const cx = (Math.random() * 0.4) * size;
      const cy = Math.random() * size;
      const r = Math.random() * 25 + 6;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      grad.addColorStop(0, 'rgba(25, 48, 20, 0.7)');
      grad.addColorStop(1, 'rgba(15, 30, 12, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  }

  // -------------------------------------------------------------
  // 2. Realistic Blackwood Conifer (Organic trunk + branch cards)
  // -------------------------------------------------------------
  private buildRealisticPineModel(barkMat: THREE.Material, foliageMat: THREE.Material): THREE.Group {
    const treeGroup = new THREE.Group();

    // Natural curved trunk using an extruded spline
    const curvePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.15, 4.0, -0.1),
      new THREE.Vector3(-0.1, 9.0, 0.2),
      new THREE.Vector3(0.05, 14.0, 0.05),
      new THREE.Vector3(0, 18.0, 0),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const trunkGeom = new THREE.TubeGeometry(curve, 16, 0.65, 8, false);

    // Taper trunk towards the top and flare root buttresses at the base
    const pos = trunkGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const taper = Math.max(0.12, 1.0 - y / 19.0);
      const rootFlare = y < 1.2 ? 1.0 + (1.2 - y) * 0.75 : 1.0;
      pos.setX(i, pos.getX(i) * taper * rootFlare);
      pos.setZ(i, pos.getZ(i) * taper * rootFlare);
    }
    trunkGeom.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeom, barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    treeGroup.add(trunkMesh);

    // Realistic multi-tier branch cards radiating outward (NOT cones!)
    const cardGeom = new THREE.PlaneGeometry(3.6, 2.4);
    cardGeom.translate(0, 1.2, 0);

    const tiers = 9;
    for (let t = 0; t < tiers; t++) {
      const y = 4.0 + t * 1.45;
      const scale = (1.0 - (t / tiers) * 0.7) * 1.1;
      const branchesInTier = 5 + (t % 2);

      for (let b = 0; b < branchesInTier; b++) {
        const angle = (b / branchesInTier) * Math.PI * 2 + (t * 0.65);
        const cardMesh = new THREE.Mesh(cardGeom, foliageMat);

        cardMesh.position.set(Math.cos(angle) * (0.4 * scale), y, Math.sin(angle) * (0.4 * scale));
        cardMesh.scale.set(scale, scale, scale);

        // Angled downwards like real drooping pine boughs
        cardMesh.rotation.y = angle + Math.PI / 2;
        cardMesh.rotation.x = 0.55 + Math.random() * 0.15;
        cardMesh.rotation.z = (Math.random() - 0.5) * 0.2;

        cardMesh.castShadow = true;
        cardMesh.receiveShadow = true;
        treeGroup.add(cardMesh);

        // Cross-card to give 3D volume from any angle
        const crossCard = cardMesh.clone();
        crossCard.rotation.y += Math.PI / 3;
        treeGroup.add(crossCard);
      }
    }

    return treeGroup;
  }

  // -------------------------------------------------------------
  // 3. Realistic Gnarled Witch Oak (Sprawling crooked boughs)
  // -------------------------------------------------------------
  private buildRealisticOakModel(barkMat: THREE.Material, foliageMat: THREE.Material): THREE.Group {
    const treeGroup = new THREE.Group();

    // Curved twisted trunk
    const curvePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.5, 3.0, 0.4),
      new THREE.Vector3(-0.3, 6.5, -0.2),
      new THREE.Vector3(0.1, 9.5, 0.1),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const trunkGeom = new THREE.TubeGeometry(curve, 12, 0.85, 8, false);

    // Root buttresses
    const pos = trunkGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y < 1.5) {
        const flare = 1.0 + (1.5 - y) * 0.9;
        pos.setX(i, pos.getX(i) * flare);
        pos.setZ(i, pos.getZ(i) * flare);
      }
    }
    trunkGeom.computeVertexNormals();

    const trunkMesh = new THREE.Mesh(trunkGeom, barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    treeGroup.add(trunkMesh);

    // 4 Crooked Sprawling Primary Boughs
    const boughAngles = [0.3, 1.8, 3.4, 4.9];
    const leafCardGeom = new THREE.PlaneGeometry(3.2, 2.5);

    boughAngles.forEach((ang, idx) => {
      const boughCurve = [
        new THREE.Vector3(0, 6.5 + idx * 0.6, 0),
        new THREE.Vector3(Math.cos(ang) * 2.2, 7.5 + idx * 0.5, Math.sin(ang) * 2.2),
        new THREE.Vector3(Math.cos(ang) * 4.2, 8.8, Math.sin(ang) * 4.2),
      ];
      const bTube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(boughCurve), 8, 0.28, 6, false);
      const bMesh = new THREE.Mesh(bTube, barkMat);
      bMesh.castShadow = true;
      treeGroup.add(bMesh);

      // Clusters of leaf cards at branch ends
      for (let c = 0; c < 4; c++) {
        const leafMesh = new THREE.Mesh(leafCardGeom, foliageMat);
        leafMesh.position.set(
          Math.cos(ang) * 3.8 + (Math.random() - 0.5) * 1.5,
          8.6 + (Math.random() - 0.5) * 1.2,
          Math.sin(ang) * 3.8 + (Math.random() - 0.5) * 1.5
        );
        leafMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        leafMesh.scale.setScalar(Math.random() * 0.4 + 0.9);
        leafMesh.castShadow = true;
        leafMesh.receiveShadow = true;
        treeGroup.add(leafMesh);
      }
    });

    return treeGroup;
  }

  // -------------------------------------------------------------
  // 4. Ground Wild Fern Clusters (Cross-plane fronds)
  // -------------------------------------------------------------
  private buildFernClusterModel(fernMat: THREE.Material): THREE.Group {
    const fernGroup = new THREE.Group();
    const frondGeom = new THREE.PlaneGeometry(1.6, 2.8);
    frondGeom.translate(0, 1.4, 0);

    const frondCount = 6;
    for (let i = 0; i < frondCount; i++) {
      const ang = (i / frondCount) * Math.PI * 2;
      const frond = new THREE.Mesh(frondGeom, fernMat);
      frond.rotation.y = ang;
      frond.rotation.x = 0.45; // Arch out towards ground
      fernGroup.add(frond);
    }
    return fernGroup;
  }

  // -------------------------------------------------------------
  // 5. Wild Forest Grass Clumps
  // -------------------------------------------------------------
  private buildGrassClumpGeometry(): THREE.BufferGeometry {
    // 3 intersecting vertical cards (tri-cross)
    const cardGeom = new THREE.PlaneGeometry(1.4, 1.2);
    cardGeom.translate(0, 0.6, 0);

    const merged = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(cardGeom);
      m.rotation.y = (i * Math.PI) / 3;
      m.updateMatrix();
      merged.add(m);
    }

    // Merge cards into single geometry
    const geometries: THREE.BufferGeometry[] = [];
    merged.children.forEach((c) => {
      geometries.push((c as THREE.Mesh).geometry.clone().applyMatrix4(c.matrix));
    });

    return this.mergeSimpleGeometries(geometries);
  }

  private mergeSimpleGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    let totalPos = 0;
    let totalNorm = 0;
    let totalUv = 0;
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

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    if (totalNorm > 0) merged.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    if (totalUv > 0) merged.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    merged.computeVertexNormals();
    return merged;
  }

  // -------------------------------------------------------------
  // Populate the Map with Realistic Forest & Ground Cover
  // -------------------------------------------------------------
  private buildRealisticForest(terrain: TerrainManager, totalTrees: number): void {
    // Materials with alpha-cutout, translucency, and natural depth
    const pineBarkMat = new THREE.MeshStandardMaterial({
      map: this.createBarkTexture(true),
      roughness: 0.92,
      metalness: 0.05,
      color: 0x3d3028,
    });

    const oakBarkMat = new THREE.MeshStandardMaterial({
      map: this.createBarkTexture(false),
      roughness: 0.95,
      metalness: 0.05,
      color: 0x483a30,
    });

    const pineFoliageMat = new THREE.MeshStandardMaterial({
      map: this.foliageTextures.pineTexture,
      transparent: true,
      alphaTest: 0.45,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.05,
      color: 0x273b22, // Deep atmospheric evergreen
    });

    const oakFoliageMat = new THREE.MeshStandardMaterial({
      map: this.foliageTextures.oakTexture,
      transparent: true,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.05,
      color: 0x354a2a,
    });

    const fernMat = new THREE.MeshStandardMaterial({
      map: this.foliageTextures.fernTexture,
      transparent: true,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.75,
      color: 0x2e5229,
    });

    const grassMat = new THREE.MeshStandardMaterial({
      map: this.foliageTextures.grassTexture,
      transparent: true,
      alphaTest: 0.38,
      side: THREE.DoubleSide,
      roughness: 0.85,
      color: 0x3b582b,
    });

    // 1. Build Base Prototypes
    const pineProto = this.buildRealisticPineModel(pineBarkMat, pineFoliageMat);
    const oakProto = this.buildRealisticOakModel(oakBarkMat, oakFoliageMat);
    const fernProto = this.buildFernClusterModel(fernMat);

    // 2. Distribute Trees across Landscape
    const half = terrain.config.size * 0.46;
    const cityPos = terrain.config.cityPos;

    // Use chunked groups for smooth rendering
    const treeBatch = new THREE.Group();

    for (let i = 0; i < totalTrees; i++) {
      const x = (Math.random() - 0.5) * 2 * half;
      const z = (Math.random() - 0.5) * 2 * half;

      // Keep city clearance
      const distCity = Math.sqrt(Math.pow(x - cityPos.x, 2) + Math.pow(z - cityPos.z, 2));
      if (distCity < 90) continue;

      const groundY = terrain.getHeightAt(x, z);
      if (groundY < terrain.config.waterLevel + 0.4) continue;

      const normal = terrain.getNormalAt(x, z);
      if (normal.y < 0.68) continue; // Don't spawn on cliffs

      const isPine = Math.random() > 0.32;
      const tree = isPine ? pineProto.clone(true) : oakProto.clone(true);

      const scale = Math.random() * 0.5 + 0.8;
      tree.position.set(x, groundY - 0.2, z);
      tree.scale.set(scale, scale * (Math.random() * 0.3 + 0.9), scale);
      tree.rotation.y = Math.random() * Math.PI * 2;
      tree.rotation.x = (Math.random() - 0.5) * 0.08;
      tree.rotation.z = (Math.random() - 0.5) * 0.08;

      treeBatch.add(tree);
      this.treeColliders.push({ center: new THREE.Vector2(x, z), radius: 0.9 * scale });

      // Add a couple of fern clusters near base of trees
      if (Math.random() > 0.4) {
        const fern = fernProto.clone(true);
        fern.position.set(x + (Math.random() - 0.5) * 2.2, groundY, z + (Math.random() - 0.5) * 2.2);
        const fScale = Math.random() * 0.4 + 0.8;
        fern.scale.setScalar(fScale);
        fern.rotation.y = Math.random() * Math.PI * 2;
        treeBatch.add(fern);
      }
    }

    this.group.add(treeBatch);

    // 3. Dense Wild Forest Grass Carpet (3,500 instanced clumps)
    const grassGeom = this.buildGrassClumpGeometry();
    const grassCount = 3500;
    const grassMesh = new THREE.InstancedMesh(grassGeom, grassMat, grassCount);
    grassMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    let gIdx = 0;
    for (let i = 0; i < grassCount; i++) {
      const x = (Math.random() - 0.5) * 2 * (half * 0.85);
      const z = (Math.random() - 0.5) * 2 * (half * 0.85);
      const y = terrain.getHeightAt(x, z);

      if (y > terrain.config.waterLevel + 0.2) {
        dummy.position.set(x, y, z);
        const sc = Math.random() * 0.6 + 0.75;
        dummy.scale.set(sc, sc * (Math.random() * 0.4 + 0.8), sc);
        dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
        dummy.updateMatrix();
        grassMesh.setMatrixAt(gIdx++, dummy.matrix);
      }
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    this.group.add(grassMesh);
  }

  public checkCollision(x: number, z: number, playerRadius: number = 0.5): boolean {
    for (let i = 0; i < this.treeColliders.length; i++) {
      const col = this.treeColliders[i];
      const dx = x - col.center.x;
      const dz = z - col.center.y;
      const distSq = dx * dx + dz * dz;
      const minD = col.radius + playerRadius;
      if (distSq < minD * minD) {
        return true;
      }
    }
    return false;
  }
}
