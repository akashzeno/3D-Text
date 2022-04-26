import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Canvas
const canvas = document.querySelector(".canvas");

// Scene
const scene = new THREE.Scene();

// Size
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

// Group
const donutAndTextGroup = new THREE.Group();

// Font
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetikerTypeface.json", (font) => {
	const textGeometry = new TextGeometry("AkasH Zeno", {
		font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4,
	});
	textGeometry.center();
	const material = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const text = new THREE.Mesh(textGeometry, material);
	donutAndTextGroup.add(text);

	// donut
	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
	const donutRandomXYZ = () => {
		return (Math.random() - 0.5) * 10;
	};
	for (let i = 0; i < 200; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);
		donut.position.set(donutRandomXYZ(), donutRandomXYZ(), donutRandomXYZ());
		donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		donutAndTextGroup.add(donut);
	}
	scene.add(donutAndTextGroup);
});

// Resize
window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen
canvas.addEventListener("dblclick", () => {
	if (canvas.requestFullscreen) {
		(document.fullscreenElement && document.exitFullscreen()) ||
			canvas.requestFullscreen();
	} else if (webkitRequestFullscreen) {
		(document.webkitFullscreenElement && document.webkitExitFullscreen()) ||
			canvas.webkitRequestFullscreen();
	}
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

// Animation
function moveObject() {
	// Clock
	const elapsedTime = clock.getElapsedTime();
	donutAndTextGroup.rotation.y = elapsedTime * 0.2;
	// Render
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(moveObject);
}

moveObject();
