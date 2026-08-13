// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function clickHandling(renderer, camera, paintings) {

  const handleInteraction = (event) => {

    // Ignora cliques no menu
    const menu = document.getElementById("menu");

    if (
      menu &&
      menu.style.display !== "none" &&
      menu.contains(event.target)
    ) {
      return;
    }

    let clientX;
    let clientY;

    if (event.clientX !== undefined) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches?.length) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return;
    }

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    onClick(camera, paintings);
  };

  renderer.domElement.addEventListener(
    "pointerdown",
    handleInteraction,
    false
  );
}

function onClick(camera, paintings) {

  raycaster.setFromCamera(mouse, camera);

  const paintingsArray =
    Array.isArray(paintings)
      ? paintings
      : paintings.children || [];

  const intersects =
    raycaster.intersectObjects(
      paintingsArray,
      true
    );

  if (!intersects.length) return;

  let painting = intersects[0].object;

  while (
    painting &&
    !painting.userData?.info?.title
  ) {
    painting = painting.parent;
  }

  if (!painting?.userData?.info) return;

  const title =
    painting.userData.info.title ||
    "Obra de Arte";

  const link =
    painting.userData.info.link;

  showPaintingInfo(title);

  if (link && link !== "#") {
    window.open(link, "_blank");
  }
}

function showPaintingInfo(title) {

  const infoDiv =
    document.getElementById(
      "painting-info"
    );

  if (!infoDiv) return;

  infoDiv.textContent = `🖼️ ${title}`;

  infoDiv.style.opacity = "1";
  infoDiv.style.transform =
    "translateX(-50%) scale(1)";

  setTimeout(() => {
    infoDiv.style.opacity = "0";
    infoDiv.style.transform =
      "translateX(-50%) scale(0.9)";
  }, 2000);
}

export { clickHandling };