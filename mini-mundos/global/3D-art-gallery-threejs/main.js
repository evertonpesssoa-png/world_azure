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
// SUPORTE UNIVERSAL: PC, CELULAR, TABLET
// ============================================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1024);

if (isMobile || isTablet) {
    console.log("📱 Modo touch ativado");
    
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
        if (document.activeElement) {
            document.activeElement.dispatchEvent(event);
        }
    }
    
    // Criar joystick (se não existir)
    if (!document.getElementById('touch-joypad')) {
        const joypad = document.createElement('div');
        joypad.id = 'touch-joypad';
        joypad.className = 'touch-joypad';
        joypad.innerHTML = `
            <div class="joy-btn joy-empty"></div>
            <div class="joy-btn" data-key="w">⬆️</div>
            <div class="joy-btn joy-empty"></div>
            <div class="joy-btn" data-key="a">⬅️</div>
            <div class="joy-btn" data-key="s">⬇️</div>
            <div class="joy-btn" data-key="d">➡️</div>
            <div class="joy-btn joy-empty"></div>
            <div class="joy-btn" data-key=" ">⚡</div>
            <div class="joy-btn joy-empty"></div>
        `;
        document.body.appendChild(joypad);
    }
    
    // Criar painel de botões
    if (!document.getElementById('mobile-controls-panel')) {
        const panel = document.createElement('div');
        panel.id = 'mobile-controls-panel';
        panel.className = 'mobile-controls-panel';
        panel.innerHTML = `
            <button class="mobile-btn" id="mobile-menu-btn">📋 MENU</button>
            <button class="mobile-btn" id="mobile-enter-btn">🎮 ENTER</button>
        `;
        document.body.appendChild(panel);
    }
    
    // Configurar joystick
    document.querySelectorAll('.joy-btn[data-key]').forEach(btn => {
        const key = btn.dataset.key;
        
        const startPress = (e) => {
            e.preventDefault();
            simulateKey(key, 'keydown');
            btn.style.transform = 'scale(0.88)';
            btn.style.background = 'rgba(255,100,0,0.9)';
        };
        
        const endPress = (e) => {
            e.preventDefault();
            simulateKey(key, 'keyup');
            btn.style.transform = '';
            btn.style.background = '';
        };
        
        btn.addEventListener('touchstart', startPress);
        btn.addEventListener('touchend', endPress);
        btn.addEventListener('touchcancel', endPress);
        btn.addEventListener('mousedown', startPress);
        btn.addEventListener('mouseup', endPress);
    });
    
    // Botão Menu (M)
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            simulateKey('m', 'keydown');
            setTimeout(() => simulateKey('m', 'keyup'), 100);
        });
    }
    
    // Botão Enter
    const enterBtn = document.getElementById('mobile-enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            simulateKey('Enter', 'keydown', 'Enter');
            setTimeout(() => simulateKey('Enter', 'keyup', 'Enter'), 100);
        });
    }
    
    // Áudio: primeiro toque desbloqueia
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
    
    // Ajustar pointer lock para toque
    let pointerLockActive = false;
    const spaceBtn = document.querySelector('.joy-btn[data-key=" "]');
    if (spaceBtn && renderer && renderer.domElement) {
        spaceBtn.addEventListener('click', () => {
            if (!pointerLockActive) {
                renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.webkitRequestPointerLock;
                if (renderer.domElement.requestPointerLock) {
                    renderer.domElement.requestPointerLock();
                    pointerLockActive = true;
                }
            } else {
                document.exitPointerLock();
                pointerLockActive = false;
            }
        });
    }
    
    // Forçar foco no body para receber eventos
    document.body.setAttribute('tabindex', '0');
    document.body.focus();
    
    console.log("✅ Controle responsivo ativado!");
}

// Adicionar classe CSS para identificar dispositivo
if (isMobile) {
    document.body.classList.add('is-mobile');
} else if (isTablet) {
    document.body.classList.add('is-tablet');
} else {
    document.body.classList.add('is-desktop');
}