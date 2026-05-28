import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x332200, 0.5);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffdd88, 1.2);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.7);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xffaa44, 0.45);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const goldenLight = new THREE.PointLight(0xffcc66, 0.5);
    goldenLight.position.set(0.5, 2.5, 1);
    scene.add(goldenLight);
    
    return { fillLight, goldenLight };
}