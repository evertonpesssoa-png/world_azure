// ============================================
// 🗝️ HÉCATE - KEY COMBOS
// Detecta combinações de teclas suspeitas e hacker
// ============================================

(function() {
    'use strict';
    
    // Detectar Core (prioridade Hécate)
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    if (!Core) {
        console.error('❌ Hécate KeyCombos: Core não encontrado!');
        return;
    }
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const CONFIG = {
        SEQUENCE_TIMEOUT: 5000,        // Limpar sequência após 5 segundos
        MAX_SEQUENCE_LENGTH: 20,        // Máximo de caracteres na sequência
        PASTE_MAX_LENGTH: 500,          // Máximo de caracteres do paste para log
        SEQUENCE_RESET_ON_DETECT: true  // Resetar sequência após detectar
    };
    
    // Histórico de teclas pressionadas
    let keyHistory = [];
    let keySequence = [];
    let lastKeyTime = 0;
    let detectionCount = 0;
    
    // ============================================
    // COMBINAÇÕES SUSPEITAS (EXPANDIDAS)
    // ============================================
    
    const SUSPICIOUS_COMBOS = [
        // DevTools
        { keys: ['F12'], name: 'DEVTOOLS_F12', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'I'], name: 'DEVTOOLS_CTRL_SHIFT_I', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'J'], name: 'CONSOLE_CTRL_SHIFT_J', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'C'], name: 'INSPECTOR_CTRL_SHIFT_C', severity: 'high', block: true },
        { keys: ['Control', 'U'], name: 'VIEW_SOURCE', severity: 'medium', block: true },
        { keys: ['Control', 'Shift', 'U'], name: 'VIEW_SOURCE_ALT', severity: 'medium', block: true },
        
        // Debug
        { keys: ['Control', 'Shift', 'D'], name: 'DEBUGGER_SHORTCUT', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'S'], name: 'SAVE_SHORTCUT', severity: 'medium', block: true },
        
        // Console/Code injection
        { keys: ['Control', 'Shift', 'K'], name: 'CONSOLE_CLEAR', severity: 'medium', block: false },
        { keys: ['Control', 'Shift', 'E'], name: 'CONSOLE_EVALUATE', severity: 'high', block: true },
        
        // Data manipulation
        { keys: ['Control', 'Shift', 'Delete'], name: 'CLEAR_CACHE', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'R'], name: 'HARD_RELOAD', severity: 'medium', block: true },
        
        // Hack tools
        { keys: ['Control', 'Alt', 'I'], name: 'ALTERNATE_INSPECTOR', severity: 'high', block: true },
        { keys: ['Control', 'Alt', 'J'], name: 'ALTERNATE_CONSOLE', severity: 'high', block: true },
        { keys: ['Control', 'Shift', 'M'], name: 'DEVICE_TOGGLE', severity: 'medium', block: true },
        
        // Mac específicos
        { keys: ['Meta', 'Alt', 'I'], name: 'MAC_DEVTOOLS', severity: 'high', block: true },
        { keys: ['Meta', 'Option', 'I'], name: 'MAC_DEVTOOLS_ALT', severity: 'high', block: true },
        
        // Windows/Linux específicos
        { keys: ['Control', 'Alt', 'Delete'], name: 'TASK_MANAGER', severity: 'low', block: false },
        
        // SQL Injection pattern (simulado)
        { keys: ['\'', ' ', 'o', 'r', ' ', '1', '=', '1'], name: 'SQL_INJECTION_PATTERN', severity: 'critical', block: true },
        { keys: ['<', 's', 'c', 'r', 'i', 'p', 't'], name: 'XSS_PATTERN', severity: 'critical', block: true },
        { keys: ['\'', ';', ' ', 'd', 'r', 'o', 'p'], name: 'SQL_DROP_PATTERN', severity: 'critical', block: true }
    ];
    
    // ============================================
    // SEQUÊNCIAS HACKER (EXPANDIDAS)
    // ============================================
    
    const HACKER_SEQUENCES = [
        { sequence: ['k', 'a', 'l', 'i'], name: 'KALI_LINUX_REFERENCE', severity: 'medium' },
        { sequence: ['h', 'a', 'c', 'k'], name: 'HACK_TERM', severity: 'medium' },
        { sequence: ['i', 'n', 'j', 'e', 'c', 't'], name: 'INJECT_TERM', severity: 'high' },
        { sequence: ['e', 'x', 'p', 'l', 'o', 'i', 't'], name: 'EXPLOIT_TERM', severity: 'high' },
        { sequence: ['b', 'r', 'e', 'a', 'k'], name: 'BREAK_TERM', severity: 'medium' },
        { sequence: ['s', 'q', 'l'], name: 'SQL_TERM', severity: 'high' },
        { sequence: ['x', 's', 's'], name: 'XSS_TERM', severity: 'high' },
        { sequence: ['c', 'r', 'a', 'c', 'k'], name: 'CRACK_TERM', severity: 'medium' },
        { sequence: ['p', 'h', 'p', 'm', 'y', 'a', 'd', 'm', 'i', 'n'], name: 'PHPMYADMIN_REF', severity: 'medium' },
        { sequence: ['r', 'o', 'o', 't'], name: 'ROOT_TERM', severity: 'medium' },
        { sequence: ['a', 'd', 'm', 'i', 'n'], name: 'ADMIN_TERM', severity: 'low' },
        { sequence: ['p', 'a', 's', 's', 'w', 'd'], name: 'PASSWORD_TERM', severity: 'medium' }
    ];
    
    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    
    function applyBlockIfNeeded(combo) {
        if (combo.severity === 'critical') {
            if (typeof Core.applyBlock === 'function') {
                Core.applyBlock(`Combinação crítica detectada: ${combo.name}`);
            } else if (typeof window.HecateBlock !== 'undefined' && window.HecateBlock.applyBlock) {
                window.HecateBlock.applyBlock(`Combinação crítica detectada: ${combo.name}`);
            }
        }
    }
    
    // ============================================
    // DETECÇÃO DE COMBINAÇÕES
    // ============================================
    
    function checkCombos(key, ctrlKey, altKey, shiftKey, metaKey) {
        // Construir combinação atual
        let currentCombo = [key];
        if (ctrlKey) currentCombo.unshift('Control');
        if (altKey) currentCombo.unshift('Alt');
        if (shiftKey) currentCombo.unshift('Shift');
        if (metaKey) currentCombo.unshift('Meta');
        
        for (const combo of SUSPICIOUS_COMBOS) {
            const match = arraysEqual(currentCombo, combo.keys) || 
                         arraysEqual(currentCombo.slice().reverse(), combo.keys);
            
            if (match) {
                detectionCount++;
                
                Core.registerSuspiciousAction(
                    `HACKER_COMBO_DETECTED - ${combo.name} (${combo.severity})`,
                    combo.severity
                );
                
                if (combo.block) {
                    applyBlockIfNeeded(combo);
                }
                
                return true;
            }
        }
        return false;
    }
    
    // ============================================
    // DETECÇÃO DE SEQUÊNCIAS
    // ============================================
    
    function checkSequence(key) {
        const now = Date.now();
        
        // Limpar histórico muito antigo
        if (now - lastKeyTime > CONFIG.SEQUENCE_TIMEOUT) {
            keySequence = [];
        }
        
        lastKeyTime = now;
        keySequence.push(key.toLowerCase());
        
        // Manter apenas últimos N caracteres
        while (keySequence.length > CONFIG.MAX_SEQUENCE_LENGTH) {
            keySequence.shift();
        }
        
        // Verificar sequências suspeitas
        for (const seq of HACKER_SEQUENCES) {
            const sequenceStr = keySequence.join('');
            const targetStr = seq.sequence.join('');
            
            if (sequenceStr.includes(targetStr)) {
                detectionCount++;
                
                Core.registerSuspiciousAction(
                    `HACKER_SEQUENCE_TYPED - ${seq.name} (${targetStr})`,
                    seq.severity
                );
                
                if (CONFIG.SEQUENCE_RESET_ON_DETECT) {
                    keySequence = [];
                }
                return true;
            }
        }
        
        return false;
    }
    
    // ============================================
    // DETECÇÃO DE PASTE
    // ============================================
    
    const SUSPICIOUS_PATTERNS = [
        { pattern: /<script/i, name: 'SCRIPT_TAG_PASTE', severity: 'critical', block: true },
        { pattern: /javascript:/i, name: 'JAVASCRIPT_PROTOCOL', severity: 'critical', block: true },
        { pattern: /eval\(/i, name: 'EVAL_PASTE', severity: 'high', block: true },
        { pattern: /document\.cookie/i, name: 'COOKIE_STEAL', severity: 'critical', block: true },
        { pattern: /localStorage/i, name: 'STORAGE_ACCESS', severity: 'medium', block: false },
        { pattern: /sessionStorage/i, name: 'SESSION_STORAGE_ACCESS', severity: 'medium', block: false },
        { pattern: /fetch\(/i, name: 'FETCH_PASTE', severity: 'medium', block: false },
        { pattern: /XMLHttpRequest/i, name: 'XHR_PASTE', severity: 'medium', block: false },
        { pattern: /console\./i, name: 'CONSOLE_PASTE', severity: 'low', block: false },
        { pattern: /\.innerHTML/i, name: 'INNER_HTML_PASTE', severity: 'medium', block: false },
        { pattern: /\.src/i, name: 'SRC_PASTE', severity: 'low', block: false },
        { pattern: /postMessage/i, name: 'POST_MESSAGE_PASTE', severity: 'medium', block: false },
        { pattern: /WebSocket/i, name: 'WEBSOCKET_PASTE', severity: 'medium', block: false }
    ];
    
    function detectPastedCode(e) {
        const pastedText = e.clipboardData?.getData('text');
        
        if (!pastedText) return;
        
        const truncatedText = pastedText.length > CONFIG.PASTE_MAX_LENGTH 
            ? pastedText.substring(0, CONFIG.PASTE_MAX_LENGTH) + '...' 
            : pastedText;
        
        for (const pattern of SUSPICIOUS_PATTERNS) {
            if (pattern.pattern.test(pastedText)) {
                detectionCount++;
                
                Core.registerSuspiciousAction(
                    `SUSPICIOUS_CODE_PASTE - ${pattern.name} (${truncatedText.substring(0, 100)})`,
                    pattern.severity
                );
                
                if (pattern.block) {
                    applyBlockIfNeeded({ name: pattern.name, severity: pattern.severity });
                    e.preventDefault();
                    return false;
                }
                break;
            }
        }
        
        return true;
    }
    
    // ============================================
    // DETECÇÃO DE TECLAS ESPECIAIS
    // ============================================
    
    function detectSpecialKeys(e) {
        const specialKeyMap = [
            { key: 'Insert', condition: (e) => e.ctrlKey || e.shiftKey, name: 'INSERT_COMBO_PRESSED', severity: 'medium' },
            { key: 'PrintScreen', condition: null, name: 'PRINT_SCREEN_PRESSED', severity: 'low' },
            { key: 'ScrollLock', condition: null, name: 'SCROLL_LOCK_PRESSED', severity: 'medium' },
            { key: 'Pause', condition: null, name: 'PAUSE_BREAK_PRESSED', severity: 'medium' },
            { key: 'Home', condition: (e) => e.ctrlKey, name: 'CTRL_HOME_PRESSED', severity: 'low' },
            { key: 'End', condition: (e) => e.ctrlKey, name: 'CTRL_END_PRESSED', severity: 'low' }
        ];
        
        for (const item of specialKeyMap) {
            if (e.key === item.key) {
                const shouldTrigger = item.condition ? item.condition(e) : true;
                if (shouldTrigger) {
                    Core.registerSuspiciousAction(item.name, item.severity);
                }
            }
        }
    }
    
    // ============================================
    // HANDLER PRINCIPAL
    // ============================================
    
    function onKeyDown(e) {
        const key = e.key;
        const ctrl = e.ctrlKey || e.metaKey;
        const alt = e.altKey;
        const shift = e.shiftKey;
        const meta = e.metaKey;
        
        // Evitar que atalhos funcionem
        const isSuspiciousCombo = checkCombos(key, ctrl, alt, shift, meta);
        
        if (isSuspiciousCombo) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Detectar sequências de digitação
        if (key.length === 1 && /[a-zA-Z0-9]/i.test(key)) {
            checkSequence(key);
        }
        
        // Detectar teclas especiais
        detectSpecialKeys(e);
    }
    
    function onPaste(e) {
        detectPastedCode(e);
    }
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        console.log('🗝️ HÉCATE: KeyCombos System ativado');
        
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('paste', onPaste);
        
        // Também detectar no body para garantir
        document.body.addEventListener('keydown', onKeyDown);
        document.body.addEventListener('paste', onPaste);
        
        console.log('🗝️ HÉCATE: KeyCombos System pronto');
    }
    
    // Iniciar automaticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();