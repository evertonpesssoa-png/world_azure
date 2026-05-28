import * as THREE from 'three';

export function initSymbols(scene, config) {
    const codeSymbols = ['{', '}', '</>', '[]', '()', ';', '#', '~', 'const', 'let', 'function', '=>', 'class'];
    const symbols = [];
    
    for (let i = 0; i < 40; i++) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        context.fillStyle = config.color;
        context.font = 'Bold 36px monospace';
        context.textAlign = 'center';
        context.fillText(codeSymbols[Math.floor(Math.random() * codeSymbols.length)], canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.3 });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.4, 0.2, 1);
        sprite.position.set(
            (Math.random() - 0.5) * 6,
            Math.random() * 3,
            (Math.random() - 0.5) * 6
        );
        scene.add(sprite);
        symbols.push(sprite);
    }
    
    return symbols;
}