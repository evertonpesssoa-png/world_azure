import * as THREE from 'three';

export function initFloor(scene, config) {
    const gridHelper = new THREE.GridHelper(14, 24, config.color, 0x331166);
    gridHelper.position.y = -0.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    scene.add(gridHelper);
    
    const groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9),
        new THREE.MeshStandardMaterial({ color: 0x0a0515, roughness: 0.6, metalness: 0.2, transparent: true, opacity: 0.6 })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = -0.5;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);
    
    const circleGlow = new THREE.Mesh(
        new THREE.CircleGeometry(1.3, 32),
        new THREE.MeshStandardMaterial({ color: config.color, emissive: config.color, emissiveIntensity: 0.35, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    circleGlow.rotation.x = -Math.PI / 2;
    circleGlow.position.y = -0.45;
    scene.add(circleGlow);
    
    return circleGlow;
}