// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { displayPaintingInfo, hidePaintingInfo } from "./paintingInfo.js";
import { updateMovement } from "./movement.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls
) => {
  const clock = new THREE.Clock();
  
  // Configurações de renderização (feitas uma vez, não a cada frame)
  renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio);
  
  // Para Three.js r150+, usar colorManagement em vez de gammaOutput
  if (renderer.outputEncoding !== undefined) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
  if (renderer.toneMapping !== undefined) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
  }
  
  // Otimização para celular: reduzir qualidade de sombras
  if (isMobile && renderer.shadowMap) {
    renderer.shadowMap.enabled = false; // Desativa sombras no celular
  }
  
  // Variável para evitar múltiplas exibições da mesma pintura
  let currentShownPainting = null;
  let frameCount = 0;
  
  let render = function () {
    const delta = Math.min(clock.getDelta(), 0.033); // Limita delta máximo (evita pulos)
    
    // Atualiza movimento (apenas se o menu não estiver visível)
    const menu = document.getElementById('menu');
    const isMenuVisible = menu && menu.style.display !== 'none';
    
    if (!isMenuVisible) {
      updateMovement(delta, controls, camera, walls);
    }
    
    const distanceThreshold = isMobile ? 6 : 8; // Distância menor no celular (otimização)
    
    let paintingToShow = null;
    let closestDistance = distanceThreshold;
    
    // Otimização: verificar apenas a cada 3 frames no celular
    if (!isMobile || frameCount % 3 === 0) {
      for (let i = 0; i < paintings.length; i++) {
        const painting = paintings[i];
        const distanceToPainting = camera.position.distanceTo(painting.position);
        
        if (distanceToPainting < closestDistance) {
          closestDistance = distanceToPainting;
          paintingToShow = painting;
        }
      }
    }
    
    // Só atualizar a informação se a pintura mudou
    if (paintingToShow && paintingToShow !== currentShownPainting) {
      currentShownPainting = paintingToShow;
      displayPaintingInfo(paintingToShow.userData.info);
    } else if (!paintingToShow && currentShownPainting !== null) {
      currentShownPainting = null;
      hidePaintingInfo();
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    frameCount++;
  };

  render();
  
  // Retorna função para limpar recursos (opcional)
  return () => {
    clock.stop();
  };
};