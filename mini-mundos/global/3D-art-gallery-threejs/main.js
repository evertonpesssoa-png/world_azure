import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

import {
  scene,
  setupScene
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/scene.js";

import {
  createPaintings
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/paintings.js";

import {
  createWalls
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/walls.js";

import {
  setupLighting
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/lighting.js";

import {
  setupFloor
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/floor.js";

import {
  createCeiling
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/ceiling.js";

import {
  createBoundingBoxes
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/boundingBox.js";

import {
  setupRendering
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/rendering.js";

import {
  setupEventListeners
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/eventListeners.js";

import {
  addObjectsToScene
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/sceneHelpers.js";

import {
  setupAudio
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/audioGuide.js";

import {
  clickHandling
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/clickHandling.js";

import {
  setupVR
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/VRSupport.js";

import {
  loadStatueModel
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/statue.js";

import {
  loadBenchModel
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/bench.js";

import {
  loadCeilingLampModel
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/ceilingLamp.js";

import {
  setupPlayButton,
  setupOverlayClose
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/menu.js";


// ==============================================
// 📱 CONTROLE DE TOQUE
// ==============================================

import {
  setupTouchControls
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/touchControls.js";


// ==============================================
// 🎬 CENA PRINCIPAL
// ==============================================

const {
  camera,
  controls,
  renderer
} = setupScene();


// ==============================================
// 📱 TOUCH CONTROLS
// ==============================================
//
// Ativa o olhar por arrastar 1 dedo
// somente em dispositivos móveis.
//
// O próprio módulo verifica se é mobile.
// ==============================================

setupTouchControls(
  camera,
  renderer
);


// ==============================================
// 🔄 RESPONSIVIDADE DA TELA
// ==============================================

function onWindowResize() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height
  );
}


// ==============================================
// EVENTO DE RESIZE
// ==============================================

window.addEventListener(
  "resize",
  onWindowResize
);


// ==============================================
// AJUSTE INICIAL
// ==============================================
//
// Dá um pequeno tempo para o navegador
// terminar de montar a interface.
// ==============================================

setTimeout(() => {

  onWindowResize();

}, 300);


// ==============================================
// 🔊 ÁUDIO
// ==============================================

setupAudio(camera);


// ==============================================
// 🎨 TEXTURAS
// ==============================================

const textureLoader =
  new THREE.TextureLoader();


// ==============================================
// 🧱 PAREDES
// ==============================================

const walls =
  createWalls(
    scene,
    textureLoader
  );


// ==============================================
// 🟫 CHÃO
// ==============================================

setupFloor(scene);


// ==============================================
// 🏛️ TETO
// ==============================================

createCeiling(
  scene,
  textureLoader
);


// ==============================================
// 🖼️ PINTURAS
// ==============================================

const paintings =
  createPaintings(
    scene,
    textureLoader
  );


// ==============================================
// 💡 ILUMINAÇÃO
// ==============================================

setupLighting(
  scene,
  paintings
);


// ==============================================
// 📦 BOUNDING BOXES
// ==============================================

createBoundingBoxes(
  walls
);

createBoundingBoxes(
  paintings
);


// ==============================================
// ➕ OBJETOS NA CENA
// ==============================================

addObjectsToScene(
  scene,
  paintings
);


// ==============================================
// 🖱️ EVENTOS
// ==============================================

setupEventListeners(
  controls
);


// ==============================================
// 🖼️ CLIQUE NAS PINTURAS
// ==============================================

clickHandling(
  renderer,
  camera,
  paintings
);


// ==============================================
// 🎥 RENDERIZAÇÃO
// ==============================================

setupRendering(
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls
);


// ==============================================
// 🗿 ESTÁTUA
// ==============================================

loadStatueModel(
  scene
);


// ==============================================
// 🪑 BANCO
// ==============================================

loadBenchModel(
  scene
);


// ==============================================
// 💡 LÂMPADA DO TETO
// ==============================================

loadCeilingLampModel(
  scene
);


// ==============================================
// 🥽 VR
// ==============================================

setupVR(
  renderer
);


// ==============================================
// 🎛️ MENU E BOTÕES
// ==============================================

setupPlayButton(
  controls
);

setupOverlayClose();


// ==============================================
// 🌐 COMPATIBILIDADE GLOBAL
// ==============================================

window.startGallery =
  function() {

    console.log(
      "✅ startGallery executada com sucesso!"
    );

  };


// ==============================================
// 🔗 NOMES ALTERNATIVOS
// ==============================================

window.init =
  window.startGallery;

window.entrarGaleria =
  window.startGallery;


// ==============================================
// ✅ FINALIZAÇÃO
// ==============================================

console.log(
  "📱 TouchControls integrado"
);

console.log(
  "✅ Botões configurados"
);

console.log(
  "✅ main.js carregado"
);