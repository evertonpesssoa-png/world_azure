// ==============================================
// IMPORTS CORRIGIDOS COM CAMINHOS ABSOLUTOS DA CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/loaders/GLTFLoader.js";

// Detecta se é celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const loadBenchModel = (scene) => {
  const loader = new GLTFLoader();
  
  // Caminhos alternativos para tentar (prioriza GitHub Pages)
  const paths = [
    "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/models/bench_2/scene.gltf",
    "./public/models/bench_2/scene.gltf",
    "../public/models/bench_2/scene.gltf",
    "./models/bench_2/scene.gltf"
  ];
  
  let currentPathIndex = 0;
  
  function tryLoadNext() {
    if (currentPathIndex >= paths.length) {
      console.warn("⚠️ Banco não encontrado em nenhum caminho");
      return;
    }
    
    const path = paths[currentPathIndex];
    console.log(`📦 Tentando carregar banco: ${path}`);
    
    loader.load(path, 
      (gltf) => {
        const bench = gltf.scene;
        console.log("✅ Banco carregado com sucesso!", bench);
        
        // Configurar posição, rotação e escala
        bench.position.set(0, -3.12, -8);
        bench.rotation.set(0, 0, 0);
        bench.scale.set(3, 3, 3);
        
        // Ajustar materiais para performance no celular
        bench.traverse((child) => {
          if (child.isMesh) {
            // Se for celular, reduzir qualidade das texturas
            if (isMobile && child.material) {
              if (child.material.map) {
                child.material.map.anisotropy = 1; // Reduz anisotropia
              }
              child.material.roughness = 0.7;
              child.material.metalness = 0.3;
            }
            
            // Habilitar sombras (opcional)
            child.castShadow = true;
            child.receiveShadow = false;
          }
        });
        
        scene.add(bench);
      },
      (xhr) => {
        // Progresso do carregamento
        console.log(`📦 Banco: ${Math.floor((xhr.loaded / xhr.total) * 100)}% carregado`);
      },
      (error) => {
        console.warn(`❌ Erro ao carregar banco do caminho ${path}:`, error);
        currentPathIndex++;
        tryLoadNext();
      }
    );
  }
  
  tryLoadNext();
};