export function updatePortalsList(portals, selectedPortalIndex, onDeleteCallback, onSelectCallback, onDoubleClickCallback) {
    const list = document.getElementById('portalsList');
    const portalCount = document.getElementById('portalCount');
    
    if (portals.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">🌀 Nenhum portal cadastrado</div>';
        if (portalCount) portalCount.innerHTML = '📦 0 portais ativos';
        return;
    }
    
    if (portalCount) portalCount.innerHTML = `📦 ${portals.length} portal(is) ativo(s)`;
    
    list.innerHTML = portals.map((portal, idx) => `
        <div class="portal-item ${idx === selectedPortalIndex ? 'selected' : ''}" data-index="${idx}">
            <div class="portal-info">
                <span class="portal-icon">${portal.icon}</span>
                <div class="portal-details">
                    <div class="portal-name">${portal.name}</div>
                    <div class="portal-pos">📍 x: ${portal.x}, z: ${portal.z}</div>
                </div>
            </div>
            <button class="delete-portal" data-index="${idx}">🗑️</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.portal-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-portal')) return;
            const idx = parseInt(el.dataset.index);
            if (onSelectCallback) onSelectCallback(idx);
        });
        
        el.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('delete-portal')) return;
            const idx = parseInt(el.dataset.index);
            if (onDoubleClickCallback) onDoubleClickCallback(portals[idx]);
        });
    });
    
    document.querySelectorAll('.delete-portal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            if (confirm(`Remover portal "${portals[idx].name}"?`)) {
                if (onDeleteCallback) onDeleteCallback(idx);
            }
        });
    });
}