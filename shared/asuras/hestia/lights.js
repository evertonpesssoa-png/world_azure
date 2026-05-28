import * as THREE from 'three';

export function initLights(scene, config) {
    const ambientLight = new THREE.AmbientLight(0x223344, 0.55);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffeecc, 1.1);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(config.color, 0.65);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xaaccff, 0.4);
    backLight.position.set(-2, 1.5, -3);
    scene.add(backLight);
    
    const divineLight = new THREE.PointLight(0xffeedd, 0.5);
    divineLight.position.set(0.5, 2.5, 1);
    scene.add(divineLight);
    
    return { fillLight, divineLight };
}