// ============================================
// 🗝️ HÉCATE - INTERACTION MANAGER
// Gerencia interações multi-dispositivo
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus (prioridade Hécate)
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate InteractionManager: EventBus não encontrado!');
        return;
    }
    
    class InteractionManager {
        constructor() {
            this.devices = [];
            this.activeDevice = null;
            this.deviceType = 'unknown';
            this.isInitialized = false;
            this.interactionReceived = false;
            this.blocked = false;
            this.eventListeners = []; // Para cleanup
            
            // Configurações
            this.config = {
                debug: false,
                blockAfterFirstInteraction: false,
                reinteractDelay: 5000,
                autoDetectTV: true
            };
        }
        
        // ============================================
        // DETECÇÃO DE DISPOSITIVOS
        // ============================================
        
        detectDevices() {
            const availableDevices = [];
            
            // Verificar handlers em ordem de prioridade
            const handlers = [
                { handler: window.HecateTVHandler, name: 'TV', oldName: 'TVHandler' },
                { handler: window.HecateTabletHandler, name: 'Tablet', oldName: 'TabletHandler' },
                { handler: window.HecateMobileHandler, name: 'Mobile', oldName: 'MobileHandler' },
                { handler: window.HecateDesktopHandler, name: 'Desktop', oldName: 'DesktopHandler' }
            ];
            
            for (const h of handlers) {
                // Tentar novo nome primeiro, depois antigo
                const handler = h.handler || (typeof window[h.oldName] !== 'undefined' ? window[h.oldName] : null);
                
                if (handler && handler.isActive && handler.isActive()) {
                    availableDevices.push(handler);
                    console.log(`📱 Dispositivo detectado: ${handler.name || h.name}`);
                    break; // Pega o primeiro que detectar
                }
            }
            
            // Fallback para handlers antigos (compatibilidade)
            if (availableDevices.length === 0) {
                const oldHandlers = ['DesktopHandler', 'MobileHandler', 'TabletHandler'];
                for (const name of oldHandlers) {
                    if (typeof window[name] !== 'undefined' && window[name].isActive && window[name].isActive()) {
                        availableDevices.push(window[name]);
                        console.log(`📱 Dispositivo detectado (legado): ${name}`);
                        break;
                    }
                }
            }
            
            // Se nenhum específico, usar fallback
            if (availableDevices.length === 0) {
                console.warn('⚠️ Nenhum handler específico encontrado, usando fallback');
                availableDevices.push(this.getFallbackHandler());
            }
            
            this.devices = availableDevices;
            this.activeDevice = availableDevices[0];
            this.deviceType = this.activeDevice?.type || 'unknown';
            
            console.log(`🗝️ Hécate: Dispositivo ativo - ${this.activeDevice?.name} (${this.deviceType})`);
            
            return this.activeDevice;
        }
        
        // Handler fallback (genérico)
        getFallbackHandler() {
            return {
                type: 'generic',
                name: 'Dispositivo Genérico',
                isActive: () => true,
                register: () => {
                    console.log('🔄 Usando handler genérico');
                    
                    const clickHandler = () => {
                        Events.emit('interaction:click', { device: 'generic', timestamp: Date.now() });
                    };
                    
                    document.addEventListener('click', clickHandler);
                    document.addEventListener('touchstart', clickHandler);
                    
                    return true;
                },
                unregister: () => {},
                getConfig: () => ({}),
                getInfo: () => ({ type: 'generic', name: 'Genérico' })
            };
        }
        
        // ============================================
        // REGISTRO DE HANDLERS
        // ============================================
        
        registerDeviceHandlers() {
            if (!this.activeDevice) return false;
            
            const success = this.activeDevice.register();
            
            if (success) {
                console.log(`✅ Hécate: Handlers registrados para: ${this.activeDevice.name}`);
                this.setupInteractionEvents();
            }
            
            return success;
        }
        
        // ============================================
        // CONFIGURAÇÃO DE EVENTOS
        // ============================================
        
        setupInteractionEvents() {
            // Limpar listeners anteriores se existirem
            this.clearEventListeners();
            
            // Evento de clique/tap
            const clickHandler = (data) => {
                if (this.blocked) return;
                if (this.config.debug) console.log(`🖱️ Clique detectado [${data.device}]`, data);
                this.handleInteraction('click', data);
            };
            Events.on('interaction:click', clickHandler);
            this.eventListeners.push({ event: 'interaction:click', handler: clickHandler });
            
            // Single click
            const singleClickHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('singleclick', data);
            };
            Events.on('interaction:singleclick', singleClickHandler);
            this.eventListeners.push({ event: 'interaction:singleclick', handler: singleClickHandler });
            
            // Double click
            const doubleClickHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('doubleclick', data);
            };
            Events.on('interaction:doubleclick', doubleClickHandler);
            this.eventListeners.push({ event: 'interaction:doubleclick', handler: doubleClickHandler });
            
            // Teclado
            const keyboardHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('keyboard', data);
            };
            Events.on('interaction:keyboard', keyboardHandler);
            this.eventListeners.push({ event: 'interaction:keyboard', handler: keyboardHandler });
            
            // Toque (mobile)
            const touchHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('touch', data);
            };
            Events.on('interaction:touchstart', touchHandler);
            this.eventListeners.push({ event: 'interaction:touchstart', handler: touchHandler });
            
            // Swipe
            const swipeHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('swipe', data);
            };
            Events.on('interaction:swipe', swipeHandler);
            this.eventListeners.push({ event: 'interaction:swipe', handler: swipeHandler });
            
            // Long press
            const longPressHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('longpress', data);
            };
            Events.on('interaction:longpress', longPressHandler);
            this.eventListeners.push({ event: 'interaction:longpress', handler: longPressHandler });
            
            // Scroll
            const scrollHandler = (data) => {
                if (this.blocked) return;
                this.handleInteraction('scroll', data);
            };
            Events.on('interaction:scroll', scrollHandler);
            this.eventListeners.push({ event: 'interaction:scroll', handler: scrollHandler });
            
            if (this.config.debug) console.log('✅ Hécate: Eventos de interação configurados');
        }
        
        clearEventListeners() {
            for (const listener of this.eventListeners) {
                Events.off(listener.event, listener.handler);
            }
            this.eventListeners = [];
        }
        
        // ============================================
        // PROCESSAMENTO DE INTERAÇÃO
        // ============================================
        
        handleInteraction(type, data) {
            // Se já recebeu interação e está bloqueado
            if (this.interactionReceived && this.config.blockAfterFirstInteraction) {
                if (this.config.debug) console.log('⏸️ Interação ignorada - aguardando processamento');
                return;
            }
            
            const isFirst = !this.interactionReceived;
            this.interactionReceived = true;
            
            // Emitir evento principal
            Events.emit('user:interaction', {
                type: type,
                device: this.deviceType,
                data: data,
                timestamp: Date.now(),
                isFirst: isFirst
            });
            
            // Emitir evento específico para primeira interação
            if (isFirst) {
                Events.emit('user:firstInteraction', {
                    type: type,
                    device: this.deviceType,
                    data: data,
                    timestamp: Date.now()
                });
            }
            
            if (this.config.debug) {
                console.log(`👆 Hécate: Interação recebida - ${type} [${this.deviceType}] ${isFirst ? '(PRIMEIRA)' : ''}`);
            }
        }
        
        // ============================================
        // CONTROLE DE ESTADO
        // ============================================
        
        blockInteractions(duration = 1000) {
            this.blocked = true;
            
            setTimeout(() => {
                this.blocked = false;
                if (this.config.debug) console.log('🔓 Hécate: Interações desbloqueadas');
            }, duration);
        }
        
        resetInteraction() {
            this.interactionReceived = false;
            this.blocked = false;
            if (this.config.debug) console.log('🔄 Hécate: Estado de interação resetado');
        }
        
        // ============================================
        // INFORMAÇÕES DO DISPOSITIVO
        // ============================================
        
        getDeviceInfo() {
            return {
                type: this.deviceType,
                name: this.activeDevice?.name || 'Desconhecido',
                config: this.activeDevice?.getConfig?.() || {},
                info: this.activeDevice?.getInfo?.() || {},
                supports: {
                    touch: 'ontouchstart' in window,
                    mouse: !('ontouchstart' in window) || window.matchMedia('(pointer:fine)').matches,
                    stylus: window.matchMedia('(any-pointer:fine)').matches,
                    keyboard: true,
                    remote: this.deviceType === 'tv'
                },
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };
        }
        
        isFirstInteraction() {
            return !this.interactionReceived;
        }
        
        // ============================================
        // CONFIGURAÇÃO
        // ============================================
        
        setDebug(enabled) {
            this.config.debug = enabled;
            if (Events && Events.setDebug) {
                Events.setDebug(enabled);
            }
        }
        
        getConfig() {
            return { ...this.config };
        }
        
        // ============================================
        // INICIALIZAÇÃO E DESTRUIÇÃO
        // ============================================
        
        init() {
            if (this.isInitialized) return this;
            
            console.log('🗝️ Hécate Interaction Manager inicializando...');
            
            this.detectDevices();
            this.registerDeviceHandlers();
            
            this.isInitialized = true;
            
            // Emitir evento de inicialização
            Events.emit('interaction:ready', {
                device: this.deviceType,
                deviceInfo: this.getDeviceInfo(),
                timestamp: Date.now()
            });
            
            console.log(`✅ Hécate Interaction Manager pronto - Dispositivo: ${this.deviceType}`);
            
            return this;
        }
        
        destroy() {
            if (this.activeDevice && this.activeDevice.unregister) {
                this.activeDevice.unregister();
            }
            
            this.clearEventListeners();
            
            this.isInitialized = false;
            this.interactionReceived = false;
            this.blocked = false;
            
            console.log('🗝️ Hécate Interaction Manager destruído');
        }
    }
    
    // Singleton
    const interactionManager = new InteractionManager();
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateInteractionManager = interactionManager;
        // Compatibilidade com nome antigo
        window.InteractionManager = interactionManager;
    }
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = interactionManager;
    }
    
    console.log('🗝️ Hécate Interaction Manager carregado');
    
})();