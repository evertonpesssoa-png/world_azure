// ============================================
// 🗝️ HÉCATE - NETWORK GUARD
// Protege contra ataques de rede e injeções
// ============================================

(function() {
    'use strict';
    
    // Detectar Core (prioridade Hécate)
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    if (!Core) {
        console.error('❌ Hécate NetworkGuard: Core não encontrado!');
        return;
    }
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const CONFIG = {
        BLOCK_ON_CRITICAL: true,           // Bloquear em ações críticas
        LOG_ALL_REQUESTS: false,            // Log de todas as requisições (debug)
        ALLOWED_ORIGINS: [
            window.location.origin,
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://unpkg.com',
            'https://cdn.jsdelivr.net'
        ],
        SUSPICIOUS_PATTERNS: [
            { pattern: /\.onion/i, severity: 'critical', name: 'ONION_ADDRESS', block: true },
            { pattern: /\.tor/i, severity: 'critical', name: 'TOR_ADDRESS', block: true },
            { pattern: /localhost/i, severity: 'high', name: 'LOCALHOST_ACCESS', block: true },
            { pattern: /127\.0\.0\.1/i, severity: 'high', name: 'LOCAL_IP_ACCESS', block: true },
            { pattern: /192\.168\./i, severity: 'high', name: 'LOCAL_NETWORK', block: true },
            { pattern: /10\.\d+\.\d+\.\d+/i, severity: 'high', name: 'PRIVATE_IP', block: true },
            { pattern: /172\.(1[6-9]|2[0-9]|3[0-1])\./i, severity: 'high', name: 'PRIVATE_IP_172', block: true },
            { pattern: /ngrok\.io/i, severity: 'critical', name: 'NGROK_TUNNEL', block: true },
            { pattern: /serveo\.net/i, severity: 'critical', name: 'SERVEO_TUNNEL', block: true },
            { pattern: /localhost\.run/i, severity: 'critical', name: 'LOCALHOST_RUN', block: true },
            { pattern: /\.local/i, severity: 'medium', name: 'LOCAL_DOMAIN', block: false },
            { pattern: /telegram\.org/i, severity: 'medium', name: 'TELEGRAM', block: false },
            { pattern: /discord\.com\/api/i, severity: 'medium', name: 'DISCORD_API', block: false },
            { pattern: /pastebin\.com/i, severity: 'medium', name: 'PASTEBIN', block: false }
        ]
    };
    
    let blockedCount = 0;
    let suspiciousCount = 0;
    
    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    
    function applyBlockIfNeeded(severity, reason) {
        if (severity === 'critical' && CONFIG.BLOCK_ON_CRITICAL) {
            blockedCount++;
            if (typeof Core.applyBlock === 'function') {
                Core.applyBlock(`Network: ${reason}`);
            } else if (typeof window.HecateBlock !== 'undefined' && window.HecateBlock.applyBlock) {
                window.HecateBlock.applyBlock(`Network: ${reason}`);
            }
        }
    }
    
    // ============================================
    // VERIFICAÇÃO DE URL
    // ============================================
    
    function checkUrlSuspicion(url) {
        if (!url) return false;
        
        try {
            const urlObj = new URL(url, window.location.href);
            
            // Verificar whitelist
            const isAllowed = CONFIG.ALLOWED_ORIGINS.some(origin => {
                try {
                    const allowedOrigin = new URL(origin).origin;
                    return urlObj.origin === allowedOrigin;
                } catch {
                    return urlObj.origin === origin;
                }
            });
            
            if (isAllowed) return false;
            
            // Verificar patterns suspeitos
            for (const pattern of CONFIG.SUSPICIOUS_PATTERNS) {
                if (pattern.pattern.test(url)) {
                    suspiciousCount++;
                    return pattern;
                }
            }
            
            // Verificar se é um domínio externo desconhecido (apenas log)
            if (urlObj.origin !== window.location.origin && !isAllowed) {
                if (CONFIG.LOG_ALL_REQUESTS) {
                    Core.registerSuspiciousAction(
                        `EXTERNAL_REQUEST - ${urlObj.origin}`,
                        'low'
                    );
                }
                return { severity: 'low', name: 'EXTERNAL_REQUEST', block: false };
            }
            
            return false;
        } catch (e) {
            // URL inválida
            return false;
        }
    }
    
    // ============================================
    // PROTEÇÃO FETCH
    // ============================================
    
    function protectFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const url = args[0];
            const urlStr = typeof url === 'string' ? url : (url.url || url.href);
            
            const suspicion = checkUrlSuspicion(urlStr);
            
            if (suspicion) {
                Core.registerSuspiciousAction(
                    `FETCH_${suspicion.name} - URL: ${urlStr.substring(0, 200)}`,
                    suspicion.severity
                );
                
                if (suspicion.block) {
                    applyBlockIfNeeded(suspicion.severity, suspicion.name);
                    return Promise.reject(new Error(`🔒 Fetch blocked by Hécate: ${suspicion.name}`));
                }
            }
            
            return originalFetch.apply(this, args);
        };
        
        // Preservar propriedades
        for (let prop in originalFetch) {
            if (originalFetch.hasOwnProperty(prop)) {
                window.fetch[prop] = originalFetch[prop];
            }
        }
    }
    
    // ============================================
    // PROTEÇÃO XMLHttpRequest
    // ============================================
    
    function protectXHR() {
        const OriginalXHR = window.XMLHttpRequest;
        
        window.XMLHttpRequest = function() {
            const xhr = new OriginalXHR();
            const originalOpen = xhr.open;
            let url = '';
            
            xhr.open = function(method, requestUrl, ...rest) {
                url = requestUrl;
                const suspicion = checkUrlSuspicion(url);
                
                if (suspicion) {
                    Core.registerSuspiciousAction(
                        `XHR_${suspicion.name} - Method: ${method}, URL: ${url.substring(0, 200)}`,
                        suspicion.severity
                    );
                    
                    if (suspicion.block) {
                        applyBlockIfNeeded(suspicion.severity, suspicion.name);
                        return;
                    }
                }
                
                return originalOpen.call(this, method, requestUrl, ...rest);
            };
            
            return xhr;
        };
        
        window.XMLHttpRequest.prototype = OriginalXHR.prototype;
        window.XMLHttpRequest.prototype.constructor = OriginalXHR;
    }
    
    // ============================================
    // PROTEÇÃO WEBSOCKET
    // ============================================
    
    function protectWebSocket() {
        const OriginalWebSocket = window.WebSocket;
        
        window.WebSocket = function(...args) {
            const url = args[0];
            const suspicion = checkUrlSuspicion(url);
            
            if (suspicion && suspicion.block) {
                Core.registerSuspiciousAction(
                    `WEBSOCKET_${suspicion.name} - URL: ${url}`,
                    'critical'
                );
                applyBlockIfNeeded('critical', `WebSocket: ${suspicion.name}`);
                throw new Error(`🔒 WebSocket blocked by Hécate: ${suspicion.name}`);
            }
            
            if (suspicion) {
                Core.registerSuspiciousAction(
                    `WEBSOCKET_${suspicion.name} - URL: ${url}`,
                    suspicion.severity
                );
            }
            
            return new OriginalWebSocket(...args);
        };
        
        window.WebSocket.prototype = OriginalWebSocket.prototype;
    }
    
    // ============================================
    // DETECÇÃO DE IFRAMES MALICIOSOS
    // ============================================
    
    function detectMaliciousIframes() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME') {
                        const src = node.src || node.getAttribute('src') || '';
                        const suspicion = checkUrlSuspicion(src);
                        
                        if (suspicion) {
                            Core.registerSuspiciousAction(
                                `MALICIOUS_IFRAME_${suspicion.name} - URL: ${src}`,
                                suspicion.severity
                            );
                            
                            if (suspicion.block) {
                                node.remove();
                                applyBlockIfNeeded(suspicion.severity, `Iframe: ${suspicion.name}`);
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // ============================================
    // DETECÇÃO DE SCRIPTS REMOTOS
    // ============================================
    
    function detectRemoteScripts() {
        // Verificar scripts existentes
        const existingScripts = document.querySelectorAll('script[src]');
        existingScripts.forEach(script => {
            const src = script.src;
            if (src && !src.includes(window.location.origin)) {
                const suspicion = checkUrlSuspicion(src);
                if (suspicion && suspicion.block) {
                    Core.registerSuspiciousAction(
                        `EXISTING_REMOTE_SCRIPT - ${src}`,
                        suspicion.severity
                    );
                    script.remove();
                }
            }
        });
        
        // Observar novos scripts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'SCRIPT' && node.src && !node.src.includes(window.location.origin)) {
                        const suspicion = checkUrlSuspicion(node.src);
                        
                        if (suspicion) {
                            Core.registerSuspiciousAction(
                                `REMOTE_SCRIPT_INJECTION_${suspicion.name} - URL: ${node.src}`,
                                suspicion.severity
                            );
                            
                            if (suspicion.block) {
                                node.remove();
                                applyBlockIfNeeded(suspicion.severity, `Remote script: ${suspicion.name}`);
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.head, { childList: true, subtree: true });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // ============================================
    // PROTEÇÃO CONTRA BEACON
    // ============================================
    
    function protectBeacon() {
        if (navigator.sendBeacon) {
            const originalSendBeacon = navigator.sendBeacon;
            
            navigator.sendBeacon = function(url, data) {
                const suspicion = checkUrlSuspicion(url);
                
                if (suspicion) {
                    Core.registerSuspiciousAction(
                        `BEACON_${suspicion.name} - URL: ${url}`,
                        suspicion.severity
                    );
                    
                    if (suspicion.block) {
                        applyBlockIfNeeded(suspicion.severity, `Beacon: ${suspicion.name}`);
                        return false;
                    }
                }
                
                return originalSendBeacon.call(this, url, data);
            };
        }
    }
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        console.log('🗝️ HÉCATE: NetworkGuard ativado');
        
        // Proteger requisições
        protectFetch();
        protectXHR();
        protectWebSocket();
        protectBeacon();
        
        // Detectar injeções
        detectMaliciousIframes();
        detectRemoteScripts();
        
        console.log(`🗝️ HÉCATE: NetworkGuard pronto - ${CONFIG.ALLOWED_ORIGINS.length} origens permitidas`);
    }
    
    // Iniciar automaticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();