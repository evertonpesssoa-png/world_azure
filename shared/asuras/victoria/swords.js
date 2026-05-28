import * as THREE from 'three';

export function initSwords(scene) {
    function createFloatingSword(x, z, yOffset) {
        const group = new THREE.Group();
        const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0xcc3333, metalness: 0.8 }));
        blade.position.y = 0.15;
        group.add(blade);
        
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), new THREE.MeshStandardMaterial({ color: 0xaa0000, metalness: 0.5 }));
        handle.position.y = -0.05;
        group.add(handle);
        
        const crossguard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.08), new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.7 }));
        crossguard.position.y = 0;
        group.add(crossguard);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const swordPositions = [
        [-1.5, 1.0, 1.6], [1.5, 1.0, 1.6],
        [-1.6, 0.9, -1.5], [1.6, 0.9, -1.5],
        [-2.2, 1.1, 0.5], [2.2, 1.1, 0.5],
        [0.5, 1.2, -2.2], [-0.5, 1.2, -2.2]
    ];
    
    swordPositions.forEach(pos => {
        const sword = createFloatingSword(pos[0], pos[2], pos[1]);
        scene.add(sword);
    });
}