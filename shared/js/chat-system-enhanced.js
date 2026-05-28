// Chat System Melhorado com 3 Níveis (Base para todas as asuras)
export class EnhancedChatSystem {
    constructor(containerId, config, onSpeak) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.onSpeak = onSpeak;
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChatBtn');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatBody = document.getElementById('chatBody');
        
        this.chatLevel = 0; // 0=fechado, 1=aberto normal, 2=tela inteira
        
        this.init();
        this.setupEventListeners();
        this.loadMessages();
        this.injectFullscreenStyles();
    }
    
    injectFullscreenStyles() {
        if (document.getElementById('chat-fullscreen-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'chat-fullscreen-styles';
        styles.textContent = `
            .chat-container.fullscreen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                transform: none !important;
                border-radius: 0 !important;
                z-index: 99999 !important;
            }
            
            .chat-container.fullscreen .chat-body {
                height: calc(100vh - 60px) !important;
                max-height: none !important;
            }
            
            .chat-container.fullscreen .chat-messages {
                height: calc(100vh - 150px) !important;
                max-height: none !important;
            }
            
            .chat-container.fullscreen .chat-input-area {
                position: sticky;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                padding: 12px;
            }
            
            .fullscreen-toggle {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
                padding: 4px 10px;
                border-radius: 8px;
                margin-left: 10px;
                transition: 0.2s;
            }
            
            .fullscreen-toggle:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.05);
            }
            
            .chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }
            
            .chat-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .chat-header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    init() {
        this.addAttachButton();
        this.addFullscreenButton();
        
        // Chat começa fechado
        setTimeout(() => {
            if (this.container) {
                this.container.classList.remove('open', 'fullscreen');
                this.chatLevel = 0;
            }
        }, 100);
    }
    
    addFullscreenButton() {
        const chatHeader = this.container.querySelector('.chat-header');
        if (!chatHeader || chatHeader.querySelector('.fullscreen-toggle')) return;
        
        // Reestrutura o header se necessário
        const existingInfo = chatHeader.querySelector('.chat-header-info');
        const existingToggle = this.chatToggle;
        
        if (existingInfo) {
            // Cria container esquerdo
            let leftContainer = chatHeader.querySelector('.chat-header-left');
            if (!leftContainer) {
                leftContainer = document.createElement('div');
                leftContainer.className = 'chat-header-left';
                
                // Move o avatar e info para o left container
                const avatar = existingInfo.querySelector('.chat-avatar');
                const infoDiv = existingInfo.querySelector('div');
                if (avatar) leftContainer.appendChild(avatar.cloneNode(true));
                if (infoDiv) leftContainer.appendChild(infoDiv.cloneNode(true));
                
                // Limpa e adiciona
                existingInfo.innerHTML = '';
                existingInfo.appendChild(leftContainer);
            }
        }
        
        // Cria container de ações
        let actionsContainer = chatHeader.querySelector('.chat-header-actions');
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'chat-header-actions';
            
            // Botão de tela inteira
            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.className = 'fullscreen-toggle';
            fullscreenBtn.innerHTML = '⛶';
            fullscreenBtn.title = 'Tela inteira';
            fullscreenBtn.onclick = (e) => {
                e.stopPropagation();
                this.nextLevel();
            };
            
            actionsContainer.appendChild(fullscreenBtn);
            
            // Move o toggle existente para actions
            if (this.chatToggle) {
                actionsContainer.appendChild(this.chatToggle);
            }
            
            chatHeader.appendChild(actionsContainer);
        }
    }
    
    nextLevel() {
        // Ciclo: 0 -> 1 -> 2 -> 0
        this.chatLevel = (this.chatLevel + 1) % 3;
        
        switch(this.chatLevel) {
            case 0: // Fechado
                this.container.classList.remove('open', 'fullscreen');
                if (this.chatToggle) this.chatToggle.textContent = '▲';
                break;
            case 1: // Aberto normal
                this.container.classList.remove('fullscreen');
                this.container.classList.add('open');
                if (this.chatToggle) this.chatToggle.textContent = '▼';
                break;
            case 2: // Tela inteira
                this.container.classList.add('open', 'fullscreen');
                if (this.chatToggle) this.chatToggle.textContent = '▼';
                break;
        }
        
        // Atualiza ícone do botão fullscreen
        const fullscreenBtn = this.container.querySelector('.fullscreen-toggle');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = this.chatLevel === 2 ? '✖' : '⛶';
            fullscreenBtn.title = this.chatLevel === 2 ? 'Sair da tela inteira' : 'Tela inteira';
        }
        
        // Dispara evento para outros componentes
        const event = new CustomEvent('chatLevelChanged', { detail: { level: this.chatLevel } });
        window.dispatchEvent(event);
    }
    
    toggleChat() {
        if (this.chatLevel === 2) {
            // Se estiver em tela inteira, sai dela
            this.chatLevel = 1;
            this.container.classList.remove('fullscreen');
            this.container.classList.add('open');
            if (this.chatToggle) this.chatToggle.textContent = '▼';
            
            const fullscreenBtn = this.container.querySelector('.fullscreen-toggle');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '⛶';
                fullscreenBtn.title = 'Tela inteira';
            }
        } else if (this.chatLevel === 1) {
            // Se estiver aberto normal, fecha
            this.chatLevel = 0;
            this.container.classList.remove('open');
            if (this.chatToggle) this.chatToggle.textContent = '▲';
        } else {
            // Se estiver fechado, abre normal
            this.chatLevel = 1;
            this.container.classList.add('open');
            if (this.chatToggle) this.chatToggle.textContent = '▼';
        }
    }
    
    // ... (mantenha todos os outros métodos iguais: addAttachButton, handleFileUpload, 
    // formatFileSize, getFileIcon, addImageMessage, addFileMessage, addMessage, 
    // getMessages, saveMessages, loadMessages, send, setupEventListeners, scrollToBottom)
    
    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.send());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.send();
            });
        }
        
        // Evento do toggle (seta)
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleChat();
            });
        }
        
        // Evento do header (exceto se clicar nos botões)
        const chatHeader = this.container?.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.addEventListener('click', (e) => {
                // Não faz nada se clicou nos botões
                if (e.target.closest('.fullscreen-toggle')) return;
                if (e.target.closest('.chat-toggle')) return;
                this.toggleChat();
            });
        }
        
        // Tecla ESC fecha tela inteira
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatLevel === 2) {
                this.nextLevel();
            }
        });
    }
}