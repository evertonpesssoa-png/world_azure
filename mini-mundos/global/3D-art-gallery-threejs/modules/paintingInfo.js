// Display painting info in the DOM
export const displayPaintingInfo = (info) => {
  const infoElement = document.getElementById('painting-info');
  if (!infoElement) return;
  
  // Define o conteúdo HTML
  infoElement.innerHTML = `
    <strong>🖼️ ${info.title}</strong><br>
    🎨 ${info.artist} • 📅 ${info.year}
  `;
  
  // Torna visível (compatível com seu CSS)
  infoElement.style.opacity = '1';
  infoElement.style.visibility = 'visible';
  infoElement.style.transform = 'translateX(-50%) scale(1)';
  
  // Adiciona classe show se existir no CSS
  infoElement.classList.add('show');
  
  console.log(`🖼️ Exibindo info: ${info.title}`);
};

// Hide painting info in the DOM
export const hidePaintingInfo = () => {
  const infoElement = document.getElementById('painting-info');
  if (!infoElement) return;
  
  // Torna invisível
  infoElement.style.opacity = '0';
  infoElement.style.visibility = 'hidden';
  infoElement.style.transform = 'translateX(-50%) scale(0.9)';
  
  // Remove classe show
  infoElement.classList.remove('show');
  
  // Limpa o conteúdo após a animação
  setTimeout(() => {
    if (infoElement.style.opacity === '0') {
      infoElement.innerHTML = '';
    }
  }, 300);
};

// Versão simplificada (apenas texto, sem HTML)
export const displaySimpleInfo = (title) => {
  const infoElement = document.getElementById('painting-info');
  if (!infoElement) return;
  
  infoElement.innerHTML = `🖼️ ${title}`;
  infoElement.style.opacity = '1';
  infoElement.style.visibility = 'visible';
  
  // Esconde automaticamente após 3 segundos
  setTimeout(() => {
    hidePaintingInfo();
  }, 3000);
};