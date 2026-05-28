import * as THREE from 'three';

export function initScales(scene) {
    const scaleGroup = new THREE.Group();
    const scaleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0xffddaa, metalness: 0.7 }));
    scaleBase.position.y = 0;
    scaleGroup.add(scaleBase);
    
    const scaleArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xffddaa, metalness: 0.6 }));
    scaleArm.position.y = 0.22;
    scaleGroup.add(scaleArm);
    
    const leftPan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 8), new THREE.MeshStandardMaterial({ color: 0xffddaa, metalness: 0.5 }));
    leftPan.position.set(-0.28, 0.18, 0);
    scaleGroup.add(leftPan);
    
    const rightPan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 8), new THREE.MeshStandardMaterial({ color: 0xffddaa, metalness: 0.5 }));
    rightPan.position.set(0.28, 0.18, 0);
    scaleGroup.add(rightPan);
    
    scaleGroup.position.set(2.2, 0.3, 2.2);
    scene.add(scaleGroup);
    
    const scaleGroup2 = scaleGroup.clone();
    scaleGroup2.position.set(-2.2, 0.3, 2.2);
    scene.add(scaleGroup2);
    
    return { scaleGroup, scaleGroup2 };
}