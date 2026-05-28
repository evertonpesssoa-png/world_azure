import * as THREE from 'three';

export function initGears(scene) {
    function createGear(x, z, yOffset, size = 0.12) {
        const group = new THREE.Group();
        const gear = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x44ccaa, metalness: 0.8 }));
        gear.rotation.z = Math.random() * Math.PI;
        group.add(gear);
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const gearPositions = [
        [-1.5, 0.7, 1.8], [1.5, 0.7, 1.8],
        [-1.6, 0.5, -1.7], [1.6, 0.5, -1.7],
        [-2.2, 0.8, 0.6], [2.2, 0.8, 0.6],
        [0.6, 0.9, -2.2], [-0.6, 0.9, -2.2]
    ];
    
    gearPositions.forEach(pos => {
        const gear = createGear(pos[0], pos[2], pos[1], 0.11 + Math.random() * 0.06);
        scene.add(gear);
    });
}