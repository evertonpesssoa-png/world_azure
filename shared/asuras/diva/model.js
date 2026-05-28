import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

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
                
                const isEye = node.name && (
                    node.name.toLowerCase().includes('eye') || 
                    node.name.toLowerCase().includes('olho') ||
                    node.name.toLowerCase().includes('face')
                );
                
                if (node.material) {
                    node.material.roughness = 0.3;
                    node.material.metalness = 0.6;
                    
                    if (isEye) {
                        node.material.emissive = new THREE.Color(0xff66cc);
                        node.material.emissiveIntensity = 0.6;
                        node.material.roughness = 0.2;
                        console.log('✨ Olhos da DIVA com brilho ativado');
                    }
                }
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
        console.log('✅ Modelo da DIVA carregado com iluminação corrigida!');
        
    }, undefined, (error) => {
        console.error('❌ Erro ao carregar modelo:', error);
        const fallback = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.7 }));
        fallback.position.set(0, 0.2, 0);
        scene.add(fallback);
    });
    
    return { model, mixer };
}