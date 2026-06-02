// ============================================
// 🖱️ HÉCATE - CLICK SYSTEM
// Sistema unificado de clique/toque para todos os dispositivos
// ============================================

(function() {
    'use strict';
    
    // Detectar EventBus (prioridade Hécate, fallback Obscurátil)
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    if (!Events) {
        console.error('❌ Hécate ClickSystem: EventBus não encontrado!');
        return;
    }
    
    class ClickSystem {
        constructor() {
            this.clickCount = 0;
            this.lastClickTime = 0;
            this.lastClickPosition = null;
            this.clickTimeout = null;
            this.doubleClickDelay = 300;
            this.longPressDelay = 500;
            this.longPressTimeout = null;
            this.isLongPress = false;
            this.handlers = [];
        }
        
        init() {
            // Escutar eventos de clique unificados
            Events.on('interaction:click', (data) => {
                this.processClick(data);
            });
            
            Events.on('interaction:tap', (data) => {
                this.processClick({ ...data, type: 'tap' });
            });
            
            // Long press detection
            Events.on('interaction:longpress', (data) => {
                this.processLongPress(data);
            });
            
            console.log('🖱️ Hécate ClickSystem inicializado');
        }
        
        processClick(data) {
            const now = Date.now();
            const timeDiff = now - this.lastClickTime;
            
            // Registrar posição do clique
            this.lastClickPosition = { x: data.x, y: data.y };
            
            // Detectar duplo clique
            if (timeDiff < this.doubleClickDelay && this.clickCount > 0) {
                this.clickCount++;
                
                if (this.clickCount === 2) {
                    // Double click
                    Events.emit('interaction:doubleclick', {
                        ...data,
                        clickCount: this.clickCount,
                        timeBetween: timeDiff,
                        position: this.lastClickPosition,
                        timestamp: now
                    });
                    this.resetClickCount();
                }
            } else {
                this.clickCount = 1;
                this.startClickTimeout();
                
                // Single click normal
                Events.emit('interaction:singleclick', {
                    ...data,
                    clickCount: 1,
                    position: this.lastClickPosition,
                    timestamp: now
                });
            }
            
            // Verificar se é a primeira interação do usuário
            const firstInteraction = !localStorage.getItem('wz_first_interaction');
            if (firstInteraction) {
                localStorage.setItem('wz_first_interaction', Date.now().toString());
                Events.emit('user:firstInteraction', {
                    ...data,
                    position: this.lastClickPosition,
                    timestamp: Date.now()
                });
            }
            
            this.lastClickTime = now;
        }
        
        processLongPress(data) {
            this.isLongPress = true;
            
            Events.emit('interaction:longpress', {
                ...data,
                duration: this.longPressDelay,
                position: data.x ? { x: data.x, y: data.y } : this.lastClickPosition,
                timestamp: Date.now()
            });
            
            // Reset após long press
            setTimeout(() => {
                this.isLongPress = false;
            }, 100);
        }
        
        startClickTimeout() {
            if (this.clickTimeout) clearTimeout(this.clickTimeout);
            
            this.clickTimeout = setTimeout(() => {
                this.resetClickCount();
            }, this.doubleClickDelay);
        }
        
        resetClickCount() {
            this.clickCount = 0;
            if (this.clickTimeout) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = null;
            }
        }
        
        // Configurar delays
        setDoubleClickDelay(delay) {
            this.doubleClickDelay = delay;
        }
        
        setLongPressDelay(delay) {
            this.longPressDelay = delay;
        }
        
        // Obter estatísticas
        getStats() {
            return {
                lastClickTime: this.lastClickTime,
                lastClickPosition: this.lastClickPosition,
                doubleClickDelay: this.doubleClickDelay,
                longPressDelay: this.longPressDelay
            };
        }
    }
    
    const clickSystem = new ClickSystem();
    clickSystem.init();
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateClickSystem = clickSystem;
        // Compatibilidade com nome antigo
        window.ClickSystem = clickSystem;
    }
    
    console.log('🖱️ Hécate Click System carregado');
    
})();