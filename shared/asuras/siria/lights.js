import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x224422, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xaaffaa, 1.0);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.7);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xffcc44, 0.4);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const spiritLight = new THREE.PointLight(0x44ffaa, 0.3);
    spiritLight.position.set(2, 1, 1.5);
    scene.add(spiritLight);
    
    return { fillLight };
}