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

  // ==============================================
  // FORÇA BRUTA: ESCONDE O MENU IMEDIATAMENTE
  // ==============================================
  menu.style.display = "none";
  menu.style.visibility = "hidden";
  menu.style.opacity = "0";
  menu.style.pointerEvents = "none";
  menu.style.zIndex = "-9999";
  
  // Remove a classe hidden para garantir que não haja conflito
  menu.classList.remove("hidden");
};

export const showMenu = () => {
  const menu = document.getElementById("menu");

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

export const startExperience = (controls) => {
  hideMenu();
  
  // ==============================================
  // CORREÇÃO CRUCIAL: Para celular, não tenta travar o mouse!
  // ==============================================
  if (isMobile) {
    document.dispatchEvent(new CustomEvent("experienceStarted"));
    return; // Para a execução aqui no celular
  }

  // O código abaixo roda APENAS para Desktop (PC)
  try {
    if (controls?.lock) {
      controls.lock();
    }
  } catch (err) {
    console.warn("Erro ao ativar PointerLock:", err);
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

  // Verifica se não está com display: none
  return menu.style.display !== "none";
};