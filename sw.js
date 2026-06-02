// ============================================
// 🗝️ HÉCATE - SERVICE WORKER
// Protege todas as páginas do World Azure
// ============================================

const CACHE_NAME = 'hecate-protector-v1';
const GRIMOIRE_URL = '/world_azure/index.html';
const ACCESS_DENIED_URL = '/world_azure/shared/error/access-denied.html';

// Páginas que podem ser acessadas diretamente (públicas)
const PUBLIC_PAGES = [
    '/world_azure/index.html',
    '/world_azure/shared/error/access-denied.html',
    '/world_azure/404.html'
];

// Extensões de arquivos que NÃO devem ser bloqueados
const ALLOWED_EXTENSIONS = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.mp3', '.wav', '.ogg', '.json', '.glb', '.gltf', '.bin'
];

// ============================================
// INTERCEPTAR REQUISIÇÕES
// ============================================

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const pathname = url.pathname;
    
    // Verificar se é um arquivo estático (permitir)
    const isStatic = ALLOWED_EXTENSIONS.some(ext => pathname.endsWith(ext));
    if (isStatic) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Verificar se é uma página pública (permitir)
    const isPublic = PUBLIC_PAGES.some(page => pathname === page);
    if (isPublic) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Verificar se é uma página HTML (bloquear e redirecionar)
    if (pathname.endsWith('.html')) {
        console.log(`🗝️ Hécate: Bloqueando acesso direto a ${pathname}`);
        
        // Redirecionar para o grimório
        event.respondWith(
            fetch(GRIMOIRE_URL).catch(() => {
                // Fallback se o grimório não estiver disponível
                return fetch(ACCESS_DENIED_URL);
            })
        );
        return;
    }
    
    // Para todo o resto, permitir
    event.respondWith(fetch(event.request));
});

// ============================================
// INSTALAÇÃO
// ============================================

self.addEventListener('install', (event) => {
    console.log('🗝️ Hécate Service Worker instalado');
    
    // Pular para o ativo imediatamente
    event.waitUntil(self.skipWaiting());
});

// ============================================
// ATIVAÇÃO
// ============================================

self.addEventListener('activate', (event) => {
    console.log('🗝️ Hécate Service Worker ativado');
    
    // Limpar caches antigos
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// ============================================
// MENSAGENS DO CLIENTE
// ============================================

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

console.log('🗝️ Hécate Service Worker carregado');