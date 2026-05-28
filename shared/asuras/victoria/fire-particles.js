import * as THREE from 'three';

export function initFireParticles(scene) {
    const fireCount = 2000;
    const fireGeometry = new THREE.BufferGeometry();
    const firePositions = new Float32Array(fireCount * 3);
    const fireColors = new Float32Array(fireCount * 3);
    
    for (let i = 0; i < fireCount; i++) {
        firePositions[i*3] = (Math.random() - 0.5) * 14;
        firePositions[i*3+1] = Math.random() * 4;
        firePositions[i*3+2] = (Math.random() - 0.5) * 12;
        
        const type = Math.random();
        if (type < 0.5) {
            fireColors[i*3] = 0.9 + Math.random() * 0.3;
            fireColors[i*3+1] = 0.1 + Math.random() * 0.2;
            fireColors[i*3+2] = 0.05;
        } else if (type < 0.75) {
            fireColors[i*3] = 0.9 + Math.random() * 0.3;
            fireColors[i*3+1] = 0.4 + Math.random() * 0.3;
            fireColors[i*3+2] = 0.05;
        } else {
            fireColors[i*3] = 1.0;
            fireColors[i*3+1] = 0.2;
            fireColors[i*3+2] = 0.0;
        }
    }
    fireGeometry.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
    fireGeometry.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));
    
    const fireMaterial = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.6 });
    const fireParticles = new THREE.Points(fireGeometry, fireMaterial);
    scene.add(fireParticles);
    
    return fireParticles;
}