import * as THREE from 'three';

export function initGlasses(scene) {
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xcc88ff, metalness: 0.7 });
    
    function createMagnifyingGlass(x, z, yOffset) {
        const group = new THREE.Group();
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6), glassMaterial);
        handle.position.y = -0.15;
        group.add(handle);
        
        const ringGlass = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 16, 32), glassMaterial);
        ringGlass.position.y = 0;
        group.add(ringGlass);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const glassPositions = [
        [-1.8, 0.6, 1.2], [1.8, 0.6, 1.2],
        [-1.5, 0.5, -1.8], [1.5, 0.5, -1.8],
        [0, 0.7, 2.2], [0, 0.7, -2.2]
    ];
    
    glassPositions.forEach(pos => {
        const glass = createMagnifyingGlass(pos[0], pos[2], pos[1]);
        scene.add(glass);
    });
}