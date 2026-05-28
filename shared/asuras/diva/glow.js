import * as THREE from 'three';

export function initGlow(scene, config) {
    const glowGeometry = new THREE.SphereGeometry(1.1, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glowHalo = new THREE.Mesh(glowGeometry, glowMaterial);
    glowHalo.position.set(0, 0.5, 0);
    scene.add(glowHalo);
    
    return glowHalo;
}