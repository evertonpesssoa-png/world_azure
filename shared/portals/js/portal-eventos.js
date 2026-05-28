import { asurasConfig, BASE_URL } from './portal-config.js';

let portals = [];
let selectedPortalIndex = -1;
let currentAsura = 'merlim';
let updatePortalsListCallback = null;

export function setPortalsRef(p, idx, asura, callback) {
    portals = p;
    selectedPortalIndex = idx;
    currentAsura = asura;
    updatePortalsListCallback = callback;
}

export function initEventos() {
    // ADICIONAR PORTAL
    document.getElementById('addPortalBtn')?.addEventListener('click', () => {
        const x = parseFloat(document.getElementById('posX').value);
        const z = parseFloat(document.getElementById('posZ').value);
        const y = parseFloat(document.getElementById('posY').value);
        const name = document.getElementById('portalName').value.trim();
        const icon = document.getElementById('portalIcon').value.trim() || '🚪';
        
        if (!name) {
            alert('⚠️ Digite um nome para o portal');
            return;
        }
        
        if (portals.length >= 20) {
            alert('⚠️ Máximo de 20 portais por Asura');
            return;
        }
        
        portals.push({ name, icon, x, y, z });
        selectedPortalIndex = portals.length - 1;
        if (updatePortalsListCallback) updatePortalsListCallback(portals, selectedPortalIndex);
        
        document.getElementById('portalName').value = '';
        document.getElementById('portalIcon').value = '🚪';
    });
    
    // COORDENADAS RÁPIDAS
    document.querySelectorAll('.coord-preset').forEach(el => {
        el.addEventListener('click', () => {
            const x = parseFloat(el.dataset.x);
            const z = parseFloat(el.dataset.z);
            document.getElementById('posX').value = x;
            document.getElementById('posZ').value = z;
        });
    });
    
    // EXPORTAR
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const data = { asura: currentAsura, portals: portals };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portals_${currentAsura}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    // IMPORTAR
    document.getElementById('importBtn')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (data.asura === currentAsura) {
                        portals.length = 0;
                        portals.push(...data.portals);
                        selectedPortalIndex = -1;
                        if (updatePortalsListCallback) updatePortalsListCallback(portals, selectedPortalIndex);
                    } else {
                        alert(`❌ Esse arquivo é para ${data.asura}, você está em ${currentAsura}`);
                    }
                } catch (err) {
                    alert('❌ Arquivo inválido');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
    
    // BOTÃO VOLTAR FÍSICO (COM FLASH NA COR DA ASURA)
    document.getElementById('backToAsuraBtn')?.addEventListener('click', () => {
        const lastAsura = localStorage.getItem('lastAsura') || currentAsura;
        document.body.classList.add('transition-out');
        const corAsura = asurasConfig[lastAsura]?.color || '#00ffcc';
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
                window.location.href = BASE_URL + `worlds/${lastAsura}.html`;
            }, 350);
        });
    });
}