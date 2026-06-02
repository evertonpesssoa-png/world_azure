// ============================================
// 🗝️ HÉCATE - ANTI-DEBUG
// Detecta e bloqueia ferramentas de desenvolvedor
// ============================================

(function() {
    'use strict';
    
    // Detectar Core (prioridade Hécate)
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    if (!Core) {
        console.error('❌ Hécate AntiDebug: Core não encontrado!');
        return;
    }
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const CONFIG = {
        CHECK_INTERVAL: 1000,      // Verificar a cada 1 segundo
        DEBUGGER_INTERVAL: 3000,    // Debugger check a cada 3 segundos
        SIZE_THRESHOLD: 200,        // Threshold para detectar DevTools por tamanho
        DEBUGGER_TIME_THRESHOLD: 100 // Tempo mínimo para considerar debugger ativo (ms)
    };
    
    let devToolsOpen = false;
    let checkInterval = null;
    let debuggerInterval = null;
    let lastOpenTime = 0;
    let detectionCount = 0;
    
    // ============================================
    // MÉTODOS DE DETECÇÃO
    // ============================================
    
    // Detectar via tamanho da janela
    function detectByWindowSize() {
        const widthThreshold = window.outerWidth - window.innerWidth > CONFIG.SIZE_THRESHOLD;
        const heightThreshold = window.outerHeight - window.innerHeight > CONFIG.SIZE_THRESHOLD;
        
        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                lastOpenTime = Date.now();
                detectionCount++;
                
                Core.registerSuspiciousAction(
                    `DEVTOOLS_OPENED - Window size detection (${detectionCount})`,
                    'high'
                );
                
                console.warn('🗝️ HÉCATE: Ferramentas de desenvolvedor detectadas!');
                
                // Emitir evento global
                if (window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('hecate:devtools', { 
                        detail: { 
                            open: true, 
                            method: 'windowSize',
                            count: detectionCount,
                            timestamp: Date.now()
                        } 
                    }));
                }
            }
        } else {
            if (devToolsOpen) {
                devToolsOpen = false;
                Core.registerSuspiciousAction(
                    'DEVTOOLS_CLOSED',
                    'low'
                );
            }
        }
    }
    
    // Detectar via debugger statement
    function detectByDebugger() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        const duration = end - start;
        
        if (duration > CONFIG.DEBUGGER_TIME_THRESHOLD) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                lastOpenTime = Date.now();
                detectionCount++;
                
                Core.registerSuspiciousAction(
                    `DEVTOOLS_OPENED - Debugger detection (${Math.floor(duration)}ms)`,
                    'high'
                );
            }
        }
    }
    
    // Detectar via toSource (Firefox)
    function detectByToSource() {
        try {
            const dummy = document.createElement('div');
            if (dummy.toSource && dummy.toSource().length > 100) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    Core.registerSuspiciousAction(
                        'DEVTOOLS_OPENED - toSource detection',
                        'high'
                    );
                }
            }
        } catch (e) {
            // Ignorar
        }
    }
    
    // Detectar via console.profile (Chrome)
    function detectByConsoleProfile() {
        if (console.profile && console.profileEnd) {
            try {
                console.profile('hecate_detection');
                console.profileEnd('hecate_detection');
                
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    Core.registerSuspiciousAction(
                        'DEVTOOLS_OPENED - Console.profile detection',
                        'medium'
                    );
                }
            } catch (e) {
                // Ignorar
            }
        }
    }
    
    // ============================================
    // HONEYPOTS E PROTEÇÃO
    // ============================================
    
    // Setup console honeypot
    function setupConsoleHoneypot() {
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        const honeypotMessage = '%c🗝️ HÉCATE %cHONEYPOT ACTIVATED';
        
        console.log = function(...args) {
            if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(honeypotMessage)) {
                Core.registerSuspiciousAction(
                    'CONSOLE_HONEYPOT_TRIGGERED - Console.log manipulation',
                    'high'
                );
            }
            return originalLog.apply(console, args);
        };
        
        console.info = function(...args) {
            if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(honeypotMessage)) {
                Core.registerSuspiciousAction(
                    'CONSOLE_HONEYPOT_TRIGGERED - Console.info manipulation',
                    'high'
                );
            }
            return originalInfo.apply(console, args);
        };
        
        console.warn = function(...args) {
            if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(honeypotMessage)) {
                Core.registerSuspiciousAction(
                    'CONSOLE_HONEYPOT_TRIGGERED - Console.warn manipulation',
                    'medium'
                );
            }
            return originalWarn.apply(console, args);
        };
        
        console.error = function(...args) {
            if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(honeypotMessage)) {
                Core.registerSuspiciousAction(
                    'CONSOLE_HONEYPOT_TRIGGERED - Console.error manipulation',
                    'high'
                );
            }
            return originalError.apply(console, args);
        };
    }
    
    // Detectar tentativa de inspeção de DOM
    function detectDOMInspection() {
        let element = document.createElement('div');
        let inspectionDetected = false;
        
        try {
            Object.defineProperty(element, 'id', {
                get: function() {
                    if (!inspectionDetected) {
                        inspectionDetected = true;
                        Core.registerSuspiciousAction(
                            'DOM_INSPECTION_DETECTED - Element property getter triggered',
                            'medium'
                        );
                    }
                    return '';
                }
            });
        } catch (e) {
            // Fallback para navegadores antigos
            if (element.__defineGetter__) {
                element.__defineGetter__('id', function() {
                    Core.registerSuspiciousAction(
                        'DOM_INSPECTION_DETECTED - __defineGetter__ triggered',
                        'medium'
                    );
                    return '';
                });
            }
        }
        
        // Tentativa de acessar propriedade
        setInterval(() => {
            try {
                const dummy = element.id;
            } catch (e) {}
        }, 100);
    }
    
    // ============================================
    // BLOQUEIO DE SHORTCUTS
    // ============================================
    
    function blockDebugShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                Core.registerSuspiciousAction('F12_PRESSED', 'medium');
                return false;
            }
            
            // Ctrl+Shift+I / Cmd+Option+I (Inspector)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                Core.registerSuspiciousAction('DEVTOOLS_INSPECTOR_SHORTCUT', 'high');
                return false;
            }
            
            // Ctrl+Shift+J / Cmd+Option+J (Console)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                Core.registerSuspiciousAction('DEVTOOLS_CONSOLE_SHORTCUT', 'high');
                return false;
            }
            
            // Ctrl+Shift+C / Cmd+Option+C (Element picker)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
                Core.registerSuspiciousAction('DEVTOOLS_ELEMENT_PICKER', 'medium');
                return false;
            }
            
            // Ctrl+U / Cmd+U (View Source)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
                Core.registerSuspiciousAction('VIEW_SOURCE_ATTEMPT', 'low');
                return false;
            }
            
            // Ctrl+S / Cmd+S (Save)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
                e.preventDefault();
                Core.registerSuspiciousAction('SAVE_PAGE_ATTEMPT', 'low');
                return false;
            }
        });
        
        // Bloquear right-click
        document.addEventListener('contextmenu', (e) => {
            Core.registerSuspiciousAction('RIGHT_CLICK_ATTEMPT', 'low');
            e.preventDefault();
            return false;
        });
        
        // Bloquear drag and drop de elementos
        document.addEventListener('dragstart', (e) => {
            Core.registerSuspiciousAction('DRAG_START_ATTEMPT', 'low');
            e.preventDefault();
            return false;
        });
    }
    
    // ============================================
    // PROTEÇÃO DE PROPRIEDADES
    // ============================================
    
    function protectGlobalObjects() {
        // Prevenir override de funções críticas
        const criticalFunctions = [
            { obj: localStorage, method: 'setItem', name: 'localStorage.setItem' },
            { obj: localStorage, method: 'getItem', name: 'localStorage.getItem' },
            { obj: sessionStorage, method: 'setItem', name: 'sessionStorage.setItem' }
        ];
        
        criticalFunctions.forEach(fn => {
            if (fn.obj && fn.obj[fn.method]) {
                const original = fn.obj[fn.method];
                fn.obj[fn.method] = function(...args) {
                    // Verificar stack trace suspeito
                    const stack = new Error().stack;
                    if (stack && (stack.includes('devtools') || stack.includes('console'))) {
                        Core.registerSuspiciousAction(
                            `CRITICAL_FUNCTION_ACCESS - ${fn.name} called from suspicious context`,
                            'high'
                        );
                    }
                    return original.apply(this, args);
                };
            }
        });
    }
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        console.log('🗝️ HÉCATE: Anti-Debug System ativado');
        
        // Bloquear shortcuts
        blockDebugShortcuts();
        
        // Detectar DevTools por tamanho (mais confiável)
        checkInterval = setInterval(detectByWindowSize, CONFIG.CHECK_INTERVAL);
        
        // Detectar via debugger (mais leve, intervalos maiores)
        debuggerInterval = setInterval(() => {
            detectByDebugger();
            detectByToSource();
        }, CONFIG.DEBUGGER_INTERVAL);
        
        // Setup honeypot
        setupConsoleHoneypot();
        
        // Proteger objetos globais
        protectGlobalObjects();
        
        // Detectar inspeção de DOM
        detectDOMInspection();
        
        // Tentar detectar console aberto via performance
        setInterval(() => {
            if (console.profile && console.profileEnd) {
                detectByConsoleProfile();
            }
        }, 5000);
        
        // Detectar mudanças de orientação (pode indicar inspeção em mobile)
        window.addEventListener('orientationchange', () => {
            Core.registerSuspiciousAction('ORIENTATION_CHANGE', 'low');
        });
        
        console.log('🗝️ HÉCATE: Anti-Debug System pronto');
    }
    
    // Limpar intervalos quando a página for descarregada
    window.addEventListener('beforeunload', () => {
        if (checkInterval) clearInterval(checkInterval);
        if (debuggerInterval) clearInterval(debuggerInterval);
    });
    
    // Iniciar automaticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();