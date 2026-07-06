/* ═══════════════════════════════════════════════════════
   כזוהר הרקיע — Three.js Sacred Particle Sky
   Golden dust · Sky-blue stars · Symmetric radial glow
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

  /* ── Golden dust particles ── */
  const dustCount = 400;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustVel = new Float32Array(dustCount * 3);
  const dustSize = new Float32Array(dustCount);

  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    // Symmetric distribution
    const angle = (i / dustCount) * Math.PI * 2;
    const radius = 20 + Math.random() * 60;
    dustPos[i3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
    dustPos[i3 + 1] = Math.sin(angle) * radius * 0.5 + (Math.random() - 0.5) * 20;
    dustPos[i3 + 2] = (Math.random() - 0.5) * 40;

    dustVel[i3]     = (Math.random() - 0.5) * 0.02;
    dustVel[i3 + 1] = Math.random() * 0.03 + 0.01;
    dustVel[i3 + 2] = (Math.random() - 0.5) * 0.02;

    dustSize[i] = Math.random() * 1.5 + 0.5;
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSize, 1));

  // Circular sprite texture
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 64;
  const sctx = spriteCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 240, 200, 1)');
  grad.addColorStop(0.3, 'rgba(230, 200, 140, .8)');
  grad.addColorStop(1, 'rgba(184, 147, 90, 0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);
  const spriteTex = new THREE.CanvasTexture(spriteCanvas);

  const dustMat = new THREE.PointsMaterial({
    map: spriteTex,
    size: 1.6,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xC9A55C,
    opacity: 0.85,
    sizeAttenuation: true
  });

  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ── Sky-blue star cluster ── */
  const starCount = 150;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPos[i3]     = (Math.random() - 0.5) * 200;
    starPos[i3 + 1] = (Math.random() - 0.5) * 120;
    starPos[i3 + 2] = -50 - Math.random() * 40;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

  const starSprite = document.createElement('canvas');
  starSprite.width = starSprite.height = 32;
  const stctx = starSprite.getContext('2d');
  const sgrad = stctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  sgrad.addColorStop(0, 'rgba(220, 235, 245, 1)');
  sgrad.addColorStop(0.4, 'rgba(184, 207, 222, .7)');
  sgrad.addColorStop(1, 'rgba(184, 207, 222, 0)');
  stctx.fillStyle = sgrad;
  stctx.fillRect(0, 0, 32, 32);
  const starTex = new THREE.CanvasTexture(starSprite);

  const starMat = new THREE.PointsMaterial({
    map: starTex,
    size: 1.2,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xB8CFDE,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ── Mouse tilt ── */
  let mouseX = 0, mouseY = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── Animate ── */
  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    const positions = dustGeo.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      positions[i3]     += dustVel[i3];
      positions[i3 + 1] += dustVel[i3 + 1];
      positions[i3 + 2] += dustVel[i3 + 2];
      // Wrap around vertically for continuous flow
      if (positions[i3 + 1] > 80) positions[i3 + 1] = -80;
      if (positions[i3 + 1] < -80) positions[i3 + 1] = 80;
      if (positions[i3] > 100) positions[i3] = -100;
      if (positions[i3] < -100) positions[i3] = 100;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // Twinkle stars
    stars.rotation.z = t * 0.02;
    dust.rotation.z = t * 0.01;

    // Smooth camera tilt
    tx += (mouseX * 3 - tx) * 0.03;
    ty += (mouseY * 2 - ty) * 0.03;
    camera.position.x = tx;
    camera.position.y = -ty;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
