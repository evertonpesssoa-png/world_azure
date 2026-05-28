import * as THREE from 'three';

export function initPillars(scene, config) {
    const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x331177, emissive: 0x5511aa, emissiveIntensity: 0.15, metalness: 0.5 });
    
    function createShadowPillar(x, z, height = 1.3) {
        const group = new THREE.Group();
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, height, 8), pillarMaterial);
        pillar.position.y = 0;
        group.add(pillar);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 16, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: 0xaa55ff, emissiveIntensity: 0.25 }));
        ring.position.y = height / 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const pillarPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = createShadowPillar(pos[0], pos[1], 1.0 + Math.random() * 0.4);
        scene.add(pillar);
    });
}