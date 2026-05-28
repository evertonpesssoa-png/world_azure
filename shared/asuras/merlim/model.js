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
                node.receiveShadow = false;
            }
        });
        scene.add(model);
        
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
            console.log(`✅ ${gltf.animations.length} animação(ões) ativada(s)`);
        }
        
        if (onLoadCallback) onLoadCallback(model, mixer);
        console.log('✅ Modelo do MERLIM carregado');
    }, undefined, (error) => {
        console.error('❌ Erro ao carregar modelo:', error);
        const fallbackModel = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 }));
        fallbackModel.position.set(0, 0.2, 0);
        scene.add(fallbackModel);
        const techRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 32, 60), new THREE.MeshStandardMaterial({ color: 0x66eeff, emissive: config.color, emissiveIntensity: 0.4 }));
        techRing.position.set(0, 0.5, 0);
        techRing.rotation.x = Math.PI / 2;
        scene.add(techRing);
    });
    
    return { model, mixer };
}