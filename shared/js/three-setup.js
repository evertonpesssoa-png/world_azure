import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let time = 0;
let deltaTime = 0.016;
let lastTime = performance.now();

export function initThree(config) {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.bgColor || 0x050510);
    scene.fog = new THREE.FogExp2(config.bgColor || 0x050510, 0.008);
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(config.cameraPosition?.x || 3, config.cameraPosition?.y || 2, config.cameraPosition?.z || 4);
    camera.lookAt(0, 0.8, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.target.set(0, 0.8, 0);
    
    return { scene, camera, renderer, controls };
}

export function addBasicLights(scene, color) {
    const ambientLight = new THREE.AmbientLight(0x222240, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(color, 0.7);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0x88aaff, 0.4);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    return { fillLight };
}

export function addGround(scene, color) {
    const gridHelper = new THREE.GridHelper(12, 20, color, 0x333366);
    gridHelper.position.y = -0.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    scene.add(gridHelper);
    
    const groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({ color: 0x0a0512, roughness: 0.7, metalness: 0.3, transparent: true, opacity: 0.4 })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.5;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);
    
    const circleGlow = new THREE.Mesh(
        new THREE.CircleGeometry(1.2, 32),
        new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.3, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    );
    circleGlow.rotation.x = -Math.PI / 2;
    circleGlow.position.y = -0.45;
    scene.add(circleGlow);
    
    return { circleGlow };
}

export function addParticles(scene, color) {
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 12;
        particlePositions[i*3+1] = Math.random() * 4;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: color, size: 0.04, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    return { particles };
}

export function addRings(scene, color) {
    const ringGeometry = new THREE.TorusGeometry(1.0, 0.03, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.5 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 0.2;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    const ring2Geometry = new THREE.TorusGeometry(1.3, 0.02, 64, 200);
    const ring2 = new THREE.Mesh(ring2Geometry, ringMaterial);
    ring2.position.y = 0.1;
    ring2.rotation.x = Math.PI / 2 + 0.3;
    scene.add(ring2);
    
    return { ring, ring2 };
}

export function loadModel(scene, config) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(config.modelPath, (gltf) => {
            const model = gltf.scene;
            model.position.set(0, config.modelPositionY || -0.25, 0);
            model.scale.set(config.modelScale, config.modelScale, config.modelScale);
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            });
            scene.add(model);
            
            let mixer = null;
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach(clip => mixer.clipAction(clip).play());
                console.log(`✅ ${gltf.animations.length} animação(ões) ativada(s)`);
            }
            resolve({ model, mixer });
        }, undefined, (error) => {
            console.error('❌ Erro ao carregar modelo:', error);
            const fallbackModel = new THREE.Mesh(
                new THREE.SphereGeometry(0.7, 32, 32),
                new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.5 })
            );
            fallbackModel.position.set(0, 0.2, 0);
            scene.add(fallbackModel);
            resolve({ model: fallbackModel, mixer: null });
        });
    });
}

export function startAnimation(scene, camera, renderer, controls, extras) {
    let time = 0;
    let deltaTime = 0.016;
    let lastTime = performance.now();
    
    function updateDelta() {
        const now = performance.now();
        deltaTime = Math.min(0.033, (now - lastTime) / 1000);
        lastTime = now;
        requestAnimationFrame(updateDelta);
    }
    updateDelta();
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        
        if (extras.mixer) extras.mixer.update(deltaTime);
        if (extras.particles) {
            extras.particles.rotation.y = time * 0.1;
            extras.particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        }
        if (extras.ring) extras.ring.rotation.z = time * 0.3;
        if (extras.ring2) extras.ring2.rotation.z = -time * 0.2;
        if (extras.fillLight) extras.fillLight.intensity = 0.6 + Math.sin(time * 4) * 0.2;
        if (extras.circleGlow) extras.circleGlow.material.emissiveIntensity = 0.2 + Math.sin(time * 2.5) * 0.15;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}