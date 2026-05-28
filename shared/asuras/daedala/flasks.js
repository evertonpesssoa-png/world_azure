import * as THREE from 'three';

export function initFlasks(scene) {
    const flaskColors = ['#ff6688', '#88ff66', '#66ffcc', '#ffaa44', '#cc66ff'];
    const flaskPositions = [
        [-1.0, 0.45, 2.2], [1.0, 0.45, 2.2],
        [-1.2, 0.4, -2.0], [1.2, 0.4, -2.0],
        [0, 0.5, 2.4], [0, 0.45, -2.3]
    ];
    
    function createFlask(x, z, yOffset, color) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.22, 8), new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.7 }));
        group.add(body);
        
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.12, 8), new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.2, transparent: true, opacity: 0.8 }));
        liquid.position.y = -0.03;
        group.add(liquid);
        
        group.position.set(x, yOffset, z);
        return group;
    }
    
    flaskPositions.forEach((pos, idx) => {
        const flask = createFlask(pos[0], pos[2], pos[1], flaskColors[idx % flaskColors.length]);
        scene.add(flask);
    });
}