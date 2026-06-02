// ============================================
// 🗝️ HÉCATE - FEEDBACK SYSTEM
// Sistema de notificações e mensagens visuais
// ============================================

(function() {
    'use strict';
    
    class FeedbackSystem {
        constructor() {
            this.container = null;
            this.messageQueue = [];
            this.isShowing = false;
            this.defaultDuration = 3000;
            this.maxMessages = 5;  // Máximo de mensagens simultâneas
            this.name = 'Hécate';
        }
        
        // ============================================
        // INICIALIZAÇÃO
        // ============================================
        
        init() {
            if (this.container) return;
            
            // Criar container de mensagens
            this.container = document.createElement('div');
            this.container.id = 'hecate-feedback';
            this.container.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                font-family: 'Courier New', monospace;
            `;
            document.body.appendChild(this.container);
            
            this.addStyles();
            
            console.log('🗝️ Hécate Feedback System inicializado');
        }
        
        // ============================================
        // GERENCIAMENTO DE FILA
        // ============================================
        
        showMessage(text, type = 'info', duration = null) {
            const msgDuration = duration || this.defaultDuration;
            
            const message = {
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
                text,
                type,
                duration: msgDuration,
                timestamp: Date.now()
            };
            
            this.messageQueue.push(message);
            
            // Limitar tamanho da fila
            while (this.messageQueue.length > this.maxMessages * 2) {
                this.messageQueue.shift();
            }
            
            this.processQueue();
        }
        
        processQueue() {
            if (this.isShowing || this.messageQueue.length === 0) return;
            
            // Verificar quantas mensagens estão visíveis
            const visibleMessages = this.container?.children.length || 0;
            if (visibleMessages >= this.maxMessages) return;
            
            this.isShowing = true;
            const message = this.messageQueue.shift();
            this.displayMessage(message);
        }
        
        // ============================================
        // EXIBIÇÃO DE MENSAGENS
        // ============================================
        
        displayMessage(message) {
            const colors = {
                success: '#00ff88',
                error: '#ff3300',
                warning: '#ffaa00',
                info: '#9b30ff'
            };
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: '🗝️'
            };
            
            const msgElement = document.createElement('div');
            msgElement.id = `hecate-msg-${message.id}`;
            msgElement.style.cssText = `
                background: rgba(0,0,0,0.95);
                backdrop-filter: blur(10px);
                border: 1px solid ${colors[message.type] || colors.info};
                border-radius: 50px;
                padding: 12px 24px;
                color: ${colors[message.type] || colors.info};
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.5px;
                animation: hecateSlideIn 0.3s ease;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                pointer-events: none;
                white-space: nowrap;
                max-width: 90vw;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
            
            msgElement.innerHTML = `${icons[message.type] || '🗝️'} ${message.text}`;
            
            this.container.appendChild(msgElement);
            
            // Agendar remoção
            setTimeout(() => {
                msgElement.style.animation = 'hecateFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (msgElement.parentNode) msgElement.remove();
                    this.isShowing = false;
                    this.processQueue();
                }, 300);
            }, message.duration);
        }
        
        // ============================================
        // MÉTODOS PÚBLICOS
        // ============================================
        
        success(text, duration = 2000) {
            this.showMessage(text, 'success', duration);
        }
        
        error(text, duration = 4000) {
            this.showMessage(text, 'error', duration);
        }
        
        warning(text, duration = 3000) {
            this.showMessage(text, 'warning', duration);
        }
        
        info(text, duration = 2500) {
            this.showMessage(text, 'info', duration);
        }
        
        // Limpar todas as mensagens
        clear() {
            if (this.container) {
                this.container.innerHTML = '';
            }
            this.messageQueue = [];
            this.isShowing = false;
        }
        
        // ============================================
        // ESTILOS
        // ============================================
        
        addStyles() {
            if (document.getElementById('hecate-feedback-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'hecate-feedback-styles';
            style.textContent = `
                @keyframes hecateSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) translateX(-50%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) translateX(-50%);
                    }
                }
                
                @keyframes hecateFadeOut {
                    to {
                        opacity: 0;
                        transform: translateY(-10px) translateX(-50%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // ============================================
        // UTILITÁRIOS
        // ============================================
        
        getQueueLength() {
            return this.messageQueue.length;
        }
        
        setMaxMessages(max) {
            this.maxMessages = max;
        }
        
        setDefaultDuration(ms) {
            this.defaultDuration = ms;
        }
    }
    
    // Singleton
    const feedback = new FeedbackSystem();
    
    // Exportar
    if (typeof window !== 'undefined') {
        window.HecateFeedback = feedback;
        // Compatibilidade com nome antigo
        window.ObscuratilFeedback = feedback;
    }
    
    console.log('🗝️ Hécate Feedback System carregado');
    
})();