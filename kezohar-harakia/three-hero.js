import * as THREE from 'three';

const canvas = document.getElementById('heroCanvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!canvas || prefersReducedMotion) {
  if (canvas) canvas.style.display = 'none';
} else {
  initHeroScene(canvas);
}

function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 8;

  const group = new THREE.Group();
  scene.add(group);

  const goldColor = 0xB8860B;
  const material = new THREE.LineBasicMaterial({
    color: goldColor,
    transparent: true,
    opacity: 0.1,
  });

  const starShape = createStarOfDavidGeometry(2.4);
  const wireframe = new THREE.LineSegments(starShape, material);
  group.add(wireframe);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.008, 8, 64),
    material.clone()
  );
  innerRing.material.opacity = 0.06;
  group.add(innerRing);

  starShape.dispose();

  let animationId = null;
  let isVisible = true;

  function resize() {
    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    group.rotation.y += 0.0012;
    group.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
    innerRing.rotation.z += 0.0008;

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  resize();
  animate();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting; },
    { threshold: 0.05 }
  );
  visibilityObserver.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && !animationId) {
      animate();
    }
  });
}

function createStarOfDavidGeometry(size) {
  const geometry = new THREE.BufferGeometry();
  const points = [];

  const triangleUp = getEquilateralTriangle(size, 0);
  const triangleDown = getEquilateralTriangle(size, Math.PI);

  for (let i = 0; i < 3; i++) {
    points.push(
      triangleUp[i].x, triangleUp[i].y, 0,
      triangleUp[(i + 1) % 3].x, triangleUp[(i + 1) % 3].y, 0
    );
    points.push(
      triangleDown[i].x, triangleDown[i].y, 0,
      triangleDown[(i + 1) % 3].x, triangleDown[(i + 1) % 3].y, 0
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

function getEquilateralTriangle(radius, rotation) {
  const vertices = [];
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (i * 2 * Math.PI) / 3 - Math.PI / 2;
    vertices.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  return vertices;
}