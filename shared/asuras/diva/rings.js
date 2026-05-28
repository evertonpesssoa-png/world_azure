import * as THREE from 'three';

export function initRings(scene, config) {
    const ringGeometry1 = new THREE.TorusGeometry(1.0, 0.03, 64, 200);
    const ringMaterial1 = new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.position.y = 0.2;
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ringGeometry2 = new THREE.TorusGeometry(1.3, 0.02, 64, 200);
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial1);
    ring2.position.y = 0.1;
    ring2.rotation.x = Math.PI / 2 + 0.3;
    scene.add(ring2);
    
    return { ring1, ring2 };
}