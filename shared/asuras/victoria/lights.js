import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x330000, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xff4422, 1.1);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.9);
    fillLight.position.set(1, 1.5, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xcc0000, 0.6);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const hellLight = new THREE.PointLight(0xff3300, 0.55);
    hellLight.position.set(0.5, 0.5, 1);
    scene.add(hellLight);
    
    return { fillLight, hellLight };
}