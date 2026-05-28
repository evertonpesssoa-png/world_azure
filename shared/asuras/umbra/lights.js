import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x111122, 0.35);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xaa88ff, 0.7);
    mainLight.position.set(2, 4, 1.5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.5);
    fillLight.position.set(1, 1.5, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xaa44ff, 0.35);
    backLight.position.set(-2, 1.2, -3);
    scene.add(backLight);
    
    const shadowLight = new THREE.PointLight(0x6633aa, 0.3);
    shadowLight.position.set(0.5, 0.8, 1);
    scene.add(shadowLight);
    
    return { fillLight };
}