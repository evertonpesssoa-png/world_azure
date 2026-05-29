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
import { setupPlayButton, startExperience, hideMenu, showMenu } from "./modules/menu.js";
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

// ============================================================
// CORREÇÃO DO BOTÃO PLAY - SOLUÇÃO DEFINITIVA
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1024);

// Função para iniciar a experiência (forçada)
function forceStartExperience() {
  console.log("🎮 Forçando início da experiência...");
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = 'none';
    menu.style.visibility = 'hidden';
    menu.style.pointerEvents = 'none';
  }
  
  if (!isMobile && controls && controls.lock) {
    try {
      controls.lock();
    } catch(e) { console.warn(e); }
  }
  
  if (renderer && renderer.domElement) {
    renderer.domElement.focus();
  }
}

// Configurar botão PLAY diretamente (sem depender de módulos)
document.addEventListener('DOMContentLoaded', () => {
  console.log("🔧 Configurando botões...");
  
  // Botão PLAY
  const playBtn = document.getElementById('play_button');
  if (playBtn) {
    // Remover listeners antigos
    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
    
    const handlePlay = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("✅ PLAY clicado!");
      forceStartExperience();
    };
    
    newPlayBtn.addEventListener('click', handlePlay);
    newPlayBtn.addEventListener('touchstart', handlePlay, { passive: false });
    console.log("✅ Botão PLAY configurado");
  } else {
    console.warn("⚠️ Botão PLAY não encontrado!");
  }
  
  // Botão ABOUT
  const aboutBtn = document.getElementById('about_button');
  if (aboutBtn) {
    const newAboutBtn = aboutBtn.cloneNode(true);
    aboutBtn.parentNode.replaceChild(newAboutBtn, aboutBtn);
    
    const handleAbout = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("ℹ️ ABOUT clicado");
      const overlay = document.getElementById('about-overlay');
      if (overlay) {
        overlay.classList.add('active');
      }
    };
    
    newAboutBtn.addEventListener('click', handleAbout);
    newAboutBtn.addEventListener('touchstart', handleAbout, { passive: false });
    console.log("✅ Botão ABOUT configurado");
  }
  
  // Fechar overlay do about
  const closeAbout = document.getElementById('close-about');
  if (closeAbout) {
    const newCloseBtn = closeAbout.cloneNode(true);
    closeAbout.parentNode.replaceChild(newCloseBtn, closeAbout);
    newCloseBtn.addEventListener('click', () => {
      document.getElementById('about-overlay')?.classList.remove('active');
    });
    newCloseBtn.addEventListener('touchstart', () => {
      document.getElementById('about-overlay')?.classList.remove('active');
    });
  }
});

// Chamar setupPlayButton mesmo assim (fallback)
setTimeout(() => {
  try {
    setupPlayButton(controls);
  } catch(e) {
    console.warn("setupPlayButton fallback:", e);
  }
}, 100);

setupEventListeners(controls);

clickHandling(renderer, camera, paintings);

setupRendering(scene, camera, renderer, paintings, controls, walls);

loadStatueModel(scene);
loadBenchModel(scene);
loadCeilingLampModel(scene);

setupVR(renderer);

// ============================================================
// CONTROLES MÓVEIS
// ============================================================

if (isMobile || isTablet) {
    console.log("📱 Inicializando controles móveis...");
    
    setTimeout(() => {
        const canvas = renderer?.domElement;
        
        function sendCommand(key, isDown = true) {
            const keyMap = {
                'w': 'KeyW',
                'a': 'KeyA', 
                's': 'KeyS',
                'd': 'KeyD',
                ' ': 'Space',
                'Enter': 'Enter',
                'm': 'KeyM'
            };
            
            const code = keyMap[key] || `Key${key.toUpperCase()}`;
            
            const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
                key: key,
                code: code,
                bubbles: true,
                cancelable: true
            });
            
            canvas?.dispatchEvent(event);
            document.dispatchEvent(event);
        }
        
        function createButton(text, styles, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            
            Object.assign(btn.style, {
                position: 'fixed',
                zIndex: '10000',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,100,0,0.5)',
                borderRadius: '50px',
                padding: '10px 18px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace',
                touchAction: 'manipulation',
                boxShadow: '0 0 15px rgba(255,100,0,0.3)',
                transition: 'all 0.1s ease',
                ...styles
            });
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.style.transform = 'scale(0.95)';
                btn.style.background = 'rgba(255,100,0,0.9)';
                onClick();
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.style.transform = 'scale(1)';
                btn.style.background = 'rgba(0,0,0,0.85)';
            });
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            });
            
            document.body.appendChild(btn);
            return btn;
        }
        
        // Botões de movimento
        createButton('⬆️ W', { bottom: '100px', left: '20px' }, () => {
            sendCommand('w', true);
            setTimeout(() => sendCommand('w', false), 150);
        });
        
        createButton('⬇️ S', { bottom: '40px', left: '20px' }, () => {
            sendCommand('s', true);
            setTimeout(() => sendCommand('s', false), 150);
        });
        
        createButton('⬅️ A', { bottom: '70px', left: '80px' }, () => {
            sendCommand('a', true);
            setTimeout(() => sendCommand('a', false), 100);
        });
        
        createButton('➡️ D', { bottom: '70px', left: '140px' }, () => {
            sendCommand('d', true);
            setTimeout(() => sendCommand('d', false), 100);
        });
        
        // Botão MENU (mostra menu novamente)
        createButton('📋 MENU', { bottom: '20px', right: '20px' }, () => {
            console.log('📋 Abrindo menu');
            const menu = document.getElementById('menu');
            if (menu) {
                menu.style.display = 'flex';
                menu.style.visibility = 'visible';
                menu.style.pointerEvents = 'auto';
            }
        });
        
        // Botão TRAVAR (Espaço)
        createButton('🔒 TRAVAR', { bottom: '20px', right: '160px' }, () => {
            sendCommand(' ', true);
            setTimeout(() => sendCommand(' ', false), 50);
        });
        
        // Controle de olhar (arrastar)
        let touchStartX = 0, touchStartY = 0;
        let isDragging = false;
        
        if (canvas) {
            canvas.style.touchAction = 'none';
            
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                isDragging = true;
            });
            
            canvas.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                if (deltaX !== 0 || deltaY !== 0) {
                    const mouseEvent = new MouseEvent('mousemove', {
                        movementX: deltaX,
                        movementY: deltaY,
                        bubbles: true
                    });
                    canvas.dispatchEvent(mouseEvent);
                }
                
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
            });
            
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                isDragging = false;
            });
        }
        
        // Desbloquear áudio
        const unlockAudio = () => {
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach(audio => {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            });
            document.body.removeEventListener('touchstart', unlockAudio);
            console.log("🔓 Áudio desbloqueado");
        };
        document.body.addEventListener('touchstart', unlockAudio);
        
        // Instrução flutuante
        const instruction = document.createElement('div');
        instruction.textContent = '👆 Arraste para olhar | Botões para andar';
        instruction.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            border-radius: 30px;
            padding: 8px 16px;
            color: #ffaa00;
            font-size: 12px;
            font-family: monospace;
            z-index: 10000;
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
            button {
                -webkit-tap-highlight-color: transparent;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(instruction);
        
        console.log("✅ Controles móveis instalados!");
        
    }, 500);
}

console.log("✅ main.js carregado completamente");