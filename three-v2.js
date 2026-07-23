/* ════════════════════════════════════════════════════════════════════════════
   כזוהר הרקיע · Three.js Campus Scene — Robust Version
   UMD build, no imports, complete with dark background like original
   ════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  function init() {
  // Check for WebGL support
  function hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  const canvas = document.getElementById('campusCanvas');
  const stage = document.querySelector('.campus__stage');
  if (!canvas || !stage) return;

  // If no WebGL, show static plan only
  if (!hasWebGL()) {
    canvas.style.display = 'none';
    const loader = document.getElementById('campus3DLoader');
    if (loader) loader.classList.add('is-hidden');
    return;
  }

  // Building data
  const BUILDINGS = {
    prayer: { name: 'היכל תפילה', subtitle: 'לב המתחם', desc: 'אולם תפילה מלכותי' },
    midrash: { name: 'בית מדרש', subtitle: '24/7 תורה', desc: 'מרחב לימוד מרכזי' },
    mikveh: { name: 'מקוואות', subtitle: 'הידור בטהרה', desc: 'מקוואות נפרדים' },
    community: { name: 'אולם קהילה', subtitle: 'שיעורים ושמחות', desc: 'אולם רב־תכליתי' },
    chesed: { name: 'מרכז חסד', subtitle: 'חסד יסובבנו', desc: 'בית הפעילות של החסד' }
  };

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1A1408);  // dark warm
  scene.fog = new THREE.Fog(0x1A1408, 60, 180);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 500);
  camera.position.set(50, 45, 60);

  // Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'default' });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.sRGBColorSpace;

  // Controls (if OrbitControls loaded)
  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    try {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.minDistance = 25;
      controls.maxDistance = 120;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.target.set(0, 4, 0);
    } catch (e) { controls = null; }
  }

  // Lighting
  const hemi = new THREE.HemisphereLight(0xC89B5C, 0x1A1408, 0.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xFFEBC4, 1.2);
  sun.position.set(40, 70, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -50; sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50; sun.shadow.camera.bottom = -50;
  scene.add(sun);
  const glow = new THREE.PointLight(0xE6B673, 1.0, 80, 2);
  glow.position.set(0, 15, 0);
  scene.add(glow);

  // Materials
  const M = {
    stone:  new THREE.MeshStandardMaterial({ color: 0xD5C8E0, roughness: 0.6, metalness: 0.05 }),
    ivory:  new THREE.MeshStandardMaterial({ color: 0xE8DEF0, roughness: 0.55, metalness: 0.05 }),
    gold:   new THREE.MeshStandardMaterial({ color: 0xC89B5C, roughness: 0.25, metalness: 0.9 }),
    blue:   new THREE.MeshStandardMaterial({ color: 0x5A7A8E, roughness: 0.4, metalness: 0.15 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x6B5080, roughness: 0.4, metalness: 0.5 }),
    umber:  new THREE.MeshStandardMaterial({ color: 0x4A3060, roughness: 0.5, metalness: 0.1 }),
    ground: new THREE.MeshStandardMaterial({ color: 0x2A1F0A, roughness: 0.85 })
  };
  const sh = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

  // Ground
  const ground = sh(new THREE.Mesh(new THREE.CircleGeometry(60, 64), M.ground));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Central fountain
  const f = new THREE.Group();
  const fBase = sh(new THREE.Mesh(new THREE.CylinderGeometry(3, 3.5, 1, 24), M.stone));
  fBase.position.y = 0.5;
  f.add(fBase);
  const fRing = sh(new THREE.Mesh(new THREE.TorusGeometry(3, 0.15, 8, 24), M.gold));
  fRing.position.y = 1;
  f.add(fRing);
  const fTop = sh(new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), M.gold));
  fTop.position.y = 3;
  f.add(fTop);
  scene.add(f);

  // Trees
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const t = new THREE.Group();
    const trunk = sh(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 6), M.umber));
    trunk.position.y = 1;
    t.add(trunk);
    const leaves = sh(new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0x3A4A30, roughness: 0.85 })));
    leaves.position.y = 2.5;
    t.add(leaves);
    t.position.set(Math.cos(a) * 45, 0, Math.sin(a) * 45);
    scene.add(t);
  }

  // Perimeter wall
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2;
    const s = sh(new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, 0.4), M.stone));
    s.position.set(Math.cos(a) * 50, 0.5, Math.sin(a) * 50);
    s.rotation.y = -a;
    scene.add(s);
  }

  // Buildings
  function makeBuilding(id, mat, w, h, d, x, z, ry, hasDome, hasRoof) {
    const g = new THREE.Group();
    g.userData.building = id;
    const base = sh(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat));
    base.position.y = h / 2;
    g.add(base);
    if (hasDome) {
      const drum = sh(new THREE.Mesh(new THREE.CylinderGeometry(w * 0.4, w * 0.4, h * 0.3, 24), M.stone));
      drum.position.y = h + h * 0.15;
      g.add(drum);
      const dome = sh(new THREE.Mesh(
        new THREE.SphereGeometry(w * 0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        M.gold
      ));
      dome.position.y = h + h * 0.3;
      g.add(dome);
      const spire = sh(new THREE.Mesh(new THREE.ConeGeometry(0.3, 2, 8), M.gold));
      spire.position.y = h + h * 0.3 + w * 0.4 + 1;
      g.add(spire);
    } else if (hasRoof) {
      const roof = sh(new THREE.Mesh(new THREE.CylinderGeometry(0, w * 0.55, h * 0.4, 4), M.bronze));
      roof.rotation.y = Math.PI / 4;
      roof.position.y = h + h * 0.2;
      g.add(roof);
    }
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    scene.add(g);
    return g;
  }

  const buildings = [
    makeBuilding('prayer', M.ivory, 18, 10, 14, 0, 0, 0, true, false),
    makeBuilding('midrash', M.ivory, 15, 8, 12, -20, -20, Math.PI / 4, false, true),
    makeBuilding('mikveh', M.ivory, 10, 6, 10, 20, -20, -Math.PI / 4, true, false),
    makeBuilding('community', M.ivory, 14, 7, 11, 20, 20, -3 * Math.PI / 4, false, true),
    makeBuilding('chesed', M.ivory, 9, 5, 8, -20, 20, 3 * Math.PI / 4, false, true)
  ];

  // Click to focus
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const infoWrap = document.getElementById('campusInfo');
  const infoInner = infoWrap ? infoWrap.querySelector('.campus__info-inner') : null;

  function showInfo(id) {
    if (!infoInner) return;
    if (!id) {
      infoInner.innerHTML = '<span class="info__ornament">✦</span><h3 class="info__title">קריית כזוהר הרקיע</h3><p class="info__subtitle">מבט על המתחם</p><div class="divider divider--subtle"></div><p class="info__text">מתחם רוחני של חמישה מבנים מרכזיים.</p><ul class="info__stats"><li><span>מבנים</span><strong>5</strong></li><li><span>פעילות</span><strong>24 שעות</strong></li></ul>';
      return;
    }
    const d = BUILDINGS[id];
    if (!d) return;
    infoInner.innerHTML = '<span class="info__ornament">✦</span><h3 class="info__title">' + d.name + '</h3><p class="info__subtitle">' + d.subtitle + '</p><div class="divider divider--subtle"></div><p class="info__text">' + d.desc + '</p>';
  }

  let press = null;
  canvas.addEventListener('pointerdown', e => { press = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (!press) return;
    const dx = Math.abs(e.clientX - press.x);
    const dy = Math.abs(e.clientY - press.y);
    if (dx > 4 || dy > 4) { press = null; return; }
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(buildings, true);
    if (hits.length) {
      let obj = hits[0].object;
      while (obj && !obj.userData.building) obj = obj.parent;
      if (obj) showInfo(obj.userData.building);
    }
    press = null;
  });

  // Legend buttons
  document.querySelectorAll('[data-building]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.building;
      const g = buildings.find(b => b.userData.building === id);
      if (g) {
        // Animate camera
        const startPos = camera.position.clone();
        const endPos = g.position.clone().add(new THREE.Vector3(0, 12, 25));
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min(1, (now - start) / 800);
          const e = 1 - Math.pow(1 - p, 3);
          camera.position.lerpVectors(startPos, endPos, e);
          if (controls) controls.target.lerp(g.position, e);
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        showInfo(id);
      }
    });
  });

  // Resize
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight);
    }, 100);
  });

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    glow.intensity = 1.0 + Math.sin(performance.now() * 0.0008) * 0.2;
    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  // Signal ready: hide loader, hide plan, show canvas
  setTimeout(() => {
    const loader = document.getElementById('campus3DLoader');
    if (loader) loader.classList.add('is-hidden');
    const wrap = document.getElementById('campusPlanWrap');
    if (wrap) wrap.style.display = 'none';
    window.dispatchEvent(new CustomEvent('campus:ready'));
  }, 500);

  animate();
  } // end init

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

