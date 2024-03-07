import * as THREE from "three";

const scene = new THREE.Scene();

// camera
const aspectRatio = {
  width: 800,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(
  75,
  aspectRatio.width / aspectRatio.height
);
camera.position.z = 3;
scene.add(camera);

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setSize(aspectRatio.width, aspectRatio.height);
renderer.render(scene, camera);
