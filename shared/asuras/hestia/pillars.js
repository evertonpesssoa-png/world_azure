import * as THREE from 'three';

export function initPillars(scene, config) {
    function createCelestialPillar(x, z, height = 1.3) {
        const group = new THREE.Group();
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, height, 8), new THREE.MeshStandardMaterial({ color: 0x88aacc, emissive: 0x557799, emissiveIntensity: 0.15, metalness: 0.5 }));
        pillar.position.y = 0;
        group.add(pillar);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 16, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: 0xffdd99, emissiveIntensity: 0.25 }));
        ring.position.y = height / 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0xffeedd, emissive: config.color, emissiveIntensity: 0.2 }));
        crystal.position.y = height / 2 + 0.05;
        group.add(crystal);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const pillarPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = createCelestialPillar(pos[0], pos[1], 1.0 + Math.random() * 0.4);
        scene.add(pillar);
    });
}