import { keysPressed } from "./movement.js";
import { showMenu, hideMenu, isMenuVisible } from "./menu.js";
import { startAudio, stopAudio } from "./audioGuide.js";

let lockPointer = true;
let showMenuOnUnlock = false;

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const setupEventListeners = (controls, camera, scene) => {
  
  // Eventos de teclado (funciona em desktop)
  document.addEventListener("keydown", (event) => onKeyDown(event, controls), false);
  document.addEventListener("keyup", (event) => onKeyUp(event, controls), false);

  // Eventos de toque para celular (simula teclas)
  if (isMobile) {
    console.log("📱 Configurando eventos de toque para controles móveis");
    
    // Botões físicos do celular (já existem no HTML)
    // Os botões W/A/S/D já disparam eventos simulados do teclado
    // Só precisamos garantir que o menu não bloqueie interações
    
    // Impedir que o canvas capture toques quando menu está visível
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', (e) => {
        if (isMenuVisible()) {
          e.preventDefault();
        }
      });
    }
  }

  controls.addEventListener("unlock", () => {
    if (showMenuOnUnlock) {
      showMenu();
    }
    showMenuOnUnlock = false;
  });

  // Configurar botões de áudio (compatível com toque)
  const startAudioBtn = document.getElementById("start_audio");
  const stopAudioBtn = document.getElementById("stop_audio");
  
  if (startAudioBtn) {
    // Remover listeners antigos e adicionar novos
    const newStartBtn = startAudioBtn.cloneNode(true);
    startAudioBtn.parentNode.replaceChild(newStartBtn, startAudioBtn);
    newStartBtn.addEventListener("click", () => startAudio());
    newStartBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startAudio();
    });
  }
  
  if (stopAudioBtn) {
    const newStopBtn = stopAudioBtn.cloneNode(true);
    stopAudioBtn.parentNode.replaceChild(newStopBtn, stopAudioBtn);
    newStopBtn.addEventListener("click", () => stopAudio());
    newStopBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      stopAudio();
    });
  }

  // Botão toggle info
  const toggleBtn = document.getElementById("toggle-info");
  if (toggleBtn) {
    const newToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
    newToggleBtn.addEventListener("click", () => {
      document.getElementById("info-panel").classList.toggle("collapsed");
      newToggleBtn.innerText = document.getElementById("info-panel").classList.contains("collapsed") ? "Show" : "Hide";
    });
    newToggleBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      document.getElementById("info-panel").classList.toggle("collapsed");
      newToggleBtn.innerText = document.getElementById("info-panel").classList.contains("collapsed") ? "Show" : "Hide";
    });
  }

  // Botão About
  const aboutBtn = document.getElementById("about_button");
  if (aboutBtn) {
    const newAboutBtn = aboutBtn.cloneNode(true);
    aboutBtn.parentNode.replaceChild(newAboutBtn, aboutBtn);
    newAboutBtn.addEventListener("click", () => {
      document.getElementById("about-overlay").classList.add("active");
    });
    newAboutBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      document.getElementById("about-overlay").classList.add("active");
    });
  }

  // Fechar About
  const closeAbout = document.getElementById("close-about");
  if (closeAbout) {
    const newCloseAbout = closeAbout.cloneNode(true);
    closeAbout.parentNode.replaceChild(newCloseAbout, closeAbout);
    newCloseAbout.addEventListener("click", () => {
      document.getElementById("about-overlay").classList.remove("active");
    });
    newCloseAbout.addEventListener("touchstart", (e) => {
      e.preventDefault();
      document.getElementById("about-overlay").classList.remove("active");
    });
  }
  
  // Configurar botão PLAY (se existir e não foi configurado)
  const playBtn = document.getElementById("play_button");
  if (playBtn && playBtn.getAttribute('data-listener') !== 'true') {
    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
    newPlayBtn.setAttribute('data-listener', 'true');
    newPlayBtn.addEventListener("click", () => {
      hideMenu();
      if (!isMobile) {
        controls.lock();
        lockPointer = true;
      }
    });
    newPlayBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      hideMenu();
      // No celular, não tentar lock pointer
    });
  }
};

function togglePointerLock(controls) {
  if (lockPointer) {
    controls.lock();
  } else {
    showMenuOnUnlock = false;
    controls.unlock();
  }
  lockPointer = !lockPointer;
}

function onKeyDown(event, controls) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = true;
  }

  if (event.key === "Escape") {
    showMenu();
    showMenuOnUnlock = true;
    controls.unlock();
    lockPointer = false;
  }

  if (event.key === "Enter" || event.key === "Return") {
    hideMenu();
    controls.lock();
    lockPointer = true;
  }

  if (event.key === " ") {
    togglePointerLock(controls);
  }

  if (event.key === "g") {
    startAudio();
  }

  if (event.key === "p") {
    stopAudio();
  }

  if (event.key === "m") {
    showMenu();
    showMenuOnUnlock = true;
    controls.unlock();
    lockPointer = false;
  }

  if (event.key === "r") {
    location.reload();
  }
}

function onKeyUp(event, controls) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = false;
  }
}