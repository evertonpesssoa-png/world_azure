// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const setupFloor = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  
  // Versão simplificada para celular (cor sólida + leve)
  if (isMobile) {
    console.log("📱 Carregando piso versão mobile (leve)");
    
    const planeGeometry = new THREE.PlaneGeometry(45, 45);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B5A2B,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    
    const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    floorPlane.rotation.x = Math.PI / 2;
    floorPlane.position.y = -Math.PI;
    scene.add(floorPlane);
    return;
  }
  
  // Versão completa para desktop
  console.log("🖥️ Carregando piso versão desktop (texturas completas)");
  
  // Caminhos das texturas no GitHub Pages
  const texturesBasePath = "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/WoodFloor040_4K-JPG/";
  
  // Função auxiliar para carregar textura com fallback
  const loadTexture = (path, fallbackColor = null) => {
    try {
      const texture = textureLoader.load(path);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    } catch (error) {
      console.warn(`⚠️ Não foi possível carregar textura: ${path}`);
      return fallbackColor;
    }
  };
  
  const colorTexture = loadTexture(texturesBasePath + "WoodFloor040_4K_Color.jpg");
  const displacementTexture = loadTexture(texturesBasePath + "WoodFloor040_4K_Displacement.jpg");
  const normalTexture = loadTexture(texturesBasePath + "WoodFloor040_4K_NormalGL.jpg");
  const roughnessTexture = loadTexture(texturesBasePath + "WoodFloor040_4K_Roughness.jpg");
  const aoTexture = loadTexture(texturesBasePath + "WoodFloor040_4K_AmbientOcclusion.jpg");

  const planeGeometry = new THREE.PlaneGeometry(45, 45);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture instanceof THREE.Texture ? colorTexture : null,
    displacementMap: displacementTexture instanceof THREE.Texture ? displacementTexture : null,
    normalMap: normalTexture instanceof THREE.Texture ? normalTexture : null,
    roughnessMap: roughnessTexture instanceof THREE.Texture ? roughnessTexture : null,
    aoMap: aoTexture instanceof THREE.Texture ? aoTexture : null,
    displacementScale: 0.05,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0.1,
    color: colorTexture instanceof THREE.Texture ? undefined : 0x8B5A2B
  });

  const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  floorPlane.rotation.x = Math.PI / 2;
  floorPlane.position.y = -Math.PI;
  scene.add(floorPlane);
  
  console.log("✅ Piso adicionado");
};