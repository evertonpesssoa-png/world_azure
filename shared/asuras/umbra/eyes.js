import * as THREE from 'three';

export function initEyes(scene, config) {
    function createWatchfulEye(x, z, yOffset) {
        const group = new THREE.Group();
        const eyeBase = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0xaa55ff, emissive: config.color, emissiveIntensity: 0.4 }));
        group.add(eyeBase);
        
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.2 }));
        pupil.position.z = 0.1;
        group.add(pupil);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    const eyePositions = [
        [-1.2, 1.3, 1.8], [1.2, 1.3, 1.8],
        [-1.5, 1.1, -1.6], [1.5, 1.1, -1.6],
        [-2, 1.4, 0.8], [2, 1.4, 0.8],
        [0.8, 1.2, -2.2], [-0.8, 1.2, -2.2]
    ];
    
    eyePositions.forEach(pos => {
        const eye = createWatchfulEye(pos[0], pos[2], pos[1]);
        scene.add(eye);
    });
}