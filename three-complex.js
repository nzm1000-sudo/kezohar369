/* כזוהר הרקיע - 3D Model (CDN version - works on GitHub Pages) */
(() => {
  const canvas = document.getElementById('complex3DCanvas');
  const loader = document.getElementById('complex3DLoader');
  if (!canvas) return;

  // Load Three.js from CDN
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
  script.onload = () => initThree();
  document.head.appendChild(script);

  function initThree() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 500);
    camera.position.set(28, 24, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Simple ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x9BB88F, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Simple light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 30, 15);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Simple building (box + roof)
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 6),
      new THREE.MeshStandardMaterial({ color: 0xF5EFE6 })
    );
    building.position.y = 2.5;
    scene.add(building);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(5, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0xC89B5C })
    );
    roof.position.y = 6;
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      building.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    // Hide loader
    if (loader) loader.style.display = 'none';

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
  }
})();
