// =========================
// MENU.JS
// SIMPLES E ESTÁVEL
// =========================

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const hideMenu = () => {
  const menu = document.getElementById("menu");

  if (!menu) return;

  menu.classList.add("hidden");
  menu.style.display = "none";
};

export const showMenu = () => {
  const menu = document.getElementById("menu");

  if (!menu) return;

  menu.classList.remove("hidden");
  menu.style.display = "flex";
  menu.style.visibility = "visible";
  menu.style.pointerEvents = "auto";
};

export const startExperience = (controls) => {
  hideMenu();

  if (!isMobile) {
    try {
      if (controls?.lock) {
        controls.lock();
      }
    } catch (err) {
      console.warn("Erro ao ativar PointerLock:", err);
    }
  }

  document.dispatchEvent(
    new CustomEvent("experienceStarted")
  );
};

export const exitExperience = (controls) => {
  showMenu();

  if (!isMobile) {
    try {
      if (controls?.unlock) {
        controls.unlock();
      }
    } catch (err) {
      console.warn("Erro ao sair:", err);
    }
  }

  document.dispatchEvent(
    new CustomEvent("experienceExited")
  );
};

export const setupPlayButton = (controls) => {
  const playButton = document.getElementById("play_button");
  const aboutButton = document.getElementById("about_button");
  const overlay = document.getElementById("about-overlay");
  const closeAbout = document.getElementById("close-about");

  // PLAY
  if (playButton) {
    playButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      startExperience(controls);
    };
  }

  // ABOUT
  if (aboutButton) {
    aboutButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      overlay?.classList.add("active");
    };
  }

  // FECHAR
  if (closeAbout) {
    closeAbout.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      overlay?.classList.remove("active");
    };
  }

  // FECHAR CLICANDO FORA
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    };
  }
};

export const setupOverlayClose = () => {
  // Mantido apenas para compatibilidade
};

export const isMenuVisible = () => {
  const menu = document.getElementById("menu");

  if (!menu) return false;

  return menu.style.display !== "none";
};