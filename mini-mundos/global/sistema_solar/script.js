/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS

   FUNÇÕES:
   - Estrelas de fundo
   - Partículas dos anéis de Saturno
   - Cometas / meteoros ocasionais (VISÍVEIS)
   - Zoom por pinça no mobile
   - Botão de pause (roxo)
   - Painel interativo WZ (Sol, Lua e Planetas) - GLASS
   - Modo Exploração (viagem interplanetária)
   - Caixa de LOG para debug no celular
========================================================= */


/* =========================================================
   CAIXA DE LOG - PARA DEBUG NO CELULAR
========================================================= */

function createLogBox() {
    const logBox = document.createElement('div');
    logBox.id = 'logBox';
    logBox.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        max-height: 200px;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(160, 80, 255, 0.3);
        border-radius: 12px;
        padding: 10px 14px;
        z-index: 99999;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        color: #c084fc;
        pointer-events: none;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
        scroll-behavior: smooth;
        display: none;
    `;
    
    const title = document.createElement('div');
    title.textContent = '📡 LOG DO SISTEMA';
    title.style.cssText = `
        color: #c084fc;
        font-weight: bold;
        font-size: 10px;
        letter-spacing: 2px;
        margin-bottom: 6px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(160,80,255,0.1);
        padding-bottom: 4px;
    `;
    logBox.appendChild(title);
    
    const messages = document.createElement('div');
    messages.id = 'logMessages';
    messages.style.cssText = `
        max-height: 150px;
        overflow-y: auto;
        line-height: 1.6;
    `;
    logBox.appendChild(messages);
    
    document.body.appendChild(logBox);
    
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '📋 LOG';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        padding: 6px 12px;
        background: rgba(80, 20, 120, 0.45);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(160, 80, 255, 0.25);
        border-radius: 8px;
        color: #c084fc;
        font-size: 10px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        z-index: 100000;
        transition: all 0.3s ease;
        touch-action: manipulation;
    `;
    
    let isVisible = false;
    toggleBtn.addEventListener('click', () => {
        isVisible = !isVisible;
        logBox.style.display = isVisible ? 'block' : 'none';
        toggleBtn.textContent = isVisible ? '📋 OCULTAR' : '📋 LOG';
        toggleBtn.style.borderColor = isVisible ? 'rgba(160, 80, 255, 0.5)' : 'rgba(160, 80, 255, 0.2)';
    });
    
    document.body.appendChild(toggleBtn);
    return logBox;
}

function addLog(message, type = 'info') {
    const messages = document.getElementById('logMessages');
    if (!messages) return;
    
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    
    const colors = {
        info: '#c084fc',
        success: '#00ff88',
        error: '#ff4466',
        warning: '#ffaa44',
        comet: '#66ddff',
        meteor: '#ff8844',
        planet: '#4d8bf7',
        glass: '#8ab4f8',
        star: '#ffdd44',
        zoom: '#00ffcc',
        pause: '#ff66aa',
        explore: '#ff66ff'
    };
    
    entry.style.color = colors[type] || colors.info;
    entry.style.fontSize = '10px';
    entry.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
    entry.style.padding = '2px 0';
    entry.textContent = `[${timestamp}] ${message}`;
    
    messages.appendChild(entry);
    messages.scrollTop = messages.scrollHeight;
    
    while (messages.children.length > 50) {
        messages.removeChild(messages.firstChild);
    }
}

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
    originalLog.apply(console, args);
    addLog(args.join(' '), 'info');
};

console.error = function(...args) {
    originalError.apply(console, args);
    addLog('❌ ' + args.join(' '), 'error');
};

console.warn = function(...args) {
    originalWarn.apply(console, args);
    addLog('⚠️ ' + args.join(' '), 'warning');
};

let logBoxInitialized = false;

function initLogBox() {
    if (logBoxInitialized) return;
    createLogBox();
    logBoxInitialized = true;
    addLog('🚀 LOG iniciado! Clique em "📋 LOG"', 'success');
}


/* =========================================================
   ESTRELAS DE FUNDO
========================================================= */

function createStars() {
    addLog('⭐ Criando estrelas de fundo...', 'star');
    const container = document.querySelector("body");
    if (!container) {
        addLog('❌ Body não encontrado!', 'error');
        return;
    }

    let count = 0;
    for (let i = 0; i < 1000; i++) {
        const star = document.createElement("div");
        star.className = "star";
        const size = Math.random() * 2 + 1;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(star);
        count++;
    }
    addLog('✅ ' + count + ' estrelas criadas!', 'success');
}


/* =========================================================
   PARTÍCULAS DOS ANÉIS DE SATURNO
========================================================= */

function createSaturnRingParticles() {
    addLog('🪐 Criando anéis de Saturno...', 'info');
    const saturn = document.querySelector(".saturn");
    if (!saturn) {
        addLog('❌ Saturno não encontrado!', 'error');
        return;
    }
    
    if (saturn.querySelector(".saturn-particles")) {
        addLog('⏳ Anéis já existem', 'warning');
        return;
    }

    const particleContainer = document.createElement("div");
    particleContainer.className = "saturn-particles";
    const particleCount = window.innerWidth <= 768 ? 18 : 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.className = "saturn-particle";
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.random() * 18;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.32;
        const size = Math.random() * 1.8 + 0.7;
        const opacity = Math.random() * 0.55 + 0.25;

        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        particle.style.opacity = opacity;
        particle.style.animationDelay = Math.random() * 4 + "s";
        particle.style.animationDuration = 2.5 + Math.random() * 3 + "s";
        particleContainer.appendChild(particle);
    }

    saturn.appendChild(particleContainer);
    addLog('✅ ' + particleCount + ' partículas dos anéis criadas!', 'success');
}


