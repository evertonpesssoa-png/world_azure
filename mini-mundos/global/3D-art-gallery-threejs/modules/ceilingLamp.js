// ==============================================
// IMPORTS CORRIGIDOS COM CAMINHOS ABSOLUTOS DA CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/loaders/GLTFLoader.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const loadCeilingLampModel = (scene) => {
  const loader = new GLTFLoader();
  
  // Caminhos alternativos para tentar
  const paths = [
    "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/models/ceiling-lamp/scene.gltf",
    "./public/models/ceiling-lamp/scene.gltf",
    "../public/models/ceiling-lamp/scene.gltf",
    "./models/ceiling-lamp/scene.gltf"
  ];
  
  let currentPathIndex = 0;
  
  function tryLoadNext() {
    if (currentPathIndex >= paths.length) {
      console.warn("⚠️ Luminária não encontrada, pulando...");
      return;
    }
    
    const path = paths[currentPathIndex];
    console.log(`📦 Tentando carregar luminária: ${path}`);
    
    loader.load(path, 
      (gltf) => {
        const lamp = gltf.scene;
        console.log("✅ Luminária carregada com sucesso!");
        
        // Posicionar a luminária
        lamp.position.set(0, 5.5, 0);
        lamp.scale.set(0.1, 0.1, 0.1);
        
        // Otimizar para celular
        if (isMobile) {
          lamp.traverse((child) => {
            if (child.isMesh && child.material) {
              // Reduzir qualidade das texturas no celular
              if (child.material.map) {
                child.material.map.anisotropy = 1;
                child.material.map.minFilter = THREE.LinearFilter;
              }
              child.material.roughness = 0.5;
              child.material.metalness = 0.3;
            }
          });
        }
        
        scene.add(lamp);
      },
      (xhr) => {
        // Progresso (opcional)
        if (!isMobile) {
          console.log(`📦 Luminária: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`);
        }
      },
      (error) => {
        console.warn(`❌ Erro ao carregar luminária do caminho ${path}:`, error);
        currentPathIndex++;
        tryLoadNext();
      }
    );
  }
  
  tryLoadNext();
};