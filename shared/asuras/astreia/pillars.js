import * as THREE from 'three';

export function initPillars(scene, config) {
    const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x2266aa, emissive: 0x1155aa, emissiveIntensity: 0.2, metalness: 0.7 });
    
    function createPillar(x, z, height = 1.2) {
        const group = new THREE.Group();
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, height, 8), pillarMaterial);
        pillar.position.y = 0;
        group.add(pillar);
        
        const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 16, 32), new THREE.MeshStandardMaterial({ color: 0x44aaff, emissive: config.color, emissiveIntensity: 0.3 }));
        topRing.position.y = height / 2;
        topRing.rotation.x = Math.PI / 2;
        group.add(topRing);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const pillarPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = createPillar(pos[0], pos[1], 1.0 + Math.random() * 0.3);
        scene.add(pillar);
    });
}