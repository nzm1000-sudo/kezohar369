/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — מודל תלת־מימד של המתחם · Royal Majesty V4
   צבעוניות סגולה מלכותית · מבנים סימטריים · לב תלת־מימדי נקי
   ═══════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(() => {
  const canvas = document.getElementById('complex3DCanvas');
  const stage = document.querySelector('.complex3d-stage');
  const loader = document.getElementById('complex3DLoader');
  if (!canvas || !stage) return;

  /* ───────────── Royal Purple V4 Palette ───────────── */
  const PALETTE = {
    gold:       0xC89B5C,
    goldLight:  0xE9C47C,
    goldDeep:   0x8E6D31,
    purpleBg:   0x1A1030,
    purpleMid:  0x251845,
    purpleSurf: 0x2D1F50,
    stone:      0xD5C8E0,
    ivory:      0xE8DEF0,
    navy:       0x1a1040,
    skyBlue:    0x5a4080,
    bronze:     0x6B5080,
    umber:      0x4A3060,
    ground:     0x1E1440
  };

  /* ───────────── Scene / Camera / Renderer ───────────── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0a1a);
  scene.fog = new THREE.Fog(0x1A1030, 60, 200);

  const camera = new THREE.PerspectiveCamera(
    42, stage.clientWidth / stage.clientHeight, 0.1, 500
  );
  camera.position.set(55, 42, 65);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ───────────── Controls ───────────── */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 25;
  controls.maxDistance = 130;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.target.set(0, 4, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.8;

  const DEFAULT_CAMERA = camera.position.clone();

  /* ───────────── Royal Purple Lighting ───────────── */
  const hemi = new THREE.HemisphereLight(0x6A4FA0, 0x1A1030, 0.7);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xFFEBC4, 1.6);
  sun.position.set(60, 80, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.camera.far = 220;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const purpleAmbient = new THREE.PointLight(0x7B5EA7, 0.6, 120, 2);
  purpleAmbient.position.set(0, 30, 0);
  scene.add(purpleAmbient);

  const goldGlow = new THREE.PointLight(0xE6B673, 1.2, 90, 2);
  goldGlow.position.set(0, 22, 10);
  scene.add(goldGlow);

  /* ───────────── Materials ───────────── */
  const mat = {
    stone:  new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.6, metalness: 0.04 }),
    ivory:  new THREE.MeshStandardMaterial({ color: PALETTE.ivory, roughness: 0.55, metalness: 0.04 }),
    gold:   new THREE.MeshStandardMaterial({ color: PALETTE.gold, roughness: 0.22, metalness: 0.92 }),
    navy:   new THREE.MeshStandardMaterial({ color: PALETTE.navy, roughness: 0.4, metalness: 0.3 }),
    sky:    new THREE.MeshStandardMaterial({ color: PALETTE.skyBlue, roughness: 0.45, metalness: 0.15 }),
    bronze: new THREE.MeshStandardMaterial({ color: PALETTE.bronze, roughness: 0.35, metalness: 0.6 }),
    umber:  new THREE.MeshStandardMaterial({ color: PALETTE.umber, roughness: 0.5, metalness: 0.1 }),
    glass:  new THREE.MeshPhysicalMaterial({ color: 0xD5C8E0, roughness: 0.1, metalness: 0, transmission: 0.55, transparent: true, opacity: 0.5 }),
    heartRuby: new THREE.MeshStandardMaterial({ color: 0xC04060, roughness: 0.3, metalness: 0.3, emissive: 0x400820, emissiveIntensity: 0.4 })
  };

  const shadowed = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

  /* ───────────── Courtyard ground (royal purple) ───────────── */
  const ground = shadowed(new THREE.Mesh(
    new THREE.CircleGeometry(52, 64),
    new THREE.MeshStandardMaterial({ color: PALETTE.ground, roughness: 0.85 })
  ));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const ringPath = shadowed(new THREE.Mesh(
    new THREE.RingGeometry(20, 21.2, 64),
    mat.gold
  ));
  ringPath.rotation.x = -Math.PI / 2;
  ringPath.position.y = 0.02;
  scene.add(ringPath);

  /* Central fountain */
  const fountain = new THREE.Group();
  const fBase = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 1.2, 24), mat.stone));
  fBase.position.y = 0.6;
  const fRim = shadowed(new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.2, 12, 32), mat.gold));
  fRim.rotation.x = Math.PI / 2;
  fRim.position.y = 1.2;
  const fPillar = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 3.2, 16), mat.stone));
  fPillar.position.y = 2.8;
  const fFinial = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), mat.gold));
  fFinial.position.y = 4.6;
  fountain.add(fBase, fRim, fPillar, fFinial);
  scene.add(fountain);

  /* Simple trees around courtyard */
  function makeTree(x, z) {
    const t = new THREE.Group();
    const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8), mat.umber));
    trunk.position.y = 1.1;
    const leaves = shadowed(new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshStandardMaterial({ color: 0x4A5A3E, roughness: 0.8 })));
    leaves.position.y = 3;
    t.add(trunk, leaves);
    t.position.set(x, 0, z);
    return t;
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    scene.add(makeTree(Math.cos(a) * 46, Math.sin(a) * 46));
  }

  /* ───────────── Building factory helpers ───────────── */
  function colonnade(count, spanX, z, height, material) {
    const g = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const x = -spanX / 2 + (spanX / (count - 1)) * i;
      const col = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, height, 16), material));
      col.position.set(x, height / 2, z);
      const cap = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), mat.gold));
      cap.position.set(x, height + 0.15, z);
      g.add(col, cap);
    }
    return g;
  }

  /* ───────────── 3D Heart shape (clean, no cross) ───────────── */
  function createHeartGeo(scale = 1) {
    const heartShape = new THREE.Shape();
    const s = scale;
    heartShape.moveTo(0, 2 * s);
    heartShape.bezierCurveTo(0, 2.8 * s, -2.5 * s, 4 * s, -4 * s, 1.5 * s);
    heartShape.bezierCurveTo(-6 * s, -2 * s, -2 * s, -5 * s, 0, -4 * s);
    heartShape.bezierCurveTo(2 * s, -5 * s, 6 * s, -2 * s, 4 * s, 1.5 * s);
    heartShape.bezierCurveTo(2.5 * s, 4 * s, 0, 2.8 * s, 0, 2 * s);
    const extrudeSettings = { depth: 1.2 * s, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15 };
    return new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  }

  /* ───────────── Building 1: Prayer Hall (היכל תפילה) — CENTER ───────────── */
  function buildPrayerHall() {
    const group = new THREE.Group();
    group.userData.building = 'prayer';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(20, 11, 16), mat.ivory));
    base.position.y = 5.5;
    group.add(base);

    const drum = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.5, 3, 32), mat.stone));
    drum.position.y = 12.5;
    group.add(drum);

    const dome = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(7.5, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      mat.gold
    ));
    dome.position.y = 14;
    group.add(dome);

    const ribCount = 12;
    for (let i = 0; i < ribCount; i++) {
      const a = (i / ribCount) * Math.PI * 2;
      const rib = shadowed(new THREE.Mesh(new THREE.TorusGeometry(7.5, 0.08, 8, 32, Math.PI), mat.gold));
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = a;
      rib.position.y = 14;
      group.add(rib);
    }

    const spire = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.4, 12), mat.gold));
    spire.position.y = 14 + 7.5 + 1.7;
    group.add(spire);

    group.add(colonnade(5, 15, 8.3, 8, mat.stone));

    const doorFrame = shadowed(new THREE.Mesh(new THREE.BoxGeometry(4, 6, 0.6), mat.gold));
    doorFrame.position.set(0, 3, 8.5);
    group.add(doorFrame);
    const door = shadowed(new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.2, 0.3), mat.navy));
    door.position.set(0, 2.9, 8.7);
    group.add(door);

    group.position.set(0, 0, 0);  /* CENTER */
    return group;
  }

  /* ───────────── Building 2: Beit Midrash (בית מדרש) ───────────── */
  function buildMidrash() {
    const group = new THREE.Group();
    group.userData.building = 'midrash';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(17, 9, 13), mat.ivory));
    base.position.y = 4.5;
    group.add(base);

    const roof = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0, 9.5, 4, 4), mat.navy));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 11;
    group.add(roof);

    const trim = shadowed(new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.15, 8, 4), mat.gold));
    trim.rotation.x = Math.PI / 2;
    trim.rotation.z = Math.PI / 4;
    trim.position.y = 9.05;
    group.add(trim);

    for (let i = -1; i <= 1; i++) {
      const win = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.2), mat.glass));
      win.position.set(i * 4.5, 5.2, 6.55);
      group.add(win);
      const frame = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2, 3, 0.35), mat.gold));
      frame.position.set(i * 4.5, 5.2, 6.5);
      group.add(frame);
    }

    group.position.set(-22, 0, -22);  /* SYMMETRIC: back-left */
    group.rotation.y = Math.PI / 4;
    return group;
  }

  /* ───────────── Building 3: Mikveh (מקוואות) ───────────── */
  function buildMikveh() {
    const group = new THREE.Group();
    group.userData.building = 'mikveh';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(11, 6.5, 11), mat.ivory));
    base.position.y = 3.25;
    group.add(base);

    const domeDrum = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 1.5, 24), mat.sky));
    domeDrum.position.y = 7;
    group.add(domeDrum);

    const dome = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1),
      mat.sky
    ));
    dome.position.y = 7.7;
    group.add(dome);

    const ring = shadowed(new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.12, 8, 24), mat.gold));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 7;
    group.add(ring);

    group.position.set(22, 0, -22);  /* SYMMETRIC: back-right */
    group.rotation.y = -Math.PI / 4;
    return group;
  }

  /* ───────────── Building 4: Community Hall (אולם קהילה) ───────────── */
  function buildCommunityHall() {
    const group = new THREE.Group();
    group.userData.building = 'community';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 12), mat.ivory));
    base.position.y = 3.75;
    group.add(base);

    const roof = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 9.5, 3.2, 4), mat.bronze));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 9.1;
    group.add(roof);

    group.add(colonnade(4, 12, 6.3, 6.8, mat.stone));

    group.position.set(22, 0, 22);  /* SYMMETRIC: front-right */
    group.rotation.y = -3 * Math.PI / 4;
    return group;
  }

  /* ───────────── Building 5: Chesed Center (מרכז חסד) — with 3D heart ───────────── */
  function buildChesedCenter() {
    const group = new THREE.Group();
    group.userData.building = 'chesed';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 9), mat.ivory));
    base.position.y = 2.75;
    group.add(base);

    const roof = shadowed(new THREE.Mesh(new THREE.ConeGeometry(7.2, 3, 4), mat.bronze));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 7;
    group.add(roof);

    /* ── Clean 3D Heart emblem (no cross, no plus) ── */
    const heartGeo = createHeartGeo(1.3);
    const heartMesh = shadowed(new THREE.Mesh(heartGeo, mat.heartRuby));
    heartMesh.position.set(0, 3.2, 4.6);
    heartMesh.rotation.y = Math.PI;
    group.add(heartMesh);

    /* Gold ring around heart */
    const emblemRing = shadowed(new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.12, 10, 24), mat.gold));
    emblemRing.position.set(0, 3.2, 4.55);
    group.add(emblemRing);

    group.position.set(-22, 0, 22);  /* SYMMETRIC: front-left */
    group.rotation.y = 3 * Math.PI / 4;
    return group;
  }

  const buildings = [
    buildPrayerHall(),
    buildMidrash(),
    buildMikveh(),
    buildCommunityHall(),
    buildChesedCenter()
  ];
  buildings.forEach(b => scene.add(b));

  /* Low garden wall connecting the complex, gold capped */
  const wallSegments = 48;
  for (let i = 0; i < wallSegments; i++) {
    const a = (i / wallSegments) * Math.PI * 2;
    const seg = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 0.4), mat.stone));
    seg.position.set(Math.cos(a) * 50, 0.55, Math.sin(a) * 50);
    seg.rotation.y = -a;
    scene.add(seg);
  }

  /* ───────────── Interaction: click to focus building ───────────── */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const infoPanels = document.querySelectorAll('.c3d-info-panel');
  function showBuildingPanel(id) {
    infoPanels.forEach(p => {
      const match = id ? p.dataset.building === id : p.hasAttribute('data-default');
      p.hidden = !match;
    });
  }

  function focusBuilding(group) {
    const targetPos = group.position.clone();
    targetPos.y = 6;
    controls.target.lerp(targetPos, 1);
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(targetPos.clone().add(dir.multiplyScalar(30)));
    showBuildingPanel(group.userData.building);
  }

  function findBuildingGroup(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.building) return o;
      o = o.parent;
    }
    return null;
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(buildings, true);
    if (hits.length) {
      const group = findBuildingGroup(hits[0].object);
      if (group) focusBuilding(group);
    }
  });

  /* Legend buttons drive the same focus logic */
  document.querySelectorAll('[data-target-building]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.targetBuilding;
      const group = buildings.find(b => b.userData.building === id);
      if (group) focusBuilding(group);
    });
  });

  /* Control overlay buttons */
  document.querySelectorAll('.c3d-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'reset') {
        camera.position.copy(DEFAULT_CAMERA);
        controls.target.set(0, 4, 0);
        showBuildingPanel(null);
      }
      if (action === 'zoom-in') {
        const dir = controls.target.clone().sub(camera.position).normalize();
        camera.position.add(dir.multiplyScalar(8));
      }
      if (action === 'zoom-out') {
        const dir = camera.position.clone().sub(controls.target).normalize();
        camera.position.add(dir.multiplyScalar(8));
      }
      if (action === 'rotate') {
        controls.autoRotate = !controls.autoRotate;
        btn.classList.toggle('is-active', controls.autoRotate);
      }
    });
  });

  /* ───────────── Animation loop ───────────── */
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    goldGlow.intensity = 1.2 + Math.sin(t * 0.6) * 0.15;
    purpleAmbient.intensity = 0.6 + Math.sin(t * 0.4 + 1) * 0.1;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  if (loader) {
    requestAnimationFrame(() => {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 400);
    });
  }

  window.addEventListener('resize', () => {
    if (!stage) return;
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth, stage.clientHeight);
  });
})();
