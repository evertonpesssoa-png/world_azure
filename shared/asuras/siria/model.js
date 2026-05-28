import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel(scene, config, onLoadCallback) {
    const loader = new GLTFLoader();
    let model = null;
    let mixer = null;
    
    loader.load(config.modelPath, (gltf) => {
        model = gltf.scene;
        model.position.set(0, config.modelPositionY, 0);
        model.scale.set(config.modelScale, config.modelScale, config.modelScale);
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        scene.add(model);
        
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach(clip => {
                mixer.clipAction(clip).play();
            });
            console.log(`✅ ${gltf.animations.length} animação(ões) ativada(s)`);
        }
        
        if (onLoadCallback) onLoadCallback(model, mixer);
        console.log('✅ Modelo da SIRIA carregado');
    }, undefined, (error) => {
        console.error('❌ Erro ao carregar modelo:', error);
        const fallback = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.7 }));
        fallback.position.set(0, 0.2, 0);
        scene.add(fallback);
    });
    
    return { model, mixer };
}