import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x113333, 0.45);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xaaffee, 0.9);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.75);
    fillLight.position.set(1.5, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0x44ffaa, 0.45);
    backLight.position.set(-2, 1.8, -3);
    scene.add(backLight);
    
    const labLight = new THREE.PointLight(0x88ffee, 0.4);
    labLight.position.set(0, 1.2, 1);
    scene.add(labLight);
    
    return { fillLight, labLight };
}