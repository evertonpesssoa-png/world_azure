import * as THREE from 'three';

export function initBooks(scene) {
    function createFloatingBook(x, z, yOffset) {
        const group = new THREE.Group();
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.13, 0.05), new THREE.MeshStandardMaterial({ color: 0xffcc66, metalness: 0.3 }));
        group.add(cover);
        
        const pages = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.04), new THREE.MeshStandardMaterial({ color: 0xffeecc }));
        pages.position.z = 0.01;
        group.add(pages);
        
        group.position.set(x, yOffset, z);
        group.rotation.y = Math.random() * Math.PI * 2;
        return group;
    }
    
    const bookPositions = [
        [-1.0, 0.7, 2.0], [1.0, 0.7, 2.0],
        [-1.2, 0.5, -2.0], [1.2, 0.5, -2.0],
        [0, 0.8, 2.3], [0, 0.6, -2.3],
        [-2.0, 0.7, 1.0], [2.0, 0.7, 1.0]
    ];
    
    bookPositions.forEach(pos => {
        const book = createFloatingBook(pos[0], pos[2], pos[1]);
        scene.add(book);
    });
}