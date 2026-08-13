// ==============================================
// CLICK HANDLING
// Interação com as obras da galeria
// ==============================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function clickHandling(renderer, camera, paintings) {

  const handleInteraction = (event) => {

    // ==========================================
    // IGNORA ELEMENTOS DA INTERFACE
    // ==========================================

    const menu = document.getElementById("menu");

    if (
      menu &&
      menu.style.display !== "none" &&
      menu.contains(event.target)
    ) {
      return;
    }

    // Não processa clique em controles da interface
    if (
      event.target.closest?.(
        "#info-panel, #audio_controls, #painting-info, #VRButton, .touch-joypad, .mobile-controls-panel"
      )
    ) {
      return;
    }

    // ==========================================
    // COORDENADAS
    // ==========================================

    const clientX = event.clientX;
    const clientY = event.clientY;

    if (
      clientX === undefined ||
      clientY === undefined
    ) {
      return;
    }

    mouse.x =
      (clientX / window.innerWidth) * 2 - 1;

    mouse.y =
      -(clientY / window.innerHeight) * 2 + 1;

    // ==========================================
    // VERIFICA A OBRA
    // ==========================================

    onClick(camera, paintings);
  };

  renderer.domElement.addEventListener(
    "pointerdown",
    handleInteraction,
    false
  );
}


// ==============================================
// RAYCAST DA OBRA
// ==============================================

function onClick(camera, paintings) {

  raycaster.setFromCamera(mouse, camera);

  const paintingsArray =
    Array.isArray(paintings)
      ? paintings
      : paintings?.children || [];

  if (!paintingsArray.length) {
    console.warn("⚠️ Nenhuma pintura encontrada.");
    return;
  }

  const intersects =
    raycaster.intersectObjects(
      paintingsArray,
      true
    );

  if (!intersects.length) {
    return;
  }

  // ==========================================
  // ENCONTRA O OBJETO PAI DA OBRA
  // ==========================================

  let painting = intersects[0].object;

  while (
    painting &&
    !painting.userData?.info?.title
  ) {
    painting = painting.parent;
  }

  if (!painting?.userData?.info) {
    console.warn(
      "⚠️ Objeto clicado não possui informações."
    );
    return;
  }

  const info = painting.userData.info;

  console.log(
    "🖼️ Obra selecionada:",
    info.title
  );

  // ==========================================
  // MOSTRA INFORMAÇÕES
  // ==========================================

  displayPaintingInfo(info);
}


// ==============================================
// MOSTRAR INFORMAÇÃO DA OBRA
// ==============================================

function displayPaintingInfo(info) {

  const infoDiv =
    document.getElementById("painting-info");

  if (!infoDiv) {
    console.warn(
      "⚠️ #painting-info não encontrado."
    );
    return;
  }

  infoDiv.innerHTML = `
    <strong>🖼️ ${info.title || "Obra de Arte"}</strong>
    ${
      info.artist || info.year
        ? `<br>🎨 ${info.artist || ""}${
            info.year
              ? ` • 📅 ${info.year}`
              : ""
          }`
        : ""
    }
  `;

  // ==========================================
  // MOSTRA
  // ==========================================

  infoDiv.style.opacity = "1";
  infoDiv.style.visibility = "visible";
  infoDiv.style.transform =
    "translateX(-50%) scale(1)";

  infoDiv.classList.add("show");

  // ==========================================
  // ESCONDE DEPOIS DE 3 SEGUNDOS
  // ==========================================

  clearTimeout(
    infoDiv._hideTimer
  );

  infoDiv._hideTimer = setTimeout(() => {

    infoDiv.style.opacity = "0";
    infoDiv.style.visibility = "hidden";

    infoDiv.style.transform =
      "translateX(-50%) scale(0.9)";

    infoDiv.classList.remove("show");

  }, 3000);
}


export { clickHandling };