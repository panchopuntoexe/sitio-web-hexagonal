/**
 * Escenas Three.js con modelos 3D giratorios (geometrías de ejemplo).
 * Puedes reemplazar por GLB/GLTF de tus propios escaneos fotogramétricos.
 */
(function () {
  function createScene(containerId, geometryType) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var width = container.offsetWidth;
    var height = Math.max(200, container.offsetHeight || 280);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0d0e14, 0);
    container.appendChild(renderer.domElement);

    // Luz ambiental y direccional
    scene.add(new THREE.AmbientLight(0x404060, 0.8));
    var light = new THREE.DirectionalLight(0x00d4aa, 0.9);
    light.position.set(2, 3, 4);
    scene.add(light);
    var fill = new THREE.DirectionalLight(0x7c3aed, 0.4);
    fill.position.set(-2, -1, 2);
    scene.add(fill);

    // Geometría según tipo
    var geometry;
    if (geometryType === 'torus') {
      geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
    } else {
      geometry = new THREE.IcosahedronGeometry(0.75, 2);
    }

    var material = new THREE.MeshPhongMaterial({
      color: 0x00d4aa,
      specular: 0x333333,
      shininess: 60,
      flatShading: false,
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.008;
      mesh.rotation.x += 0.003;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      var w = container.offsetWidth;
      var h = Math.max(200, container.offsetHeight || 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createScene('canvas-modelo-1', 'torus');
    createScene('canvas-modelo-2', 'icosahedron');
  }
})();
