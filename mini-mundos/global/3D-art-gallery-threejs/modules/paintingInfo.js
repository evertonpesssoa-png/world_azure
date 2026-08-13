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

  // Cancela qualquer estado anterior de ocultação
  infoElement.style.display = "block";
  infoElement.style.visibility = "visible";
  infoElement.style.opacity = "1";

  // Mantém o elemento centralizado
  infoElement.style.transform =
    "translateX(-50%) scale(1)";

  // Classe visual
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
  infoElement.style.transform =
    "translateX(-50%) scale(0.9)";

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
  infoElement.innerHTML = `🖼️ ${title || "Obra de Arte"}`;

  // Força o elemento a aparecer novamente
  infoElement.style.display = "block";
  infoElement.style.visibility = "visible";
  infoElement.style.opacity = "1";

  infoElement.style.transform =
    "translateX(-50%) scale(1)";

  infoElement.classList.add("show");

  // Esconde automaticamente
  setTimeout(() => {
    hidePaintingInfo();
  }, 3000);
};