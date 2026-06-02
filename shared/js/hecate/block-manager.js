// ============================================
// 🗝️ HÉCATE - BLOCK MANAGER
// Sistema de bloqueio exponencial
// ============================================

(function() {
    'use strict';
    
    // Detectar Core (prioridade Hécate)
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    if (!Core) {
        console.error('❌ Hécate BlockManager: Core não encontrado!');
        return;
    }
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const BLOCK_CONFIG = {
        MAX_ATTEMPTS: 3,
        BASE_BLOCK_HOURS: 24,
        EXPONENTIAL_BASE: 2,
        MAX_BLOCK_DAYS: 30,
        
        STORAGE_KEYS: {
            ATTEMPTS: 'hecate_attempts',
            BLOCK_UNTIL: 'hecate_blocked_until',
            BLOCK_COUNT: 'hecate_block_count'
        }
    };
    
    // Keys antigas para compatibilidade/migração
    const OLD_STORAGE_KEYS = {
        ATTEMPTS: 'wz_obscuratil_attempts',
        BLOCK_UNTIL: 'wz_obscuratil_blocked_until',
        BLOCK_COUNT: 'wz_obscuratil_block_count'
    };
    
    // ============================================
    // FUNÇÕES DE MIGRAÇÃO
    // ============================================
    
    function migrateOldData() {
        let migrated = false;
        
        // Migrar attempts
        const oldAttempts = localStorage.getItem(OLD_STORAGE_KEYS.ATTEMPTS);
        if (oldAttempts !== null && !localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS)) {
            localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS, oldAttempts);
            migrated = true;
        }
        
        // Migrar block_until
        const oldBlockUntil = localStorage.getItem(OLD_STORAGE_KEYS.BLOCK_UNTIL);
        if (oldBlockUntil !== null && !localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL)) {
            localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL, oldBlockUntil);
            migrated = true;
        }
        
        // Migrar block_count
        const oldBlockCount = localStorage.getItem(OLD_STORAGE_KEYS.BLOCK_COUNT);
        if (oldBlockCount !== null && !localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_COUNT)) {
            localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_COUNT, oldBlockCount);
            migrated = true;
        }
        
        if (migrated) {
            console.log('🗝️ Hécate BlockManager: Dados migrados do sistema antigo');
        }
    }
    
    // ============================================
    // FUNÇÕES DE BLOQUEIO
    // ============================================
    
    function calculateBlockTime(blockCount) {
        if (blockCount <= 0) return 0;
        let hours = BLOCK_CONFIG.BASE_BLOCK_HOURS * Math.pow(BLOCK_CONFIG.EXPONENTIAL_BASE, blockCount - 1);
        const maxHours = BLOCK_CONFIG.MAX_BLOCK_DAYS * 24;
        return Math.min(hours, maxHours);
    }
    
    function getBlockCount() {
        const count = localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_COUNT);
        return count ? parseInt(count) : 0;
    }
    
    function incrementBlockCount() {
        const current = getBlockCount();
        const newCount = current + 1;
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_COUNT, newCount);
        return newCount;
    }
    
    function resetBlockCount() {
        localStorage.removeItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_COUNT);
        localStorage.removeItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL);
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS, '0');
        
        // Limpar dados antigos também
        localStorage.removeItem(OLD_STORAGE_KEYS.BLOCK_COUNT);
        localStorage.removeItem(OLD_STORAGE_KEYS.BLOCK_UNTIL);
        localStorage.removeItem(OLD_STORAGE_KEYS.ATTEMPTS);
    }
    
    function isBlocked() {
        const blockedUntil = localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL);
        if (!blockedUntil) {
            return { blocked: false, remainingMs: 0, remainingHours: 0, blockCount: getBlockCount() };
        }
        
        const blockedTime = parseInt(blockedUntil);
        const now = Date.now();
        
        if (now >= blockedTime) {
            localStorage.removeItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL);
            return { blocked: false, remainingMs: 0, remainingHours: 0, blockCount: getBlockCount() };
        }
        
        const remainingMs = blockedTime - now;
        const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
        const remainingDays = Math.floor(remainingHours / 24);
        
        return {
            blocked: true,
            remainingMs: remainingMs,
            remainingHours: remainingHours,
            remainingDays: remainingDays,
            blockCount: getBlockCount(),
            // Formatação amigável
            remainingText: remainingDays > 0 ? `${remainingDays} ${remainingDays === 1 ? 'dia' : 'dias'}` : `${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}`
        };
    }
    
    function applyBlock(reason = 'Falha no teste') {
        const newBlockCount = incrementBlockCount();
        const blockHours = calculateBlockTime(newBlockCount);
        const blockUntil = Date.now() + (blockHours * 60 * 60 * 1000);
        
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.BLOCK_UNTIL, blockUntil);
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS, '0');
        
        // Registrar ação suspeita
        Core.registerSuspiciousAction(
            `BLOQUEIO_APLICADO: ${reason} | Duração: ${blockHours}h | Contagem: ${newBlockCount}`,
            'high'
        );
        
        console.warn(`🔒 Hécate BlockManager: Bloqueio #${newBlockCount} - ${blockHours} horas`);
        
        return { blockCount: newBlockCount, blockHours, blockUntil, reason };
    }
    
    function getAttempts() {
        const blockStatus = isBlocked();
        if (blockStatus.blocked) return BLOCK_CONFIG.MAX_ATTEMPTS;
        
        const attempts = localStorage.getItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS);
        return attempts ? parseInt(attempts) : 0;
    }
    
    function incrementAttempts() {
        const current = getAttempts();
        const newAttempts = current + 1;
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS, newAttempts);
        
        if (newAttempts >= BLOCK_CONFIG.MAX_ATTEMPTS) {
            const blockInfo = applyBlock('Tentativas excedidas');
            return { attempts: newAttempts, blocked: true, blockInfo };
        }
        
        return { attempts: newAttempts, blocked: false };
    }
    
    function resetAttempts() {
        localStorage.setItem(BLOCK_CONFIG.STORAGE_KEYS.ATTEMPTS, '0');
    }
    
    function getRemainingAttempts() {
        const attempts = getAttempts();
        return Math.max(0, BLOCK_CONFIG.MAX_ATTEMPTS - attempts);
    }
    
    // ============================================
    // ESCUTAR EVENTOS CRÍTICOS
    // ============================================
    
    Core.on('security:critical', (data) => {
        console.warn('🔒 Hécate: Evento crítico detectado, aplicando bloqueio:', data);
        applyBlock(`Ação crítica: ${data.action}`);
    });
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    function init() {
        migrateOldData();
        console.log(`🗝️ Hécate BlockManager v1.0 - Sistema de bloqueio exponencial`);
        console.log(`📊 Config: ${BLOCK_CONFIG.MAX_ATTEMPTS} tentativas, bloqueio base de ${BLOCK_CONFIG.BASE_BLOCK_HOURS}h`);
    }
    
    // ============================================
    // API PÚBLICA
    // ============================================
    
    const BlockManager = {
        // Estado
        isBlocked,
        getBlockCount,
        getAttempts,
        getRemainingAttempts,
        
        // Ações
        applyBlock,
        incrementAttempts,
        resetAttempts,
        resetBlockCount,
        
        // Cálculos
        calculateBlockTime,
        
        // Config
        CONFIG: BLOCK_CONFIG,
        
        // Inicialização
        init
    };
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateBlock = BlockManager;
        // Compatibilidade com nome antigo
        window.BlockManager = BlockManager;
    }
    
    // Inicializar automaticamente
    init();
    
})();