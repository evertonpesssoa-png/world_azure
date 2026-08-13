// ==============================================
// IMPORTS CORRIGIDOS COM CAMINHOS ABSOLUTOS DA CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three-stdlib@2.30.3/controls/PointerLockControls.js";

export const scene = new THREE.Scene();
let camera;
let controls;
let renderer;

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ==============================================
// FUNÇÃO PARA PEGAR O TAMANHO REAL DA VIEWPORT
// ==============================================
function getViewportSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  };
}

export const setupScene = () => {
  const viewport = getViewportSize();

  // Câmera com ajustes para celular
  camera = new THREE.PerspectiveCamera(
    isMobile ? 75 : 60, // FOV maior no celular
    viewport.width / viewport.height,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, isMobile ? 1.8 : 2, 15);

  // Renderer otimizado
  renderer = new THREE.WebGLRenderer({ 
    antialias: !isMobile,
    powerPreference: "high-performance"
  });
  renderer.setSize(viewport.width, viewport.height);
  renderer.setClearColor(0x050510, 1);
  document.body.appendChild(renderer.domElement);

  // Configuração de sombras
  renderer.shadowMap.enabled = !isMobile;
  if (!isMobile) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  // Controles com pointer lock
  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(controls.getObject());

  if (isMobile) {
    console.log("📱 Modo celular: controles de movimento com toque ativados");
  }

  // ==============================================
  // EVENTO DE RESIZE E ROTAÇÃO (CORRIGIDO)
  // ==============================================
  function onWindowResize() {
    const newViewport = getViewportSize();

    camera.aspect = newViewport.width / newViewport.height;
    camera.updateProjectionMatrix();
    renderer.setSize(newViewport.width, newViewport.height);

    console.log(`📐 Viewport: ${newViewport.width} × ${newViewport.height}`);
  }

  window.addEventListener("resize", onWindowResize, false);
  
  // Correção para quando o celular gira
  window.addEventListener("orientationchange", () => {
    setTimeout(onWindowResize, 150);
  });

  // Prevenir comportamento padrão do toque no canvas
  if (isMobile) {
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.target === renderer.domElement) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  console.log(`✅ Cena configurada (modo ${isMobile ? 'mobile' : 'desktop'})`);
  
  return { camera, controls, renderer };
};

// Função auxiliar para limpar recursos
export const disposeScene = () => {
  if (renderer) {
    renderer.dispose();
  }
  window.removeEventListener('resize', onWindowResize);
};

// Exportar getters
export const getCamera = () => camera;
export const getControls = () => controls;
export const getRenderer = () => renderer;