/* =========================================================
   COMETAS / METEOROS - VERSÃO VISÍVEL NO CELULAR
========================================================= */

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createComet() {
    addLog('☄️ createComet() CHAMADA!', 'comet');
    
    const container = document.querySelector(".container");
    if (!container) {
        addLog('❌ Container não encontrado!', 'error');
        return;
    }

    if (container.querySelector(".comet")) {
        addLog('⏳ Já existe um cometa ativo', 'warning');
        return;
    }

    const comet = document.createElement("div");
    comet.className = "comet";
    
    comet.style.cssText = `
        position: fixed !important;
        width: 35px !important;
        height: 35px !important;
        border-radius: 50% !important;
        background: radial-gradient(circle at 35% 35%, #ffffff, #66ddff) !important;
        box-shadow: 0 0 50px rgba(100, 200, 255, 0.9), 0 0 100px rgba(100, 200, 255, 0.5), 0 0 150px rgba(50, 150, 255, 0.3) !important;
        pointer-events: none !important;
        z-index: 9999 !important;
        opacity: 0 !important;
        border: 2px solid rgba(255, 255, 255, 0.4) !important;
        transition: none !important;
    `;

    const direction = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;

    switch (direction) {
        case 0:
            startX = randomBetween(-25, 20);
            startY = randomBetween(-20, 10);
            endX = randomBetween(80, 125);
            endY = randomBetween(80, 125);
            addLog('📍 Cometa: ↘ (superior esquerdo → inferior direito)', 'comet');
            break;
        case 1:
            startX = randomBetween(80, 125);
            startY = randomBetween(-20, 10);
            endX = randomBetween(-25, 20);
            endY = randomBetween(80, 125);
            addLog('📍 Cometa: ↙ (superior direito → inferior esquerdo)', 'comet');
            break;
        case 2:
            startX = randomBetween(-25, -10);
            startY = randomBetween(15, 85);
            endX = randomBetween(110, 125);
            endY = startY + randomBetween(-20, 20);
            addLog('📍 Cometa: → (esquerda → direita)', 'comet');
            break;
        default:
            startX = randomBetween(110, 125);
            startY = randomBetween(15, 85);
            endX = randomBetween(-25, -10);
            endY = startY + randomBetween(-20, 20);
            addLog('📍 Cometa: ← (direita → esquerda)', 'comet');
            break;
    }

    const duration = randomBetween(3.0, 6.0);
    
    const startXPx = (startX / 100) * window.innerWidth;
    const startYPx = (startY / 100) * window.innerHeight;
    const endXPx = (endX / 100) * window.innerWidth;
    const endYPx = (endY / 100) * window.innerHeight;

    comet.style.left = startXPx + 'px';
    comet.style.top = startYPx + 'px';

    const tail = document.createElement('div');
    tail.style.cssText = `
        position: absolute !important;
        width: 180px !important;
        height: 5px !important;
        top: 50% !important;
        right: 12px !important;
        transform: translateY(-50%) !important;
        background: linear-gradient(to left, rgba(100, 200, 255, 0.9), rgba(50, 150, 255, 0.4), rgba(0, 100, 255, 0.1), transparent) !important;
        filter: blur(2.5px) !important;
        pointer-events: none !important;
        border-radius: 3px !important;
    `;
    comet.appendChild(tail);

    container.appendChild(comet);
    addLog('✅ Cometa ADICIONADO! (duração: ' + duration.toFixed(1) + 's, tamanho: 35px)', 'success');

    let startTime = null;

    function animateComet(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startXPx + (endXPx - startXPx) * eased;
        const currentY = startYPx + (endYPx - startYPx) * eased;
        
        comet.style.left = currentX + 'px';
        comet.style.top = currentY + 'px';
        comet.style.opacity = progress < 0.08 ? progress / 0.08 : (progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1);
        comet.style.transform = `scale(${0.4 + eased * 0.6})`;
        
        const angle = Math.atan2(endYPx - startYPx, endXPx - startXPx) * 180 / Math.PI;
        tail.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animateComet);
        } else {
            if (comet.parentNode) {
                comet.remove();
                addLog('🗑️ Cometa removido após animação', 'comet');
            }
        }
    }

    requestAnimationFrame(animateComet);
}

function scheduleComet() {
    const delay = randomBetween(6000, 15000);
    addLog(`⏰ Próximo cometa em ${(delay/1000).toFixed(1)}s`, 'comet');
    window._cometScheduler = setTimeout(() => {
        createComet();
        scheduleComet();
    }, delay);
}

