// ============================================
// 🖥️ HÉCATE - DESKTOP
// Handlers para computador (mouse, teclado)
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus (prioridade Hécate, fallback Obscurátil)
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate Desktop: EventBus não encontrado!');
        return;
    }
    
    const DesktopHandler = {
        type: 'desktop',
        name: 'Computador',
        events: [],
        isRegistered: false,
        
        // ============================================
        // DETECÇÃO DE DISPOSITIVO
        // ============================================
        
        isActive() {
            return !this.isMobile() && !this.isTablet();
        },
        
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        isTablet() {
            return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) && 
                   (window.innerWidth >= 768 && window.innerWidth <= 1024);
        },
        
        // ============================================
        // HANDLERS DE EVENTOS
        // ============================================
        
        // Clique do mouse
        handleClick(e) {
            Events.emit('interaction:click', {
                device: this.type,
                x: e.clientX,
                y: e.clientY,
                button: e.button,
                target: e.target.tagName,
                timestamp: Date.now()
            });
            
            // Double click detection (pode ser refinado depois)
            if (e.detail === 2) {
                Events.emit('interaction:doubleclick', {
                    device: this.type,
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }
        },
        
        // Movimento do mouse (com throttle)
        handleMouseMove(e) {
            if (this.mouseMoveTimeout) clearTimeout(this.mouseMoveTimeout);
            
            this.mouseMoveTimeout = setTimeout(() => {
                Events.emit('interaction:mousemove', {
                    device: this.type,
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }, 100);
        },
        
        // Teclado (com proteção contra atalhos)
        handleKeyDown(e) {
            // Atalhos suspeitos (devtools)
            const suspiciousKeys = ['F12', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'];
            const isSuspicious = suspiciousKeys.includes(e.key);
            
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            const isDevShortcut = (e.ctrlKey || e.metaKey) && 
                                  (e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                                  ((e.ctrlKey || e.metaKey) && e.key === 'u');
            
            if (isSuspicious || isDevShortcut) {
                e.preventDefault();
                Events.emit('security:suspicious', {
                    type: 'devtools_shortcut',
                    key: e.key,
                    ctrl: e.ctrlKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
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
        
        // Scroll
        handleScroll() {
            Events.emit('interaction:scroll', {
                device: this.type,
                scrollY: window.scrollY,
                scrollX: window.scrollX,
                timestamp: Date.now()
            });
        },
        
        // Context menu (right-click)
        handleContextMenu(e) {
            e.preventDefault();
            Events.emit('interaction:contextmenu', {
                device: this.type,
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            return false;
        },
        
        // ============================================
        // REGISTRO E LIMPEZA
        // ============================================
        
        register() {
            if (!this.isActive()) return false;
            if (this.isRegistered) return true;
            
            console.log(`🖥️ Hécate: [${this.name}] Handlers registrados`);
            
            // Bind dos handlers
            this.handleClick = this.handleClick.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            this.handleContextMenu = this.handleContextMenu.bind(this);
            
            // Adicionar listeners
            document.addEventListener('click', this.handleClick);
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('keydown', this.handleKeyDown);
            window.addEventListener('scroll', this.handleScroll);
            document.addEventListener('contextmenu', this.handleContextMenu);
            
            this.isRegistered = true;
            return true;
        },
        
        unregister() {
            if (!this.isRegistered) return;
            
            document.removeEventListener('click', this.handleClick);
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('keydown', this.handleKeyDown);
            window.removeEventListener('scroll', this.handleScroll);
            document.removeEventListener('contextmenu', this.handleContextMenu);
            
            if (this.mouseMoveTimeout) {
                clearTimeout(this.mouseMoveTimeout);
            }
            
            this.isRegistered = false;
            console.log(`🖥️ Hécate: [${this.name}] Handlers removidos`);
        },
        
        // ============================================
        // CONFIGURAÇÕES
        // ============================================
        
        getConfig() {
            return {
                doubleClickDelay: 300,
                hoverDelay: 100,
                scrollThreshold: 50,
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
                    touch: false,
                    stylus: false
                }
            };
        }
    };
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateDesktopHandler = DesktopHandler;
        // Compatibilidade com nome antigo
        window.DesktopHandler = DesktopHandler;
    }
    
    console.log('🖥️ Hécate Desktop Handler carregado');
    
})();