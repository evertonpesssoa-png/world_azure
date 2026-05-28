import * as THREE from 'three';

export function initRings(scene, config) {
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.04, 64, 200);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.5 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 0.15;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    const ring2Geometry = new THREE.TorusGeometry(1.55, 0.032, 64, 200);
    const ring2Material = new THREE.MeshStandardMaterial({ color: 0x66ffdd, emissive: 0x44ffcc, emissiveIntensity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.position.y = 0.05;
    ring2.rotation.x = Math.PI / 2 + 0.3;
    scene.add(ring2);
    
    return { ring, ring2 };
}