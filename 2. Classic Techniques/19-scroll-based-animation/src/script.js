import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const objectDistance = 4;

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#fff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader();
const gradientTexure = textureLoader.load("textures/gradients/3.jpg");
gradientTexure.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexure,
});
const meshes = [
  new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material),
  new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material),
  new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material),
];

for (let i = 0; i < meshes.length; i++) {
  meshes[i].position.y = -objectDistance * i;
  meshes[i].position.x = i % 2 == 0 ? 2 : -2;
  scene.add(meshes[i]);
}

/**
 * Particles
 */
// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectDistance * 0.5 - Math.random() * objectDistance * meshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
//Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;
    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inout",
      x: "+=6",
      y: "+=3",
      z: "+1.5",
    });
  }
});

/**
 * Cursor
 */
let cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = -cursor.x * 0.25;
  const parallaxY = cursor.y * 0.25;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 3 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 3 * deltaTime;

  // Animate meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
