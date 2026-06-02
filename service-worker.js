// ============================================
// 🗝️ HÉCATE - SERVICE WORKER COMPLETO
// Protege TODAS as páginas desde o PRIMEIRO ACESSO
// ============================================

const CACHE_NAME = 'hecate-v1';
const GRIMOIRE_URL = '/world_azure/index.html';

// ============================================
// INTERCEPTAR TODAS AS REQUISIÇÕES
// ============================================

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const pathname = url.pathname;
    
    // 🔓 ARQUIVOS QUE NUNCA SÃO BLOQUEADOS
    const ALWAYS_ALLOW = [
        // Páginas públicas
        '/world_azure/index.html',
        '/world_azure/shared/error/access-denied.html',
        
        // Extensões de arquivos estáticos
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
    
    // 🔒 QUALQUER OUTRO ARQUIVO HTML → REDIRECIONAR PARA O GRIMÓRIO
    if (pathname.endsWith('.html')) {
        console.log(`🗝️ Hécate: Bloqueando ${pathname} → redirecionando para o grimório`);
        
        event.respondWith(
            fetch(GRIMOIRE_URL).catch(() => {
                // Fallback se o grimório não estiver disponível
                return new Response(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Hécate - Guardiã do Grimório</title>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                background: radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%);
                                min-height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-family: monospace;
                                margin: 0;
                            }
                            .container {
                                text-align: center;
                                background: rgba(0,0,0,0.9);
                                border: 2px solid #9b30ff;
                                border-radius: 20px;
                                padding: 40px;
                            }
                            .icon { font-size: 60px; margin-bottom: 20px; }
                            h2 { color: #9b30ff; margin-bottom: 10px; }
                            a { color: #9b30ff; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="icon">🗝️</div>
                            <h2>HÉCATE - GUARDIÃ DO GRIMÓRIO</h2>
                            <p>Acesse o <a href="${GRIMOIRE_URL}">Grimório Dimensional</a> para entrar no World Azure.</p>
                        </div>
                    </body>
                    </html>
                `, { headers: { 'Content-Type': 'text/html' } });
            })
        );
        return;
    }
    
    // Para todo o resto, permitir
    event.respondWith(fetch(event.request));
});

// ============================================
// INSTALAÇÃO (ativa imediatamente)
// ============================================

self.addEventListener('install', (event) => {
    console.log('🗝️ Hécate Service Worker instalando...');
    event.waitUntil(self.skipWaiting());
});

// ============================================
// ATIVAÇÃO (toma controle imediatamente)
// ============================================

self.addEventListener('activate', (event) => {
    console.log('🗝️ Hécate Service Worker ativado!');
    event.waitUntil(self.clients.claim());
});

console.log('🗝️ Hécate Service Worker carregado - Proteção ativa');