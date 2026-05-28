import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x112244, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xaaddff, 1.1);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.8);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0x3388ff, 0.5);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const techLight = new THREE.PointLight(0x66eeff, 0.4);
    techLight.position.set(2, 1.5, 1.5);
    scene.add(techLight);
    
    return { fillLight };
}