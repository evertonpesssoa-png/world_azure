import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x332233, 0.85);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffaaff, 1.5);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0xff4db8, 1.2);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const bottomLight = new THREE.PointLight(0xff66cc, 0.7);
    bottomLight.position.set(0, -1, 0);
    scene.add(bottomLight);
    
    const frontLight = new THREE.PointLight(0xffaacc, 0.5);
    frontLight.position.set(0, 1, 2);
    scene.add(frontLight);
    
    const backLight = new THREE.PointLight(0x44aaff, 0.5);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const warmLight = new THREE.PointLight(0xffaa66, 0.4);
    warmLight.position.set(2, 1, 1.5);
    scene.add(warmLight);
    
    return { fillLight, bottomLight, frontLight };
}