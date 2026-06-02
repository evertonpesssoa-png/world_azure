// ============================================
// 🗝️ HÉCATE - ANTI-HACK
// Detecta e bloqueia manipulação de código
// ============================================

(function() {
    'use strict';
    
    // Detectar Core (prioridade Hécate)
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    if (!Core) {
        console.error('❌ Hécate AntiHack: Core não encontrado!');
        return;
    }
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const CONFIG = {
        INTEGRITY_CHECK_INTERVAL: 5000,  // Verificar integridade a cada 5 segundos
        MAX_STACK_DEPTH: 10,             // Profundidade máxima de stack para análise
        PROTECTED_STORAGE_KEYS: [
            'hecate_auth_complete',
            'hecate_blocked_until',
            'hecate_block_count',
            'hecate_attempts',
            'wz_obscuratil_complete',    // Compatibilidade
            'wz_obscuratil_blocked_until'
        ]
    };
    
    // ============================================
    // HASH E INTEGRIDADE
    // ============================================
    
    let originalHashes = new Map();
    let integrityCheckInterval = null;
    let violationCount = 0;
    
    // Função de hash melhorada
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    // Registrar hash original de funções críticas
    function registerCriticalFunctions() {
        const criticalFunctions = [
            { name: 'HecateCore.isAuthenticated', obj: Core, method: 'isAuthenticated' },
            { name: 'HecateCore.registerSuspiciousAction', obj: Core, method: 'registerSuspiciousAction' },
            { name: 'HecateCore.setAuthenticated', obj: Core, method: 'setAuthenticated' },
            { name: 'JSON.stringify', obj: JSON, method: 'stringify' },
            { name: 'JSON.parse', obj: JSON, method: 'parse' },
            { name: 'Array.prototype.map', obj: Array.prototype, method: 'map' }
        ];
        
        criticalFunctions.forEach(fn => {
            if (fn.obj && typeof fn.obj[fn.method] === 'function') {
                const fnString = fn.obj[fn.method].toString();
                originalHashes.set(fn.name, simpleHash(fnString));
            }
        });
        
        console.log(`🗝️ Hécate: ${originalHashes.size} funções críticas registradas`);
    }
    
    // Verificar integridade das funções
    function checkIntegrity() {
        const checks = [
            { name: 'HecateCore.isAuthenticated', obj: Core, method: 'isAuthenticated', critical: true },
            { name: 'HecateCore.registerSuspiciousAction', obj: Core, method: 'registerSuspiciousAction', critical: true }
        ];
        
        let localViolations = 0;
        
        checks.forEach(fn => {
            if (fn.obj && typeof fn.obj[fn.method] === 'function') {
                const currentHash = simpleHash(fn.obj[fn.method].toString());
                const originalHash = originalHashes.get(fn.name);
                
                if (originalHash && currentHash !== originalHash) {
                    localViolations++;
                    violationCount++;
                    
                    Core.registerSuspiciousAction(
                        `FUNCTION_TAMPERING_DETECTED - ${fn.name} was modified (hash mismatch)`,
                        'critical'
                    );
                }
            }
        });
        
        if (localViolations > 0) {
            console.error('🗝️ HÉCATE: Violação de integridade detectada!');
            
            // Aplicar bloqueio se tiver método
            if (typeof Core.applyBlock === 'function') {
                Core.applyBlock('Código manipulado detectado');
            } else if (typeof window.HecateBlock !== 'undefined' && window.HecateBlock.applyBlock) {
                window.HecateBlock.applyBlock('Código manipulado detectado');
            }
        }
        
        return localViolations;
    }
    
    // ============================================
    // BLOQUEIO DE EVAL E FUNCTION
    // ============================================
    
    function blockDangerousEval() {
        const originalEval = window.eval;
        
        window.eval = function(code) {
            // Verificar se é uma chamada legítima do sistema
            const stack = new Error().stack;
            const isInternalCall = stack && stack.includes('Hecate');
            
            if (!isInternalCall) {
                Core.registerSuspiciousAction(
                    `EVAL_ATTEMPT - Code: ${code ? code.substring(0, 200) : 'empty'}`,
                    'critical'
                );
                throw new Error('❌ eval() blocked by Hécate Security System');
            }
            
            return originalEval.call(this, code);
        };
        
        // Bloquear Function constructor
        const originalFunction = window.Function;
        
        window.Function = function(...args) {
            // Verificar se é uma chamada legítima
            const stack = new Error().stack;
            const isInternalCall = stack && stack.includes('Hecate');
            
            if (!isInternalCall) {
                Core.registerSuspiciousAction(
                    `FUNCTION_CONSTRUCTOR_ATTEMPT - Args: ${args.join(', ').substring(0, 200)}`,
                    'critical'
                );
                throw new Error('❌ Function() constructor blocked by Hécate Security System');
            }
            
            return new originalFunction(...args);
        };
        
        // Copiar propriedades estáticas
        Object.setPrototypeOf(window.Function, originalFunction);
        for (let key in originalFunction) {
            if (originalFunction.hasOwnProperty(key)) {
                window.Function[key] = originalFunction[key];
            }
        }
    }
    
    // ============================================
    // DETECÇÃO DE INJEÇÃO
    // ============================================
    
    function detectScriptInjection() {
        // Salvar referências originais
        const originalAppendChild = document.body.appendChild;
        const originalInsertBefore = document.body.insertBefore;
        const originalWrite = document.write;
        const originalWriteln = document.writeln;
        
        // Bloquear appendChild de scripts
        document.body.appendChild = function(node) {
            if (node && node.tagName === 'SCRIPT') {
                Core.registerSuspiciousAction(
                    `SCRIPT_INJECTION_ATTEMPT - SCRIPT tag via appendChild - src: ${node.src || 'inline'}`,
                    'critical'
                );
                return null;
            }
            if (node && node.tagName === 'IFRAME') {
                Core.registerSuspiciousAction(
                    `IFRAME_INJECTION_ATTEMPT - src: ${node.src || 'unknown'}`,
                    'high'
                );
                return null;
            }
            return originalAppendChild.call(this, node);
        };
        
        // Bloquear insertBefore de scripts
        document.body.insertBefore = function(node, reference) {
            if (node && node.tagName === 'SCRIPT') {
                Core.registerSuspiciousAction(
                    `SCRIPT_INJECTION_ATTEMPT (insertBefore) - src: ${node.src || 'inline'}`,
                    'critical'
                );
                return null;
            }
            return originalInsertBefore.call(this, node, reference);
        };
        
        // Bloquear document.write
        document.write = function(...args) {
            const content = args.join('');
            if (content.includes('<script') || content.includes('<iframe')) {
                Core.registerSuspiciousAction(
                    `DOCUMENT_WRITE_INJECTION_ATTEMPT - Content contains script/iframe`,
                    'critical'
                );
                return;
            }
            return originalWrite.apply(this, args);
        };
        
        document.writeln = function(...args) {
            const content = args.join('');
            if (content.includes('<script') || content.includes('<iframe')) {
                Core.registerSuspiciousAction(
                    `DOCUMENT_WRITELN_INJECTION_ATTEMPT - Content contains script/iframe`,
                    'critical'
                );
                return;
            }
            return originalWriteln.apply(this, args);
        };
    }
    
    // ============================================
    // DETECÇÃO DE OVERRIDE
    // ============================================
    
    function detectNativeOverrides() {
        const nativeMethods = [
            { obj: console, method: 'log', name: 'console.log', severity: 'low' },
            { obj: console, method: 'error', name: 'console.error', severity: 'low' },
            { obj: console, method: 'warn', name: 'console.warn', severity: 'low' },
            { obj: Object, method: 'defineProperty', name: 'Object.defineProperty', severity: 'high' },
            { obj: Object, method: 'getOwnPropertyDescriptor', name: 'Object.getOwnPropertyDescriptor', severity: 'medium' }
        ];
        
        nativeMethods.forEach(method => {
            const original = method.obj[method.method];
            if (!original) return;
            
            Object.defineProperty(method.obj, method.method, {
                value: function(...args) {
                    const stack = new Error().stack;
                    const isSuspicious = stack && (
                        stack.includes('devtools') ||
                        stack.includes('console') && !stack.includes('Hecate')
                    );
                    
                    if (isSuspicious) {
                        Core.registerSuspiciousAction(
                            `NATIVE_METHOD_ACCESS - ${method.name} called from suspicious context`,
                            method.severity
                        );
                    }
                    
                    return original.apply(this, args);
                },
                writable: false,
                configurable: false
            });
        });
    }
    
    // ============================================
    // PROTEÇÃO DE STORAGE
    // ============================================
    
    function protectLocalStorage() {
        const originalClear = localStorage.clear;
        const originalRemoveItem = localStorage.removeItem;
        
        // Bloquear clear completo
        localStorage.clear = function() {
            Core.registerSuspiciousAction(
                'LOCALSTORAGE_CLEAR_ATTEMPT - Full storage wipe attempted',
                'critical'
            );
            
            // Tentar aplicar bloqueio
            if (typeof Core.applyBlock === 'function') {
                Core.applyBlock('Tentativa de limpar dados críticos');
            }
            return null;
        };
        
        // Bloquear remoção de chaves protegidas
        localStorage.removeItem = function(key) {
            if (CONFIG.PROTECTED_STORAGE_KEYS.includes(key)) {
                Core.registerSuspiciousAction(
                    `PROTECTED_STORAGE_REMOVE_ATTEMPT - Key: ${key}`,
                    'critical'
                );
                return null;
            }
            return originalRemoveItem.call(this, key);
        };
        
        // Bloquear setItem em chaves protegidas (evita overwrite)
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (CONFIG.PROTECTED_STORAGE_KEYS.includes(key) && 
                localStorage.getItem(key) === 'true') {
                Core.registerSuspiciousAction(
                    `PROTECTED_STORAGE_MODIFY_ATTEMPT - Key: ${key}`,
                    'high'
                );
                // Permitir apenas se for o próprio sistema
                const stack = new Error().stack;
                if (!stack.includes('Hecate')) {
                    return null;
                }
            }
            return originalSetItem.call(this, key, value);
        };
    }
    
    // ============================================
    // PROTEÇÃO CONTRA DEBUGGER STATEMENT
    // ============================================
    
    function protectAgainstDebugger() {
        // Sobrescrever a função de debugger
        const noop = () => {};
        
        try {
            // Tentar desabilitar debugger statement
            const Debugger = function() {};
            Debugger.prototype = {};
        } catch (e) {
            // Ignorar
        }
        
        // Detectar debugger ativo via try-catch
        setInterval(() => {
            const start = performance.now();
            try {
                // eslint-disable-next-line no-debugger
                debugger;
            } catch (e) {}
            const duration = performance.now() - start;
            
            if (duration > 50) {
                Core.registerSuspiciousAction(
                    `DEBUGGER_STATEMENT_DETECTED - Duration: ${Math.floor(duration)}ms`,
                    'high'
                );
            }
        }, 3000);
    }
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        console.log('🗝️ HÉCATE: Anti-Hack System ativado');
        
        // Registrar funções críticas
        registerCriticalFunctions();
        
        // Verificar integridade periodicamente
        integrityCheckInterval = setInterval(checkIntegrity, CONFIG.INTEGRITY_CHECK_INTERVAL);
        
        // Bloquear eval e Function constructor
        blockDangerousEval();
        
        // Detectar injeção de script
        detectScriptInjection();
        
        // Detectar override de métodos nativos
        detectNativeOverrides();
        
        // Proteger localStorage
        protectLocalStorage();
        
        // Proteger contra debugger
        protectAgainstDebugger();
        
        console.log('🗝️ HÉCATE: Anti-Hack System pronto');
    }
    
    // Limpar intervalo
    window.addEventListener('beforeunload', () => {
        if (integrityCheckInterval) clearInterval(integrityCheckInterval);
    });
    
    // Iniciar automaticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();