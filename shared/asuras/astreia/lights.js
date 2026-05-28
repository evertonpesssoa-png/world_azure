import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x113366, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xaaccff, 1.1);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.8);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0x44aaff, 0.5);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const heavenLight = new THREE.PointLight(0xaaddff, 0.4);
    heavenLight.position.set(2, 2.5, 1.5);
    scene.add(heavenLight);
    
    return { fillLight, heavenLight };
}