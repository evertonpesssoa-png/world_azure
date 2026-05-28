import * as THREE from 'three';

export function initCrystals(scene, config) {
    const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0x88ffaa, emissive: config.color, emissiveIntensity: 0.3, metalness: 0.8 });
    
    const crystalPositions = [
        [1.2, -0.3, 1.5], [-1.2, -0.3, 1.5],
        [1.5, -0.3, -1.2], [-1.5, -0.3, -1.2],
        [0.8, -0.3, 2], [-0.8, -0.3, 2],
        [2, -0.3, 0.8], [-2, -0.3, 0.8]
    ];
    
    crystalPositions.forEach(pos => {
        const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), crystalMaterial);
        crystal.position.set(pos[0], pos[1], pos[2]);
        scene.add(crystal);
    });
}