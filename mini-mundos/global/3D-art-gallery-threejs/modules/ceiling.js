// ==============================================
// IMPORTS CORRIGIDOS COM CAMINHOS ABSOLUTOS DA CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const createCeiling = (scene, textureLoader) => {
  
  // ==============================================
  // CAMINHO ABSOLUTO DA PASTA DE TEXTURAS
  // ==============================================
  const texturesBasePath = "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/OfficeCeiling005_4K-JPG/";
  
  // Versão simplificada para celular (usa apenas textura de cor, sem texturas extras pesadas)
  if (isMobile) {
    console.log("📱 Carregando teto versão mobile (leve)");
    
    // Carregar apenas a textura principal (reduzida para performance)
    const colorTexture = textureLoader.load(texturesBasePath + "OfficeCeiling005_4K_Color.jpg");
    colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(2, 2);
    
    const ceilingGeometry = new THREE.PlaneGeometry(45, 40);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      map: colorTexture,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
      color: 0xeeeeee
    });
    
    const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceilingPlane.rotation.x = Math.PI / 2;
    ceilingPlane.position.y = 10;
    scene.add(ceilingPlane);
    return;
  }
  
  // Versão completa para desktop (com todas as texturas)
  console.log("🖥️ Carregando teto versão desktop (completa)");
  
  // Tenta carregar texturas com fallback
  const loadTexture = (path, fallbackColor = null) => {
    try {
      return textureLoader.load(path);
    } catch (error) {
      console.warn(`⚠️ Não foi possível carregar textura: ${path}`);
      return fallbackColor ? new THREE.Color(fallbackColor) : null;
    }
  };
  
  const colorTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_Color.jpg", 0xcccccc);
  const displacementTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_Displacement.jpg");
  const aoTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_AmbientOcclusion.jpg");
  const metalnessTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_Metalness.jpg");
  const normalGLTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_NormalGL.jpg");
  const roughnessTexture = loadTexture(texturesBasePath + "OfficeCeiling005_4K_Roughness.jpg");

  // Configurar repetição das texturas
  const textures = [colorTexture, displacementTexture, aoTexture, metalnessTexture, normalGLTexture, roughnessTexture];
  textures.forEach(texture => {
    if (texture && texture.wrapS) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    }
  });

  const ceilingGeometry = new THREE.PlaneGeometry(45, 40);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture instanceof THREE.Texture ? colorTexture : null,
    displacementMap: displacementTexture instanceof THREE.Texture ? displacementTexture : null,
    aoMap: aoTexture instanceof THREE.Texture ? aoTexture : null,
    metalnessMap: metalnessTexture instanceof THREE.Texture ? metalnessTexture : null,
    normalMap: normalGLTexture instanceof THREE.Texture ? normalGLTexture : null,
    roughnessMap: roughnessTexture instanceof THREE.Texture ? roughnessTexture : null,
    displacementScale: 0.05,
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.2
  });
  
  const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceilingPlane.rotation.x = Math.PI / 2;
  ceilingPlane.position.y = 10;
  scene.add(ceilingPlane);
};