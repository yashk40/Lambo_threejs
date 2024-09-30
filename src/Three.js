import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

export function initThreeScene(canvas) {
    if (!canvas) {
        console.error('Canvas element is not provided');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15); // Changed from 7 to 15

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minDistance = 5; // Add this line
    controls.maxDistance = 20; // Add this line

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    // Set up EffectComposer
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
        0.5,  // strength
        0.4,  // radius
        0.85  // threshold
    );
    composer.addPass(bloomPass);

    const filmPass = new FilmPass(
        0.35,    // noise intensity
        0.025,   // scanline intensity
        648,     // scanline count
        false    // grayscale
    );
    composer.addPass(filmPass);

    const loader = new GLTFLoader();
    loader.load(
        '/Wheel.glb',
        (gltf) => {
            const model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            scene.add(model);
        },
        undefined,
        (error) => console.error('An error occurred loading the model:', error)
    );

    const handleResize = () => {
        if (canvas.clientWidth && canvas.clientHeight) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            composer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    };

    window.addEventListener('resize', handleResize);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        composer.render();
    }

    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        scene.remove(ambientLight, frontLight);
        composer.dispose();
        renderer.dispose();
        controls.dispose();
    };
}