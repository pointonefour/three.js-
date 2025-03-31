import * as THREE from 'three';
// You might import OrbitControls or other things later like this:
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("Three.js version:", THREE.REVISION);

// --- Basic Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Get the canvas element from HTML
const canvas = document.querySelector('#webgl-canvas');

// Renderer - Pass the canvas element to the renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); // antialias is optional
renderer.setSize(window.innerWidth, window.innerHeight);
// We don't need `document.body.appendChild(renderer.domElement);` because we provided the canvas

// Fix pixelation on high-DPI displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Update pixel ratio too
});

animate();