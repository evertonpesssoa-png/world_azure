// =========================
// MENU.JS - COMPATÍVEL COM CELULAR
// =========================

export const hideMenu = () => {
  const menu = document.getElementById("menu");

  if (menu) {
    menu.style.display = "none";
    menu.style.visibility = "hidden";
    menu.style.pointerEvents = "none";
  }
};

export const showMenu = () => {
  const menu = document.getElementById("menu");

  if (menu) {
    menu.style.display = "flex";
    menu.style.visibility = "visible";
    menu.style.pointerEvents = "auto";
  }
};

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const startExperience = (controls) => {
  hideMenu();

  if (!isMobile) {
    try {
      if (controls && typeof controls.lock === "function") {
        controls.lock();
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    const canvas = document.querySelector("canvas");

    if (canvas) {
      canvas.setAttribute("tabindex", "0");
      canvas.focus();
    }
  }

  document.dispatchEvent(new CustomEvent("experienceStarted"));
};

export const exitExperience = (controls) => {
  showMenu();

  if (!isMobile) {
    try {
      if (controls && typeof controls.unlock === "function") {
        controls.unlock();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  document.dispatchEvent(new CustomEvent("experienceExited"));
};

export const setupPlayButton = (controls) => {
  const playButton = document.getElementById("play_button");
  const aboutButton = document.getElementById("about_button");
  const closeAbout = document.getElementById("close-about");

  // PLAY
  if (playButton) {
    playButton.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        startExperience(controls);
      },
      { passive: false }
    );
  }

  // ABOUT
  if (aboutButton) {
    aboutButton.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const overlay = document.getElementById("about-overlay");

        if (overlay) {
          overlay.classList.add("active");
        }
      },
      { passive: false }
    );
  }

  // FECHAR ABOUT
  if (closeAbout) {
    closeAbout.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        const overlay = document.getElementById("about-overlay");

        if (overlay) {
          overlay.classList.remove("active");
        }
      },
      { passive: false }
    );
  }
};

export const setupOverlayClose = () => {
  const overlay = document.getElementById("about-overlay");

  if (!overlay) return;

  overlay.addEventListener(
    "pointerdown",
    (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    },
    { passive: true }
  );
};

export const isMenuVisible = () => {
  const menu = document.getElementById("menu");

  if (!menu) return false;

  return menu.style.display !== "none";
};