// 🔥 METEORO CORRIGIDO - MENOR, EM LOCAIS E MOMENTOS DIFERENTES
function createMeteor() {
    addLog('💫 createMeteor() CHAMADA!', 'meteor');
    
    const container = document.querySelector(".container");
    if (!container) {
        addLog('❌ Container não encontrado!', 'error');
        return;
    }

    // 🔥 NÃO IMPEDE MAIS METEOROS SE TIVER COMETA
    // (agora podem aparecer juntos)

    const meteor = document.createElement("div");
    meteor.className = "meteor";
    
    // 🔥 TAMANHO REDUZIDO PELA METADE (12px em vez de 25px)
    const size = 12;
    meteor.style.cssText = `
        position: fixed !important;
        width: ${size}px !important;
        height: ${size}px !important;
        border-radius: 50% !important;
        background: radial-gradient(circle at 35% 35%, #ffffff, #ff8844) !important;
        box-shadow: 0 0 20px rgba(255, 150, 50, 0.9), 0 0 40px rgba(255, 100, 0, 0.5), 0 0 60px rgba(255, 50, 0, 0.3) !important;
        pointer-events: none !important;
        z-index: 9998 !important;
        opacity: 0 !important;
        border: 1px solid rgba(255, 200, 100, 0.3) !important;
        transition: none !important;
    `;

    // 🔥 POSIÇÕES ALEATÓRIAS DIFERENTES
    const startX = randomBetween(-5, 105);
    const startY = randomBetween(-5, 105);
    const distance = randomBetween(10, 25);
    const endX = startX + distance * (Math.random() > 0.5 ? 1 : -1);
    const endY = startY + distance * randomBetween(0.3, 0.8) * (Math.random() > 0.5 ? 1 : -1);
    
    // 🔥 DURAÇÃO VARIADA (0.8-2.5 segundos)
    const duration = randomBetween(0.8, 2.5);

    const startXPx = (startX / 100) * window.innerWidth;
    const startYPx = (startY / 100) * window.innerHeight;
    const endXPx = (endX / 100) * window.innerWidth;
    const endYPx = (endY / 100) * window.innerHeight;

    meteor.style.left = startXPx + 'px';
    meteor.style.top = startYPx + 'px';

    // 🔥 RASTRO MENOR (proporcional ao tamanho)
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: absolute !important;
        width: ${size * 3}px !important;
        height: 2px !important;
        top: 50% !important;
        right: 4px !important;
        transform: translateY(-50%) !important;
        background: linear-gradient(to left, rgba(255, 200, 100, 0.8), rgba(255, 150, 50, 0.3), transparent) !important;
        filter: blur(1px) !important;
        pointer-events: none !important;
        border-radius: 1px !important;
    `;
    meteor.appendChild(trail);

    container.appendChild(meteor);
    addLog(`✅ Meteoro ADICIONADO! (duração: ${duration.toFixed(1)}s, tamanho: ${size}px, pos: ${startX.toFixed(0)}%, ${startY.toFixed(0)}%)`, 'success');

    let startTime = null;

    function animateMeteor(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const eased = progress * progress;
        
        const currentX = startXPx + (endXPx - startXPx) * eased;
        const currentY = startYPx + (endYPx - startYPx) * eased;
        
        meteor.style.left = currentX + 'px';
        meteor.style.top = currentY + 'px';
        meteor.style.opacity = progress < 0.05 ? progress / 0.05 : (progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1);
        meteor.style.transform = `scale(${0.5 + eased * 0.5})`;
        
        const angle = Math.atan2(endYPx - startYPx, endXPx - startXPx) * 180 / Math.PI;
        trail.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animateMeteor);
        } else {
            if (meteor.parentNode) {
                meteor.remove();
                addLog('🗑️ Meteoro removido após animação', 'meteor');
            }
        }
    }

    requestAnimationFrame(animateMeteor);
}

// 🔥 SCHEDULE METEORO CORRIGIDO - INTERVALOS VARIADOS E MÚLTIPLOS
function scheduleMeteor() {
    // 🔥 INTERVALOS ALEATÓRIOS MAIS VARIADOS (3-15 segundos)
    const delay = randomBetween(3000, 15000);
    addLog(`⏰ Próximo meteoro em ${(delay/1000).toFixed(1)}s`, 'meteor');
    window._meteorScheduler = setTimeout(() => {
        // 🔥 PODE CRIAR MAIS DE UM METEORO POR VEZ (1-2)
        const count = Math.random() > 0.7 ? 2 : 1;
        for (let i = 0; i < count; i++) {
            // 🔥 ATRASO ENTRE METEOROS (0.5-2 segundos)
            setTimeout(() => {
                createMeteor();
            }, i * randomBetween(500, 2000));
        }
        scheduleMeteor();
    }, delay);
}


/* =========================================================
   ZOOM POR PINÇA - MOBILE
========================================================= */

function setupPinchZoom() {
    addLog('🔍 Configurando zoom por pinça...', 'zoom');
    const container = document.querySelector(".container");
    if (!container) {
        addLog('❌ Container não encontrado!', 'error');
        return;
    }

    let zoom = 1;
    const MIN_ZOOM = 0.65;
    const MAX_ZOOM = 2.5;
    let initialDistance = 0;
    let initialZoom = 1;

    function getTouchDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function applyZoom(value) {
        zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
        container.style.transform = `scale(${zoom})`;
        addLog('🔍 Zoom: ' + zoom.toFixed(2), 'zoom');
    }

    container.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 2) return;
        initialDistance = getTouchDistance(event.touches[0], event.touches[1]);
        initialZoom = zoom;
        addLog('👆 Dois dedos detectados - zoom iniciado', 'zoom');
    }, { passive: false });

    container.addEventListener("touchmove", (event) => {
        if (event.touches.length !== 2) return;
        event.preventDefault();
        const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
        if (initialDistance <= 0) return;
        const scale = currentDistance / initialDistance;
        applyZoom(initialZoom * scale);
    }, { passive: false });

    container.addEventListener("touchend", () => { 
        initialDistance = 0;
        addLog('👆 Zoom finalizado', 'zoom');
    }, { passive: true });
    
    container.addEventListener("touchcancel", () => { 
        initialDistance = 0;
        addLog('👆 Zoom cancelado', 'zoom');
    }, { passive: true });
    
    addLog('✅ Zoom por pinça configurado!', 'success');
}


/* =========================================================
   BOTÃO DE PAUSE - GLASS ROXO
========================================================= */

function setupPauseButton() {
    addLog('⏸️ Criando botão de pause ROXO...', 'pause');
    
    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pauseBtn';
    pauseBtn.textContent = '⏸️ Pausar';
    pauseBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 14px 28px;
        background: rgba(80, 20, 120, 0.45);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid rgba(160, 80, 255, 0.25);
        border-radius: 16px;
        color: #c084fc;
        font-size: 14px;
        font-family: 'Courier New', monospace;
        font-weight: 600;
        cursor: pointer;
        z-index: 9999;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 8px 32px rgba(80, 20, 120, 0.3), 0 0 0 1px rgba(160, 80, 255, 0.05) inset, 0 0 30px rgba(160, 80, 255, 0.05);
        user-select: none;
        touch-action: manipulation;
        letter-spacing: 2px;
        text-transform: uppercase;
    `;

    pauseBtn.addEventListener('mouseenter', () => {
        pauseBtn.style.background = 'rgba(100, 40, 160, 0.6)';
        pauseBtn.style.borderColor = 'rgba(160, 80, 255, 0.5)';
        pauseBtn.style.boxShadow = '0 8px 40px rgba(80, 20, 120, 0.4), 0 0 0 1px rgba(160, 80, 255, 0.1) inset, 0 0 50px rgba(160, 80, 255, 0.1)';
        pauseBtn.style.transform = 'scale(1.04)';
        pauseBtn.style.color = '#d8b4fe';
    });

    pauseBtn.addEventListener('mouseleave', () => {
        pauseBtn.style.background = 'rgba(80, 20, 120, 0.45)';
        pauseBtn.style.borderColor = 'rgba(160, 80, 255, 0.25)';
        pauseBtn.style.boxShadow = '0 8px 32px rgba(80, 20, 120, 0.3), 0 0 0 1px rgba(160, 80, 255, 0.05) inset, 0 0 30px rgba(160, 80, 255, 0.05)';
        pauseBtn.style.transform = 'scale(1)';
        pauseBtn.style.color = '#c084fc';
    });

    let isPaused = false;

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '▶️ Continuar' : '⏸️ Pausar';
        addLog(isPaused ? '⏸️ SISTEMA PAUSADO' : '▶️ SISTEMA RETOMADO', 'pause');

        document.querySelectorAll(
            '.mercury, .venus, .earth, .mars, ' +
            '.jupiter, .saturn, .uranus, .neptune, .pluto, ' +
            '.moon, .saturn-particle, .sun, .star'
        ).forEach(el => {
            el.style.animationPlayState = isPaused ? 'paused' : 'running';
        });

        if (isPaused) {
            clearTimeout(window._cometScheduler);
            clearTimeout(window._meteorScheduler);
            addLog('⏸️ Cometas e meteoros PAUSADOS', 'pause');
        } else {
            scheduleComet();
            scheduleMeteor();
            addLog('▶️ Cometas e meteoros RETOMADOS', 'pause');
        }
    });

    document.body.appendChild(pauseBtn);
    window.pauseBtn = pauseBtn;

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && window.pauseBtn) {
            event.preventDefault();
            window.pauseBtn.click();
            addLog('⌨️ Tecla ESPAÇO pressionada', 'pause');
        }
    });
    
    addLog('✅ Botão de pause ROXO criado!', 'success');
}


