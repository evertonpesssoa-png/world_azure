import * as THREE from 'three';

export function initRings(scene, config) {
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.035, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.45 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 0.15;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    const ring2Geometry = new THREE.TorusGeometry(1.5, 0.03, 64, 200);
    const ring2Material = new THREE.MeshStandardMaterial({ color: 0xaa55ff, emissive: 0x7733cc, emissiveIntensity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.position.y = 0.05;
    ring2.rotation.x = Math.PI / 2 + 0.3;
    scene.add(ring2);
    
    return { ring, ring2 };
}