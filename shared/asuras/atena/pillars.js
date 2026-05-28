import * as THREE from 'three';

export function initPillars(scene, config) {
    function createGoldenPillar(x, z, height = 1.3) {
        const group = new THREE.Group();
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, height, 8), new THREE.MeshStandardMaterial({ color: 0xcc8800, emissive: 0xaa6600, emissiveIntensity: 0.2, metalness: 0.8 }));
        pillar.position.y = 0;
        group.add(pillar);
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 16, 32), new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.3 }));
        ring.position.y = height / 2;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        const topCrystal = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 8), new THREE.MeshStandardMaterial({ color: config.color, emissive: 0xffcc66, emissiveIntensity: 0.3 }));
        topCrystal.position.y = height / 2 + 0.05;
        group.add(topCrystal);
        
        group.position.set(x, -0.4, z);
        return group;
    }
    
    const pillarPositions = [
        [-2.8, -2.5], [2.8, -2.5], [-2.8, 2.5], [2.8, 2.5],
        [-2, -3.2], [2, -3.2], [-3.2, -1.8], [3.2, -1.8],
        [-3.2, 1.8], [3.2, 1.8], [-2, 3.2], [2, 3.2]
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = createGoldenPillar(pos[0], pos[1], 1.0 + Math.random() * 0.4);
        scene.add(pillar);
    });
}