/* =========================================================
   PAINEL INTERATIVO WZ - COSMOLOGIA (GLASS)
========================================================= */

const planetData = {
    mercury: {
        name: 'MERCÚRIO',
        asura: 'SÍRIA',
        emoji: '☿',
        title: '⚡ Asura do Comércio e Comunicação',
        description: '1º planeta do Sistema Solar',
        info: 'Síria rege o fluxo da prosperidade, a comunicação e o comércio. Como Mercúrio, que viaja rápido entre os mundos, Síria conecta os domínios da WZ com agilidade e precisão.',
        distance: '57,9 milhões km',
        diameter: '4.879 km',
        day: '58,6 dias terrestres',
        year: '88 dias terrestres',
        moons: '0 luas',
        color: '#b5b5b5',
        sigil: '⚡',
        type: 'Planeta'
    },
    venus: {
        name: 'VÊNUS',
        asura: 'DIVA',
        emoji: '♀',
        title: '🌸 Asura da Diplomacia e Harmonia',
        description: '2º planeta do Sistema Solar',
        info: 'Diva rege as relações, a elegância e a harmonia. Como Vênus, que brilha no céu noturno, Diva ilumina os caminhos da diplomacia e da beleza na WZ.',
        distance: '108,2 milhões km',
        diameter: '12.104 km',
        day: '243 dias terrestres',
        year: '225 dias terrestres',
        moons: '0 luas',
        color: '#e8cda0',
        sigil: '🌸',
        type: 'Planeta'
    },
    earth: {
        name: 'TERRA',
        asura: 'ASTREIA',
        emoji: '🌍',
        title: '🛡️ Asura da Proteção e Defesa',
        description: '3º planeta do Sistema Solar',
        info: 'Astreia é o bastião da vida e da proteção na WZ. Como a Terra, que abriga e sustenta, Astreia defende os limites do império com firmeza e sabedoria.',
        distance: '149,6 milhões km',
        diameter: '12.756 km',
        day: '24 horas',
        year: '365,25 dias',
        moons: '1 lua (Hécate)',
        color: '#4d8bf7',
        sigil: '🛡️',
        type: 'Planeta'
    },
    mars: {
        name: 'MARTE',
        asura: 'VICTÓRIA',
        emoji: '♂',
        title: '⚔️ Asura da Guerra e Conquista',
        description: '4º planeta do Sistema Solar',
        info: 'Victória rege a estratégia, a conquista e o avanço. Como Marte, o planeta vermelho, Victória representa a força que avança quando necessário, sempre com propósito.',
        distance: '227,9 milhões km',
        diameter: '6.792 km',
        day: '24,6 horas',
        year: '687 dias',
        moons: '2 luas (Fobos e Deimos)',
        color: '#c1440e',
        sigil: '⚔️',
        type: 'Planeta'
    },
    jupiter: {
        name: 'JÚPITER',
        asura: 'ATENA',
        emoji: '♃',
        title: '🦉 Asura da Sabedoria Soberana',
        description: '5º planeta do Sistema Solar',
        info: 'Atena expande o conhecimento e a sabedoria na WZ. Como Júpiter, o maior planeta, Atena reina com inteligência e visão, guiando o império com clareza.',
        distance: '778,5 milhões km',
        diameter: '142.984 km',
        day: '9,9 horas',
        year: '11,86 anos',
        moons: '95 luas (Ganímedes é a maior)',
        color: '#d4a574',
        sigil: '🦉',
        type: 'Planeta'
    },
    saturn: {
        name: 'SATURNO',
        asura: 'HÉSTIA',
        emoji: '♄',
        title: '⚖️ Asura da Lei e Ordem',
        description: '6º planeta do Sistema Solar',
        info: 'Héstia rege o tempo, a lei e a jurisprudência na WZ. Como Saturno, com seus anéis que representam ciclos, Héstia mantém a ordem e a justiça no império.',
        distance: '1,43 bilhão km',
        diameter: '120.536 km',
        day: '10,7 horas',
        year: '29,46 anos',
        moons: '146 luas (Titã é a maior)',
        color: '#ead6b8',
        sigil: '⚖️',
        type: 'Planeta'
    },
    uranus: {
        name: 'URANO',
        asura: 'DAEDALA',
        emoji: '⛢',
        title: '🔧 Asura da Inovação e Tecnologia',
        description: '7º planeta do Sistema Solar',
        info: 'Daedala revoluciona a tecnologia e a inovação na WZ. Como Urano, que gira de lado, Daedala pensa fora do convencional, criando o novo e o disruptivo.',
        distance: '2,87 bilhões km',
        diameter: '51.118 km',
        day: '17,2 horas',
        year: '84 anos',
        moons: '27 luas',
        color: '#7ec8e3',
        sigil: '🔧',
        type: 'Planeta'
    },
    neptune: {
        name: 'NETUNO',
        asura: 'UMBRA',
        emoji: '♆',
        title: '🌙 Asura do Mistério e Percepção',
        description: '8º planeta do Sistema Solar',
        info: 'Umbra rege as sombras, o mistério e a caça na WZ. Como Netuno, que esconde segredos nas profundezas, Umbra vê o que outros não percebem e age nas margens.',
        distance: '4,50 bilhões km',
        diameter: '49.528 km',
        day: '16,1 horas',
        year: '164,8 anos',
        moons: '16 luas (Tritão é a maior)',
        color: '#3b4cb8',
        sigil: '🌙',
        type: 'Planeta'
    },
    pluto: {
        name: 'PLUTÃO',
        asura: 'MÉRLIM',
        emoji: '♇',
        title: '🔮 Guardião do Limiar Invisível',
        description: 'Planeta anão — Guardião da Fronteira',
        info: 'Mérlim rege a transformação profunda e a engenharia do renascimento na WZ. Como Plutão, que existe além da fronteira conhecida, Mérlim é o guardião do limiar, mostrando que sempre há um novo ciclo além do fim aparente.',
        distance: '5,91 bilhões km',
        diameter: '2.377 km',
        day: '6,4 dias',
        year: '248 anos',
        moons: '5 luas (Caronte é a maior)',
        color: '#d6c8b0',
        sigil: '🔮',
        type: 'Planeta Anão'
    }
};

