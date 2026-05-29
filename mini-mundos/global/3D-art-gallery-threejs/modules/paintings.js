import * as THREE from 'three';
import { paintingData } from './paintingData.js';

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Função para carregar textura com fallback (tenta vários caminhos)
function loadTextureWithFallback(textureLoader, paths, index) {
  const tryLoad = (pathIndex) => {
    if (pathIndex >= paths.length) {
      console.error(`❌ Não foi possível carregar a imagem ${index}`);
      // Retorna uma textura colorida como fallback
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Obra ${index}`, 256, 256);
      return new THREE.CanvasTexture(canvas);
    }
    
    try {
      const path = paths[pathIndex];
      console.log(`📷 Tentando carregar imagem ${index}: ${path}`);
      const texture = textureLoader.load(path);
      return texture;
    } catch (error) {
      console.warn(`⚠️ Falha ao carregar ${paths[pathIndex]}, tentando próximo...`);
      return tryLoad(pathIndex + 1);
    }
  };
  
  return tryLoad(0);
}

export function createPaintings(scene, textureLoader) {
  let paintings = [];

  paintingData.forEach((data, idx) => {
    // Garantir que imgSrc é um array (para fallback) ou string
    let imagePaths;
    if (Array.isArray(data.imgSrc)) {
      imagePaths = data.imgSrc;
    } else {
      // Se for string, criar array com caminhos alternativos
      imagePaths = [
        data.imgSrc,
        `/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/artworks/${idx + 1}.jpg`,
        `./public/artworks/${idx + 1}.jpg`,
        `../public/artworks/${idx + 1}.jpg`,
        `./artworks/${idx + 1}.jpg`,
        `https://raw.githubusercontent.com/evertonpesssoa-png/world_azure/main/mini-mundos/global/3D-art-gallery-threejs/public/artworks/${idx + 1}.jpg`
      ];
    }
    
    // Carregar textura com fallback
    const texture = loadTextureWithFallback(textureLoader, imagePaths, idx + 1);
    
    // Material otimizado para celular
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: isMobile ? 0.5 : 0.3,
      metalness: isMobile ? 0.1 : 0.2,
      side: THREE.DoubleSide
    });
    
    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(data.width, data.height),
      material
    );

    painting.position.set(data.position.x, data.position.y, data.position.z);
    painting.rotation.y = data.rotationY;
    
    painting.userData = {
      type: 'painting',
      info: data.info,
      url: data.info.link,
      index: idx
    };

    painting.castShadow = !isMobile; // Sem sombras no celular (melhora performance)
    painting.receiveShadow = false;

    paintings.push(painting);
  });

  console.log(`✅ ${paintings.length} pinturas criadas (modo ${isMobile ? 'mobile' : 'desktop'})`);
  return paintings;
}