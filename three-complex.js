/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — גרסה מכובדת ויוקרתית
   תאורה רכה • אווירה רגועה • מצלמה מכובדת
   ═══════════════════════════════════════════════════════ */

(() => {
  const canvas = document.getElementById('complex3DCanvas');
  const loader = document.getElementById('complex3DLoader');
  if (!canvas) return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
  script.onload = () => initPremiumModel();
  document.head.appendChild(script);

  function initPremiumModel() {
    const COLORS = {
      grass: 0x9BB88F,
      wall: 0xF5EFE6,
      wallShadow: 0xE8DECB,
      roofGold: 0xC89B5C,
      dome: 0xC89B5C,
      window: 0x4A8AC0,
      door: 0x3E2318,
      tree: 0x5A7A4A,
      stone: 0xE8DECB
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xE8F0F8, 35, 90);

    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 400);
    camera.position.set(32, 26, 32);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // === תאורה רכה ומכובדת ===
    scene.add(new THREE.HemisphereLight(0xE8F4FF, 0xC8B48A, 0.65));

    const sun = new THREE.DirectionalLight(0xFFF8E7, 1.1);
    sun.position.set(25, 35, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xD4E8FF, 0.35);
    fill.position.set(-20, 25, -15);
    scene.add(fill);

    // === קרקע ===
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(55, 55),
      new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // === בניינים (גרסה משודרגת) ===
    // בניין תפילה מרכזי עם כיפה
    const prayer = createMainBuilding(COLORS);
    scene.add(prayer);

    // בית מדרש
    const midrash = createBuilding(COLORS, 7, 4.8, 9, 0xF5EFE6);
    midrash.position.set(13, 0, 0);
    scene.add(midrash);

    // מקווה
    const mikveh = createBuilding(COLORS, 5.5, 3.8, 6.5, 0xF5EFE6);
    mikveh.position.set(-13, 0, 0);
    scene.add(mikveh);

    // אולם קהילה
    const community = createBuilding(COLORS, 8, 3.2, 5.5, 0xF5EFE6);
    community.position.set(0, 0, 13);
    scene.add(community);

    // מרכז חסד
    const chesed = createBuilding(COLORS, 5.5, 3.2, 4.5, 0xF5EFE6);
    chesed.position.set(0, 0, -13);
    scene.add(chesed);

    // עצים עדינים
    createCalmTrees(scene, COLORS);

    // === מצלמה רגועה ===
    let targetX = 0, targetY = 4, targetZ = 0;
    let currentX = 32, currentY = 26, currentZ = 32;

    function animate() {
      requestAnimationFrame(animate);

      // תנועה רגועה של המצלמה
      currentX += (targetX - currentX) * 0.015;
      currentY += (targetY - currentY) * 0.015;
      currentZ += (targetZ - currentZ) * 0.015;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.position.z = currentZ;
      camera.lookAt(targetX, targetY, targetZ);

      renderer.render(scene, camera);
    }
    animate();

    // הסתר Loader
    if (loader) loader.style.display = 'none';

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    console.log('%c[כזוהר הרקיע] מודל מכובד נטען בהצלחה', 'color:#C89B5C');
  }

  // === פונקציות עזר ===
  function createMainBuilding(C) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(9, 5.5, 7), new THREE.MeshStandardMaterial({ color: C.wall }));
    base.position.y = 2.75;
    base.castShadow = true;
    g.add(base);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color: C.dome, metalness: 0.5, roughness: 0.3 }));
    dome.position.y = 7;
    g.add(dome);

    return g;
  }

  function createBuilding(C, w, h, d, color) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color }));
    base.position.y = h / 2;
    base.castShadow = true;
    g.add(base);
    return g;
  }

  function createCalmTrees(scene, C) {
    const positions = [[-18, -18], [18, -18], [-18, 18], [18, 18], [-10, 14], [10, 14], [-14, -10], [14, -10]];
    positions.forEach(([x, z]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.4, 8), new THREE.MeshStandardMaterial({ color: C.stone }));
      trunk.position.set(x, 0.7, z);
      scene.add(trunk);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 8), new THREE.MeshStandardMaterial({ color: C.tree }));
      foliage.position.set(x, 2.4, z);
      scene.add(foliage);
    });
  }
})();
