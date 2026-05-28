export function initUI(config) {
    // Botão voltar
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        const portalFlash = document.createElement('div');
        portalFlash.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, ${config.color}, transparent 70%); opacity: 0; pointer-events: none; z-index: 10000; transition: opacity 0.6s ease;`;
        document.body.appendChild(portalFlash);
        setTimeout(() => { portalFlash.style.opacity = '0.9'; }, 10);
        setTimeout(() => { window.location.href = '../index.html'; }, 700);
    });
    
    // Botão perfil (toggle)
    const profileButton = document.getElementById('profileButton');
    const profilePanel = document.getElementById('profilePanel');
    let isProfileOpen = false;
    
    // Preencher painel de perfil
    profilePanel.innerHTML = `
        <h2>${config.name}</h2>
        <div class="subtitle">${config.title}</div>
        ${config.skills.map(skill => `
            <div class="skill-bar">
                <div class="skill-label"><span>${skill.name}</span><span>${skill.value}%</span></div>
                <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: ${skill.value}%"></div></div>
            </div>
        `).join('')}
        <div class="personality-text">${config.personalityText}</div>
    `;
    
    profileButton.addEventListener('click', () => {
        isProfileOpen = !isProfileOpen;
        if (isProfileOpen) {
            profilePanel.classList.add('open');
        } else {
            profilePanel.classList.remove('open');
        }
    });
    
    // Fechar perfil ao clicar fora
    document.addEventListener('click', (e) => {
        if (isProfileOpen && !profilePanel.contains(e.target) && e.target !== profileButton) {
            profilePanel.classList.remove('open');
            isProfileOpen = false;
        }
    });
    
    // Portal de entrada
    const portalOverlay = document.getElementById('portalOverlay');
    portalOverlay.style.setProperty('--asura-color', config.color);
    setTimeout(() => {
        portalOverlay.style.opacity = '0.6';
        setTimeout(() => {
            portalOverlay.style.opacity = '0';
            setTimeout(() => {
                portalOverlay.style.display = 'none';
            }, 800);
        }, 500);
    }, 50);
}