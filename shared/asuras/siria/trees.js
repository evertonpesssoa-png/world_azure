import * as THREE from 'three';

export function initTrees(scene, config) {
    function createSpiritTree(x, z, size = 1) {
        const group = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * size, 0.3 * size, 0.8 * size, 6), new THREE.MeshStandardMaterial({ color: 0x35aa66, emissive: 0x226633, emissiveIntensity: 0.2 }));
        trunk.position.y = 0;
        group.add(trunk);
        
        const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.4 * size, 0.5 * size, 8), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.15 }));
        foliage1.position.y = 0.5 * size;
        group.add(foliage1);
        
        const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.3 * size, 0.4 * size, 8), new THREE.MeshStandardMaterial({ color: 0x55ffaa, emissive: 0x55ffaa, emissiveIntensity: 0.2 }));
        foliage2.position.y = 0.9 * size;
        group.add(foliage2);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const treePositions = [
        [-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5],
        [-1.8, -3], [1.8, -3], [-3, -1.5], [3, -1.5],
        [-3, 1.5], [3, 1.5], [-1.5, 3], [1.5, 3],
        [0, 3.2], [0, -3.2]
    ];
    
    treePositions.forEach(pos => {
        const tree = createSpiritTree(pos[0], pos[1], 0.8 + Math.random() * 0.3);
        scene.add(tree);
    });
}