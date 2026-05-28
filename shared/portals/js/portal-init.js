import { asurasConfig, defaultPortals } from './portal-config.js';

export function loadAsura(currentAsura, setCurrentAsura, setPortals, setSelectedIndex, updateUI) {
    const urlParams = new URLSearchParams(window.location.search);
    const asuraParam = urlParams.get('asura');
    
    let asura = currentAsura;
    if (asuraParam && asurasConfig[asuraParam]) {
        asura = asuraParam;
    }
    
    if (setCurrentAsura) setCurrentAsura(asura);
    
    let portals = [];
    if (defaultPortals[asura]) {
        portals = JSON.parse(JSON.stringify(defaultPortals[asura]));
    }
    
    if (setPortals) setPortals(portals);
    if (setSelectedIndex) setSelectedIndex(-1);
    
    const asuraNameEl = document.getElementById('asuraName');
    const asuraInfoEl = document.getElementById('asuraInfo');
    if (asuraNameEl) {
        asuraNameEl.textContent = `${asurasConfig[asura].icon} ${asurasConfig[asura].name}`;
        asuraNameEl.style.color = asurasConfig[asura].color;
    }
    if (asuraInfoEl) asuraInfoEl.style.borderColor = asurasConfig[asura].color;
    
    if (updateUI) updateUI(portals);
    
    return { asura, portals };
}

export function initAsuraSelector(currentAsura, setCurrentAsura, setPortals, setSelectedIndex, updateUI) {
    const selector = document.getElementById('asuraSelector');
    selector.innerHTML = '';
    
    Object.keys(asurasConfig).forEach(key => {
        const btn = document.createElement('button');
        btn.className = `asura-btn ${key === currentAsura ? 'active' : ''}`;
        btn.textContent = `${asurasConfig[key].icon} ${asurasConfig[key].name}`;
        btn.style.borderColor = asurasConfig[key].color;
        btn.style.color = asurasConfig[key].color;
        
        btn.addEventListener('click', () => {
            if (setCurrentAsura) setCurrentAsura(key);
            
            const newPortals = JSON.parse(JSON.stringify(defaultPortals[key] || []));
            if (setPortals) setPortals(newPortals);
            if (setSelectedIndex) setSelectedIndex(-1);
            
            document.querySelectorAll('.asura-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const asuraNameEl = document.getElementById('asuraName');
            if (asuraNameEl) {
                asuraNameEl.textContent = `${asurasConfig[key].icon} ${asurasConfig[key].name}`;
                asuraNameEl.style.color = asurasConfig[key].color;
            }
            
            if (updateUI) updateUI(newPortals);
        });
        selector.appendChild(btn);
    });
}