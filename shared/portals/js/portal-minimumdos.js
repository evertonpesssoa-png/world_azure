import { BASE_URL } from './portal-config.js';

// =========================
// CAMINHOS DOS MINI-MUNDOS
// =========================
export function getMiniMundoPath(portalName) {
    const map = {
        'SISTEMA SOLAR': BASE_URL + 'mini-mundos/global/sistema_solar/index.html',
        'TERRA': BASE_URL + 'mini-mundos/global/earth/index.html',
        'GALÁXIA': BASE_URL + 'mini-mundos/global/galaxy_animation/index.html',
        'CINEMA': BASE_URL + 'mini-mundos/global/planner/index.html',
        'PRAIA': BASE_URL + 'mini-mundos/global/beach/index.html',
        'CIDADE CYBER': BASE_URL + 'mini-mundos/global/cybercity/index.html',
        'MUSEU DINOSSAURO': BASE_URL + 'mini-mundos/global/dinomuseum/index.html',
        'TEMPLO DRAGÃO': BASE_URL + 'mini-mundos/global/dragon-temple/index.html',
        'BIBLIOTECA': BASE_URL + 'mini-mundos/global/library/index.html',
        'BURACO NEGRO': BASE_URL + 'mini-mundos/exclusive/umbra/buraco_negro/index.html'
    };
    return map[portalName.toUpperCase()] || null;
}

// =========================
// FALLBACK CYBERPUNK PARA MINI-MUNDOS INDISPONÍVEIS
// =========================
export function showCyberpunkWarning(portalName, portalIcon) {
    const existingWarning = document.getElementById('cyberpunk-warning');
    if (existingWarning) existingWarning.remove();
    
    const warning = document.createElement('div');
    warning.id = 'cyberpunk-warning';
    warning.innerHTML = `
        <div class="warning-container">
            <div class="warning-glitch">⚠️ ACESSO NEGADO ⚠️</div>
            <div class="warning-icon">${portalIcon || '🚪'}</div>
            <div class="warning-title">${portalName}</div>
            <div class="warning-message">MINI-MUNDO EM CONSTRUÇÃO</div>
            <div class="warning-sub">Os engenheiros do sistema estão trabalhando neste setor.</div>
            <div class="warning-code">ERROR_404_PORTAL_NOT_FOUND</div>
            <div class="warning-timer">Fechando em <span id="warning-countdown">3</span> segundos...</div>
            <button class="warning-btn" id="warning-close-btn">⨯ FECHAR</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #cyberpunk-warning {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(8px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            animation: warningPulse 0.5s ease;
        }
        .warning-container {
            background: linear-gradient(135deg, #0a0a1a, #000000);
            border: 2px solid #ff00ff;
            border-radius: 16px;
            padding: 30px 40px;
            text-align: center;
            box-shadow: 0 0 40px rgba(255,0,255,0.3);
            animation: warningGlitch 0.3s ease infinite alternate;
            max-width: 90%;
            width: 400px;
        }
        .warning-glitch {
            font-size: 24px;
            font-weight: bold;
            color: #ff00ff;
            text-shadow: 2px 2px 0px #00ffff;
            margin-bottom: 20px;
            animation: glitchText 0.5s ease infinite alternate;
        }
        .warning-icon { font-size: 64px; margin: 20px 0; filter: drop-shadow(0 0 10px #ff00ff); animation: iconPulse 1s ease infinite; }
        .warning-title { font-size: 28px; font-weight: bold; color: #00ffff; margin-bottom: 15px; }
        .warning-message { font-size: 16px; color: #ffaa00; background: rgba(255,170,0,0.1); padding: 8px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #ffaa00; }
        .warning-sub { font-size: 12px; color: #888; margin-bottom: 20px; }
        .warning-code { font-size: 11px; color: #ff4444; background: #1a1a1a; padding: 5px; border-radius: 4px; margin: 15px 0; }
        .warning-timer { font-size: 12px; color: #00ff88; margin: 15px 0; }
        .warning-btn { background: linear-gradient(135deg, #ff00ff, #cc00cc); border: none; color: white; padding: 10px 20px; border-radius: 30px; cursor: pointer; margin-top: 10px; transition: all 0.3s; }
        .warning-btn:hover { transform: scale(1.05); box-shadow: 0 0 20px #ff00ff; }
        @keyframes warningPulse { from { opacity: 0; } to { opacity: 1; } }
        @keyframes warningGlitch { 0% { transform: translate(0); } 100% { transform: translate(2px, -1px); } }
        @keyframes glitchText { 0% { text-shadow: 2px 2px 0px #00ffff; } 100% { text-shadow: -2px -2px 0px #ff00ff; } }
        @keyframes iconPulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(warning);
    
    let countdown = 3;
    const countdownSpan = warning.querySelector('#warning-countdown');
    const timer = setInterval(() => {
        countdown--;
        if (countdownSpan) countdownSpan.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(timer);
            warning.remove();
            style.remove();
        }
    }, 1000);
    
    const closeBtn = warning.querySelector('#warning-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearInterval(timer);
            warning.remove();
            style.remove();
        });
    }
}