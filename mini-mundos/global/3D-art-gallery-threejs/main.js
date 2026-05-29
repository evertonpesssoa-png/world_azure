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

// Aguardar o DOM estar completamente carregado
window.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 DOM carregado - configurando botões...");
  
  // Função para esconder o menu
  function esconderMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = 'none';
      menu.style.visibility = 'hidden';
      menu.style.pointerEvents = 'none';
      console.log("✅ Menu escondido");
    }
  }

  // Função para mostrar o menu
  function mostrarMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = 'flex';
      menu.style.visibility = 'visible';
      menu.style.pointerEvents = 'auto';
      console.log("✅ Menu mostrado");
    }
  }

  // ===== BOTÃO PLAY =====
  const playButton = document.getElementById('play_button');
  if (playButton) {
    // Remove qualquer listener anterior clonando
    const novoPlay = playButton.cloneNode(true);
    playButton.parentNode.replaceChild(novoPlay, playButton);
    
    novoPlay.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      esconderMenu();
      console.log("🎮 PLAY clicado!");
    };
    
    novoPlay.ontouchstart = function(e) {
      e.preventDefault();
      e.stopPropagation();
      esconderMenu();
      console.log("🎮 PLAY tocado!");
    };
    
    console.log("✅ Botão PLAY configurado");
  } else {
    console.error("❌ Botão PLAY não encontrado no DOM");
  }

  // ===== BOTÃO ABOUT =====
  const aboutButton = document.getElementById('about_button');
  if (aboutButton) {
    const novoAbout = aboutButton.cloneNode(true);
    aboutButton.parentNode.replaceChild(novoAbout, aboutButton);
    
    novoAbout.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('about-overlay');
      if (overlay) overlay.classList.add('active');
      console.log("ℹ️ About aberto");
    };
    
    novoAbout.ontouchstart = function(e) {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('about-overlay');
      if (overlay) overlay.classList.add('active');
      console.log("ℹ️ About tocado");
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
      console.log("❌ About fechado");
    };
    
    novoClose.ontouchstart = function() {
      const overlay = document.getElementById('about-overlay');
      if (overlay) overlay.classList.remove('active');
    };
  }

  // ===== TOGGLE INFO PANEL =====
  const toggleBtn = document.getElementById('toggle-info');
  if (toggleBtn) {
    toggleBtn.onclick = function() {
      const panel = document.getElementById('info-panel');
      if (panel) panel.classList.toggle('collapsed');
      this.innerText = panel?.classList.contains('collapsed') ? "Mostrar" : "Esconder";
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
      background: rgba(0,0,0,0.9);
      border: 2px solid #ff6600;
      border-radius: 50px;
      padding: 12px 20px;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 0 10px rgba(255,102,0,0.5);
    `;
    menuFloatBtn.onclick = mostrarMenu;
    menuFloatBtn.ontouchstart = mostrarMenu;
    document.body.appendChild(menuFloatBtn);
    
    // Botão ANDAR flutuante
    const andarBtn = document.createElement('button');
    andarBtn.textContent = '⬆️ ANDAR';
    andarBtn.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 20px;
      z-index: 9999;
      background: rgba(0,0,0,0.9);
      border: 2px solid #00ffcc;
      border-radius: 50px;
      padding: 12px 20px;
      color: #00ffcc;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 0 10px rgba(0,255,204,0.3);
    `;
    andarBtn.onclick = function() {
      console.log("⬆️ ANDAR");
      const keyEvent = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true });
      document.dispatchEvent(keyEvent);
      setTimeout(() => {
        const keyUp = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true });
        document.dispatchEvent(keyUp);
      }, 150);
    };
    andarBtn.ontouchstart = function(e) {
      e.preventDefault();
      console.log("⬆️ ANDAR (toque)");
      const keyEvent = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true });
      document.dispatchEvent(keyEvent);
      setTimeout(() => {
        const keyUp = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true });
        document.dispatchEvent(keyUp);
      }, 150);
    };
    document.body.appendChild(andarBtn);
    
    // Instrução flutuante
    const instr = document.createElement('div');
    instr.textContent = '👆 Toque em "EXPLORAR ARTE" para começar';
    instr.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.9);
      color: #ffaa00;
      padding: 15px 25px;
      border-radius: 30px;
      font-size: 14px;
      z-index: 10000;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #ffaa00;
      pointer-events: none;
      animation: fadeOutInstr 4s ease forwards;
    `;
    
    const styleInstr = document.createElement('style');
    styleInstr.textContent = `
      @keyframes fadeOutInstr {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); visibility: hidden; }
      }
    `;
    document.head.appendChild(styleInstr);
    document.body.appendChild(instr);
    setTimeout(() => instr.remove(), 4000);
  }
});

// Fallback: caso o DOM já esteja carregado
if (document.readyState === 'loading') {
  console.log("⏳ Aguardando DOMContentLoaded...");
} else {
  console.log("✅ DOM já estava carregado");
  // Disparar manualmente se necessário
  setTimeout(() => {
    const event = new Event('DOMContentLoaded');
    window.dispatchEvent(event);
  }, 100);
}

console.log("✅ main.js carregado - tudo pronto!");