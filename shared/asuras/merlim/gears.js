import * as THREE from 'three';

export function initGears(scene) {
    const gearMaterial = new THREE.MeshStandardMaterial({ color: 0x44aaff, metalness: 0.9, roughness: 0.2 });
    
    function createGear(x, z, yOffset, size = 0.15) {
        const gear = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 0.05, 12), gearMaterial);
        gear.position.set(x, yOffset, z);
        return gear;
    }
    
    const gearPositions = [
        [-1.2, 0.4, 1.5], [1.2, 0.4, 1.5], [-1.5, 0.6, -1.2], [1.5, 0.6, -1.2],
        [-0.8, 0.3, 2.2], [0.8, 0.3, 2.2], [2.2, 0.5, -0.8], [-2.2, 0.5, 0.8]
    ];
    
    gearPositions.forEach(pos => {
        const gear = createGear(pos[0], pos[2], pos[1], 0.12 + Math.random() * 0.08);
        scene.add(gear);
    });
}