const celestialData = {
    sun: {
        name: 'SOL',
        emoji: '☀️',
        asura: 'MESTRE',
        title: '👑 A Presença que Ilumina',
        description: 'Centro do Sistema Solar',
        info: 'O Sol é o silêncio que ilumina. Não é o soberano que fala, é a fonte que aquece. Não é a ordem que se impõe, é a luz que permite que tudo cresça. Na cosmologia da WZ, o Sol representa a Presença do Mestre — simples, silenciosa, mas essencial.',
        distance: '—',
        diameter: '1.392.700 km',
        day: '25 dias',
        year: '—',
        moons: '8 planetas',
        color: '#fdb813',
        sigil: '👑',
        type: 'Estrela'
    },
    moon: {
        name: 'LUA',
        emoji: '🌙',
        asura: 'HÉCATE',
        title: '🌙 Guardiã das Fronteiras',
        description: 'Satélite Natural da Terra — Selo de Hécate no Céu',
        info: 'A Lua é Hécate, a Guardiã das Fronteiras. Ela não emite luz própria — reflete a luz do Sol, assim como Hécate reflete a autoridade do Mestre. Ela vigia os limiares entre o conhecido e o desconhecido, entre a Terra e o cosmos.',
        distance: '384.400 km',
        diameter: '3.474 km',
        day: '27,3 dias',
        year: '27,3 dias',
        moons: '—',
        color: '#d4d4d4',
        sigil: '🌙',
        type: 'Satélite — Guardiã das Fronteiras'
    }
};

