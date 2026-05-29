import * as THREE from "three";

let sound;
let bufferLoaded = false;
let isPlaying = false;

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// setup audio for the scene
export const setupAudio = (camera) => {
  console.log("🔊 Inicializando áudio...");
  
  // create an audio listener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  
  // Tentar carregar o áudio (caminho correto para o GitHub)
  const audioPath = "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/sounds/tiersen.mp3";
  
  audioLoader.load(audioPath, 
    function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      bufferLoaded = true;
      console.log("✅ Áudio carregado com sucesso!");
    },
    function (xhr) {
      // Progresso do carregamento
      console.log(`🎵 Carregando áudio: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`);
    },
    function (error) {
      console.error("❌ Erro ao carregar áudio:", error);
      console.log("⚠️ Tentando caminho alternativo...");
      
      // Tentativa com caminho relativo (fallback)
      const fallbackPath = "./sounds/tiersen.mp3";
      audioLoader.load(fallbackPath, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        bufferLoaded = true;
        console.log("✅ Áudio carregado via fallback!");
      });
    }
  );
};

// play audio (com desbloqueio para celular)
export const startAudio = () => {
  if (!sound) {
    console.warn("🔊 Áudio não inicializado");
    return;
  }
  
  if (!bufferLoaded) {
    console.warn("🔊 Áudio ainda carregando, tente novamente em alguns segundos");
    return;
  }
  
  if (isPlaying) {
    console.log("🔊 Áudio já está tocando");
    return;
  }
  
  try {
    sound.play();
    isPlaying = true;
    console.log("🎵 Áudio iniciado");
  } catch (error) {
    console.error("❌ Erro ao tocar áudio:", error);
    // No celular, pode precisar de interação do usuário
    console.log("📱 Pode ser necessário tocar na tela primeiro para desbloquear o áudio");
  }
};

// pause audio
export const stopAudio = () => {
  if (sound && isPlaying) {
    try {
      sound.pause();
      isPlaying = false;
      console.log("🔇 Áudio pausado");
    } catch (error) {
      console.error("❌ Erro ao pausar áudio:", error);
    }
  }
};

// Alternar play/pause
export const toggleAudio = () => {
  if (isPlaying) {
    stopAudio();
  } else {
    startAudio();
  }
};

// Verificar se o áudio está tocando
export const isAudioPlaying = () => {
  return isPlaying;
};

// Desbloquear áudio no celular (chamar no primeiro toque do usuário)
export const unlockAudioOnTouch = () => {
  if (!bufferLoaded) {
    console.log("🔓 Aguardando carregamento do áudio para desbloquear...");
    return;
  }
  
  // Criar um contexto de áudio vazio e descartar (técnica de desbloqueio)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(audioContext.destination);
  
  const oscillator = audioContext.createOscillator();
  oscillator.connect(gainNode);
  oscillator.start(0);
  oscillator.stop(0.001);
  
  audioContext.close().then(() => {
    console.log("🔓 Áudio desbloqueado para celular!");
  }).catch(() => {});
  
  // Remover o listener depois de desbloquear
  document.removeEventListener('touchstart', unlockAudioOnTouch);
  document.removeEventListener('click', unlockAudioOnTouch);
};

// Configurar desbloqueio automático para celular
if (isMobile) {
  document.addEventListener('touchstart', unlockAudioOnTouch, { once: true });
  document.addEventListener('click', unlockAudioOnTouch, { once: true });
}