// ============================================
// 🗝️ HÉCATE - CORE
// Deusa da Magia, Encruzilhadas e Proteção
// Sistema de defesa do World Azure
// ============================================

const HecateCore = (function() {
    'use strict';
    
    // Configurações
    const CONFIG = {
        VERSION: '1.0.0',
        NAME: 'Hécate',
        STORAGE_KEYS: {
            AUTH_COMPLETE: 'hecate_auth_complete',
            SUSPICIOUS_ACTIONS: 'hecate_suspicious_log',
            ATTEMPTS: 'hecate_attempts',
            BLOCK_UNTIL: 'hecate_blocked_until',
            BLOCK_COUNT: 'hecate_block_count'
        }
    };
    
    // Estado
    let state = {
        isAuthenticated: false,
        activeAlerts: [],
        listeners: [],
        listenerId: 0
    };
    
    // ============================================
    // AUTENTICAÇÃO
    // ============================================
    
    function isAuthenticated() {
        const auth = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_COMPLETE);
        state.isAuthenticated = auth === 'true';
        return state.isAuthenticated;
    }
    
    function setAuthenticated() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_COMPLETE, 'true');
        state.isAuthenticated = true;
        emitEvent('auth:granted', { timestamp: Date.now() });
        console.log('🗝️ Hécate: Autenticação concedida');
    }
    
    function clearAuthentication() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_COMPLETE);
        state.isAuthenticated = false;
        emitEvent('auth:revoked', { timestamp: Date.now() });
        console.log('🗝️ Hécate: Autenticação removida');
    }
    
    // ============================================
    // SISTEMA DE SUSPEITAS
    // ============================================
    
    function registerSuspiciousAction(action, severity = 'medium') {
        const suspicious = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SUSPICIOUS_ACTIONS) || '[]');
        
        const logEntry = {
            id: Date.now(),
            action: action,
            severity: severity,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        suspicious.unshift(logEntry); // Mais recente primeiro
        while (suspicious.length > 50) suspicious.pop();
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.SUSPICIOUS_ACTIONS, JSON.stringify(suspicious));
        
        console.warn(`🗝️ HÉCATE: [${severity.toUpperCase()}] ${action}`);
        
        emitEvent('suspicious:action', { action, severity, count: suspicious.length });
        
        // Se for crítica, notificar bloqueio
        if (severity === 'critical') {
            emitEvent('security:critical', { action, timestamp: Date.now() });
        }
        
        return suspicious.length;
    }
    
    function getSuspiciousLog() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SUSPICIOUS_ACTIONS) || '[]');
    }
    
    function clearSuspiciousLog() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.SUSPICIOUS_ACTIONS);
        emitEvent('suspicious:cleared', { timestamp: Date.now() });
    }
    
    // ============================================
    // SISTEMA DE EVENTOS (com remoção)
    // ============================================
    
    function on(event, callback, once = false) {
        const id = ++state.listenerId;
        state.listeners.push({ 
            id, 
            event, 
            callback, 
            once 
        });
        
        // Retornar ID para poder remover depois
        return id;
    }
    
    function off(event, callbackOrId) {
        if (typeof callbackOrId === 'number') {
            // Remover por ID
            state.listeners = state.listeners.filter(l => l.id !== callbackOrId);
        } else {
            // Remover por event + callback
            state.listeners = state.listeners.filter(l => 
                !(l.event === event && l.callback === callbackOrId)
            );
        }
    }
    
    function emitEvent(event, data) {
        const toCall = state.listeners.filter(l => l.event === event);
        
        toCall.forEach(listener => {
            try {
                listener.callback(data);
                
                // Se for once, remover após executar
                if (listener.once) {
                    off(event, listener.callback);
                }
            } catch (e) {
                console.error(`Erro no listener de ${event}:`, e);
            }
        });
    }
    
    function once(event, callback) {
        return on(event, callback, true);
    }
    
    function clearEvents() {
        state.listeners = [];
        console.log('🗝️ Hécate: Eventos limpos');
    }
    
    // ============================================
    // UTILITÁRIOS
    // ============================================
    
    function getConfig() {
        return { ...CONFIG };
    }
    
    function getState() {
        return { ...state };
    }
    
    function getVersion() {
        return CONFIG.VERSION;
    }
    
    // ============================================
    // API PÚBLICA
    // ============================================
    
    return {
        // Informações
        VERSION: CONFIG.VERSION,
        NAME: CONFIG.NAME,
        
        // Autenticação
        isAuthenticated,
        setAuthenticated,
        clearAuthentication,
        
        // Suspeitas
        registerSuspiciousAction,
        getSuspiciousLog,
        clearSuspiciousLog,
        
        // Eventos (nova API)
        on,
        off,
        once,
        emit: emitEvent,
        clearEvents,
        
        // Utilitários
        getConfig,
        getState,
        getVersion,
        
        // Constantes expostas
        STORAGE_KEYS: CONFIG.STORAGE_KEYS
    };
    
})();

// Exportar globalmente
if (typeof window !== 'undefined') {
    window.HecateCore = HecateCore;
    // Manter compatibilidade com nome antigo (temporário)
    window.ObscuratilCore = HecateCore;
}

// Log de inicialização
console.log(`🗝️ HÉCATE v${HecateCore.VERSION} - Deusa da Magia e Proteção`);
console.log('🌙 Sistema de defesa do World Azure ativado');