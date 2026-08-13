// =========================
// MENU.JS
// SIMPLES E ESTÁVEL
// =========================

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );


// ==============================================
// ESCONDER MENU
// ==============================================

export const hideMenu = () => {

  const menu = document.getElementById("menu");

  if (!menu) return;

  menu.style.display = "none";
  menu.style.visibility = "hidden";
  menu.style.opacity = "0";
  menu.style.pointerEvents = "none";
  menu.style.zIndex = "-9999";

  menu.classList.remove("hidden");
};


// ==============================================
// MOSTRAR MENU
// ==============================================

export const showMenu = () => {

  const menu = document.getElementById("menu");

  if (!menu) return;

  menu.style.display = "";
  menu.style.visibility = "";
  menu.style.opacity = "";
  menu.style.pointerEvents = "";
  menu.style.zIndex = "";

  menu.classList.remove("hidden");
};


// ==============================================
// INICIAR EXPERIÊNCIA
// ==============================================

export const startExperience = (controls) => {

  hideMenu();


  // ==========================================
  // 📱 CELULAR
  // ==========================================

  if (isMobile) {

    document.dispatchEvent(
      new CustomEvent("experienceStarted")
    );

    return;
  }


  // ==========================================
  // 🖥️ DESKTOP
  // ==========================================

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


  document.dispatchEvent(
    new CustomEvent("experienceStarted")
  );

};


// ==============================================
// SAIR DA EXPERIÊNCIA
// ==============================================

export const exitExperience = (controls) => {

  showMenu();


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


  document.dispatchEvent(
    new CustomEvent("experienceExited")
  );

};


// ==============================================
// CONFIGURAR BOTÕES
// ==============================================
//
// startAudio é recebido do audioGuide.js.
//
// Quando o usuário clica em EXPLORAR:
//
// 1. O áudio é solicitado.
// 2. O menu desaparece.
// 3. A experiência começa.
//
// Se o MP3 ainda estiver carregando,
// o audioGuide.js continuará aguardando
// e iniciará automaticamente quando terminar.
// ==============================================

export const setupPlayButton = (
  controls,
  startAudio
) => {

  const playButton =
    document.getElementById("play_button");

  const aboutButton =
    document.getElementById("about_button");

  const overlay =
    document.getElementById("about-overlay");

  const closeAbout =
    document.getElementById("close-about");


  // ==========================================
  // PLAY / EXPLORAR
  // ==========================================

  if (playButton) {

    playButton.onclick = (e) => {

      e.preventDefault();
      e.stopPropagation();


      // ========================================
      // 🔊 INICIA / AGENDA O ÁUDIO
      // ========================================

      if (typeof startAudio === "function") {

        startAudio();

      } else {

        console.warn(
          "🔊 startAudio não foi fornecido ao menu."
        );

      }


      // ========================================
      // 🎮 ENTRA NA GALERIA
      // ========================================

      startExperience(
        controls
      );

    };

  }


  // ==========================================
  // ABOUT
  // ==========================================

  if (aboutButton) {

    aboutButton.onclick = (e) => {

      e.preventDefault();
      e.stopPropagation();

      overlay?.classList.add("active");

    };

  }


  // ==========================================
  // FECHAR ABOUT
  // ==========================================

  if (closeAbout) {

    closeAbout.onclick = (e) => {

      e.preventDefault();
      e.stopPropagation();

      overlay?.classList.remove("active");

    };

  }


  // ==========================================
  // FECHAR CLICANDO FORA
  // ==========================================

  if (overlay) {

    overlay.onclick = (e) => {

      if (e.target === overlay) {

        overlay.classList.remove("active");

      }

    };

  }

};


// ==============================================
// COMPATIBILIDADE
// ==============================================

export const setupOverlayClose = () => {

  // Mantido apenas para compatibilidade.

};


// ==============================================
// VERIFICAR MENU
// ==============================================

export const isMenuVisible = () => {

  const menu =
    document.getElementById("menu");

  if (!menu) return false;


  return menu.style.display !== "none";

};