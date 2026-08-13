// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const setupLighting = (scene, paintings) => {
  
  // Ambiente light (sempre presente)
  const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.8 : 0.6);
  scene.add(ambientLight);
  
  // Função para criar spotlight (sem GUI)
  function createSpotlight(x, y, z, intensity, targetPosition) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);
    spotlight.castShadow = !isMobile; // Sombras apenas no desktop (melhora performance)
    spotlight.angle = 1.57079;
    spotlight.penumbra = 0.2;
    spotlight.decay = 1;
    spotlight.distance = 40;
    
    // Configuração de sombra (apenas desktop)
    if (!isMobile) {
      spotlight.shadow.mapSize.width = 1024;
      spotlight.shadow.mapSize.height = 1024;
      spotlight.shadow.bias = -0.0001;
    }
    
    scene.add(spotlight);
    scene.add(spotlight.target);
    
    return spotlight;
  }
  
  // Criar spotlights para as paredes
  const frontWallSpotlight = createSpotlight(0, 6.7, -13, 0.948, new THREE.Vector3(0, 0, -20));
  const backWallSpotlight = createSpotlight(0, 6.7, 13, 0.948, new THREE.Vector3(0, 0, 20));
  const leftWallSpotlight = createSpotlight(-13, 6.7, 0, 0.948, new THREE.Vector3(-20, 0, 0));
  const rightWallSpotlight = createSpotlight(13, 6.7, 0, 0.948, new THREE.Vector3(20, 0, 0));
  
  // Spotlight para a estátua
  const statueSpotlight = createSpotlight(0, 10, 0, 0.948, new THREE.Vector3(0, -4.2, 0));
  statueSpotlight.angle = 0.75084;
  statueSpotlight.decay = 1;
  statueSpotlight.penumbra = 1;
  statueSpotlight.distance = 0;
  
  // Em desktop, adicionar GUI (opcional)
  if (!isMobile) {
    addDesktopGUI(ambientLight, frontWallSpotlight, backWallSpotlight, leftWallSpotlight, rightWallSpotlight, statueSpotlight);
  } else {
    console.log("📱 Modo celular: GUI de iluminação desativada (performance otimizada)");
  }
  
  console.log("✅ Iluminação configurada");
};

// Função separada para GUI (apenas desktop)
function addDesktopGUI(ambientLight, frontSpot, backSpot, leftSpot, rightSpot, statueSpot) {
  import("https://cdn.jsdelivr.net/npm/lil-gui@0.16.0/dist/lil-gui.esm.min.js").then(({ GUI }) => {
    const gui = new GUI();
    gui.close(); // Começa fechado para não poluir a tela
    
    // Ambient Light
    const ambientFolder = gui.addFolder("Ambient Light");
    ambientFolder.add(ambientLight, "intensity", 0, 2);
    ambientFolder.open();
    
    // Função auxiliar para adicionar controles de um spotlight
    function addSpotlightControls(folderName, spotlight) {
      const folder = gui.addFolder(folderName);
      folder.add(spotlight, "intensity", 0, 4);
      folder.add(spotlight, "angle", 0, Math.PI / 2).name("Angle");
      folder.add(spotlight, "penumbra", 0, 1).name("Penumbra");
      folder.add(spotlight.position, "x", -50, 50);
      folder.add(spotlight.position, "y", -50, 50);
      folder.add(spotlight.position, "z", -50, 50);
      folder.open();
    }
    
    addSpotlightControls("Front Wall Light", frontSpot);
    addSpotlightControls("Back Wall Light", backSpot);
    addSpotlightControls("Left Wall Light", leftSpot);
    addSpotlightControls("Right Wall Light", rightSpot);
    
    const statueFolder = gui.addFolder("Statue Light");
    statueFolder.add(statueSpot, "intensity", 0, 4);
    statueFolder.add(statueSpot, "angle", 0, Math.PI / 2).name("Angle");
    statueFolder.add(statueSpot, "penumbra", 0, 1).name("Penumbra");
    statueFolder.open();
    
    console.log("🖥️ GUI de iluminação carregada (desktop)");
  }).catch(() => {
    console.log("⚠️ GUI não carregada - continuando sem controles visuais");
  });
}