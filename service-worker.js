// ============================================
// 🗝️ HÉCATE - SERVICE WORKER CORRIGIDO
// Verifica autenticação ANTES de bloquear
// ============================================

const GRIMOIRE_URL = '/world_azure/index.html';
const ACCESS_DENIED_URL = '/world_azure/shared/error/access-denied.html';

// ============================================
// FUNÇÃO PARA VERIFICAR AUTENTICAÇÃO
// ============================================

function isAuthenticated(request) {
    // Tentar pegar o token do header ou do sessionStorage via client
    // Service Worker não acessa localStorage diretamente
    return new Promise((resolve) => {
        // Verificar se existe um token no header da requisição
        const authHeader = request.headers.get('X-Hecate-Auth');
        if (authHeader === 'true') {
            resolve(true);
            return;
        }
        
        // Se não tiver header, permitir (mas auth.js vai barrar depois)
        // Isso evita bloqueio completo
        resolve(false);
    });
}

// ============================================
// INTERCEPTAR REQUISIÇÕES
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
    
    // 🔒 BLOQUEAR APENAS PÁGINAS HTML PROTEGIDAS
    // NÃO bloqueia todas as HTML, apenas as que não são index.html
    if (pathname.endsWith('.html') && !pathname.endsWith('index.html')) {
        console.log(`🗝️ Hécate SW: Verificando acesso para ${pathname}`);
        
        // Permitir a requisição - o auth.js vai fazer a verificação real
        // Se o Service Worker bloquear, nunca chega no auth.js!
        event.respondWith(fetch(event.request).catch(() => {
            // Se falhar, redirecionar para access-denied
            return fetch(ACCESS_DENIED_URL);
        }));
        return;
    }
    
    // Para todo o resto, permitir
    event.respondWith(fetch(event.request));
});

// INSTALAÇÃO
self.addEventListener('install', (event) => {
    console.log('🗝️ Hécate SW instalando (versão corrigida)...');
    event.waitUntil(self.skipWaiting());
});

// ATIVAÇÃO
self.addEventListener('activate', (event) => {
    console.log('🗝️ Hécate SW ativado!');
    event.waitUntil(self.clients.claim());
});