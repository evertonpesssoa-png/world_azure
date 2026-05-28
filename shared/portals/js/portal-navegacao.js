import { asurasConfig, BASE_URL } from './portal-config.js';
import { getMiniMundoPath, showCyberpunkWarning } from './portal-minimundos.js';

let isRedirecting = false;
let currentAsura = 'merlim';

export function setCurrentAsura(asura) {
    currentAsura = asura;
}

export function getCurrentAsura() {
    return currentAsura;
}

export function openMiniMundo(portalName, portalIcon) {
    if (isRedirecting) return;
    const caminho = getMiniMundoPath(portalName);
    
    if (!caminho) {
        showCyberpunkWarning(portalName, portalIcon);
        return;
    }
    
    localStorage.setItem('lastAsura', currentAsura);
    isRedirecting = true;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed; inset:0; background:radial-gradient(circle, ${asurasConfig[currentAsura].color}, transparent); opacity:0; transition:opacity 0.5s; z-index:99999; pointer-events:none;`;
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
        overlay.style.opacity = '0.8';
        setTimeout(() => { window.location.href = caminho; }, 400);
    });
}

// =========================
// BOTÃO VOLTAR DO CELULAR (COM FLASH NA COR DA ASURA)
// =========================
export function initVoltarCelular() {
    function voltarParaAsura() {
        const asuraParaVoltar = localStorage.getItem('lastAsura') || currentAsura;
        
        document.body.classList.add('transition-out');
        
        const corAsura = asurasConfig[asuraParaVoltar]?.color || '#00ffcc';
        
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, ${corAsura}, transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 100000;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        requestAnimationFrame(() => {
            flash.style.opacity = '0.8';
            setTimeout(() => {
                window.location.href = BASE_URL + `worlds/${asuraParaVoltar}.html`;
            }, 350);
        });
    }
    
    window.addEventListener('popstate', (event) => {
        event.preventDefault();
        history.pushState(null, null, window.location.href);
        voltarParaAsura();
    });
    
    history.pushState(null, null, window.location.href);
    console.log("✅ Botão 'voltar' do celular configurado!");
}