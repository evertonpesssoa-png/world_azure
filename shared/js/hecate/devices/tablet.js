// ============================================
// 📟 HÉCATE - TABLET
// Handlers para tablets (toque + mouse + stylus)
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus (prioridade Hécate, fallback Obscurátil)
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate Tablet: EventBus não encontrado!');
        return;
    }
    
    const TabletHandler = {
        type: 'tablet',
        name: 'Tablet',
        events: [],
        isRegistered: false,
        lastTouchTime: 0,
        
        // ============================================
        // DETECÇÃO DE DISPOSITIVO
        // ============================================
        
        isActive() {
            // iPad (novos iPads com Macintosh UA)
            const isIPad = (/iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document) ||
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            
            // Android Tablet
            const isAndroidTablet = /Android(?!.*Mobile)/i.test(navigator.userAgent);
            
            // Tamanho de tela típico de tablet
            const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1366;
            
            // Tem suporte a toque
            const hasTouch = 'ontouchstart' in window;
            
            return (isIPad || isAndroidTablet || isTabletSize) && hasTouch;
        },
        
        // ============================================
        // HANDLERS
        // ============================================
        
        // Toque (touch)
        handleTouchStart(e) {
            const touch = e.touches[0];
            this.lastTouchTime = Date.now();
            
            Events.emit('interaction:click', {
                device: this.type,
                x: touch?.clientX,
                y: touch?.clientY,
                type: 'touch',
                inputType: 'touch',
                timestamp: Date.now()
            });
            
            // Detectar multi-toque (pinça, etc)
            if (e.touches.length >= 2) {
                Events.emit('interaction:multitouch', {
                    device: this.type,
                    touches: e.touches.length,
                    timestamp: Date.now()
                });
            }
        },
        
        // Mouse (bluetooth, trackpad)
        handleMouseClick(e) {
            // Evitar duplicação se foi um toque recente
            const timeSinceTouch = Date.now() - this.lastTouchTime;
            if (timeSinceTouch < 100) return;
            
            Events.emit('interaction:click', {
                device: this.type,
                x: e.clientX,
                y: e.clientY,
                type: 'mouse',
                button: e.button,
                inputType: 'mouse',
                timestamp: Date.now()
            });
        },
        
        // Stylus / Caneta (Apple Pencil, S Pen, etc)
        handleStylus(e) {
            if (e.pointerType === 'pen') {
                Events.emit('interaction:stylus', {
                    device: this.type,
                    x: e.clientX,
                    y: e.clientY,
                    pressure: e.pressure || 0.5,
                    tiltX: e.tiltX || 0,
                    tiltY: e.tiltY || 0,
                    pointerType: e.pointerType,
                    timestamp: Date.now()
                });
                
                // Stylus também é um clique
                Events.emit('interaction:click', {
                    device: this.type,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'stylus',
                    pressure: e.pressure,
                    inputType: 'pen',
                    timestamp: Date.now()
                });
            }
        },
        
        // Teclado (teclado externo Bluetooth)
        handleKeyboard(e) {
            // Atalhos suspeitos
            const suspiciousKeys = ['F12', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'];
            const isDevShortcut = (e.ctrlKey || e.metaKey) && 
                                  (e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'));
            
            if (suspiciousKeys.includes(e.key) || isDevShortcut) {
                e.preventDefault();
                Events.emit('security:suspicious', {
                    type: 'devtools_shortcut',
                    key: e.key,
                    device: this.type,
                    timestamp: Date.now()
                });
                return;
            }
            
            Events.emit('interaction:keyboard', {
                device: this.type,
                key: e.key,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                code: e.code,
                timestamp: Date.now()
            });
        },
        
        // Scroll (touch ou mouse)
        handleScroll(e) {
            Events.emit('interaction:scroll', {
                device: this.type,
                scrollY: window.scrollY,
                scrollX: window.scrollX,
                deltaY: e.deltaY,
                deltaX: e.deltaX,
                timestamp: Date.now()
            });
        },
        
        // ============================================
        // REGISTRO E LIMPEZA
        // ============================================
        
        register() {
            if (!this.isActive()) return false;
            if (this.isRegistered) return true;
            
            console.log(`📟 Hécate: [${this.name}] Handlers registrados`);
            
            // Bind dos handlers
            this.handleTouchStart = this.handleTouchStart.bind(this);
            this.handleMouseClick = this.handleMouseClick.bind(this);
            this.handleStylus = this.handleStylus.bind(this);
            this.handleKeyboard = this.handleKeyboard.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            
            // Adicionar listeners
            document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
            document.addEventListener('click', this.handleMouseClick);
            document.addEventListener('pointerdown', this.handleStylus);
            document.addEventListener('keydown', this.handleKeyboard);
            window.addEventListener('wheel', this.handleScroll);
            
            this.isRegistered = true;
            return true;
        },
        
        unregister() {
            if (!this.isRegistered) return;
            
            document.removeEventListener('touchstart', this.handleTouchStart);
            document.removeEventListener('click', this.handleMouseClick);
            document.removeEventListener('pointerdown', this.handleStylus);
            document.removeEventListener('keydown', this.handleKeyboard);
            window.removeEventListener('wheel', this.handleScroll);
            
            this.isRegistered = false;
            console.log(`📟 Hécate: [${this.name}] Handlers removidos`);
        },
        
        // ============================================
        // CONFIGURAÇÕES
        // ============================================
        
        getConfig() {
            return {
                supportStylus: true,
                supportMouse: true,
                supportTouch: true,
                supportKeyboard: true,
                minPressure: 0.1,
                deviceType: this.type
            };
        },
        
        getInfo() {
            return {
                type: this.type,
                name: this.name,
                isActive: this.isActive(),
                isRegistered: this.isRegistered,
                supports: {
                    mouse: true,
                    keyboard: true,
                    touch: true,
                    stylus: window.PointerEvent !== undefined,
                    multitouch: true
                }
            };
        }
    };
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateTabletHandler = TabletHandler;
        // Compatibilidade com nome antigo
        window.TabletHandler = TabletHandler;
    }
    
    console.log('📟 Hécate Tablet Handler carregado');
    
})();