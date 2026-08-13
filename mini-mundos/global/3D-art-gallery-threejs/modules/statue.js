// ==============================================
// IMPORTS CORRIGIDOS COM CAMINHOS ABSOLUTOS DA CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/loaders/GLTFLoader.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const loadStatueModel = (scene) => {
  const loader = new GLTFLoader();
  
  // Caminhos alternativos para tentar
  const paths = [
    "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/models/statue/scene.gltf",
    "./public/models/statue/scene.gltf",
    "../public/models/statue/scene.gltf",
    "./models/statue/scene.gltf"
  ];
  
  let currentPathIndex = 0;
  
  function tryLoadNext() {
    if (currentPathIndex >= paths.length) {
      console.warn("⚠️ Estátua não encontrada, pulando...");
      return;
    }
    
    const path = paths[currentPathIndex];
    console.log(`📦 Tentando carregar estátua: ${path}`);
    
    loader.load(path, 
      (gltf) => {
        const statue = gltf.scene;
        console.log("✅ Estátua carregada com sucesso!");
        
        // Posicionar a estátua no centro do piso
        statue.position.set(0, -3.2, 0);
        
        // Ajustar escala (maior que 0.06 para ficar visível)
        statue.scale.set(0.25, 0.25, 0.25);
        
        // Otimizar materiais para celular
        statue.traverse((child) => {
          if (child.isMesh) {
            // Configurações de material
            if (child.material) {
              child.material.metalness = 0.0;
              child.material.roughness = isMobile ? 0.5 : 0.2;
              
              // Reduzir qualidade das texturas no celular
              if (isMobile && child.material.map) {
                child.material.map.anisotropy = 1;
                child.material.map.minFilter = THREE.LinearFilter;
              }
            }
            
            // Sombras apenas no desktop
            child.castShadow = !isMobile;
            child.receiveShadow = false;
          }
        });
        
        scene.add(statue);
      },
      (xhr) => {
        // Progresso (opcional)
        if (!isMobile) {
          console.log(`📦 Estátua: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`);
        }
      },
      (error) => {
        console.warn(`❌ Erro ao carregar estátua do caminho ${path}:`, error);
        currentPathIndex++;
        tryLoadNext();
      }
    );
  }
  
  tryLoadNext();
};