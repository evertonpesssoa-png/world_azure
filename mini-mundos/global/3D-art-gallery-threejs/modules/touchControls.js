// ============================================================
// 📱 TOUCH CONTROLS — GALERIA 3D
// ============================================================
// 1 dedo arrastando = olhar ao redor
//
// Não interfere:
// - no joystick
// - nos botões
// - no VR
// - no clique das pinturas
// ============================================================

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

let active = false;

let lastX = 0;
let lastY = 0;

// Sensibilidade da câmera
// Maior = mais rápido
// Menor = mais lento
const sensitivity = 0.003;

// ============================================================
// ELEMENTOS DA INTERFACE
// ============================================================

function isInterfaceElement(target) {
  if (!target) return false;

  return !!target.closest(`
    button,
    #menu,
    #info-panel,
    #painting-info,
    #audio_controls,
    .touch-joypad,
    .mobile-controls-panel,
    #VRButton,
    #about-overlay
  `);
}

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export function setupTouchControls(camera, renderer) {

  // Desktop não precisa desse sistema
  if (!isMobile) {
    console.log("🖥️ TouchControls: desktop detectado");
    return;
  }

  const element = renderer.domElement;

  // Impede o navegador de interpretar o toque
  // como scroll/gesto da página.
  element.style.touchAction = "none";

  // ==========================================================
  // TOUCH START
  // ==========================================================

  element.addEventListener(
    "touchstart",
    (event) => {

      // Apenas 1 dedo controla a câmera
      if (event.touches.length !== 1) {
        active = false;
        return;
      }

      // Se começou sobre algum controle da interface,
      // não mexe na câmera.
      if (isInterfaceElement(event.target)) {
        active = false;
        return;
      }

      const touch = event.touches[0];

      lastX = touch.clientX;
      lastY = touch.clientY;

      active = true;

      event.preventDefault();
    },
    {
      passive: false
    }
  );

  // ==========================================================
  // TOUCH MOVE
  // ==========================================================

  element.addEventListener(
    "touchmove",
    (event) => {

      if (!active) return;

      // Se passar para dois dedos,
      // encerra o controle de rotação.
      if (event.touches.length !== 1) {
        active = false;
        return;
      }

      const touch = event.touches[0];

      const deltaX =
        touch.clientX - lastX;

      const deltaY =
        touch.clientY - lastY;

      lastX = touch.clientX;
      lastY = touch.clientY;

      // ======================================================
      // OLHAR PARA ESQUERDA / DIREITA
      // ======================================================

      camera.rotation.y -=
        deltaX * sensitivity;

      // ======================================================
      // OLHAR PARA CIMA / BAIXO
      // ======================================================

      camera.rotation.x -=
        deltaY * sensitivity;

      // ======================================================
      // LIMITA A VISÃO VERTICAL
      // ======================================================

      const maxVertical =
        Math.PI / 2 - 0.05;

      camera.rotation.x = Math.max(
        -maxVertical,
        Math.min(
          maxVertical,
          camera.rotation.x
        )
      );

      event.preventDefault();
    },
    {
      passive: false
    }
  );

  // ==========================================================
  // TOUCH END
  // ==========================================================

  element.addEventListener(
    "touchend",
    () => {
      active = false;
    }
  );

  // ==========================================================
  // TOUCH CANCEL
  // ==========================================================

  element.addEventListener(
    "touchcancel",
    () => {
      active = false;
    }
  );

  console.log(
    "📱 TouchControls ativado!"
  );
}