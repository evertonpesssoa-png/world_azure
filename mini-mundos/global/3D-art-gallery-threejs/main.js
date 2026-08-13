import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";
import { scene, setupScene } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/scene.js";
import { createPaintings } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/paintings.js";
import { createWalls } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/walls.js";
import { setupLighting } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/lighting.js";
import { setupFloor } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/floor.js";
import { createCeiling } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/ceiling.js";
import { createBoundingBoxes } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/boundingBox.js";
import { setupRendering } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/rendering.js";
import { setupEventListeners } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/eventListeners.js";
import { addObjectsToScene } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/sceneHelpers.js";
import { setupAudio } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/audioGuide.js";
import { clickHandling } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/clickHandling.js";
import { setupVR } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/VRSupport.js";
import { loadStatueModel } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/statue.js";
import { loadBenchModel } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/bench.js";
import { loadCeilingLampModel } from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/ceilingLamp.js";

import {
  setupPlayButton,
  setupOverlayClose
} from "/world_azure/mini-mundos/global/3D-art-gallery-threejs/modules/menu.js";

const { camera, controls, renderer } = setupScene();

setupAudio(camera);

const textureLoader = new THREE.TextureLoader();

const walls = createWalls(scene, textureLoader);

setupFloor(scene);
createCeiling(scene, textureLoader);

const paintings = createPaintings(scene, textureLoader);

setupLighting(scene, paintings);

createBoundingBoxes(walls);
createBoundingBoxes(paintings);

addObjectsToScene(scene, paintings);

setupEventListeners(controls);

clickHandling(
  renderer,
  camera,
  paintings
);

setupRendering(
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls
);

loadStatueModel(scene);
loadBenchModel(scene);
loadCeilingLampModel(scene);

setupVR(renderer);

// =========================
// MENU E BOTÕES
// =========================

setupPlayButton(controls);
setupOverlayClose();

console.log("✅ Botões configurados");
console.log("✅ main.js carregado");

// ==============================================
// CORREÇÃO FINAL: AVISANDO O BOTÃO HTML
// ==============================================

window.startGallery = function() {
  console.log("✅ startGallery executada com sucesso!");
};

// Garante compatibilidade com nomes alternativos
window.init = window.startGallery;
window.entrarGaleria = window.startGallery;