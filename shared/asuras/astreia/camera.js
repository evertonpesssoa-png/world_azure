import * as THREE from 'three';

export function initCameras(scene) {
    function createSecurityCamera(x, z, yOffset = 0.8) {
        const group = new THREE.Group();
        
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.2), new THREE.MeshStandardMaterial({ color: 0x2288cc, metalness: 0.8 }));
        group.add(body);
        
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0xff3366, emissive: 0xff3366, emissiveIntensity: 0.3 }));
        lens.position.z = 0.12;
        group.add(lens);
        
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 6), new THREE.MeshStandardMaterial({ color: 0x44aaff, metalness: 0.6 }));
        base.position.y = -0.1;
        group.add(base);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const cameraPositions = [
        [-1.5, 1.2, 1.8], [1.5, 1.2, 1.8],
        [-1.8, 1.2, -1.5], [1.8, 1.2, -1.5],
        [-2.2, 1.5, 0.5], [2.2, 1.5, 0.5],
        [0.5, 1.5, -2.2], [-0.5, 1.5, -2.2]
    ];
    
    cameraPositions.forEach(pos => {
        const cam = createSecurityCamera(pos[0], pos[2], pos[1]);
        scene.add(cam);
    });
}