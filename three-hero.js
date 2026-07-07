/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — Sacred Light Rays
   Slow, silent, meditative rays of desert gold
   ═══════════════════════════════════════════════════════ */

import * as THREE from 'three';

(() => {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ═══ SACRED LIGHT RAYS ═══ */
  const rayCount = 7; // Sacred number
  const rays = [];

  // Create ray texture — soft elongated glow
  const rayCanvas = document.createElement('canvas');
  rayCanvas.width = 128;
  rayCanvas.height = 512;
  const rctx = rayCanvas.getContext('2d');
  const rGrad = rctx.createLinearGradient(64, 0, 64, 512);
  rGrad.addColorStop(0, 'rgba(240, 220, 170, 0)');
  rGrad.addColorStop(0.15, 'rgba(230, 200, 140, 0.4)');
  rGrad.addColorStop(0.5, 'rgba(220, 185, 120, 0.6)');
  rGrad.addColorStop(0.85, 'rgba(200, 155, 92, 0.3)');
  rGrad.addColorStop(1, 'rgba(180, 130, 70, 0)');
  rctx.fillStyle = rGrad;

  // Add horizontal fade to make it beam-like
  const horizGrad = rctx.createLinearGradient(0, 256, 128, 256);
  horizGrad.addColorStop(0, 'rgba(0,0,0,0)');
  horizGrad.addColorStop(0.5, 'rgba(0,0,0,1)');
  horizGrad.addColorStop(1, 'rgba(0,0,0,0)');
  rctx.globalCompositeOperation = 'source-over';
  rctx.fillRect(0, 0, 128, 512);
  rctx.globalCompositeOperation = 'destination-in';
  rctx.fillStyle = horizGrad;
  rctx.fillRect(0, 0, 128, 512);

  const rayTexture = new THREE.CanvasTexture(rayCanvas);

  for (let i = 0; i < rayCount; i++) {
    const rayMat = new THREE.SpriteMaterial({
      map: rayTexture,
      transparent: true,
      opacity: 0.12 + Math.random() * 0.08,
      blending: THREE.AdditiveBlending,
      color: i % 2 === 0 ? 0xC89B5C : 0xDDB578,
      depthWrite: false
    });

    const ray = new THREE.Sprite(rayMat);
    const scale = 25 + Math.random() * 20;
    ray.scale.set(scale * 0.4, scale * 3, 1);

    // Symmetric distribution — from top center outward
    const angle = ((i / (rayCount - 1)) - 0.5) * 1.4; // -0.7 to 0.7 radians
    const distance = 45;
    ray.position.set(
      Math.sin(angle) * distance,
      20 - Math.cos(angle) * 15,
      -10
    );

    // Slight rotation to face outward
    ray.material.rotation = angle * 0.5;

    rays.push({
      sprite: ray,
      baseOpacity: rayMat.opacity,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.3
    });
    scene.add(ray);
  }

  /* ═══ SUBTLE SKY DEPTH — very few, very distant, very still stars ═══ */
  const starCount = 40; // Much less than before, more spacious
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPos[i3]     = (Math.random() - 0.5) * 220;
    starPos[i3 + 1] = (Math.random() - 0.5) * 140;
    starPos[i3 + 2] = -80 - Math.random() * 40;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

  const starSprite = document.createElement('canvas');
  starSprite.width = starSprite.height = 32;
  const stctx = starSprite.getContext('2d');
  const sgrad = stctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  sgrad.addColorStop(0, 'rgba(255, 250, 240, 0.9)');
  sgrad.addColorStop(0.4, 'rgba(220, 210, 190, 0.4)');
  sgrad.addColorStop(1, 'rgba(200, 155, 92, 0)');
  stctx.fillStyle = sgrad;
  stctx.fillRect(0, 0, 32, 32);
  const starTex = new THREE.CanvasTexture(starSprite);

  const starMat = new THREE.PointsMaterial({
    map: starTex,
    size: 0.9,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xEDE0C4,
    opacity: 0.35,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ═══ Mouse tilt — extremely subtle ═══ */
  let mouseX = 0, mouseY = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ═══ Animate — slow, meditative ═══ */
  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();

    // Rays: slow gentle breathing (opacity + tiny vertical drift)
    rays.forEach((r) => {
      const wave = Math.sin(t * r.speed + r.phase);
      r.sprite.material.opacity = r.baseOpacity + wave * 0.06;
      r.sprite.position.y += Math.sin(t * 0.15 + r.phase) * 0.008;
    });

    // Stars: almost static, ultra-slow rotation
    stars.rotation.z = t * 0.003;

    // Camera: whisper-soft tilt (much less than before)
    tx += (mouseX * 1.2 - tx) * 0.02;
    ty += (mouseY * 0.8 - ty) * 0.02;
    camera.position.x = tx;
    camera.position.y = -ty;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
