/**
 * Carga y muestra modelos 3D desde assets: cerebro (OBJ) y torso (FBX).
 * Usa Three.js ESM desde CDN.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js';

// Rutas relativas al HTML (funcionan en local y en GitHub Pages)
const ASSETS = 'assets';

function createMaterial() {
  return new THREE.MeshPhongMaterial({
    color: 0xE1EBFF,
    specular: 0x8CB4FF,
    shininess: 40,
    flatShading: false,
  });
}

function createScene(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.offsetWidth;
  const height = Math.max(240, container.offsetHeight || 280);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0d0e14, 0);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xE1EBFF, 0.6));
  const light = new THREE.DirectionalLight(0xE1EBFF, 0.9);
  light.position.set(2, 3, 4);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0x8CB4FF, 0.4);
  fill.position.set(-2, -1, 2);
  scene.add(fill);

  let mesh = null;

  function fitAndCenter(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    object.position.sub(center);
    const scale = 1.8 / maxDim;
    object.scale.setScalar(scale);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (mesh) {
      mesh.rotation.y += 0.006;
      mesh.rotation.x += 0.002;
    }
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = container.offsetWidth;
    const h = Math.max(240, container.offsetHeight || 280);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  if (options.type === 'obj') {
    const loader = new OBJLoader();
    loader.load(options.url, (group) => {
      group.traverse((child) => {
        if (child.isMesh) {
          child.material = createMaterial();
        }
      });
      fitAndCenter(group);
      mesh = group;
      scene.add(group);
    }, undefined, (err) => {
      console.warn('Error cargando OBJ:', err);
      addFallbackGeometry();
    });
  } else if (options.type === 'fbx') {
    const loader = new FBXLoader();
    loader.load(options.url, (group) => {
      group.traverse((child) => {
        if (child.isMesh) {
          child.material = createMaterial();
        }
      });
      fitAndCenter(group);
      mesh = group;
      scene.add(group);
    }, undefined, (err) => {
      console.warn('Error cargando FBX:', err);
      addFallbackGeometry();
    });
  }

  function addFallbackGeometry() {
    const geo = new THREE.IcosahedronGeometry(0.8, 2);
    mesh = new THREE.Mesh(geo, createMaterial());
    scene.add(mesh);
  }
}

function init() {
  createScene('canvas-modelo-1', {
    type: 'obj',
    url: ASSETS + '/models/cerebro/texturedMesh.obj',
  });
  createScene('canvas-modelo-2', {
    type: 'fbx',
    url: ASSETS + '/models/torso/TorsoSagital1.fbx',
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
