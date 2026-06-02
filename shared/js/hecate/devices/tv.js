// ============================================
// 📺 HÉCATE - SMART TV
// Handlers para Smart TVs (LG webOS, Samsung Tizen, Android TV, Apple TV)
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate TV: EventBus não encontrado!');
        return;
    }
    
    const TVHandler = {
        type: 'tv',
        name: 'Smart TV',
        events: [],
        isRegistered: false,
        currentFocus: null,
        
        // ============================================
        // DETECÇÃO DE SMART TV
        // ============================================
        
        isActive() {
            // User Agents de Smart TVs
            const tvPatterns = [
                /SmartTV/i,
                /webOS/i,           // LG
                /Tizen/i,           // Samsung
                /AppleTV/i,         // Apple TV
                /Android TV/i,      // Android TV
                /GoogleTV/i,        // Google TV
                /FireTV/i,          // Amazon Fire TV
                /Roku/i,            // Roku
                /Xbox/i,            // Xbox (navegador)
                /PlayStation/i,     // PlayStation
                /Vidaa/i,           // Hisense/Philips
                /NetCast/i,         // LG antigo
                /SmartCast/i        // Vizio
            ];
            
            const isTV = tvPatterns.some(pattern => pattern.test(navigator.userAgent));
            
            // Detectar por características (tela grande, sem toque)
            const isLargeScreen = window.innerWidth >= 1920;
            const hasNoTouch = !('ontouchstart' in window);
            const isRemoteFriendly = isLargeScreen && hasNoTouch;
            
            return isTV || isRemoteFriendly;
        },
        
        // ============================================
        // HANDLERS DO CONTROLE REMOTO
        // ============================================
        
        // Navegação por setas
        handleArrowKeys(e) {
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right'
            };
            
            if (keyMap[e.key]) {
                e.preventDefault();
                
                Events.emit('interaction:tv:navigate', {
                    device: this.type,
                    direction: keyMap[e.key],
                    timestamp: Date.now()
                });
                
                // Também emitir como evento genérico
                Events.emit('interaction:keyboard', {
                    device: this.type,
                    key: e.key,
                    inputType: 'remote',
                    timestamp: Date.now()
                });
            }
        },
        
        // Botão OK/Select/Enter
        handleSelect(e) {
            const selectKeys = ['Enter', ' ', 'Select'];
            
            if (selectKeys.includes(e.key)) {
                e.preventDefault();
                
                Events.emit('interaction:click', {
                    device: this.type,
                    type: 'remote_select',
                    inputType: 'remote',
                    focusedElement: this.currentFocus,
                    timestamp: Date.now()
                });
            }
        },
        
        // Botão Back/Return
        handleBack(e) {
            if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Back') {
                e.preventDefault();
                
                Events.emit('interaction:tv:back', {
                    device: this.type,
                    timestamp: Date.now()
                });
            }
        },
        
        // Botões de mídia
        handleMediaKeys(e) {
            const mediaKeys = ['Play', 'Pause', 'Stop', 'VolumeUp', 'VolumeDown', 'MediaPlayPause'];
            
            if (mediaKeys.includes(e.key)) {
                e.preventDefault();
                
                Events.emit('interaction:tv:media', {
                    device: this.type,
                    action: e.key,
                    timestamp: Date.now()
                });
            }
        },
        
        // Botões especiais Smart TV
        handleSmartTVKeys(e) {
            const specialKeys = [
                'Info', 'Guide', 'Menu', 'Exit', 'ChannelUp', 'ChannelDown',
                'Red', 'Green', 'Yellow', 'Blue'  // Cores nos controles
            ];
            
            if (specialKeys.includes(e.key)) {
                e.preventDefault();
                
                Events.emit('interaction:tv:special', {
                    device: this.type,
                    key: e.key,
                    timestamp: Date.now()
                });
            }
        },
        
        // ============================================
        // FOCO E NAVEGAÇÃO POR ELEMENTOS
        // ============================================
        
        // Gerenciar foco para navegação por seta
        manageFocus() {
            // Adicionar atributo tabindex a elementos interativos
            const interactiveElements = document.querySelectorAll('.item, button, a, [role="button"]');
            interactiveElements.forEach(el => {
                if (el.tabIndex === -1) return;
                el.setAttribute('tabindex', '0');
                el.style.transition = 'all 0.2s ease';
                
                // Estilo de foco
                el.addEventListener('focus', () => {
                    this.currentFocus = el;
                    el.style.outline = '3px solid #9b30ff';
                    el.style.transform = 'scale(1.02)';
                    
                    Events.emit('interaction:tv:focus', {
                        device: this.type,
                        element: el.tagName,
                        elementId: el.id,
                        timestamp: Date.now()
                    });
                });
                
                el.addEventListener('blur', () => {
                    el.style.outline = 'none';
                    el.style.transform = 'scale(1)';
                });
            });
        },
        
        // ============================================
        // HANDLERS DE GESTO (touchpad do controle)
        // ============================================
        
        handleTouchpad(e) {
            // Alguns controles de TV têm touchpad
            if (e.pointerType === 'touch') {
                Events.emit('interaction:touchmove', {
                    device: this.type,
                    x: e.clientX,
                    y: e.clientY,
                    inputType: 'touchpad',
                    timestamp: Date.now()
                });
            }
        },
        
        // ============================================
        // REGISTRO E LIMPEZA
        // ============================================
        
        register() {
            if (!this.isActive()) return false;
            if (this.isRegistered) return true;
            
            console.log(`📺 Hécate: [${this.name}] Handlers registrados`);
            
            // Bind dos handlers
            this.handleArrowKeys = this.handleArrowKeys.bind(this);
            this.handleSelect = this.handleSelect.bind(this);
            this.handleBack = this.handleBack.bind(this);
            this.handleMediaKeys = this.handleMediaKeys.bind(this);
            this.handleSmartTVKeys = this.handleSmartTVKeys.bind(this);
            this.handleTouchpad = this.handleTouchpad.bind(this);
            
            // Adicionar listeners
            document.addEventListener('keydown', this.handleArrowKeys);
            document.addEventListener('keydown', this.handleSelect);
            document.addEventListener('keydown', this.handleBack);
            document.addEventListener('keydown', this.handleMediaKeys);
            document.addEventListener('keydown', this.handleSmartTVKeys);
            document.addEventListener('pointermove', this.handleTouchpad);
            
            // Gerenciar foco
            setTimeout(() => this.manageFocus(), 100);
            
            // Observar novos elementos adicionados ao DOM
            const observer = new MutationObserver(() => this.manageFocus());
            observer.observe(document.body, { childList: true, subtree: true });
            
            this.isRegistered = true;
            return true;
        },
        
        unregister() {
            if (!this.isRegistered) return;
            
            document.removeEventListener('keydown', this.handleArrowKeys);
            document.removeEventListener('keydown', this.handleSelect);
            document.removeEventListener('keydown', this.handleBack);
            document.removeEventListener('keydown', this.handleMediaKeys);
            document.removeEventListener('keydown', this.handleSmartTVKeys);
            document.removeEventListener('pointermove', this.handleTouchpad);
            
            this.isRegistered = false;
            console.log(`📺 Hécate: [${this.name}] Handlers removidos`);
        },
        
        // ============================================
        // CONFIGURAÇÕES
        // ============================================
        
        getConfig() {
            return {
                deviceType: this.type,
                supportsRemote: true,
                supportsFocus: true,
                supportsMediaKeys: true,
                focusOutline: '3px solid #9b30ff'
            };
        },
        
        getInfo() {
            return {
                type: this.type,
                name: this.name,
                isActive: this.isActive(),
                isRegistered: this.isRegistered,
                userAgent: navigator.userAgent,
                supports: {
                    remote: true,
                    focus: true,
                    touchpad: window.PointerEvent !== undefined,
                    mediaKeys: true,
                    specialKeys: true
                }
            };
        }
    };
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateTVHandler = TVHandler;
    }
    
    console.log('📺 Hécate Smart TV Handler carregado');
    
})();