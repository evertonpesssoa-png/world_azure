import * as THREE from 'three';

export function initLaurel(scene) {
    const laurelRingGeometry = new THREE.TorusGeometry(1.35, 0.045, 64, 200);
    const laurelMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff6600, emissiveIntensity: 0.4, metalness: 0.9 });
    const laurelRing = new THREE.Mesh(laurelRingGeometry, laurelMaterial);
    laurelRing.position.y = 0.2;
    laurelRing.rotation.x = Math.PI / 2;
    scene.add(laurelRing);
    
    return laurelRing;
}