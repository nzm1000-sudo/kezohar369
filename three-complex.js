/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — Royal Majesty V5
   Grand Complex מאוחד · כיפת זהב גדולה · Grand Arch · אגפים סימטריים
   רקע סגול־לילה מואר · מעברי מצלמה חלקים עם GSAP
   ═══════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(() => {
  const canvas = document.getElementById('complex3DCanvas');
  const stage = document.querySelector('.complex3d-stage');
  const loader = document.getElementById('complex3DLoader');
  if (!canvas || !stage) return;

  /* ───────────── Royal V5 Palette — brighter living night purple ───────────── */
  const PALETTE = {
    nightPurple: 0x2B1768,
    fogPurple:   0x3A2480,
    ground:      0x4B3580,
    groundGlow:  0x6A4FA0,
    ivory:       0xF0E7F4,
    stone:       0xD8CCE5,
    warmStone:   0xE7D8C3,
    pearl:       0xFAF6FF,
    gold:        0xC89B5C,
    goldLight:   0xF4CF86,
    goldDeep:    0x8E6D31,
    royalPurple: 0x5A4080,
    glass:       0xCFE2FF,
    navy:        0x211B45,
    bronze:      0x9A7451,
    garden:      0x5E7E58,
    trunk:       0x6D4C38
  };

  /* ───────────── Scene / Camera / Renderer ───────────── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.nightPurple);
  scene.fog = new THREE.Fog(PALETTE.fogPurple, 78, 230);

  const camera = new THREE.PerspectiveCamera(
    42,
    stage.clientWidth / stage.clientHeight,
    0.1,
    500
  );
  camera.position.set(62, 40, 68);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  /* ───────────── Controls ───────────── */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 28;
  controls.maxDistance = 150;
  controls.maxPolarAngle = Math.PI / 2.08;
  controls.target.set(0, 8, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.75;

  const DEFAULT_CAMERA = camera.position.clone();
  const DEFAULT_TARGET = controls.target.clone();

  /* ───────────── Royal V5 Lighting — brighter sun and glow ───────────── */
  const hemi = new THREE.HemisphereLight(0xBDA7FF, 0x2A165F, 1.05);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xFFF0C7, 2.45);
  sun.position.set(70, 95, 46);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -95;
  sun.shadow.camera.right = 95;
  sun.shadow.camera.top = 95;
  sun.shadow.camera.bottom = -95;
  sun.shadow.camera.far = 250;
  sun.shadow.bias = -0.00045;
  scene.add(sun);

  const purpleAmbient = new THREE.PointLight(0xA78BFA, 1.05, 150, 2);
  purpleAmbient.position.set(0, 34, -16);
  scene.add(purpleAmbient);

  const goldGlow = new THREE.PointLight(0xF4C46E, 1.55, 120, 2);
  goldGlow.position.set(0, 23, 17);
  scene.add(goldGlow);

  const archGlow = new THREE.PointLight(0xFFE2A3, 0.95, 55, 2);
  archGlow.position.set(0, 8, 24);
  scene.add(archGlow);

  /* ───────────── Materials ───────────── */
  const mat = {
    stone: new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.58, metalness: 0.05 }),
    ivory: new THREE.MeshStandardMaterial({ color: PALETTE.ivory, roughness: 0.5, metalness: 0.04 }),
    pearl: new THREE.MeshStandardMaterial({ color: PALETTE.pearl, roughness: 0.46, metalness: 0.04 }),
    warmStone: new THREE.MeshStandardMaterial({ color: PALETTE.warmStone, roughness: 0.55, metalness: 0.06 }),
    gold: new THREE.MeshStandardMaterial({ color: PALETTE.gold, roughness: 0.2, metalness: 0.92 }),
    goldLight: new THREE.MeshStandardMaterial({ color: PALETTE.goldLight, roughness: 0.16, metalness: 0.96, emissive: 0x3A2608, emissiveIntensity: 0.12 }),
    goldDeep: new THREE.MeshStandardMaterial({ color: PALETTE.goldDeep, roughness: 0.28, metalness: 0.9 }),
    royalPurple: new THREE.MeshStandardMaterial({ color: PALETTE.royalPurple, roughness: 0.46, metalness: 0.18 }),
    navy: new THREE.MeshStandardMaterial({ color: PALETTE.navy, roughness: 0.45, metalness: 0.22 }),
    bronze: new THREE.MeshStandardMaterial({ color: PALETTE.bronze, roughness: 0.34, metalness: 0.58 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: PALETTE.glass,
      roughness: 0.08,
      metalness: 0,
      transparent: true,
      opacity: 0.48,
      transmission: 0.42,
      thickness: 0.7,
      side: THREE.DoubleSide
    }),
    garden: new THREE.MeshStandardMaterial({ color: PALETTE.garden, roughness: 0.78, metalness: 0.02 }),
    trunk: new THREE.MeshStandardMaterial({ color: PALETTE.trunk, roughness: 0.75, metalness: 0.02 })
  };

  const shadowed = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const addBox = (group, size, position, material) => {
    const mesh = shadowed(new THREE.Mesh(new THREE.BoxGeometry(...size), material));
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  };

  const addCylinder = (group, radiusTop, radiusBottom, height, segments, position, material) => {
    const mesh = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material));
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  };

  /* ───────────── Bright courtyard ground ───────────── */
  const ground = shadowed(new THREE.Mesh(
    new THREE.CircleGeometry(68, 96),
    new THREE.MeshStandardMaterial({
      color: PALETTE.ground,
      roughness: 0.82,
      metalness: 0.02,
      emissive: PALETTE.groundGlow,
      emissiveIntensity: 0.04
    })
  ));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const radialGlow = shadowed(new THREE.Mesh(
    new THREE.RingGeometry(26, 27.4, 96),
    mat.gold
  ));
  radialGlow.rotation.x = -Math.PI / 2;
  radialGlow.position.y = 0.035;
  scene.add(radialGlow);

  const promenade = shadowed(new THREE.Mesh(
    new THREE.RingGeometry(45, 46.2, 96),
    new THREE.MeshStandardMaterial({ color: 0x6F57A5, roughness: 0.7, metalness: 0.05 })
  ));
  promenade.rotation.x = -Math.PI / 2;
  promenade.position.y = 0.025;
  scene.add(promenade);

  /* ───────────── Geometry helpers ───────────── */
  function makeArchPanel(width, springY, depth, material, bevel = 0.05) {
    const r = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-r, 0);
    shape.lineTo(r, 0);
    shape.lineTo(r, springY);
    shape.absarc(0, springY, r, 0, Math.PI, false);
    shape.lineTo(-r, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3
    });
    return shadowed(new THREE.Mesh(geo, material));
  }

  function addArchedWindow(group, x, y, z, width = 2.4, springY = 2.6, scaleZ = 0.1, rotationY = 0) {
    const frame = makeArchPanel(width + 0.38, springY + 0.18, scaleZ, mat.gold, 0.025);
    frame.position.set(x, y, z);
    frame.rotation.y = rotationY;
    const glass = makeArchPanel(width, springY, scaleZ + 0.02, mat.glass, 0.015);
    glass.position.set(x, y + 0.06, z + (rotationY === 0 ? 0.08 : -0.08));
    glass.rotation.y = rotationY;
    group.add(frame, glass);
    return { frame, glass };
  }

  function addColumn(group, x, z, height, radius = 0.42, material = mat.stone) {
    const col = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 20), material));
    col.position.set(x, height / 2, z);
    const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.45, radius * 1.6, 0.32, 20), mat.goldDeep));
    base.position.set(x, 0.16, z);
    const cap = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.55, radius * 1.38, 0.38, 20), mat.gold));
    cap.position.set(x, height + 0.19, z);
    group.add(base, col, cap);
  }

  function addColonnadeCorridor(group, side) {
    const corridor = new THREE.Group();
    corridor.userData.building = side < 0 ? 'midrash' : 'mikveh';

    const centerX = side * 19.1;
    addBox(corridor, [14.6, 0.55, 23], [centerX, 0.28, 0], mat.warmStone);

    for (let row = 0; row < 2; row++) {
      const z = row === 0 ? 9.9 : -9.9;
      for (let i = 0; i < 5; i++) {
        const x = side * (13.4 + i * 2.9);
        addColumn(corridor, x, z, 6.7, 0.36, mat.pearl);
      }
      addBox(corridor, [15.4, 0.8, 2.1], [centerX, 7.16, z], mat.gold);
      addBox(corridor, [15.4, 0.72, 1.35], [centerX, 7.92, z], mat.ivory);
    }

    for (let i = 0; i < 4; i++) {
      const x = side * (14.8 + i * 2.9);
      const arch = makeArchPanel(2.15, 3.5, 0.22, mat.stone, 0.025);
      arch.position.set(x, 2.25, 10.92);
      corridor.add(arch);
      const backArch = makeArchPanel(2.15, 3.5, 0.22, mat.stone, 0.025);
      backArch.position.set(x, 2.25, -11.14);
      backArch.rotation.y = Math.PI;
      corridor.add(backArch);
    }

    group.add(corridor);
    return corridor;
  }

  function addLantern(group, x, z, y = 7.9) {
    const lantern = new THREE.Group();
    const pole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 8), mat.goldDeep));
    pole.position.y = y - 0.7;
    const bulb = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshStandardMaterial({
      color: 0xFFE6AD,
      emissive: 0xF4C46E,
      emissiveIntensity: 0.7,
      roughness: 0.25
    })));
    bulb.position.y = y;
    lantern.add(pole, bulb);
    lantern.position.set(x, 0, z);
    group.add(lantern);
  }

  function addGrandStairs(group) {
    for (let i = 0; i < 5; i++) {
      addBox(group, [22 + i * 3.2, 0.32, 2.2], [0, 0.16 + i * 0.25, 25.2 + i * 1.65], i % 2 ? mat.stone : mat.warmStone);
    }
  }

  function addDomeRibs(group, radius, y) {
    const ribCount = 16;
    for (let i = 0; i < ribCount; i++) {
      const a = (i / ribCount) * Math.PI * 2;
      const rib = shadowed(new THREE.Mesh(new THREE.TorusGeometry(radius * 0.505, 0.055, 8, 54, Math.PI), mat.goldLight));
      rib.position.y = y + radius * 0.48;
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = a;
      rib.scale.y = 1.82;
      group.add(rib);
    }
  }

  /* ───────────── Grand Complex — one unified architectural city ───────────── */
  function buildGrandComplex() {
    const grand = new THREE.Group();
    grand.name = 'Royal V5 Grand Complex';

    /* Unified raised plinth tying every part into one composition */
    addBox(grand, [76, 1.4, 38], [0, 0.7, 0], mat.warmStone);
    addBox(grand, [80, 0.42, 42], [0, 1.62, 0], mat.gold);
    addBox(grand, [70, 0.45, 32], [0, 1.9, 0], mat.pearl);
    addGrandStairs(grand);

    /* Central sanctuary and dome */
    const central = new THREE.Group();
    central.userData.building = 'prayer';
    addBox(central, [25, 13.8, 24], [0, 8.9, 0], mat.ivory);
    addBox(central, [27.2, 1.4, 25.6], [0, 16.5, 0], mat.goldDeep);
    addBox(central, [22.6, 1.1, 21.2], [0, 17.75, 0], mat.pearl);

    addCylinder(central, 9.5, 9.5, 3.2, 48, [0, 20.05, 0], mat.stone);
    const drumRingBottom = shadowed(new THREE.Mesh(new THREE.TorusGeometry(9.55, 0.18, 12, 64), mat.gold));
    drumRingBottom.rotation.x = Math.PI / 2;
    drumRingBottom.position.y = 18.45;
    central.add(drumRingBottom);
    const drumRingTop = drumRingBottom.clone();
    drumRingTop.position.y = 21.7;
    central.add(drumRingTop);

    const dome = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(9.65, 56, 28, 0, Math.PI * 2, 0, Math.PI / 2),
      mat.goldLight
    ));
    dome.position.y = 21.65;
    central.add(dome);
    addDomeRibs(central, 9.65, 21.65);

    const crown = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.88, 1.15, 1.1, 24), mat.gold));
    crown.position.y = 31.55;
    central.add(crown);
    const spire = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.55, 4.3, 18), mat.goldLight));
    spire.position.y = 34.25;
    central.add(spire);
    const star = shadowed(new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), mat.goldLight));
    star.position.y = 36.7;
    central.add(star);

    /* Grand Arch entrance */
    const grandArch = new THREE.Group();
    grandArch.userData.building = 'prayer';
    const archWall = makeArchPanel(17, 10.2, 1.25, mat.stone, 0.06);
    archWall.position.set(0, 2.25, 12.65);
    grandArch.add(archWall);
    const archGoldTrim = makeArchPanel(14.2, 9.05, 1.31, mat.gold, 0.04);
    archGoldTrim.position.set(0, 3.03, 13.08);
    grandArch.add(archGoldTrim);
    const archRecess = makeArchPanel(10.6, 7.65, 1.37, mat.navy, 0.035);
    archRecess.position.set(0, 3.78, 13.54);
    grandArch.add(archRecess);
    const doubleDoor = addBox(grandArch, [6.8, 6.25, 0.35], [0, 6.85, 14.32], mat.royalPurple);
    doubleDoor.receiveShadow = false;
    addBox(grandArch, [0.16, 6.1, 0.42], [0, 6.88, 14.55], mat.goldDeep);
    addColumn(grandArch, -9.7, 14.1, 9.6, 0.55, mat.pearl);
    addColumn(grandArch, 9.7, 14.1, 9.6, 0.55, mat.pearl);
    addBox(grandArch, [21.5, 0.9, 2.2], [0, 12.05, 14.1], mat.gold);
    central.add(grandArch);

    /* Central facade windows */
    [-8.2, 8.2].forEach((x) => {
      addArchedWindow(central, x, 7.0, 12.28, 2.55, 3.3, 0.11, 0);
      addArchedWindow(central, x, 7.0, -12.39, 2.55, 3.3, 0.11, Math.PI);
    });
    [-5.6, 0, 5.6].forEach((x) => addArchedWindow(central, x, 12.2, 12.33, 1.55, 2.05, 0.09, 0));

    grand.add(central);

    /* Symmetric side wings */
    function buildWing(side) {
      const wing = new THREE.Group();
      wing.userData.building = side < 0 ? 'midrash' : 'mikveh';

      const cx = side * 35.5;
      addBox(wing, [23, 11.2, 22], [cx, 7.5, 0], mat.ivory);
      addBox(wing, [24.4, 1.1, 23.3], [cx, 13.65, 0], mat.goldDeep);
      addBox(wing, [20.8, 3.4, 19.6], [cx, 16.0, 0], mat.royalPurple);

      const roof = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 15.8, 4.4, 4), mat.bronze));
      roof.rotation.y = Math.PI / 4;
      roof.position.set(cx, 18.6, 0);
      wing.add(roof);

      const sideDomeDrum = addCylinder(wing, 4.4, 4.4, 1.25, 32, [cx, 20.1, 0], mat.stone);
      sideDomeDrum.scale.x = 1.02;
      const sideDome = shadowed(new THREE.Mesh(
        new THREE.SphereGeometry(4.4, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2),
        mat.gold
      ));
      sideDome.position.set(cx, 20.72, 0);
      wing.add(sideDome);
      const finial = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.8, 14), mat.goldLight));
      finial.position.set(cx, 26.0, 0);
      wing.add(finial);

      for (let i = -1; i <= 1; i++) {
        addArchedWindow(wing, cx + i * 5.2, 7.15, 11.24, 2.0, 2.85, 0.1, 0);
        addArchedWindow(wing, cx + i * 5.2, 7.15, -11.35, 2.0, 2.85, 0.1, Math.PI);
      }

      /* Integrated front pavilion inside each wing — still one connected building */
      const pavilionId = side < 0 ? 'chesed' : 'community';
      const pavilion = new THREE.Group();
      pavilion.userData.building = pavilionId;
      addBox(pavilion, [8.2, 6.8, 5.6], [cx, 5.05, 13.7], mat.pearl);
      const pArch = makeArchPanel(4.8, 4.0, 0.42, mat.gold, 0.035);
      pArch.position.set(cx, 2.0, 16.48);
      pavilion.add(pArch);
      const pRecess = makeArchPanel(3.45, 3.2, 0.45, mat.navy, 0.025);
      pRecess.position.set(cx, 2.35, 16.86);
      pavilion.add(pRecess);
      addColumn(pavilion, cx - 4.9, 16.65, 5.8, 0.28, mat.pearl);
      addColumn(pavilion, cx + 4.9, 16.65, 5.8, 0.28, mat.pearl);
      wing.add(pavilion);

      return wing;
    }

    const leftWing = buildWing(-1);
    const rightWing = buildWing(1);
    grand.add(leftWing, rightWing);

    /* Columned corridors physically connect central hall to wings */
    addColonnadeCorridor(grand, -1);
    addColonnadeCorridor(grand, 1);

    /* Long royal cornice unifies the full facade */
    addBox(grand, [78, 0.85, 1.4], [0, 14.65, 12.4], mat.gold);
    addBox(grand, [78, 0.75, 1.2], [0, 14.45, -12.4], mat.goldDeep);

    /* Courtyard lamps and decorative axis */
    [-28, -18, -8, 8, 18, 28].forEach((x) => addLantern(grand, x, 19.5, 5.6));
    [-39, 39].forEach((x) => addLantern(grand, x, -13.2, 5.2));

    const centerMedallion = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.9, 0.28, 48), mat.goldDeep));
    centerMedallion.position.set(0, 2.12, 21.8);
    grand.add(centerMedallion);
    const centerStar = shadowed(new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), mat.goldLight));
    centerStar.position.set(0, 3.0, 21.8);
    grand.add(centerStar);

    grand.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return grand;
  }

  const grandComplex = buildGrandComplex();
  scene.add(grandComplex);

  /* ───────────── Garden / perimeter — keeps focus on one large building ───────────── */
  function makeTree(x, z, scale = 1) {
    const tree = new THREE.Group();
    const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.32 * scale, 2.2 * scale, 10), mat.trunk));
    trunk.position.y = 1.1 * scale;
    const leaves = shadowed(new THREE.Mesh(new THREE.SphereGeometry(1.55 * scale, 14, 14), mat.garden));
    leaves.position.y = 2.85 * scale;
    tree.add(trunk, leaves);
    tree.position.set(x, 0, z);
    return tree;
  }

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const radius = i % 2 ? 57 : 61;
    scene.add(makeTree(Math.cos(a) * radius, Math.sin(a) * radius, i % 3 === 0 ? 1.15 : 1));
  }

  const wallSegments = 56;
  for (let i = 0; i < wallSegments; i++) {
    const a = (i / wallSegments) * Math.PI * 2;
    const seg = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.95, 0.34), mat.stone));
    seg.position.set(Math.cos(a) * 64, 0.48, Math.sin(a) * 64);
    seg.rotation.y = -a;
    scene.add(seg);
  }

  /* ───────────── Interaction + GSAP camera transitions ───────────── */
  const focusTargets = {
    prayer: {
      target: new THREE.Vector3(0, 11, 8),
      camera: new THREE.Vector3(27, 25, 46)
    },
    midrash: {
      target: new THREE.Vector3(-34, 8, 1),
      camera: new THREE.Vector3(-58, 23, 38)
    },
    mikveh: {
      target: new THREE.Vector3(34, 8, 1),
      camera: new THREE.Vector3(58, 23, 38)
    },
    community: {
      target: new THREE.Vector3(35.5, 7, 13),
      camera: new THREE.Vector3(47, 18, 45)
    },
    chesed: {
      target: new THREE.Vector3(-35.5, 7, 13),
      camera: new THREE.Vector3(-47, 18, 45)
    }
  };

  function animateCamera(cameraPosition, lookAtTarget, duration = 1.35) {
    const gsap = window.gsap;
    controls.autoRotate = false;

    if (gsap) {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);
      gsap.to(camera.position, {
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        duration,
        ease: 'power3.inOut'
      });
      gsap.to(controls.target, {
        x: lookAtTarget.x,
        y: lookAtTarget.y,
        z: lookAtTarget.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => controls.update()
      });
      return;
    }

    camera.position.copy(cameraPosition);
    controls.target.copy(lookAtTarget);
    controls.update();
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const infoPanels = document.querySelectorAll('.c3d-info-panel');

  function showBuildingPanel(id) {
    infoPanels.forEach((panel) => {
      const match = id ? panel.dataset.building === id : panel.hasAttribute('data-default');
      panel.hidden = !match;
    });
  }

  function findBuildingGroup(obj) {
    let current = obj;
    while (current) {
      if (current.userData && current.userData.building) return current;
      current = current.parent;
    }
    return null;
  }

  function focusBuilding(groupOrId) {
    const id = typeof groupOrId === 'string' ? groupOrId : groupOrId.userData.building;
    const preset = focusTargets[id];
    if (!preset) return;
    animateCamera(preset.camera, preset.target, 1.45);
    showBuildingPanel(id);
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects([grandComplex], true);
    if (!hits.length) return;

    const group = findBuildingGroup(hits[0].object);
    if (group) focusBuilding(group);
  });

  document.querySelectorAll('[data-target-building]').forEach((btn) => {
    btn.addEventListener('click', () => focusBuilding(btn.dataset.targetBuilding));
  });

  document.querySelectorAll('.c3d-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      if (action === 'reset') {
        animateCamera(DEFAULT_CAMERA, DEFAULT_TARGET, 1.25);
        showBuildingPanel(null);
      }

      if (action === 'zoom-in') {
        const dir = controls.target.clone().sub(camera.position).normalize();
        const next = camera.position.clone().add(dir.multiplyScalar(9));
        animateCamera(next, controls.target.clone(), 0.78);
      }

      if (action === 'zoom-out') {
        const dir = camera.position.clone().sub(controls.target).normalize();
        const next = camera.position.clone().add(dir.multiplyScalar(9));
        animateCamera(next, controls.target.clone(), 0.78);
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
    goldGlow.intensity = 1.55 + Math.sin(t * 0.65) * 0.18;
    purpleAmbient.intensity = 1.05 + Math.sin(t * 0.45 + 1.1) * 0.14;
    archGlow.intensity = 0.95 + Math.sin(t * 0.9) * 0.12;
    grandComplex.rotation.y = Math.sin(t * 0.12) * 0.006;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  if (loader) {
    requestAnimationFrame(() => {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 420);
    });
  }

  window.addEventListener('resize', () => {
    if (!stage) return;
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth, stage.clientHeight);
  });
})();
