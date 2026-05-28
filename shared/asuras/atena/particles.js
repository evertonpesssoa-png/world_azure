import * as THREE from 'three';

export function initParticles(scene) {
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 16;
        particlePositions[i*3+1] = Math.random() * 5;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 14;
        
        const type = Math.random();
        if (type < 0.6) {
            particleColors[i*3] = 0.9 + Math.random() * 0.3;
            particleColors[i*3+1] = 0.7 + Math.random() * 0.3;
            particleColors[i*3+2] = 0.1 + Math.random() * 0.2;
        } else if (type < 0.85) {
            particleColors[i*3] = 0.9 + Math.random() * 0.3;
            particleColors[i*3+1] = 0.8 + Math.random() * 0.3;
            particleColors[i*3+2] = 0.5 + Math.random() * 0.4;
        } else {
            particleColors[i*3] = 0.8;
            particleColors[i*3+1] = 0.9;
            particleColors[i*3+2] = 1.0;
        }
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.55 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    return particles;
}