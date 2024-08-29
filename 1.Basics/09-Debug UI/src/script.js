import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

window.addEventListener("keydown", (e) => {
  if (e.key == "v") {
    gui.show(gui._hidden);
  }
});

/**
 * Debug
 */
const gui = new GUI({ title: "Change" });
gui.hide();
const debugParameters = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugParameters.color = "#ff0000";

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugParameters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const cubeChanges = gui.addFolder("Cube");
// cubeChanges.close();
cubeChanges.add(mesh.position, "y", -3, 3, 0.01).name("Elevation");
cubeChanges.add(mesh, "visible").name("Visibility");
cubeChanges.add(mesh.material, "wireframe").name("Wireframe");
cubeChanges
  .addColor(debugParameters, "color")
  .name("Color")
  .onChange(() => {
    mesh.material.color.set(debugParameters.color);
  });

debugParameters.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(debugParameters, "spin").name("Spin");

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