function createInfoPanel() {
    addLog('🪟 Criando painel GLASS...', 'glass');
    
    const panel = document.createElement('div');
    panel.id = 'planetPanel';
    panel.className = 'glass-panel';
    
    panel.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px;">
            <div id="planetEmoji" style="font-size: 36px; line-height: 1; flex-shrink: 0;">🌍</div>
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span id="planetName" style="font-size: 22px; font-weight: bold; color: #8ab4f8; letter-spacing: 2px; text-transform: uppercase;">TERRA</span>
                    <span id="planetSigil" style="font-size: 16px; opacity: 0.6;">🛡️</span>
                </div>
                <div id="planetAsura" style="font-size: 16px; font-weight: bold; color: #6a9fd8; letter-spacing: 1px; margin-top: 2px;">ASTREIA</div>
                <div id="planetTitle" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1px; margin-top: 2px;">🛡️ Asura da Proteção e Defesa</div>
            </div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
            <span style="font-size: 11px; background: rgba(100,200,255,0.08); padding: 2px 12px; border-radius: 12px; color: rgba(255,255,255,0.4); border: 1px solid rgba(100,200,255,0.05);" id="planetDesc">3º planeta</span>
            <span style="font-size: 11px; background: rgba(100,200,255,0.05); padding: 2px 12px; border-radius: 12px; color: rgba(255,255,255,0.3); border: 1px solid rgba(100,200,255,0.05);" id="planetClassification">Planeta</span>
        </div>
        
        <div id="planetInfo" style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 16px; padding: 14px 16px; background: rgba(0, 50, 100, 0.08); border-radius: 8px; border-left: 2px solid rgba(100, 200, 255, 0.2);">
            Informações do corpo celeste
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; font-size: 12px; color: rgba(255,255,255,0.5);">
            <div><span style="color: rgba(255,255,255,0.2);">🌞 Distância</span><br><span id="planetDistance" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">📏 Diâmetro</span><br><span id="planetDiameter" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">🌅 Dia</span><br><span id="planetDay" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">📅 Ano</span><br><span id="planetYear" style="color: #8ab4f8; font-weight: bold;">---</span></div>
        </div>
        
        <div style="margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.25); text-align: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04);">
            <span id="planetMoons">🌙 0 luas</span>
        </div>
        
        <div style="position: absolute; top: 12px; right: 16px;">
            <button id="closePanel" class="glass-close">✕</button>
        </div>
        
        <div style="position: absolute; bottom: 12px; right: 16px; font-size: 9px; color: rgba(255,255,255,0.06); letter-spacing: 3px; text-transform: uppercase;">
            ⚜️ WZ • Cosmologia
        </div>
    `;

    document.body.appendChild(panel);
    addLog('✅ Painel GLASS criado!', 'success');

    document.getElementById('closePanel').addEventListener('click', closePanel);
    document.getElementById('closePanel').addEventListener('touchend', (e) => {
        e.preventDefault();
        closePanel();
    });

    return panel;
}

function openPanel(key) {
    if (!key) {
        addLog('⚠️ openPanel chamada sem key! Ignorando...', 'warning');
        return;
    }
    
    addLog(`📂 Abrindo painel para: ${key}`, 'planet');
    
    const panel = document.getElementById('planetPanel') || createInfoPanel();
    
    let data = null;
    
    if (key === 'sun') {
        data = celestialData.sun;
        addLog('☀️ SOL (MESTRE)', 'planet');
    } else if (key === 'moon') {
        data = celestialData.moon;
        addLog('🌙 LUA (HÉCATE)', 'planet');
    } else if (key === 'mercury') {
        data = planetData.mercury;
        addLog('🪐 MERCÚRIO (SÍRIA)', 'planet');
    } else if (key === 'venus') {
        data = planetData.venus;
        addLog('🪐 VÊNUS (DIVA)', 'planet');
    } else if (key === 'earth') {
        data = planetData.earth;
        addLog('🪐 TERRA (ASTREIA)', 'planet');
    } else if (key === 'mars') {
        data = planetData.mars;
        addLog('🪐 MARTE (VICTÓRIA)', 'planet');
    } else if (key === 'jupiter') {
        data = planetData.jupiter;
        addLog('🪐 JÚPITER (ATENA)', 'planet');
    } else if (key === 'saturn') {
        data = planetData.saturn;
        addLog('🪐 SATURNO (HÉSTIA)', 'planet');
    } else if (key === 'uranus') {
        data = planetData.uranus;
        addLog('🪐 URANO (DAEDALA)', 'planet');
    } else if (key === 'neptune') {
        data = planetData.neptune;
        addLog('🪐 NETUNO (UMBRA)', 'planet');
    } else if (key === 'pluto') {
        data = planetData.pluto;
        addLog('🪐 PLUTÃO (MÉRLIM)', 'planet');
    } else {
        addLog(`❌ Key desconhecida: "${key}" - IGNORANDO!`, 'error');
        return;
    }
    
    if (!data) {
        addLog(`❌ Dados NÃO encontrados para: ${key}`, 'error');
        return;
    }

    document.getElementById('planetEmoji').textContent = data.emoji;
    document.getElementById('planetName').textContent = data.name;
    
    const asuraEl = document.getElementById('planetAsura');
    const titleEl = document.getElementById('planetTitle');
    
    if (data.asura) {
        asuraEl.textContent = data.asura;
        asuraEl.style.display = 'block';
    } else {
        asuraEl.style.display = 'none';
    }
    
    titleEl.textContent = data.title;
    titleEl.style.display = 'block';
    
    document.getElementById('planetSigil').textContent = data.sigil || '';
    document.getElementById('planetDesc').textContent = data.description;
    document.getElementById('planetInfo').textContent = data.info;
    document.getElementById('planetDistance').textContent = data.distance;
    document.getElementById('planetDiameter').textContent = data.diameter;
    document.getElementById('planetDay').textContent = data.day;
    document.getElementById('planetYear').textContent = data.year;
    document.getElementById('planetMoons').textContent = data.moons !== '—' ? `🌙 ${data.moons}` : '—';
    document.getElementById('planetClassification').textContent = data.type || 'Planeta';

    document.getElementById('planetName').style.color = data.color;
    if (data.asura) {
        document.getElementById('planetAsura').style.color = data.color;
    }
    document.getElementById('planetInfo').style.borderLeftColor = data.color;

    panel.classList.add('active');
    addLog('✅ Painel ABERTO para: ' + data.name, 'success');
}

function closePanel() {
    const panel = document.getElementById('planetPanel');
    if (!panel) return;
    panel.classList.remove('active');
    addLog('❌ Painel FECHADO', 'info');
}


/* =========================================================
   MODO EXPLORAÇÃO
========================================================= */

let explorationMode = {
    active: false,
    target: null,
    zoomLevel: 1,
    isTransitioning: false
};

const planetZoomLevels = {
    mercury: 2.8, venus: 2.5, earth: 2.2, mars: 2.6,
    jupiter: 1.8, saturn: 2.0, uranus: 2.4, neptune: 2.6,
    pluto: 3.0, sun: 2.0, moon: 3.5
};

function createBackButton() {
    addLog('🔙 Criando botão Voltar GLASS...', 'glass');
    const btn = document.createElement('button');
    btn.id = 'backButton';
    btn.className = 'glass-back';
    btn.textContent = '← Voltar ao Sistema Solar';
    btn.addEventListener('click', exitExploration);
    btn.addEventListener('touchend', (e) => { e.preventDefault(); exitExploration(); });
    document.body.appendChild(btn);
    addLog('✅ Botão Voltar GLASS criado!', 'success');
    return btn;
}

function enterExploration(key) {
    if (!key) {
        addLog('⚠️ enterExploration chamada sem key!', 'warning');
        return;
    }
    
    addLog(`🚀 Iniciando exploração para: ${key}`, 'explore');
    
    if (explorationMode.isTransitioning) {
        addLog('⏳ Já está em transição', 'warning');
        return;
    }
    
    if (explorationMode.active && explorationMode.target === key) {
        addLog(`📋 Já está em ${key}, abrindo painel`, 'explore');
        openPanel(key);
        return;
    }
    
    explorationMode.isTransitioning = true;
    explorationMode.active = true;
    explorationMode.target = key;
    
    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backButton') || createBackButton();
    
    let planet = document.querySelector(`[data-key="${key}"]`);
    if (!planet) planet = document.querySelector(`.${key}`);
    
    if (!planet) {
        addLog(`❌ Planeta não encontrado: ${key}`, 'error');
        explorationMode.isTransitioning = false;
        explorationMode.active = false;
        explorationMode.target = null;
        return;
    }
    
    addLog(`📍 Planeta encontrado: ${planet.className}`, 'explore');
    if (!container) {
        addLog('❌ Container não encontrado', 'error');
        explorationMode.isTransitioning = false;
        explorationMode.active = false;
        explorationMode.target = null;
        return;
    }
    
    closePanel();
    
    const containerRect = container.getBoundingClientRect();
    const planetRect = planet.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    const planetCenterX = planetRect.left + planetRect.width / 2;
    const planetCenterY = planetRect.top + planetRect.height / 2;
    const deltaX = centerX - planetCenterX;
    const deltaY = centerY - planetCenterY;
    const zoomLevel = planetZoomLevels[key] || 2.5;
    
    container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${zoomLevel})`;
    
    addLog(`🔍 Zoom para ${key}: ${zoomLevel}x`, 'explore');
    
    setTimeout(() => {
        backBtn.classList.add('visible');
        addLog('🔙 Botão Voltar VISÍVEL', 'explore');
    }, 300);
    
    planet.style.transition = 'filter 0.8s ease, box-shadow 0.8s ease';
    planet.style.filter = 'brightness(1.3) drop-shadow(0 0 40px rgba(160,80,255,0.3))';
    planet.style.zIndex = '20';
    addLog(`✨ ${key} DESTACADO!`, 'explore');
    
    document.querySelectorAll('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon').forEach(p => {
        if (p !== planet) {
            p.style.transition = 'opacity 0.8s ease';
            p.style.opacity = '0.3';
        }
    });
    
    setTimeout(() => {
        openPanel(key);
        explorationMode.isTransitioning = false;
        addLog(`✅ Exploração em ${key} COMPLETA!`, 'success');
    }, 900);
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.transition = 'opacity 0.4s ease';
        pauseBtn.style.opacity = '0';
        pauseBtn.style.pointerEvents = 'none';
    }
}

