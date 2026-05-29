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
import { setupPlayButton } from "./modules/menu.js";
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

setupPlayButton(controls);
setupEventListeners(controls);
clickHandling(renderer, camera, paintings);
setupRendering(scene, camera, renderer, paintings, controls, walls);

loadStatueModel(scene);
loadBenchModel(scene);
loadCeilingLampModel(scene);
setupVR(renderer);

// ============================================================
// SOLUÇÃO DEFINITIVA - CONTROLES QUE FUNCIONAM
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// AGUARDAR O THREE.JS CARREGAR COMPLETAMENTE
setTimeout(() => {
  console.log("🚀 Ativando controles de emergência...");
  
  const canvas = renderer?.domElement;
  if (!canvas) {
    console.error("❌ Canvas não encontrado!");
    return;
  }
  
  // ========== 1. BOTÃO PLAY - FORÇADO ==========
  const forcePlay = () => {
    console.log("🎮 PLAY ACIONADO!");
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = 'none';
      menu.style.visibility = 'hidden';
    }
    // Forçar foco no canvas
    canvas.focus();
    canvas.click();
  };
  
  const playBtn = document.getElementById('play_button');
  if (playBtn) {
    // Remover todos os listeners antigos
    const newBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newBtn, playBtn);
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      forcePlay();
    });
    newBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      forcePlay();
    });
    console.log("✅ Botão PLAY conectado");
  }
  
  // ========== 2. MOVIMENTO VIA TOQUE SIMPLES ==========
  let touchActive = false;
  let lastTouchX = 0, lastTouchY = 0;
  
  // Movimento para frente ao tocar no canvas
  const moveForward = () => {
    console.log("🚶 Movendo para frente");
    // Simular tecla W
    const keyEvent = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true });
    document.dispatchEvent(keyEvent);
    setTimeout(() => {
      const keyUp = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true });
      document.dispatchEvent(keyUp);
    }, 100);
  };
  
  // Arrastar para olhar ao redor
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchActive = true;
    const touch = e.touches[0];
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
    
    // Primeiro toque = andar para frente (mais intuitivo)
    moveForward();
  });
  
  canvas.addEventListener('touchmove', (e) => {
    if (!touchActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchX;
    const deltaY = touch.clientY - lastTouchY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      // Simular movimento do mouse para olhar
      const mouseEvent = new MouseEvent('mousemove', {
        movementX: deltaX,
        movementY: deltaY,
        bubbles: true
      });
      canvas.dispatchEvent(mouseEvent);
    }
    
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
  });
  
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchActive = false;
  });
  
  // ========== 3. BOTÕES FLUTUANTES ==========
  function addFloatingButton(text, x, y, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      position: fixed;
      bottom: ${y}px;
      left: ${x}px;
      z-index: 20000;
      background: rgba(0,0,0,0.9);
      border: 2px solid #ff6600;
      border-radius: 50px;
      padding: 12px 20px;
      color: white;
      font-size: 18px;
      font-weight: bold;
      font-family: monospace;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 0 15px rgba(255,102,0,0.5);
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    document.body.appendChild(btn);
    return btn;
  }
  
  if (isMobile) {
    // Botão ANDAR (W)
    addFloatingButton('⬆️ ANDAR', 20, 100, () => {
      console.log('⬆️ Andar');
      const keyDown = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true });
      document.dispatchEvent(keyDown);
      setTimeout(() => {
        const keyUp = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true });
        document.dispatchEvent(keyUp);
      }, 150);
    });
    
    // Botão MENU
    addFloatingButton('📋 MENU', 20, 50, () => {
      console.log('📋 Menu');
      const menu = document.getElementById('menu');
      if (menu) {
        menu.style.display = 'flex';
        menu.style.visibility = 'visible';
      }
    });
    
    // Instrução
    const instr = document.createElement('div');
    instr.textContent = '👆 Toque na tela = andar | Arraste = olhar';
    instr.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: #ffaa00;
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 12px;
      z-index: 20000;
      white-space: nowrap;
      pointer-events: none;
    `;
    document.body.appendChild(instr);
    setTimeout(() => instr.remove(), 4000);
  }
  
  console.log("✅ Controles de emergência ativados!");
  
}, 1000);