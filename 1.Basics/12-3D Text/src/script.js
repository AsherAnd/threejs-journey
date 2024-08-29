import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/4.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello World!", {
    font: font,
    size: 0.5,
    depth: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );

  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;

  const text = new THREE.Mesh(textGeometry, material);

  const spaceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  for (let i = 0; i < 400; i++) {
    const spaceMesh = new THREE.Mesh(spaceGeometry, material);

    spaceMesh.position.x = (Math.random() - 0.5) * 5;
    spaceMesh.position.y = (Math.random() - 0.5) * 5;
    spaceMesh.position.z = (Math.random() - 0.5) * 5;

    if (
      spaceMesh.position.x > textGeometry.boundingBox.min.x &&
      textGeometry.boundingBox.max.x
    ) {
      spaceMesh.position.x = (Math.random() - 0.5) * 10;
    }
    if (
      spaceMesh.position.y > textGeometry.boundingBox.min.y &&
      textGeometry.boundingBox.max.y
    ) {
      spaceMesh.position.y = (Math.random() - 0.5) * 10;
    }
    if (
      spaceMesh.position.z > textGeometry.boundingBox.min.z &&
      textGeometry.boundingBox.max.z
    ) {
      spaceMesh.position.z = (Math.random() - 0.5) * 10;
    }

    // spaceMesh.rotation.x = Math.random() * Math.PI;
    // spaceMesh.rotation.z = Math.random() * Math.PI;

    const scale = Math.random();
    spaceMesh.scale.set(scale, scale, scale);

    scene.add(spaceMesh);
  }

  scene.add(text);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
