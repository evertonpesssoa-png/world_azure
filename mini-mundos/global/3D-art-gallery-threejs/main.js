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
// CONTROLES POR TOQUE INTERATIVOS (SEM JOYSTICK)
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1024);

if (isMobile || isTablet) {
    console.log("📱 Modo toque interativo ativado (sem joystick)");
    
    // Variáveis para controle de toque
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTime = 0;
    let isMoving = false;
    
    // Flag para saber se o pointer lock está ativo
    let pointerLockActive = false;
    
    // Função para simular teclas
    function simulateKey(key, type, code = null) {
        const keyCode = code || (key === ' ' ? 'Space' : `Key${key.toUpperCase()}`);
        const event = new KeyboardEvent(type, {
            key: key,
            code: keyCode,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
    
    // ========== ARRASTAR PARA OLHAR (mouse look) ==========
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isMoving = true;
        
        // Ativar pointer lock no primeiro toque (se não estiver ativo)
        if (!pointerLockActive && renderer && renderer.domElement) {
            renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.webkitRequestPointerLock;
            if (renderer.domElement.requestPointerLock) {
                renderer.domElement.requestPointerLock();
                pointerLockActive = true;
            }
        }
    }
    
    function handleTouchMove(e) {
        if (!isMoving) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Simular movimento do mouse para olhar ao redor
        if (deltaX !== 0 || deltaY !== 0) {
            const mouseMoveEvent = new MouseEvent('mousemove', {
                movementX: deltaX,
                movementY: deltaY,
                bubbles: true
            });
            document.dispatchEvent(mouseMoveEvent);
        }
        
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        isMoving = false;
        
        // Detectar toque duplo para andar (simular W)
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 300 && tapLength > 0) {
            // Toque duplo detectado - andar para frente
            console.log("🚶 Toque duplo - andando para frente");
            simulateKey('w', 'keydown');
            setTimeout(() => simulateKey('w', 'keyup'), 150);
        }
        
        lastTapTime = currentTime;
    }
    
    // ========== ADICIONAR EVENTOS DE TOQUE ==========
    const canvas = renderer?.domElement;
    if (canvas) {
        canvas.style.touchAction = 'none'; // Melhora resposta ao toque
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);
    }
    
    // ========== CRIAR BOTÕES FLUTUANTES ==========
    
    // Botão Menu (M)
    const menuBtn = document.createElement('button');
    menuBtn.textContent = '📋 MENU';
    menuBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 50px;
        padding: 12px 20px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
        touch-action: manipulation;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    menuBtn.addEventListener('click', () => {
        simulateKey('m', 'keydown');
        setTimeout(() => simulateKey('m', 'keyup'), 100);
    });
    document.body.appendChild(menuBtn);
    
    // Botão Enter (Explorar)
    const enterBtn = document.createElement('button');
    enterBtn.textContent = '🎮 EXPLORAR';
    enterBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 120px;
        z-index: 1000;
        background: linear-gradient(135deg, rgba(255,100,0,0.8), rgba(255,50,0,0.6));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 50px;
        padding: 12px 20px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
        touch-action: manipulation;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    enterBtn.addEventListener('click', () => {
        simulateKey('Enter', 'keydown', 'Enter');
        setTimeout(() => simulateKey('Enter', 'keyup', 'Enter'), 100);
    });
    document.body.appendChild(enterBtn);
    
    // Botão Espaço (travar/ destravar cursor) - opcional
    const spaceBtn = document.createElement('button');
    spaceBtn.textContent = '⚡ TRAVAR';
    spaceBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 240px;
        z-index: 1000;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0,255,255,0.5);
        border-radius: 50px;
        padding: 12px 16px;
        color: #0ff;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        font-family: monospace;
        touch-action: manipulation;
    `;
    spaceBtn.addEventListener('click', () => {
        simulateKey(' ', 'keydown', 'Space');
        setTimeout(() => simulateKey(' ', 'keyup', 'Space'), 100);
    });
    document.body.appendChild(spaceBtn);
    
    // ========== DESBLOQUEAR ÁUDIO ==========
    const unlockAudio = () => {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(() => {});
        });
        document.body.removeEventListener('touchstart', unlockAudio);
        document.body.removeEventListener('click', unlockAudio);
        console.log("🔓 Áudio desbloqueado");
    };
    
    document.body.addEventListener('touchstart', unlockAudio, { once: true });
    document.body.addEventListener('click', unlockAudio, { once: true });
    
    // Forçar foco
    document.body.setAttribute('tabindex', '0');
    document.body.focus();
    
    // Instrução flutuante
    const instruction = document.createElement('div');
    instruction.textContent = '👆 Arraste para olhar • Toque duplo para andar';
    instruction.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(8px);
        border-radius: 30px;
        padding: 8px 16px;
        color: #ffaa00;
        font-size: 12px;
        font-family: monospace;
        z-index: 1000;
        white-space: nowrap;
        pointer-events: none;
        animation: fadeOut 3s ease forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(instruction);
    
    console.log("✅ Controle por toque interativo ativado!");
}

// Adicionar classe CSS para identificar dispositivo
const isMobileDetected = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobileDetected) {
    document.body.classList.add('is-mobile');
}