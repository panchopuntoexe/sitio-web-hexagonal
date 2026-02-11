/**
 * Carga y muestra el modelo 3D del cerebro (OBJ). Solo este modelo, girando.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js';

const CONTAINER_ID = 'canvas-cerebro';
const OBJ_DIR = 'assets/models/cerebro/';
const OBJ_FILE = 'texturedMesh.obj';

function createMaterial() {
  return new THREE.MeshPhongMaterial({
    color: 0xE1EBFF,
    specular: 0x8CB4FF,
    shininess: 40,
    flatShading: false,
  });
}

function createBrainScene() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  const width = container.offsetWidth || 400;
  const height = Math.max(280, container.offsetHeight || 320);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0d0e14, 0);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xE1EBFF, 0.7));
  const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
  light1.position.set(3, 3, 5);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0x8CB4FF, 0.4);
  light2.position.set(-2, -1, 3);
  scene.add(light2);

  let mesh = null;

  function fitAndCenter(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    object.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim <= 0) return;
    const scale = 2.2 / maxDim;
    object.scale.setScalar(scale);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (mesh) {
      mesh.rotation.y += 0.008;
      mesh.rotation.x += 0.002;
    }
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = container.offsetWidth || 400;
    const h = Math.max(280, container.offsetHeight || 320);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  const loader = new OBJLoader();
  loader.setPath(OBJ_DIR);

  loader.load(
    OBJ_FILE,
    (group) => {
      const loadingEl = container.querySelector('.canvas-3d-loading');
      if (loadingEl) loadingEl.remove();
      group.traverse((child) => {
        if (child.isMesh) {
          child.material = createMaterial();
        }
      });
      fitAndCenter(group);
      mesh = group;
      scene.add(group);
    },
    undefined,
    (err) => {
      console.warn('Error cargando cerebro:', err);
      const loadingEl = container.querySelector('.canvas-3d-loading');
      if (loadingEl) loadingEl.textContent = 'No se pudo cargar el modelo.';
      const geo = new THREE.IcosahedronGeometry(0.9, 2);
      mesh = new THREE.Mesh(geo, createMaterial());
      scene.add(mesh);
    }
  );
}

function init() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  function tryInit() {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w > 0 && h > 0) {
      createBrainScene();
      return;
    }
    requestAnimationFrame(tryInit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
}

init();
