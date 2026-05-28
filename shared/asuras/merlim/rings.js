import * as THREE from 'three';

export function initRings(scene, config) {
    const ringGeometry1 = new THREE.TorusGeometry(1.2, 0.035, 64, 200);
    const ringMaterial1 = new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    ring1.position.y = 0.15;
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ringGeometry2 = new THREE.TorusGeometry(1.5, 0.03, 64, 200);
    const ringMaterial2 = new THREE.MeshStandardMaterial({ color: 0x66eeff, emissive: config.color, emissiveIntensity: 0.4 });
    const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ring2.position.y = 0.05;
    ring2.rotation.x = Math.PI / 2 + 0.3;
    scene.add(ring2);
    
    const ringGeometry3 = new THREE.TorusGeometry(0.9, 0.025, 64, 200);
    const ring3 = new THREE.Mesh(ringGeometry3, ringMaterial1);
    ring3.position.y = 0.25;
    ring3.rotation.x = Math.PI / 2 - 0.2;
    scene.add(ring3);
    
    return { ring1, ring2, ring3 };
}