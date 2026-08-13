// =========================
// MENU.JS
// SIMPLES E ESTÁVEL
// =========================

import {
  startAudio
} from "./audioGuide.js";


const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );


// ============================================================
// ESCONDER MENU
// ============================================================

export const hideMenu = () => {

  const menu =
    document.getElementById("menu");

  if (!menu) return;

  // ==============================================
  // FORÇA BRUTA: ESCONDE O MENU IMEDIATAMENTE
  // ==============================================

  menu.style.display = "none";

  menu.style.visibility = "hidden";

  menu.style.opacity = "0";

  menu.style.pointerEvents = "none";

  menu.style.zIndex = "-9999";

  // Remove a classe hidden para garantir
  // que não haja conflito

  menu.classList.remove("hidden");
};


// ============================================================
// MOSTRAR MENU
// ============================================================

export const showMenu = () => {

  const menu =
    document.getElementById("menu");

  if (!menu) return;

  // ==============================================
  // RESETA O MENU PARA APARECER DE NOVO
  // ==============================================

  menu.style.display = "";

  menu.style.visibility = "";

  menu.style.opacity = "";

  menu.style.pointerEvents = "";

  menu.style.zIndex = "";

  menu.classList.remove("hidden");
};


// ============================================================
// INICIAR EXPERIÊNCIA
// ============================================================

export const startExperience = (controls) => {

  // ==============================================
  // 🎵 INICIA A MÚSICA AO ENTRAR NA GALERIA
  // ==============================================

  startAudio();


  // ==============================================
  // ESCONDE O MENU
  // ==============================================

  hideMenu();


  // ==============================================
  // CORREÇÃO CRUCIAL:
  // Para celular, não tenta travar o mouse!
  // ==============================================

  if (isMobile) {

    document.dispatchEvent(
      new CustomEvent("experienceStarted")
    );

    return;
  }


  // ==============================================
  // DESKTOP — POINTER LOCK
  // ==============================================

  try {

    if (controls?.lock) {

      controls.lock();

    }

  } catch (err) {

    console.warn(
      "Erro ao ativar PointerLock:",
      err
    );

  }


  // ==============================================
  // AVISA QUE A EXPERIÊNCIA COMEÇOU
  // ==============================================

  document.dispatchEvent(
    new CustomEvent("experienceStarted")
  );

};


// ============================================================
// SAIR DA EXPERIÊNCIA
// ============================================================

export const exitExperience = (controls) => {

  showMenu();


  // ==============================================
  // DESKTOP — LIBERA POINTER LOCK
  // ==============================================

  if (!isMobile) {

    try {

      if (controls?.unlock) {

        controls.unlock();

      }

    } catch (err) {

      console.warn(
        "Erro ao sair:",
        err
      );

    }

  }


  // ==============================================
  // AVISA QUE A EXPERIÊNCIA TERMINOU
  // ==============================================

  document.dispatchEvent(
    new CustomEvent("experienceExited")
  );

};


// ============================================================
// CONFIGURA BOTÕES DO MENU
// ============================================================

export const setupPlayButton = (controls) => {

  const playButton =
    document.getElementById(
      "play_button"
    );

  const aboutButton =
    document.getElementById(
      "about_button"
    );

  const overlay =
    document.getElementById(
      "about-overlay"
    );

  const closeAbout =
    document.getElementById(
      "close-about"
    );


  // ==========================================================
  // PLAY
  // ==========================================================

  if (playButton) {

    playButton.onclick = (e) => {

      e.preventDefault();

      e.stopPropagation();


      startExperience(
        controls
      );

    };

  }


  // ==========================================================
  // ABOUT
  // ==========================================================

  if (aboutButton) {

    aboutButton.onclick = (e) => {

      e.preventDefault();

      e.stopPropagation();


      overlay?.classList.add(
        "active"
      );

    };

  }


  // ==========================================================
  // FECHAR ABOUT
  // ==========================================================

  if (closeAbout) {

    closeAbout.onclick = (e) => {

      e.preventDefault();

      e.stopPropagation();


      overlay?.classList.remove(
        "active"
      );

    };

  }


  // ==========================================================
  // FECHAR CLICANDO FORA
  // ==========================================================

  if (overlay) {

    overlay.onclick = (e) => {

      if (
        e.target === overlay
      ) {

        overlay.classList.remove(
          "active"
        );

      }

    };

  }

};


// ============================================================
// COMPATIBILIDADE
// ============================================================

export const setupOverlayClose = () => {

  // Mantido apenas para compatibilidade

};


// ============================================================
// VERIFICAR SE MENU ESTÁ VISÍVEL
// ============================================================

export const isMenuVisible = () => {

  const menu =
    document.getElementById(
      "menu"
    );

  if (!menu) return false;


  // Verifica se não está com display: none

  return (
    menu.style.display !== "none"
  );

};