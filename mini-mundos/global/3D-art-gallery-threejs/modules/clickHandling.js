import * as THREE from 'three';

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function clickHandling(renderer, camera, paintings) {
  
  // Função para processar clique/toque
  const handleInteraction = (event) => {
    // Calcular coordenadas do mouse/dedo
    if (event.clientX !== undefined) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    } else if (event.touches && event.touches[0]) {
      // Para eventos de toque
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
      return;
    }
    
    onClick(camera, paintings, event);
  };
  
  // Adicionar evento de clique (mouse e toque)
  renderer.domElement.addEventListener('click', handleInteraction, false);
  
  // Adicionar evento de toque específico para celular (mais responsivo)
  if (isMobile) {
    renderer.domElement.addEventListener('touchstart', (event) => {
      // Prevenir zoom/scroll enquanto interage com a galeria
      event.preventDefault();
      handleInteraction(event);
    }, { passive: false });
    
    console.log("📱 Toque detectado - clique nas obras funcionará!");
  }
}

function onClick(camera, paintings, originalEvent) {
  raycaster.setFromCamera(mouse, camera);
  
  // Garantir que paintings é um array
  const paintingsArray = Array.isArray(paintings) ? paintings : paintings.children || [];
  
  const intersects = raycaster.intersectObjects(paintingsArray, true); // true para objetos aninhados

  if (intersects.length > 0) {
    // Procurar pelo objeto pai que é uma pintura
    let painting = intersects[0].object;
    while (painting && !painting.userData?.info?.title) {
      painting = painting.parent;
    }
    
    if (painting && painting.userData.info) {
      const title = painting.userData.info.title || "Obra de Arte";
      const link = painting.userData.info.link;
      
      console.log(`🖼️ Clicou na obra: ${title}`);
      
      // Mostrar informações temporariamente na tela
      showPaintingInfo(title);
      
      // Abrir link se existir (com delay para não bloquear no celular)
      if (link && link !== "#") {
        setTimeout(() => {
          window.open(link, '_blank');
        }, 100);
      } else {
        console.log("ℹ️ Esta obra não tem link configurado");
      }
    } else {
      console.log("🖼️ Clicou em algo, mas não é uma pintura configurada");
    }
  }
}

// Função para mostrar informação temporária na tela
function showPaintingInfo(title) {
  const infoDiv = document.getElementById('painting-info');
  if (infoDiv) {
    infoDiv.textContent = `🖼️ ${title}`;
    infoDiv.style.opacity = '1';
    infoDiv.style.transform = 'translateX(-50%) scale(1)';
    
    setTimeout(() => {
      infoDiv.style.opacity = '0';
      infoDiv.style.transform = 'translateX(-50%) scale(0.9)';
    }, 2000);
  }
}

export { clickHandling };