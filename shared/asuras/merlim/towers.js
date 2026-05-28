import * as THREE from 'three';

export function initTowers(scene, config) {
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x2288cc, emissive: 0x1155aa, emissiveIntensity: 0.2, metalness: 0.8, roughness: 0.2 });
    
    function createTechTower(x, z, height = 1.3) {
        const group = new THREE.Group();
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, height, 8), towerMaterial);
        tower.position.y = 0;
        group.add(tower);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 16, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.3 }));
        ring.position.y = height / 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 16, 32), new THREE.MeshStandardMaterial({ color: 0x66eeff, emissive: config.color, emissiveIntensity: 0.3 }));
        ring2.position.y = height / 3;
        ring2.rotation.x = Math.PI / 2;
        group.add(ring2);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const towerPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    towerPositions.forEach(pos => {
        const tower = createTechTower(pos[0], pos[1], 1.0 + Math.random() * 0.4);
        scene.add(tower);
    });
}