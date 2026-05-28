import * as THREE from 'three';

export function initPillars(scene, config) {
    function createHellPillar(x, z, height = 1.3) {
        const group = new THREE.Group();
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, height, 8), new THREE.MeshStandardMaterial({ color: 0x990000, emissive: 0x440000, emissiveIntensity: 0.3, metalness: 0.6 }));
        pillar.position.y = 0;
        group.add(pillar);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 16, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: 0xcc0000, emissiveIntensity: 0.35 }));
        ring.position.y = height / 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        const flameTop = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: config.color, emissiveIntensity: 0.4 }));
        flameTop.position.y = height / 2 + 0.08;
        group.add(flameTop);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const pillarPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = createHellPillar(pos[0], pos[1], 1.0 + Math.random() * 0.4);
        scene.add(pillar);
    });
}