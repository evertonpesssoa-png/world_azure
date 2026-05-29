function createStars() {
  const container = document.querySelector("body");
  for (let i = 0; i < 1000; i++) {
    const star = document.createElement("div");
    star.className = "star";
    
    // Tamanho um pouco maior e variado (1px a 3px)
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    
    // Posição aleatória
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    
    // Opacidade variada (algumas mais brilhantes, outras mais fracas)
    star.style.opacity = Math.random() * 0.7 + 0.3;
    
    // Animação com delay aleatório
    star.style.animationDelay = Math.random() * 5 + "s";
    
    container.appendChild(star);
  }
}

// Aguarda o CSS carregar completamente
window.addEventListener("DOMContentLoaded", createStars);