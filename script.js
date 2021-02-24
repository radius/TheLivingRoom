import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

let controls;

function setupControls(camera, canvas) {
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.screenSpacePanning = false;

    controls.minDistance = 50;
    controls.maxDistance = 100;

    // controls.maxPolarAngle = Math.PI / 2;
    controls.update();
    return controls;
}

function setupGui(camera) {
    const guiItems = {
        camera: {
            xPos: camera.position.x,
            yPos: camera.position.y,
            zPos: camera.position.z,
            xRotation: camera.rotation.x,
            yRotation: camera.rotation.y,
            zRotation: camera.rotation.z,
        },
    };
    var gui = new GUI();
    //camera
    var cam = gui.addFolder('Camera');
    cam.add(camera.position, 'x', -200, 200).name('X pos').listen();
    cam.add(camera.position, 'y', -200, 200).name('Y pos').listen();
    cam.add(camera.position, 'z', -200, 200).name('Z pos').listen();
    cam.add(camera.rotation, 'x', -10, 10).name('X rot').listen();
    cam.add(camera.rotation, 'y', -10, 10).name('Y rot').listen();
    cam.add(camera.rotation, 'z', -10, 10).name('Z rot').listen();
    cam.open();

    var lens = gui.addFolder('Lens');
    gui.add(camera, 'fov', 1, 180).onChange(() => {
        camera.updateProjectionMatrix();
    });
}

function setupScene() {
    // create scene
    const scene = new THREE.Scene();
    const color = 0xffffff;
    const intensity = 1;
    // add some light
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    //create the interior of the cube
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../sides/3.jpg',
        '../sides/6.jpg',
        '../sides/2.jpg',
        '../sides/4.jpg',
        '../sides/5.jpg',
        '../sides/7.jpg',
    ]);
    // texture.flipY = true;
    scene.background = texture;
    return scene;
}

function animate(canvas, scene, camera) {
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(() => {
        if (elementNeedsResizing(renderer.domElement)) {
            const canvas = renderer.domElement;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        controls.update();
        renderer.render(scene, camera);
    });
}
function addCube(scene) {
    const boxWidth = 10;
    const boxHeight = 10;
    const boxDepth = 10;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

function main() {
    const canvas = document.querySelector('#c');
    const fov = 100;
    const aspect = window.innerWidth / window.innerHeight; // the canvas default
    const near = 1;
    const far = 100;
    const scene = setupScene();
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 50);

    // const cube = addCube(scene);
    // setupGui(camera);
    const controls = setupControls(camera, canvas);
    animate(canvas, scene, camera);
}

function elementNeedsResizing(element) {
    const width = element.clientWidth;
    const height = element.clientHeight;
    const needResize =
        element.width !== window.innerWidth ||
        element.height !== window.innerHeight;
    return needResize;
}

main();
