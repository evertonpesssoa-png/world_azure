import * as THREE from "three";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function createWalls(scene, textureLoader) {
  let wallGroup = new THREE.Group();
  
  // Material para as paredes (otimizado)
  let wallMaterial;
  
  if (isMobile) {
    // Versão simplificada para celular (sem texturas pesadas)
    console.log("📱 Carregando paredes versão mobile (leve)");
    wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8c8d0,
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
  } else {
    // Versão completa para desktop (com texturas)
    console.log("🖥️ Carregando paredes versão desktop (texturizada)");
    
    // Caminhos das texturas no GitHub Pages
    const texturesBasePath = "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/leather_white_4k.gltf/textures/";
    
    // Carregar texturas com fallback
    let normalMap = null;
    let roughnessMap = null;
    
    try {
      normalMap = textureLoader.load(texturesBasePath + "leather_white_nor_gl_4k.jpg");
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(2, 2);
    } catch (error) {
      console.warn("⚠️ Não foi possível carregar textura normal das paredes");
    }
    
    try {
      roughnessMap = textureLoader.load(texturesBasePath + "leather_white_rough_4k.jpg");
      roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(2, 2);
    } catch (error) {
      console.warn("⚠️ Não foi possível carregar textura roughness das paredes");
    }
    
    wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xadadae,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }
  
  // Criar as paredes com geometria otimizada
  const wallThickness = 0.001;
  const wallWidth = 80;
  const wallHeight = 20;
  
  // Front Wall
  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
    wallMaterial
  );
  frontWall.position.z = -20;
  frontWall.receiveShadow = !isMobile;
  
  // Back Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
    wallMaterial
  );
  backWall.position.z = 20;
  backWall.receiveShadow = !isMobile;
  
  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -20;
  leftWall.receiveShadow = !isMobile;
  
  // Right Wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
    wallMaterial
  );
  rightWall.position.x = 20;
  rightWall.rotation.y = Math.PI / 2;
  rightWall.receiveShadow = !isMobile;
  
  // Adicionar todas as paredes ao grupo
  wallGroup.add(frontWall, backWall, leftWall, rightWall);
  
  // Adicionar chão invisível para colisão (opcional, mas útil)
  const floorCollision = new THREE.Mesh(
    new THREE.BoxGeometry(78, 0.5, 78),
    new THREE.MeshStandardMaterial({ visible: false, transparent: true, opacity: 0 })
  );
  floorCollision.position.y = -3.5;
  floorCollision.receiveShadow = false;
  wallGroup.add(floorCollision);
  
  console.log(`✅ ${isMobile ? 'Paredes móveis' : 'Paredes com textura'} adicionadas`);
  
  return wallGroup;
}