// ============================================
// 🗝️ HÉCATE - AUTH.JS
// Sistema de autenticação global
// Integrado com Hécate (Deusa da Proteção)
// ============================================

(function() {
    'use strict';
    
    const CONFIG = {
        GRIMOIRE_PATH: 'index.html',
        ACCESS_DENIED_PATH: 'shared/error/access-denied.html',
        
        // Páginas protegidas (expansível)
        PROTECTED_PAGES: [
            'viagem.html',
            'astreia.html', 'atena.html', 'daedala.html', 'diva.html',
            'hestia.html', 'merlim.html', 'siria.html', 'umbra.html', 'victoria.html'
        ],
        
        // Páginas sempre acessíveis
        PUBLIC_PAGES: ['index.html', 'access-denied.html', '404.html']
    };
    
    // ============================================
    // DETECTAR CORE DISPONÍVEL
    // ============================================
    
    const Core = (typeof HecateCore !== 'undefined') ? HecateCore : 
                 (typeof ObscuratilCore !== 'undefined') ? ObscuratilCore : null;
    
    if (!Core) {
        console.warn('⚠️ Hécate Core não encontrado! Usando fallback.');
    }
    
    // ============================================
    // AUTENTICAÇÃO (com fallback)
    // ============================================
    
    function isAuthenticated() {
        // Prioridade 1: Hécate Core (novo sistema)
        if (Core && Core.isAuthenticated) {
            return Core.isAuthenticated();
        }
        
        // Prioridade 2: Fallback para localStorage antigo
        const auth = localStorage.getItem('wz_authenticated');
        const obscuratilAuth = localStorage.getItem('wz_obscuratil_complete');
        const hecateAuth = localStorage.getItem('hecate_auth_complete');
        
        return auth === 'true' || obscuratilAuth === 'true' || hecateAuth === 'true';
    }
    
    // ============================================
    // SINCRONIZAR COM HÉCATE CORE
    // ============================================
    
    function syncWithHecate() {
        if (!Core || !Core.on) return;
        
        // Quando Hécate autenticar, atualizar localStorage
        Core.on('auth:granted', () => {
            localStorage.setItem('wz_authenticated', 'true');
            console.log('🔄 Auth.js sincronizado com Hécate');
        });
        
        // Quando Hécate limpar autenticação
        Core.on('auth:revoked', () => {
            localStorage.removeItem('wz_authenticated');
            console.log('🔄 Auth.js sincronizado (logout)');
        });
    }
    
    // ============================================
    // REDIRECIONAMENTOS
    // ============================================
    
    function redirectToAccessDenied(reason = 'unauthorized') {
        // Guardar informações para a página cyberpunk
        sessionStorage.setItem('access_denied_reason', reason);
        sessionStorage.setItem('access_denied_from', window.location.pathname);
        sessionStorage.setItem('access_denied_timestamp', Date.now());
        
        // Se tiver Core, registrar ação suspeita
        if (Core && Core.registerSuspiciousAction) {
            Core.registerSuspiciousAction(`ACESSO_DIRETO_NEGADO: ${window.location.pathname}`, 'medium');
        }
        
        console.log(`🚫 Hécate Auth: Redirecionando para acesso negado (${reason})`);
        window.location.href = CONFIG.ACCESS_DENIED_PATH;
    }
    
    function redirectToGrimoire() {
        window.location.href = CONFIG.GRIMOIRE_PATH;
    }
    
    // ============================================
    // VERIFICAÇÃO DE ACESSO
    // ============================================
    
    function getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }
    
    function isPublicPage() {
        const currentPage = getCurrentPage();
        return CONFIG.PUBLIC_PAGES.includes(currentPage);
    }
    
    function isProtectedPage() {
        const currentPage = getCurrentPage();
        
        if (isPublicPage()) return false;
        
        // Verificar na lista de protegidas
        return CONFIG.PROTECTED_PAGES.some(page => 
            currentPage === page || currentPage.includes(page)
        );
    }
    
    function checkPageAccess() {
        const currentPage = getCurrentPage();
        
        // Páginas públicas sempre liberadas
        if (isPublicPage()) {
            console.log(`✅ Hécate Auth: Página pública - ${currentPage}`);
            return true;
        }
        
        // Verificar se é protegida
        if (!isProtectedPage()) {
            console.log(`ℹ️ Hécate Auth: Página não protegida - ${currentPage}`);
            return true;
        }
        
        // Verificar autenticação
        if (!isAuthenticated()) {
            console.log(`🔒 Hécate Auth: Acesso negado - ${currentPage}`);
            
            // Verificar se está bloqueado (se Core existir)
            let isBlocked = false;
            let blockInfo = null;
            
            if (Core) {
                const blockedUntil = localStorage.getItem('hecate_blocked_until') || 
                                    localStorage.getItem('wz_obscuratil_blocked_until');
                if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
                    isBlocked = true;
                    const remainingMs = parseInt(blockedUntil) - Date.now();
                    const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
                    blockInfo = { remainingHours, remainingMs };
                }
            }
            
            const reason = isBlocked ? 'blocked' : 'not_authenticated';
            redirectToAccessDenied(reason);
            return false;
        }
        
        console.log(`✅ Hécate Auth: Acesso liberado - ${currentPage}`);
        return true;
    }
    
    // ============================================
    // TOKENS DE NAVEGAÇÃO
    // ============================================
    
    // Nome em português (como usado no grimório)
    function gerarToken(asura) {
        const token = {
            asura: asura,
            timestamp: Date.now(),
            authenticated: isAuthenticated(),
            source: window.location.pathname
        };
        sessionStorage.setItem('wz_access_token', JSON.stringify(token));
        console.log(`🔑 Hécate Auth: Token gerado para ${asura}`);
        return token;
    }
    
    // Nome em inglês (para compatibilidade)
    function generateToken(asura) {
        return gerarToken(asura);
    }
    
    function verifyToken() {
        const tokenStr = sessionStorage.getItem('wz_access_token');
        if (!tokenStr) return false;
        
        try {
            const token = JSON.parse(tokenStr);
            const age = Date.now() - token.timestamp;
            const isValid = token.authenticated === true && age < 300000; // 5 minutos
            
            if (isValid) {
                console.log('✅ Hécate Auth: Token válido para:', token.asura);
            } else {
                console.log('⚠️ Hécate Auth: Token expirado ou inválido');
            }
            
            return isValid;
        } catch (e) {
            return false;
        }
    }
    
    function clearToken() {
        sessionStorage.removeItem('wz_access_token');
        console.log('🔑 Hécate Auth: Token limpo');
    }
    
    // ============================================
    // LOGOUT
    // ============================================
    
    function logout() {
        // Limpar todas as keys (novas e antigas)
        const keysToRemove = [
            'wz_authenticated',
            'wz_obscuratil_complete',
            'wz_obscuratil_attempts',
            'wz_obscuratil_blocked_until',
            'wz_obscuratil_block_count',
            'hecate_auth_complete',
            'hecate_attempts',
            'hecate_blocked_until',
            'hecate_block_count'
        ];
        
        keysToRemove.forEach(key => {
            if (localStorage.getItem(key) !== null) {
                localStorage.removeItem(key);
            }
        });
        
        sessionStorage.clear();
        
        // Notificar Core se existir
        if (Core && Core.clearAuthentication) {
            Core.clearAuthentication();
        }
        
        console.log('🚪 Hécate Auth: Logout realizado. Todas as credenciais limpas.');
        
        // Redirecionar para o grimório
        window.location.href = CONFIG.GRIMOIRE_PATH;
    }
    
    // ============================================
    // EXPORTAÇÃO
    // ============================================
    
    window.PortalAuth = {
        // Verificação
        isAuthenticated,
        checkAccess: checkPageAccess,
        
        // Navegação (PORTUGUÊS - usado no grimório)
        gerarToken,
        generateToken,  // compatibilidade
        
        // Navegação (INGLÊS)
        generateToken,
        verifyToken,
        clearToken,
        
        // Controle
        logout,
        redirectToDenied: redirectToAccessDenied,
        redirectToGrimoire,
        
        // Utilitários
        getCurrentPage,
        isProtectedPage,
        
        // Configuração
        addProtectedPage: (page) => {
            if (!CONFIG.PROTECTED_PAGES.includes(page)) {
                CONFIG.PROTECTED_PAGES.push(page);
                console.log(`📄 Hécate Auth: Página adicionada à proteção - ${page}`);
            }
        },
        
        // Informações
        getConfig: () => ({ ...CONFIG })
    };
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    // Sincronizar com Hécate Core
    syncWithHecate();
    
    // Executar verificação automaticamente
    const initProtection = () => {
        // Pequeno delay para garantir que o DOM está pronto
        setTimeout(() => {
            checkPageAccess();
        }, 10);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
    
    console.log('🗝️ Hécate Auth.js carregado - Sistema de proteção global');
    console.log(`📋 Protegendo ${CONFIG.PROTECTED_PAGES.length} páginas`);
    
})();