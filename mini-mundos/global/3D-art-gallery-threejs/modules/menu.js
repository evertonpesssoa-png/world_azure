// ==============================================
// ÁUDIO DA GALERIA
// ==============================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

let sound = null;
let bufferLoaded = false;
let isPlaying = false;

// Quando true, significa que o usuário já clicou
// em EXPLORAR e o áudio deve começar assim que carregar.
let playWhenLoaded = false;


// ==============================================
// SETUP DO ÁUDIO
// ==============================================

export const setupAudio = (camera) => {

  console.log("🔊 Inicializando áudio...");

  const listener = new THREE.AudioListener();

  camera.add(listener);

  sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  const audioPath =
    "/world_azure/mini-mundos/global/3D-art-gallery-threejs/public/sounds/tiersen.mp3";


  audioLoader.load(
    audioPath,

    // ==========================================
    // ÁUDIO CARREGADO
    // ==========================================

    function (buffer) {

      sound.setBuffer(buffer);

      sound.setLoop(true);

      sound.setVolume(0.5);

      bufferLoaded = true;

      console.log(
        "✅ Áudio carregado com sucesso!"
      );


      // ========================================
      // O USUÁRIO JÁ TINHA CLICADO EM EXPLORAR
      // ========================================

      if (playWhenLoaded) {

        startAudio();

      }

    },


    // ==========================================
    // PROGRESSO
    // ==========================================

    function (xhr) {

      if (xhr.total) {

        console.log(
          `🎵 Carregando áudio: ${Math.floor(
            (xhr.loaded / xhr.total
          ) * 100)}%`
        );

      }

    },


    // ==========================================
    // ERRO
    // ==========================================

    function (error) {

      console.error(
        "❌ Erro ao carregar áudio:",
        error
      );

    }
  );
};


// ==============================================
// INICIAR ÁUDIO
// ==============================================

export const startAudio = () => {

  // O usuário pediu para tocar.
  // Se ainda estiver carregando, toca assim
  // que terminar.

  playWhenLoaded = true;


  if (!sound) {

    console.warn(
      "🔊 Áudio ainda não foi inicializado"
    );

    return;

  }


  if (!bufferLoaded) {

    console.log(
      "🔊 Áudio carregando... tocará automaticamente quando terminar."
    );

    return;

  }


  if (isPlaying) {

    console.log(
      "🔊 Áudio já está tocando"
    );

    return;

  }


  try {

    // Retoma o contexto caso o navegador
    // tenha suspendido o áudio.

    if (
      sound.context &&
      sound.context.state === "suspended"
    ) {

      sound.context.resume();

    }


    sound.play();

    isPlaying = true;

    console.log(
      "🎵 Áudio iniciado!"
    );

  } catch (error) {

    console.error(
      "❌ Erro ao tocar áudio:",
      error
    );

  }

};


// ==============================================
// PARAR ÁUDIO
// ==============================================

export const stopAudio = () => {

  playWhenLoaded = false;


  if (sound && isPlaying) {

    try {

      sound.pause();

      isPlaying = false;

      console.log(
        "🔇 Áudio pausado"
      );

    } catch (error) {

      console.error(
        "❌ Erro ao pausar áudio:",
        error
      );

    }

  }

};


// ==============================================
// TOGGLE
// ==============================================

export const toggleAudio = () => {

  if (isPlaying) {

    stopAudio();

  } else {

    startAudio();

  }

};


// ==============================================
// STATUS
// ==============================================

export const isAudioPlaying = () => {

  return isPlaying;

};


// ==============================================
// DESBLOQUEIO
// ==============================================

export const unlockAudioOnTouch = () => {

  if (!sound) {

    return;

  }


  try {

    const context = sound.context;


    if (context.state === "suspended") {

      context.resume();

      console.log(
        "🔓 Contexto de áudio desbloqueado!"
      );

    }

  } catch (error) {

    console.warn(
      "⚠️ Não foi possível desbloquear áudio:",
      error
    );

  }

};