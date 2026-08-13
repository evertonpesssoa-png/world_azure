// ==============================================
// PAINTING INFO
// Informações das obras da galeria
// ==============================================


// ==============================================
// EXIBIR INFORMAÇÕES COMPLETAS DA OBRA
// ==============================================

export const displayPaintingInfo = (info) => {
  const infoElement = document.getElementById("painting-info");

  if (!infoElement) {
    console.warn("⚠️ Elemento #painting-info não encontrado");
    return;
  }

  // Define o conteúdo
  infoElement.innerHTML = `
    <strong>🖼️ ${info.title || "Obra de Arte"}</strong><br>
    🎨 ${info.artist || "Artista desconhecido"} • 📅 ${info.year || "—"}
  `;

  // Mostra o elemento
  infoElement.style.display = "block";
  infoElement.style.visibility = "visible";
  infoElement.style.opacity = "1";

  // NÃO definir transform aqui.
  // A posição horizontal fica totalmente por conta do CSS.

  infoElement.classList.add("show");

  console.log(
    `🖼️ Exibindo info: ${info.title || "Obra de Arte"}`
  );
};


// ==============================================
// ESCONDER INFORMAÇÕES DA OBRA
// ==============================================

export const hidePaintingInfo = () => {
  const infoElement = document.getElementById("painting-info");

  if (!infoElement) return;

  // Inicia animação de saída
  infoElement.style.opacity = "0";
  infoElement.style.visibility = "hidden";

  infoElement.classList.remove("show");

  // Limpa somente depois da animação
  setTimeout(() => {
    if (
      infoElement.style.opacity === "0" &&
      infoElement.style.visibility === "hidden"
    ) {
      infoElement.innerHTML = "";
    }
  }, 300);
};


// ==============================================
// VERSÃO SIMPLIFICADA
// Mostra somente o nome da obra
// ==============================================

export const displaySimpleInfo = (title) => {
  const infoElement = document.getElementById("painting-info");

  if (!infoElement) {
    console.warn("⚠️ Elemento #painting-info não encontrado");
    return;
  }

  // Define o conteúdo
  infoElement.innerHTML =
    `🖼️ ${title || "Obra de Arte"}`;

  // Mostra o elemento
  infoElement.style.display = "block";
  infoElement.style.visibility = "visible";
  infoElement.style.opacity = "1";

  // NÃO definir transform aqui.
  // O CSS controla completamente a posição.

  infoElement.classList.add("show");

  // Esconde automaticamente
  setTimeout(() => {
    hidePaintingInfo();
  }, 3000);
};