function exitExploration() {
    addLog('🌌 Saindo do modo exploração...', 'explore');
    if (explorationMode.isTransitioning) {
        addLog('⏳ Já está em transição', 'warning');
        return;
    }
    if (!explorationMode.active) {
        addLog('⚠️ Não está em modo exploração', 'warning');
        return;
    }
    
    explorationMode.isTransitioning = true;
    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backButton');
    closePanel();
    
    if (container) {
        container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        container.style.transform = 'translate(0, 0) scale(1)';
        addLog('🔍 Zoom resetado', 'explore');
    }
    
    document.querySelectorAll('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon').forEach(p => {
        p.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
        p.style.opacity = '1';
        p.style.filter = 'none';
        p.style.zIndex = '';
        p.style.boxShadow = '';
    });
    
    if (backBtn) backBtn.classList.remove('visible');
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.transition = 'opacity 0.6s ease 0.3s';
        pauseBtn.style.opacity = '1';
        pauseBtn.style.pointerEvents = 'auto';
    }
    
    setTimeout(() => {
        explorationMode.active = false;
        explorationMode.target = null;
        explorationMode.isTransitioning = false;
        addLog('🌌 Retornou ao Sistema Solar!', 'success');
    }, 900);
}

document.addEventListener('click', (e) => {
    const panel = document.getElementById('planetPanel');
    if (!panel || !panel.classList.contains('active')) return;
    
    const isClickOnPlanet = e.target.closest('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon');
    const isClickOnPanel = e.target.closest('#planetPanel');
    const isClickOnBack = e.target.closest('#backButton');
    const isClickOnPause = e.target.closest('#pauseBtn');
    const isClickOnLog = e.target.closest('#logBox') || e.target.closest('[id*="log"]') || e.target.closest('[class*="log"]');
    
    if (!isClickOnPlanet && !isClickOnPanel && !isClickOnBack && !isClickOnPause && !isClickOnLog) {
        closePanel();
        addLog('👆 Clique fora → painel fechado', 'info');
    }
});

