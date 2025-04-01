import * as THREE from 'three'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- 1. Select the canvas element ---
const canvas = document.querySelector('#webgl-canvas');
if (!canvas) {
    console.error("Could not find canvas element with id 'webgl-canvas'");
}

// --- 2. Basic Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00B1FF); // Set background color

// --- 3. Camera ---
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(2, 3, 10); // Adjusted for better view
camera.rotation.set(0, Math.PI / 4, 0);

// --- 4. Renderer ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 5. Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// --- 6. Load Blender Model ---
const loader = new GLTFLoader();
let model;
loader.load('pod_mic.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
    
    // Compute model size and center
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Reposition camera to fit model
    camera.position.set(center.x, center.y, size * 1);
    camera.lookAt(center);

    console.log("Model loaded and camera adjusted.");
}, undefined, function (error) {
    console.error("Error loading model:", error);
});

// --- 7. OrbitControls (Mouse Rotation & Zoom) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth rotation
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 100;

// --- 8. Animation Loop (Auto Rotate + Bobbing Motion) ---
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        time += 0.02; // Controls speed of bobbing
        model.position.x = Math.sin(time) * 0.4; // Slight left-right motion
        model.rotation.y += 0.00; // Slow rotation
    }
    
    controls.update(); // Ensure smooth damping
    renderer.render(scene, camera);
}

let isPanning = false;
let startX, startY;

window.addEventListener("mousedown", (event) => {
    if (event.button === 2) { // Middle mouse button
        isPanning = true;
        startX = event.clientX;
        startY = event.clientY;
    }
});

window.addEventListener("mousemove", (event) => {
    if (isPanning) {
        const deltaX = (event.clientX - startX) * 0.01; // Adjust sensitivity
        const deltaY = (event.clientY - startY) * 0.01;

        camera.position.x -= deltaX;
        camera.position.y += deltaY;
        camera.position.Z += deltaY;

        startX = event.clientX;
        startY = event.clientY;
    }
});

window.addEventListener("mouseup", () => {
    isPanning = false;
});

window.addEventListener("contextmenu",(event) => event.preventDefault());

// --- 9. Handle Window Resizing ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- 10. Start Animation ---
animate();

console.log("Three.js model viewer setup complete.");
