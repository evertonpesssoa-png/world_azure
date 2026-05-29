// =========================
// MENU.JS - COMPATÍVEL COM CELULAR
// =========================

export const hideMenu = () => {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = 'none';
    menu.style.visibility = 'hidden';
    menu.style.pointerEvents = 'none';
  }
};

export const showMenu = () => {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.style.display = 'flex';
    menu.style.visibility = 'visible';
    menu.style.pointerEvents = 'auto';
  }
};

// Detecta se é celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Inicia a experiência
export const startExperience = (controls) => {
  console.log("🎮 Iniciando experiência...");
  
  // Esconder o menu
  hideMenu();
  
  // No celular, NÃO tentar travar o pointer (causa problemas)
  if (!isMobile) {
    try {
      if (controls && typeof controls.lock === 'function') {
        controls.lock();
        console.log("🔒 Pointer lock ativado (desktop)");
      }
    } catch (err) {
      console.warn("Erro ao travar pointer:", err);
    }
  } else {
    console.log("📱 Modo celular: pointer lock desativado");
    // No celular, apenas focar no canvas para receber eventos
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.focus();
      canvas.setAttribute('tabindex', '0');
    }
  }
  
  // Disparar evento personalizado para outros módulos saberem que o menu fechou
  const event = new CustomEvent('experienceStarted');
  document.dispatchEvent(event);
};

// Sai da experiência e volta ao menu
export const exitExperience = (controls) => {
  console.log("🚪 Saindo da experiência...");
  showMenu();
  
  if (!isMobile && controls && typeof controls.unlock === 'function') {
    try {
      controls.unlock();
    } catch (err) {
      console.warn("Erro ao destravar pointer:", err);
    }
  }
  
  const event = new CustomEvent('experienceExited');
  document.dispatchEvent(event);
};

// Configurar botão PLAY
export const setupPlayButton = (controls) => {
  const playButton = document.getElementById('play_button');
  const aboutButton = document.getElementById('about_button');
  
  if (playButton) {
    // Remover event listeners antigos para evitar duplicação
    const newPlayButton = playButton.cloneNode(true);
    playButton.parentNode.replaceChild(newPlayButton, playButton);
    
    newPlayButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🎮 Botão PLAY clicado!");
      startExperience(controls);
    });
    
    // Para toque no celular
    newPlayButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🎮 Botão PLAY tocado!");
      startExperience(controls);
    });
  }
  
  if (aboutButton) {
    const newAboutButton = aboutButton.cloneNode(true);
    aboutButton.parentNode.replaceChild(newAboutButton, aboutButton);
    
    newAboutButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('about-overlay');
      if (overlay) {
        overlay.classList.add('active');
      }
    });
    
    newAboutButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('about-overlay');
      if (overlay) {
        overlay.classList.add('active');
      }
    });
  }
  
  // Fechar overlay do about
  const closeAbout = document.getElementById('close-about');
  if (closeAbout) {
    closeAbout.addEventListener('click', () => {
      const overlay = document.getElementById('about-overlay');
      if (overlay) overlay.classList.remove('active');
    });
    closeAbout.addEventListener('touchstart', () => {
      const overlay = document.getElementById('about-overlay');
      if (overlay) overlay.classList.remove('active');
    });
  }
};

// Função para verificar se o menu está visível
export const isMenuVisible = () => {
  const menu = document.getElementById('menu');
  return menu && menu.style.display !== 'none';
};