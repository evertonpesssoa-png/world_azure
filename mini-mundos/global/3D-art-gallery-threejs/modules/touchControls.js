// ============================================================
// 📱 TOUCH CONTROLS — GALERIA 3D
// ============================================================
// 1 dedo arrastando em área livre = olhar ao redor
//
// NÃO interfere:
// - no joystick
// - nos botões
// - no menu
// - no áudio
// - no VR
// - no clique das pinturas
//
// O movimento é controlado pelo movement.js.
// ============================================================

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

let active = false;

let lastX = 0;
let lastY = 0;

// ============================================================
// 🎚️ SENSIBILIDADE
// ============================================================

const sensitivity = 0.003;


// ============================================================
// 🚫 ELEMENTOS QUE NÃO PODEM CONTROLAR A CÂMERA
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
// 🎥 CONFIGURAÇÃO
// ============================================================

export function setupTouchControls(camera, renderer) {

  // ----------------------------------------------------------
  // Desktop
  // ----------------------------------------------------------

  if (!isMobile) {

    console.log(
      "🖥️ TouchControls: desktop detectado"
    );

    return;

  }


  // ----------------------------------------------------------
  // Canvas
  // ----------------------------------------------------------

  const element =
    renderer.domElement;


  element.style.touchAction =
    "none";


  // ==========================================================
  // 👆 TOUCH START
  // ==========================================================

  element.addEventListener(
    "touchstart",

    (event) => {

      // ------------------------------------------------------
      // Só um dedo
      // ------------------------------------------------------

      if (event.touches.length !== 1) {

        active = false;

        return;

      }


      // ------------------------------------------------------
      // Não iniciar olhar sobre interface
      // ------------------------------------------------------

      if (
        isInterfaceElement(
          event.target
        )
      ) {

        active = false;

        return;

      }


      const touch =
        event.touches[0];


      lastX =
        touch.clientX;

      lastY =
        touch.clientY;


      active = true;


      event.preventDefault();

    },

    {
      passive: false
    }

  );


  // ==========================================================
  // 👆 TOUCH MOVE
  // ==========================================================

  element.addEventListener(
    "touchmove",

    (event) => {

      if (!active) return;


      // ------------------------------------------------------
      // Se entrar com outro dedo, cancela
      // ------------------------------------------------------

      if (event.touches.length !== 1) {

        active = false;

        return;

      }


      const touch =
        event.touches[0];


      const deltaX =
        touch.clientX - lastX;

      const deltaY =
        touch.clientY - lastY;


      lastX =
        touch.clientX;

      lastY =
        touch.clientY;


      // ======================================================
      // 👈👉 GIRO HORIZONTAL
      // ======================================================

      camera.rotation.y -=
        deltaX * sensitivity;


      // ======================================================
      // 👆👇 GIRO VERTICAL
      // ======================================================

      camera.rotation.x -=
        deltaY * sensitivity;


      // ======================================================
      // 🔒 LIMITA VISÃO VERTICAL
      // ======================================================

      const maxVertical =
        Math.PI / 2 - 0.05;


      camera.rotation.x =
        Math.max(
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
  // ☝️ TOUCH END
  // ==========================================================

  element.addEventListener(
    "touchend",

    () => {

      active = false;

    }
  );


  // ==========================================================
  // ❌ TOUCH CANCEL
  // ==========================================================

  element.addEventListener(
    "touchcancel",

    () => {

      active = false;

    }
  );


  // ==========================================================
  // 📱 FINALIZAÇÃO
  // ==========================================================

  console.log(
    "📱 TouchControls ativado!"
  );

  console.log(
    "👆 Arraste a área livre da tela para olhar ao redor."
  );

  console.log(
    "🎮 Use o joystick para movimentar."
  );

}