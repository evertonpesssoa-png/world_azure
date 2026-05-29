import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";

export const scene = new THREE.Scene();
let camera;
let controls;
let renderer;

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const setupScene = () => {
  // Câmera com ajustes para celular
  camera = new THREE.PerspectiveCamera(
    isMobile ? 75 : 60, // FOV maior no celular (maior campo de visão)
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, isMobile ? 1.8 : 2, 15); // Câmera um pouco mais baixa no celular

  // Renderer otimizado
  renderer = new THREE.WebGLRenderer({ 
    antialias: !isMobile, // Desativa anti-aliasing no celular (melhora performance)
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050510, 1); // Cor de fundo escura (combina com o menu)
  document.body.appendChild(renderer.domElement);

  // Configuração de sombras (otimizada para celular)
  renderer.shadowMap.enabled = !isMobile; // Desativa sombras no celular
  if (!isMobile) {
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  // Controles com pointer lock (desativado no celular para evitar problemas)
  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(controls.getObject());

  // Se for celular, desativar pointer lock (não funciona bem)
  if (isMobile) {
    console.log("📱 Modo celular: controles de movimento com toque ativados");
    // O pointer lock será ignorado no menu.js
  }

  // Evento de resize (responsivo)
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

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

// Função auxiliar para limpar recursos (opcional)
export const disposeScene = () => {
  if (renderer) {
    renderer.dispose();
  }
  window.removeEventListener('resize', onWindowResize);
};

// Exportar getters para acesso seguro
export const getCamera = () => camera;
export const getControls = () => controls;
export const getRenderer = () => renderer;