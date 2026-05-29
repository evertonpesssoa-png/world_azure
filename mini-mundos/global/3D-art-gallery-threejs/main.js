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

let { camera, controls, renderer } = setupScene();

setupAudio(camera);

const textureLoader = new THREE.TextureLoader();

const walls = createWalls(scene, textureLoader);
const floor = setupFloor(scene);
const ceiling = createCeiling(scene, textureLoader);
const paintings = createPaintings(scene, textureLoader);
const lighting = setupLighting(scene, paintings);

createBoundingBoxes(walls);
createBoundingBoxes(paintings);

addObjectsToScene(scene, paintings);

setupEventListeners(controls);
clickHandling(renderer, camera, paintings);
setupRendering(scene, camera, renderer, paintings, controls, walls);

loadStatueModel(scene);
loadBenchModel(scene);
loadCeilingLampModel(scene);
setupVR(renderer);

// ============================================================
// CÓDIGO SIMPLES E DIRETO PARA OS BOTÕES
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Função para esconder o menu
function esconderMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = 'none';
    console.log("✅ Menu escondido");
  }
}

// Função para mostrar o menu
function mostrarMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = 'flex';
    console.log("✅ Menu mostrado");
  }
}

// ===== BOTÃO PLAY =====
const playButton = document.getElementById('play_button');
if (playButton) {
  // Remove qualquer listener anterior
  const novoPlay = playButton.cloneNode(true);
  playButton.parentNode.replaceChild(novoPlay, playButton);
  
  novoPlay.onclick = function(e) {
    e.preventDefault();
    esconderMenu();
  };
  
  novoPlay.ontouchstart = function(e) {
    e.preventDefault();
    esconderMenu();
  };
  
  console.log("✅ Botão PLAY configurado");
} else {
  console.error("❌ Botão PLAY não encontrado");
}

// ===== BOTÃO ABOUT =====
const aboutButton = document.getElementById('about_button');
if (aboutButton) {
  const novoAbout = aboutButton.cloneNode(true);
  aboutButton.parentNode.replaceChild(novoAbout, aboutButton);
  
  novoAbout.onclick = function(e) {
    e.preventDefault();
    const overlay = document.getElementById('about-overlay');
    if (overlay) overlay.classList.add('active');
    console.log("✅ About aberto");
  };
  
  novoAbout.ontouchstart = function(e) {
    e.preventDefault();
    const overlay = document.getElementById('about-overlay');
    if (overlay) overlay.classList.add('active');
  };
  
  console.log("✅ Botão ABOUT configurado");
}

// ===== FECHAR ABOUT =====
const closeAbout = document.getElementById('close-about');
if (closeAbout) {
  const novoClose = closeAbout.cloneNode(true);
  closeAbout.parentNode.replaceChild(novoClose, closeAbout);
  
  novoClose.onclick = function() {
    const overlay = document.getElementById('about-overlay');
    if (overlay) overlay.classList.remove('active');
  };
}

// ===== CONTROLES PARA CELULAR =====
if (isMobile) {
  console.log("📱 Ativando controles para celular");
  
  // Botão MENU flutuante (para voltar ao menu)
  const menuFloatBtn = document.createElement('button');
  menuFloatBtn.textContent = '📋 MENU';
  menuFloatBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: black;
    border: 2px solid orange;
    border-radius: 50px;
    padding: 12px 20px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  `;
  menuFloatBtn.onclick = mostrarMenu;
  menuFloatBtn.ontouchstart = mostrarMenu;
  document.body.appendChild(menuFloatBtn);
  
  // Instrução
  const instr = document.createElement('div');
  instr.textContent = '👆 Toque nos botões para andar';
  instr.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 20px;
    background: black;
    color: orange;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    z-index: 9999;
  `;
  document.body.appendChild(instr);
  setTimeout(() => instr.remove(), 5000);
}

console.log("✅ main.js carregado - tudo pronto!");