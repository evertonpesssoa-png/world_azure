import * as THREE from 'three';

export function initParticles(scene) {
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 14;
        particlePositions[i*3+1] = Math.random() * 4.5;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 12;
        
        const type = Math.random();
        if (type < 0.6) {
            particleColors[i*3] = 0.2 + Math.random() * 0.3;
            particleColors[i*3+1] = 0.7 + Math.random() * 0.3;
            particleColors[i*3+2] = 0.3 + Math.random() * 0.3;
        } else if (type < 0.8) {
            particleColors[i*3] = 1.0;
            particleColors[i*3+1] = 0.8 + Math.random() * 0.2;
            particleColors[i*3+2] = 0.2;
        } else {
            particleColors[i*3] = 0.9 + Math.random() * 0.3;
            particleColors[i*3+1] = 0.9 + Math.random() * 0.3;
            particleColors[i*3+2] = 0.9 + Math.random() * 0.3;
        }
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    return particles;
}