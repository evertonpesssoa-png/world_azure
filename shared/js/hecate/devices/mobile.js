// ============================================
// 📱 HÉCATE - MOBILE
// Handlers para smartphones (toque, swipe, long press)
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus (prioridade Hécate, fallback Obscurátil)
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate Mobile: EventBus não encontrado!');
        return;
    }
    
    const MobileHandler = {
        type: 'mobile',
        name: 'Smartphone',
        events: [],
        isRegistered: false,
        touchStartTime: 0,
        touchStartPos: null,
        longPressTimeout: null,
        swipeStart: null,
        
        // ============================================
        // DETECÇÃO DE DISPOSITIVO
        // ============================================
        
        isActive() {
            return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
                   !this.isTablet();
        },
        
        isTablet() {
            return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) && 
                   window.innerWidth >= 768;
        },
        
        // ============================================
        // HANDLERS DE TOQUE
        // ============================================
        
        // Início do toque
        handleTouchStart(e) {
            const touch = e.touches[0];
            this.touchStartTime = Date.now();
            this.touchStartPos = { x: touch.clientX, y: touch.clientY };
            
            Events.emit('interaction:touchstart', {
                device: this.type,
                x: touch.clientX,
                y: touch.clientY,
                touches: e.touches.length,
                timestamp: Date.now()
            });
            
            // Iniciar detecção de long press
            this.longPressTimeout = setTimeout(() => {
                Events.emit('interaction:longpress', {
                    device: this.type,
                    x: this.touchStartPos?.x,
                    y: this.touchStartPos?.y,
                    duration: 500,
                    timestamp: Date.now()
                });
            }, 500);
            
            // Iniciar detecção de swipe
            this.swipeStart = { 
                x: touch.clientX, 
                y: touch.clientY, 
                time: Date.now() 
            };
        },
        
        // Fim do toque
        handleTouchEnd(e) {
            const duration = Date.now() - this.touchStartTime;
            
            // Cancelar long press se não ocorreu
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }
            
            Events.emit('interaction:touchend', {
                device: this.type,
                duration: duration,
                touches: e.touches.length,
                timestamp: Date.now()
            });
            
            // Toque rápido = click
            if (duration < 300) {
                Events.emit('interaction:click', {
                    device: this.type,
                    type: 'tap',
                    duration: duration,
                    timestamp: Date.now()
                });
            }
            
            // Detectar swipe
            this.detectSwipe(e);
            
            // Resetar swipe
            this.swipeStart = null;
        },
        
        // Movimento durante toque
        handleTouchMove(e) {
            const touch = e.touches[0];
            
            // Prevenir scroll em algumas situações (opcional)
            if (e.touches.length >= 2) {
                e.preventDefault();
                Events.emit('interaction:multitouch', {
                    device: this.type,
                    touches: e.touches.length,
                    timestamp: Date.now()
                });
            }
            
            Events.emit('interaction:touchmove', {
                device: this.type,
                x: touch.clientX,
                y: touch.clientY,
                deltaX: this.touchStartPos ? touch.clientX - this.touchStartPos.x : 0,
                deltaY: this.touchStartPos ? touch.clientY - this.touchStartPos.y : 0,
                timestamp: Date.now()
            });
        },
        
        // Detectar swipe
        detectSwipe(e) {
            if (!this.swipeStart) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.swipeStart.x;
            const deltaY = touch.clientY - this.swipeStart.y;
            const deltaTime = Date.now() - this.swipeStart.time;
            
            // Swipe horizontal
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                const direction = deltaX > 0 ? 'right' : 'left';
                Events.emit('interaction:swipe', {
                    device: this.type,
                    direction: direction,
                    deltaX: deltaX,
                    deltaY: deltaY,
                    duration: deltaTime,
                    timestamp: Date.now()
                });
            }
            
            // Swipe vertical (opcional)
            if (Math.abs(deltaY) > 50 && deltaTime < 300) {
                const direction = deltaY > 0 ? 'down' : 'up';
                Events.emit('interaction:swipe', {
                    device: this.type,
                    direction: direction,
                    deltaX: deltaX,
                    deltaY: deltaY,
                    duration: deltaTime,
                    timestamp: Date.now()
                });
            }
        },
        
        // Cancelar toque (quando interrompido)
        handleTouchCancel(e) {
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }
            
            Events.emit('interaction:touchcancel', {
                device: this.type,
                timestamp: Date.now()
            });
        },
        
        // ============================================
        // REGISTRO E LIMPEZA
        // ============================================
        
        register() {
            if (!this.isActive()) return false;
            if (this.isRegistered) return true;
            
            console.log(`📱 Hécate: [${this.name}] Handlers registrados`);
            
            // Bind dos handlers
            this.handleTouchStart = this.handleTouchStart.bind(this);
            this.handleTouchEnd = this.handleTouchEnd.bind(this);
            this.handleTouchMove = this.handleTouchMove.bind(this);
            this.handleTouchCancel = this.handleTouchCancel.bind(this);
            
            // Adicionar listeners
            document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd);
            document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            document.addEventListener('touchcancel', this.handleTouchCancel);
            
            this.isRegistered = true;
            return true;
        },
        
        unregister() {
            if (!this.isRegistered) return;
            
            document.removeEventListener('touchstart', this.handleTouchStart);
            document.removeEventListener('touchend', this.handleTouchEnd);
            document.removeEventListener('touchmove', this.handleTouchMove);
            document.removeEventListener('touchcancel', this.handleTouchCancel);
            
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }
            
            this.isRegistered = false;
            console.log(`📱 Hécate: [${this.name}] Handlers removidos`);
        },
        
        // ============================================
        // CONFIGURAÇÕES
        // ============================================
        
        getConfig() {
            return {
                tapDelay: 300,
                longPressDelay: 500,
                swipeThreshold: 50,
                preventZoom: true,
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
                    mouse: false,
                    keyboard: false,
                    touch: true,
                    stylus: 'ontouchstart' in window,
                    swipe: true,
                    longpress: true,
                    multitouch: true
                }
            };
        }
    };
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateMobileHandler = MobileHandler;
        // Compatibilidade com nome antigo
        window.MobileHandler = MobileHandler;
    }
    
    console.log('📱 Hécate Mobile Handler carregado');
    
})();