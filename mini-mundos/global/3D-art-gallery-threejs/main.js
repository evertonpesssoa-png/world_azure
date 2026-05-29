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
// CONTROLES MÓVEIS - VERSÃO QUE FUNCIONA 100%
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1024);

if (isMobile || isTablet) {
    console.log("📱 Inicializando controles móveis...");
    
    // Aguardar o DOM estar pronto
    setTimeout(() => {
        // ========== FUNÇÃO PARA ENVIAR COMANDOS AO THREE.JS ==========
        // Usa o sistema de eventos diretamente no canvas
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
            
            // Disparar evento no canvas (mais confiável)
            const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
                key: key,
                code: code,
                bubbles: true,
                cancelable: true
            });
            
            canvas?.dispatchEvent(event);
            document.dispatchEvent(event);
        }
        
        // ========== CRIAR BOTÕES HTML COM CSS DIRETO ==========
        function createButton(text, styles, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            
            // Aplicar estilos diretamente no elemento
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
            
            // Feedback visual ao toque
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
        
        // ========== CRIAR BOTÕES ==========
        
        // Botão W (Andar frente)
        createButton('⬆️ W', { bottom: '100px', left: '20px' }, () => {
            console.log('▶️ Andar frente');
            sendCommand('w', true);
            setTimeout(() => sendCommand('w', false), 150);
        });
        
        // Botão S (Andar trás)
        createButton('⬇️ S', { bottom: '40px', left: '20px' }, () => {
            console.log('🔻 Andar trás');
            sendCommand('s', true);
            setTimeout(() => sendCommand('s', false), 150);
        });
        
        // Botão A (Esquerda)
        createButton('⬅️ A', { bottom: '70px', left: '80px' }, () => {
            console.log('◀️ Esquerda');
            sendCommand('a', true);
            setTimeout(() => sendCommand('a', false), 100);
        });
        
        // Botão D (Direita)
        createButton('➡️ D', { bottom: '70px', left: '140px' }, () => {
            console.log('▶️ Direita');
            sendCommand('d', true);
            setTimeout(() => sendCommand('d', false), 100);
        });
        
        // Botão MENU (M)
        createButton('📋 MENU', { bottom: '20px', right: '20px' }, () => {
            console.log('📋 Menu');
            sendCommand('m', true);
            setTimeout(() => sendCommand('m', false), 50);
        });
        
        // Botão EXPLORAR (Enter)
        createButton('🎮 EXPLORAR', { bottom: '20px', right: '160px' }, () => {
            console.log('🎮 Explorar');
            sendCommand('Enter', true);
            setTimeout(() => sendCommand('Enter', false), 50);
        });
        
        // Botão TRAVAR (Espaço)
        createButton('🔒 TRAVAR', { bottom: '20px', right: '300px' }, () => {
            console.log('🔒 Travar cursor');
            sendCommand(' ', true);
            setTimeout(() => sendCommand(' ', false), 50);
        });
        
        // ========== CONTROLE DE OLHAR (ARRASTAR) ==========
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
            console.log("🔓 Áudio desbloqueado");
        };
        document.body.addEventListener('touchstart', unlockAudio);
        
        // ========== INSTRUÇÃO FLUTUANTE ==========
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
        
    }, 500); // Delay para garantir que o Three.js carregou
}