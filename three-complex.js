/* ════════════════════════════════════════════════════════════════════════════
   כזוהר הרקיע · Three.js Campus Scene v2
   Night mode, dynamic info panels, focus animation
   ════════════════════════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(() => {
  const canvas = document.getElementById('campusCanvas');
  const stage = document.querySelector('.campus__stage');
  if (!canvas || !stage) return;

  // ── Building data (single source of truth) ──
  const BUILDINGS = {
    prayer: {
      name: 'היכל התפילה המרכזי',
      subtitle: 'Sanctuary · לב המתחם',
      description: 'אולם תפילה מלכותי עם כיפה של פאר, ארון קודש חצוב אבן ירושלמית, ופרוכת ידית זהב. מיועד לתפילות שבת, חג, ומניינים המוניים.',
      stats: [
        ['קיבולת', '500 מתפללים'],
        ['קומות', '2 — גברים ועזרת נשים'],
        ['גובה כיפה', '14 מטרים'],
      ],
    },
    midrash: {
      name: 'בית המדרש והכוללים',
      subtitle: 'Torah Study · 24/7',
      description: 'מרחב לימוד מרכזי הפעיל סביב השעון. כולל 6 חדרי כולל נפרדים, ספריית תורה עשירה, וחצר לימוד מקורה.',
      stats: [
        ['מקומות לימוד', '200'],
        ['מעגלי לימוד', '6'],
        ['פעילות', '24 שעות'],
      ],
    },
    mikveh: {
      name: 'מתחם המקוואות',
      subtitle: 'Ritual Baths · הידור בטהרה',
      description: 'מקוואות נפרדים לגברים ולנשים, בהידור מרבי. אבן ירושלמית, מערכות סינון מתקדמות, וחדרי הכנה יוקרתיים.',
      stats: [
        ['מקוואות', '2 — גברים ונשים'],
        ['חדרי הכנה', '8 חדרים פרטיים'],
        ['הידור', 'מאושר לחומרות'],
      ],
    },
    community: {
      name: 'אולם הקהילה הרב־תכליתי',
      subtitle: 'Community Hall',
      description: 'אולם רב־תכליתי לשיעורי תורה של קהל הרחב, אירועי מרכז, שמחות קהילתיות, ובריתות מילה.',
      stats: [
        ['קיבולת', '300 מקומות'],
        ['שימושים', 'שיעורים · אירועים · שמחות'],
        ['ציוד', 'מערכת שמע מקצועית'],
      ],
    },
    chesed: {
      name: 'מרכז "חסד יסובבנו"',
      subtitle: 'Chesed Center',
      description: 'בית הפעילות של קרן החסד. מחסני מזון, משרי סיוע, וחדרי קבלת פונים. שם המתחם — "חסד יסובבנו".',
      stats: [
        ['משפחות', 'כ-150 בחלוקה שבועית'],
        ['מחסן מזון', 'מלא · 24/7'],
        ['משרדי קבלה', '3'],
      ],
    },
  };

  // ── Palette (night theme) ──
  const PALETTE = {
    stone:     0xD5C8E0,
    ivory:     0xE8DEF0,
    gold:      0xC89B5C,
    goldLight: 0xE9C47C,
    goldDeep:  0x8E6D31,
    stoneDark: 0x6B5A7A,
    blue:      0x5A7A8E,
    bronze:    0x6B5080,
    umber:     0x4A3060,
    ground:    0x1E1440,
    bg:        0x0A0907,
    fog:       0x0A0907,
    rose:      0xA66973,
    green:     0x3D6A5A,
  };

  // ── Scene setup ──
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.bg);
  scene.fog = new THREE.Fog(PALETTE.fog, 70, 220);

  const camera = new THREE.PerspectiveCamera(
    42,
    stage.clientWidth / stage.clientHeight,
    0.1,
    500
  );
  camera.position.set(60, 50, 70);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ── Controls ──
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 25;
  controls.maxDistance = 130;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.target.set(0, 5, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.6;

  const DEFAULT_CAM_POS = camera.position.clone();
  const DEFAULT_TARGET = controls.target.clone();

  // ── Lighting (warm gold nighttime) ──
  const hemi = new THREE.HemisphereLight(0x5A4080, 0x0A0907, 0.5);
  scene.add(hemi);

  const moon = new THREE.DirectionalLight(0xFFD8A8, 1.0);
  moon.position.set(50, 80, 30);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -70;
  moon.shadow.camera.right = 70;
  moon.shadow.camera.top = 70;
  moon.shadow.camera.bottom = -70;
  moon.shadow.camera.far = 200;
  moon.shadow.bias = -0.0005;
  scene.add(moon);

  const goldGlow = new THREE.PointLight(0xE6B673, 1.4, 100, 2);
  goldGlow.position.set(0, 20, 0);
  scene.add(goldGlow);

  const blueAccent = new THREE.PointLight(0x5A7A8E, 0.8, 60, 2);
  blueAccent.position.set(20, 12, -20);
  scene.add(blueAccent);

  // ── Materials ──
  const mat = {
    stone:  new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.6, metalness: 0.05 }),
    ivory:  new THREE.MeshStandardMaterial({ color: PALETTE.ivory, roughness: 0.55, metalness: 0.05 }),
    gold:   new THREE.MeshStandardMaterial({ color: PALETTE.gold, roughness: 0.25, metalness: 0.92 }),
    blue:   new THREE.MeshStandardMaterial({ color: PALETTE.blue, roughness: 0.45, metalness: 0.15 }),
    bronze: new THREE.MeshStandardMaterial({ color: PALETTE.bronze, roughness: 0.4, metalness: 0.55 }),
    umber:  new THREE.MeshStandardMaterial({ color: PALETTE.umber, roughness: 0.5, metalness: 0.1 }),
    glass:  new THREE.MeshPhysicalMaterial({
      color: 0xD5C8E0,
      roughness: 0.1,
      metalness: 0,
      transmission: 0.6,
      transparent: true,
      opacity: 0.5,
    }),
  };

  const shadowed = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

  // ── Ground ──
  const ground = shadowed(new THREE.Mesh(
    new THREE.CircleGeometry(55, 64),
    new THREE.MeshStandardMaterial({ color: PALETTE.ground, roughness: 0.85 })
  ));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Central path circle (gold)
  const pathRing = shadowed(new THREE.Mesh(
    new THREE.RingGeometry(22, 22.8, 64),
    mat.gold
  ));
  pathRing.rotation.x = -Math.PI / 2;
  pathRing.position.y = 0.02;
  scene.add(pathRing);

  // ── Central fountain ──
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

  // ── Trees (lighter count) ──
  function makeTree(x, z) {
    const t = new THREE.Group();
    const trunk = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8), mat.umber));
    trunk.position.y = 1.1;
    const leaves = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x3A4A30, roughness: 0.85 })
    ));
    leaves.position.y = 3;
    t.add(trunk, leaves);
    t.position.set(x, 0, z);
    return t;
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    scene.add(makeTree(Math.cos(a) * 48, Math.sin(a) * 48));
  }

  // ── Building factory helpers ──
  function colonnade(count, spanX, z, height, material) {
    const g = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const x = -spanX / 2 + (spanX / (count - 1)) * i;
      const col = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, height, 12), material));
      col.position.set(x, height / 2, z);
      const cap = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), mat.gold));
      cap.position.set(x, height + 0.15, z);
      g.add(col, cap);
    }
    return g;
  }

  // ── Building 1: Prayer Hall (center) ──
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

    // Dome ribs
    const ribCount = 10;
    for (let i = 0; i < ribCount; i++) {
      const a = (i / ribCount) * Math.PI * 2;
      const rib = shadowed(new THREE.Mesh(
        new THREE.TorusGeometry(7.5, 0.08, 6, 24, Math.PI),
        mat.gold
      ));
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

    group.position.set(0, 0, 0);
    return group;
  }

  // ── Building 2: Beit Midrash ──
  function buildMidrash() {
    const group = new THREE.Group();
    group.userData.building = 'midrash';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(17, 9, 13), mat.ivory));
    base.position.y = 4.5;
    group.add(base);

    const roof = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0, 9.5, 4, 4), mat.bronze));
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 11;
    group.add(roof);

    const trim = shadowed(new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.15, 6, 4), mat.gold));
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

    group.position.set(-22, 0, -22);
    group.rotation.y = Math.PI / 4;
    return group;
  }

  // ── Building 3: Mikveh (blue accent) ──
  function buildMikveh() {
    const group = new THREE.Group();
    group.userData.building = 'mikveh';

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(11, 6.5, 11), mat.ivory));
    base.position.y = 3.25;
    group.add(base);

    const domeDrum = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 1.5, 24), mat.blue));
    domeDrum.position.y = 7;
    group.add(domeDrum);

    const dome = shadowed(new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1),
      mat.blue
    ));
    dome.position.y = 7.7;
    group.add(dome);

    const ring = shadowed(new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.12, 6, 24), mat.gold));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 7;
    group.add(ring);

    group.position.set(22, 0, -22);
    group.rotation.y = -Math.PI / 4;
    return group;
  }

  // ── Building 4: Community Hall ──
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

    group.position.set(22, 0, 22);
    group.rotation.y = -3 * Math.PI / 4;
    return group;
  }

  // ── Building 5: Chesed Center (with heart accent) ──
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

    // Heart emblem — using the new rose color
    const heartMat = new THREE.MeshStandardMaterial({
      color: PALETTE.rose,
      roughness: 0.3,
      metalness: 0.3,
      emissive: 0x4A1A22,
      emissiveIntensity: 0.3
    });

    const heartShape = new THREE.Shape();
    const s = 0.9;
    heartShape.moveTo(0, 2 * s);
    heartShape.bezierCurveTo(0, 2.8 * s, -2.5 * s, 4 * s, -4 * s, 1.5 * s);
    heartShape.bezierCurveTo(-6 * s, -2 * s, -2 * s, -5 * s, 0, -4 * s);
    heartShape.bezierCurveTo(2 * s, -5 * s, 6 * s, -2 * s, 4 * s, 1.5 * s);
    heartShape.bezierCurveTo(2.5 * s, 4 * s, 0, 2.8 * s, 0, 2 * s);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.8 * s,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1
    });
    const heartMesh = shadowed(new THREE.Mesh(heartGeo, heartMat));
    heartMesh.position.set(0, 3.2, 4.6);
    heartMesh.rotation.y = Math.PI;
    group.add(heartMesh);

    const ring = shadowed(new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 8, 20), mat.gold));
    ring.position.set(0, 3.2, 4.55);
    group.add(ring);

    group.position.set(-22, 0, 22);
    group.rotation.y = 3 * Math.PI / 4;
    return group;
  }

  const buildings = [
    buildPrayerHall(),
    buildMidrash(),
    buildMikveh(),
    buildCommunityHall(),
    buildChesedCenter(),
  ];
  buildings.forEach(b => scene.add(b));

  // ── Perimeter wall ──
  const wallSegments = 36;
  for (let i = 0; i < wallSegments; i++) {
    const a = (i / wallSegments) * Math.PI * 2;
    const seg = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 0.4), mat.stone));
    seg.position.set(Math.cos(a) * 52, 0.55, Math.sin(a) * 52);
    seg.rotation.y = -a;
    scene.add(seg);
  }

  // ── Click interaction ──
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function findBuildingGroup(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.building) return o;
      o = o.parent;
    }
    return null;
  }

  function showBuildingInfo(id) {
    const wrap = document.getElementById('campusInfo');
    if (!wrap) return;
    const inner = wrap.querySelector('.campus__info-inner');
    if (!inner) return;

    if (!id) {
      // Default
      inner.innerHTML = `
        <span class="info__ornament" aria-hidden="true">✦</span>
        <h3 class="info__title">קריית כזוהר הרקיע</h3>
        <p class="info__subtitle">מבט על המתחם כולו</p>
        <div class="divider divider--subtle"><span class="divider__line"></span><span class="divider__diamond">✦</span><span class="divider__line"></span></div>
        <p class="info__text">מתחם רוחני של חמישה מבנים מרכזיים, המשתרעים סביב חצר מרכזית מוצלת עצים.</p>
        <ul class="info__stats">
          <li><span>מבנים</span><strong>5</strong></li>
          <li><span>יעד קומות</span><strong>עד 3</strong></li>
          <li><span>פעילות</span><strong>24 שעות</strong></li>
        </ul>
        <p class="info__hint">לחצו על מבנה להרחבה · גררו לסיבוב</p>
      `;
      return;
    }

    const data = BUILDINGS[id];
    if (!data) return;

    inner.innerHTML = `
      <span class="info__ornament" aria-hidden="true">✦</span>
      <h3 class="info__title">${data.name}</h3>
      <p class="info__subtitle">${data.subtitle}</p>
      <div class="divider divider--subtle"><span class="divider__line"></span><span class="divider__diamond">✦</span><span class="divider__line"></span></div>
      <p class="info__text">${data.description}</p>
      <ul class="info__stats">
        ${data.stats.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join('')}
      </ul>
    `;
  }

  function focusBuilding(group) {
    const targetPos = group.position.clone();
    targetPos.y = 6;
    const offset = new THREE.Vector3(0, 12, 28);
    const camTarget = targetPos.clone().add(offset);

    // Animate camera
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const dur = 1000;
    const start = performance.now();
    controls.autoRotate = false;
    document.querySelector('[data-action="rotate"]')?.classList.remove('is-active');

    const animate = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      camera.position.lerpVectors(startPos, camTarget, eased);
      controls.target.lerpVectors(startTarget, targetPos, eased);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    showBuildingInfo(group.userData.building);
  }

  // Pointer click
  let clickStart = null;
  canvas.addEventListener('pointerdown', e => { clickStart = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (!clickStart) return;
    const dx = Math.abs(e.clientX - clickStart.x);
    const dy = Math.abs(e.clientY - clickStart.y);
    if (dx > 4 || dy > 4) { clickStart = null; return; } // it was a drag

    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(buildings, true);
    if (hits.length) {
      const group = findBuildingGroup(hits[0].object);
      if (group) focusBuilding(group);
    }
    clickStart = null;
  });

  // Legend buttons
  document.querySelectorAll('[data-building]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.building;
      const group = buildings.find(b => b.userData.building === id);
      if (group) {
        focusBuilding(group);
        // smooth scroll to 3D
        document.getElementById('campus')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Control buttons
  document.querySelectorAll('.ctrl').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'reset') {
        const startPos = camera.position.clone();
        const startTarget = controls.target.clone();
        const dur = 800;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          camera.position.lerpVectors(startPos, DEFAULT_CAM_POS, eased);
          controls.target.lerpVectors(startTarget, DEFAULT_TARGET, eased);
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        showBuildingInfo(null);
      }
      if (action === 'rotate') {
        controls.autoRotate = !controls.autoRotate;
        btn.classList.toggle('is-active', controls.autoRotate);
      }
    });
  });

  // ── Cinematic entry ──
  const startCamPos = new THREE.Vector3(110, 90, 110);
  camera.position.copy(startCamPos);
  const entryDur = 1800;
  const entryStart = performance.now();
  const entryAnimate = (now) => {
    const p = Math.min(1, (now - entryStart) / entryDur);
    const eased = 1 - Math.pow(1 - p, 4);
    camera.position.lerpVectors(startCamPos, DEFAULT_CAM_POS, eased);
    if (p < 1) requestAnimationFrame(entryAnimate);
  };
  requestAnimationFrame(entryAnimate);

  // ── Main loop ──
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    goldGlow.intensity = 1.3 + Math.sin(t * 0.6) * 0.2;
    blueAccent.intensity = 0.7 + Math.sin(t * 0.4 + 1) * 0.15;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // ── Signal ready ──
  setTimeout(() => window.dispatchEvent(new Event('campus:ready')), 400);

  // ── Resize ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!stage) return;
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight);
    }, 100);
  });
})();
