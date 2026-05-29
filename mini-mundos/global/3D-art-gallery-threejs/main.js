import * as THREE from "three";
import { scene, setupScene } from "./modules/scene.js";
import { createPaintings } from "./modules/paintings.js";
import { createWalls } from "./modules/walls.js";
import { setupLighting } from "./modules/lighting.js";
import { setupFloor } from "./modules/floor.js";
import { createCeiling } from "./modules/ceiling.js";
import { createBoundingBoxes } from "./modules/boundingBox.js";
import { setupRendering } from "./modules/rendering.js";
import { setupEventListeners } from "./modules/eventListeners.js";
import { addObjectsToScene } from "./modules/sceneHelpers.js";
import { setupAudio } from "./modules/audioGuide.js";
import { clickHandling } from "./modules/clickHandling.js";
import { setupVR } from "./modules/VRSupport.js";
import { loadStatueModel } from "./modules/statue.js";
import { loadBenchModel } from "./modules/bench.js";
import { loadCeilingLampModel } from "./modules/ceilingLamp.js";

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

clickHandling(renderer, camera, paintings);

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

console.log("✅ main.js carregado");