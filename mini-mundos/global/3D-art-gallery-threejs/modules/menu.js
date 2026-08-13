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

  // Adiciona a classe hidden para ativar a transição do CSS
  menu.classList.add("hidden");
  
  // Remove o display: none forçado para permitir a transição
  menu.style.display = "";
  
  // Após 600ms (tempo suficiente para a transição de 0.5s do CSS), remove o elemento do DOM
  setTimeout(() => {
    if (menu && menu.classList.contains("hidden")) {
      menu.style.display = "none";
    }
  }, 600);
};

export const showMenu = () => {
  const menu = document.getElementById("menu");

  if (!menu) return;

  // Remove a classe hidden e reseta o display para aparecer de novo
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