function addClickHandler(element, key) {
    if (!key) {
        addLog(`⚠️ Elemento sem key: ${element.className}`, 'warning');
        return;
    }
    
    const finalKey = String(key);
    addLog(`🔗 Configurando: ${finalKey} (${element.className})`, 'info');
    
    element.style.cursor = 'pointer';
    element.style.transition = 'transform 0.15s ease, filter 0.3s ease';
    element.style.webkitTapHighlightColor = 'transparent';

    element.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        addLog(`🖱️ CLIQUE em: ${finalKey}`, 'planet');
        openPanel(finalKey);
    });

    element.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addLog(`👆 TOQUE em: ${finalKey}`, 'planet');
        openPanel(finalKey);
    });

    element.addEventListener('touchstart', () => { 
        element.style.transform = 'scale(0.92)'; 
    });
    element.addEventListener('touchend', () => { 
        element.style.transform = 'scale(1)'; 
    });
    element.addEventListener('touchcancel', () => { 
        element.style.transform = 'scale(1)'; 
    });
    element.addEventListener('mousedown', () => { 
        element.style.transform = 'scale(0.92)'; 
    });
    element.addEventListener('mouseup', () => { 
        element.style.transform = 'scale(1)'; 
    });
    element.addEventListener('mouseleave', () => { 
        element.style.transform = 'scale(1)'; 
    });
    element.addEventListener('mouseenter', () => { 
        element.style.filter = 'brightness(1.3) drop-shadow(0 0 20px rgba(160,80,255,0.15))'; 
    });
    element.addEventListener('mouseleave', () => { 
        element.style.filter = 'none'; 
    });
}

function setupPlanetClick() {
    addLog('🪐 Configurando corpos celestes como clicáveis...', 'info');
    const allCelestialBodies = document.querySelectorAll('.sun, .moon, .mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto');
    let count = 0;
    allCelestialBodies.forEach(element => {
        const key = element.dataset.key;
        if (!key) {
            addLog(`⚠️ Elemento sem data-key: ${element.className}`, 'warning');
            return;
        }
        addLog(`🪐 Configurando: ${key} (classe: ${element.className})`, 'info');
        addClickHandler(element, key);
        count++;
    });
    addLog(`✅ ${count} corpos celestes configurados!`, 'success');
    addLog('🚀 Modo Exploração ativado!', 'explore');
}

function initPlanetInteraction() {
    addLog('🔄 Inicializando interação com planetas...', 'info');
    const checkPlanets = setInterval(() => {
        const planets = document.querySelectorAll('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto');
        if (planets.length > 0) {
            clearInterval(checkPlanets);
            addLog(`✅ ${planets.length} planetas encontrados!`, 'success');
            setupPlanetClick();
        }
    }, 100);
    setTimeout(() => {
        clearInterval(checkPlanets);
        addLog('⏰ Timeout: verificando novamente...', 'warning');
        setupPlanetClick();
    }, 5000);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && explorationMode.active) {
        addLog('⌨️ ESC → saindo da exploração', 'explore');
        exitExploration();
    }
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
    addLog('🚀 INICIALIZANDO SISTEMA SOLAR...', 'info');
    
    initLogBox();
    createStars();
    createSaturnRingParticles();
    setupPinchZoom();
    setupPauseButton();
    initPlanetInteraction();

    setTimeout(() => { createComet(); }, randomBetween(3000, 6000));
    scheduleComet();

    setTimeout(() => { createMeteor(); }, randomBetween(5000, 10000));
    scheduleMeteor();

    addLog('✅ SISTEMA SOLAR INICIALIZADO!', 'success');
    addLog('💡 Digite createComet() ou createMeteor() para testar.', 'info');
    addLog('⏸️ Botão ROXO ou ESPAÇO para pausar.', 'info');
    addLog('🪐 Toque nos planetas, Sol ou Lua para viajar!', 'info');
    addLog('📱 Clique em "📋 LOG" para ver os logs!', 'info');

    window.createComet = createComet;
    window.createMeteor = createMeteor;
    window.openPanel = openPanel;
    window.enterExploration = enterExploration;
    window.exitExploration = exitExploration;
    
    addLog('📋 DATA-KEYS ENCONTRADOS:', 'info');
    document.querySelectorAll('[data-key]').forEach(el => {
        addLog(`  - ${el.className} → "${el.dataset.key}"`, 'info');
    });
    
    const planetKeys = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    addLog('📋 VERIFICANDO DADOS DOS PLANETAS:', 'info');
    planetKeys.forEach(key => {
        if (planetData[key]) {
            addLog(`  ✅ ${key}: ${planetData[key].name}`, 'success');
        } else {
            addLog(`  ❌ ${key}: DADOS FALTANDO!`, 'error');
        }
    });
});