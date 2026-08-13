// ==============================================
// CLICK HANDLING
// Interação com as obras da galeria
// ==============================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

import {
  displayPaintingInfo
} from "./paintingInfo.js";


// ==============================================
// RAYCASTER
// ==============================================

const mouse = new THREE.Vector2();

const raycaster = new THREE.Raycaster();


// ==============================================
// CONTROLE DE TOQUE
// Evita clique duplicado no celular
// ==============================================

let lastTouchTime = 0;


// ==============================================
// CLICK HANDLING
// ==============================================

function clickHandling(
  renderer,
  camera,
  paintings
) {

  if (!renderer?.domElement) {
    console.warn(
      "⚠️ Renderer não possui DOM element."
    );

    return;
  }


  const handleInteraction = (event) => {

    // ==========================================
    // EVITA DUPLICAÇÃO DE EVENTOS TOUCH
    // ==========================================

    if (event.pointerType === "touch") {
      lastTouchTime = Date.now();
    }

    // Se for mouse logo depois de um toque,
    // ignora o evento fantasma.
    if (
      event.pointerType === "mouse" &&
      Date.now() - lastTouchTime < 500
    ) {
      return;
    }


    // ==========================================
    // IGNORA ELEMENTOS DA INTERFACE
    // ==========================================

    const menu =
      document.getElementById("menu");

    if (
      menu &&
      menu.style.display !== "none" &&
      menu.contains(event.target)
    ) {
      return;
    }


    // ==========================================
    // IGNORA CONTROLES
    // ==========================================

    if (
      event.target?.closest?.(`
        #info-panel,
        #audio_controls,
        #painting-info,
        #VRButton,
        .touch-joypad,
        .mobile-controls-panel,
        button
      `)
    ) {
      return;
    }


    // ==========================================
    // COORDENADAS DO POINTER
    // ==========================================

    const clientX = event.clientX;
    const clientY = event.clientY;


    if (
      typeof clientX !== "number" ||
      typeof clientY !== "number"
    ) {
      return;
    }


    // ==========================================
    // CONVERTE PARA NDC
    // ==========================================

    mouse.x =
      (clientX / window.innerWidth) * 2 - 1;

    mouse.y =
      -(clientY / window.innerHeight) * 2 + 1;


    // ==========================================
    // VERIFICA A OBRA
    // ==========================================

    onClick(
      camera,
      paintings
    );
  };


  // ==========================================
  // POINTER DOWN
  // Funciona:
  // - Mouse
  // - Touch
  // - Caneta
  // ==========================================

  renderer.domElement.addEventListener(
    "pointerdown",
    handleInteraction,
    false
  );


  console.log(
    "🖼️ ClickHandling ativado."
  );
}


// ==============================================
// RAYCAST DA OBRA
// ==============================================

function onClick(
  camera,
  paintings
) {

  raycaster.setFromCamera(
    mouse,
    camera
  );


  // ==========================================
  // NORMALIZA ARRAY DE PINTURAS
  // ==========================================

  const paintingsArray =
    Array.isArray(paintings)
      ? paintings
      : paintings?.children || [];


  if (!paintingsArray.length) {

    console.warn(
      "⚠️ Nenhuma pintura encontrada."
    );

    return;
  }


  // ==========================================
  // RAYCAST
  // recursive = true
  // ==========================================

  const intersects =
    raycaster.intersectObjects(
      paintingsArray,
      true
    );


  if (!intersects.length) {
    return;
  }


  // ==========================================
  // ENCONTRA A OBRA REAL
  // ==========================================

  let painting =
    intersects[0].object;


  while (
    painting &&
    !painting.userData?.info?.title
  ) {

    painting =
      painting.parent;
  }


  // ==========================================
  // VERIFICA INFORMAÇÃO
  // ==========================================

  if (
    !painting?.userData?.info
  ) {

    console.warn(
      "⚠️ Objeto clicado não possui informações."
    );

    return;
  }


  // ==========================================
  // INFORMAÇÕES DA OBRA
  // ==========================================

  const info =
    painting.userData.info;


  console.log(
    "🖼️ Obra selecionada:",
    info.title
  );


  // ==========================================
  // ENVIA PARA O SISTEMA DE INFORMAÇÃO
  // ==========================================

  displayPaintingInfo(info);
}


// ==============================================
// EXPORT
// ==============================================

export {
  clickHandling
};