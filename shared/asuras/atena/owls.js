import * as THREE from 'three';

export function initOwls(scene, config) {
    function createOwlSymbol(x, z, yOffset) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: config.color, emissive: 0xcc8800, emissiveIntensity: 0.2 }));
        group.add(body);
        
        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: config.color, emissiveIntensity: 0.3 }));
        leftEye.position.set(-0.06, 0.05, 0.12);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: config.color, emissiveIntensity: 0.3 }));
        rightEye.position.set(0.06, 0.05, 0.12);
        group.add(rightEye);
        
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), new THREE.MeshStandardMaterial({ color: 0xffaa44 }));
        beak.position.set(0, -0.02, 0.14);
        group.add(beak);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const owlPositions = [
        [-1.5, 1.0, 1.6], [1.5, 1.0, 1.6],
        [-1.6, 0.9, -1.5], [1.6, 0.9, -1.5],
        [-2.2, 1.1, 0.5], [2.2, 1.1, 0.5],
        [0.5, 1.2, -2.2], [-0.5, 1.2, -2.2]
    ];
    
    owlPositions.forEach(pos => {
        const owl = createOwlSymbol(pos[0], pos[2], pos[1]);
        scene.add(owl);
    });
}