// ============================================
// 🗝️ HÉCATE - SERVICE WORKER COMPLETO
// Protege TODAS as páginas redirecionando para ACCESS-DENIED
// ============================================

const GRIMOIRE_URL = '/world_azure/index.html';
const ACCESS_DENIED_URL = '/world_azure/shared/error/access-denied.html';

// ============================================
// INTERCEPTAR TODAS AS REQUISIÇÕES
// ============================================

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const pathname = url.pathname;
    
    // 🔓 ARQUIVOS QUE NUNCA SÃO BLOQUEADOS
    const ALWAYS_ALLOW = [
        '/world_azure/index.html',
        '/world_azure/shared/error/access-denied.html',
        '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
        '.mp3', '.wav', '.ogg', '.json', '.glb', '.gltf', '.bin',
        '.mp4', '.webm', '.woff', '.woff2', '.ttf', '.eot'
    ];
    
    // Verificar se é um arquivo sempre permitido
    const isAlwaysAllowed = ALWAYS_ALLOW.some(allow => {
        if (allow.startsWith('.')) {
            return pathname.endsWith(allow);
        }
        return pathname === allow;
    });
    
    if (isAlwaysAllowed) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // 🔒 QUALQUER OUTRO ARQUIVO HTML → REDIRECIONAR PARA ACCESS-DENIED
    if (pathname.endsWith('.html')) {
        console.log(`🗝️ Hécate: Bloqueando ${pathname} → redirecionando para access-denied`);
        
        event.respondWith(
            fetch(ACCESS_DENIED_URL).catch(() => {
                // Fallback: redirecionar para o grimório se access-denied não existir
                return fetch(GRIMOIRE_URL);
            })
        );
        return;
    }
    
    // Para todo o resto, permitir
    event.respondWith(fetch(event.request));
});

// INSTALAÇÃO IMEDIATA
self.addEventListener('install', (event) => {
    console.log('🗝️ Hécate Service Worker instalando...');
    event.waitUntil(self.skipWaiting());
});

// ATIVAÇÃO IMEDIATA
self.addEventListener('activate', (event) => {
    console.log('🗝️ Hécate Service Worker ativado!');
    event.waitUntil(self.clients.claim());
});

console.log('🗝️ Hécate Service Worker carregado - Redirecionando para access-denied.html');