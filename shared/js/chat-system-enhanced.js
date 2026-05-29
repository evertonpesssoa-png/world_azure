// Chat System Melhorado com 3 Níveis (VERSÃO ESTÁVEL COMPLETA)
export class EnhancedChatSystem {
    constructor(containerId, config, onSpeak) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.onSpeak = onSpeak;

        this.messagesContainer = this.container.querySelector('#chatMessages');
        this.input = this.container.querySelector('#chatInput');
        this.sendBtn = this.container.querySelector('#sendChatBtn');
        this.chatHeader = this.container.querySelector('.chat-header');

        this.chatLevel = 0; // 0=fechado, 1=normal, 2=fullscreen

        this.init();
        this.setupEventListeners();
        this.loadMessages();
    }

    /* =========================
       INIT
    ========================= */
    init() {
        this.addAttachButton();
        this.addFullscreenButton();
        this.setLevel(0);

        // mensagem inicial
        this.addMessage(
            `✨ Bem-vindo ao meu reino. Sou ${this.config.name}. ${this.config.welcomeMessage || ''}`,
            false
        );
    }

    /* =========================
       CONTROLE DE ESTADO
    ========================= */
    setLevel(level) {
        this.chatLevel = level;

        this.container.classList.remove('level-0', 'level-1', 'level-2');
        this.container.classList.add(`level-${level}`);

        const fsBtn = this.container.querySelector('.fullscreen-toggle');

        if (fsBtn) {
            fsBtn.innerHTML = level === 2 ? '✖' : '⛶';
            fsBtn.title = level === 2 ? 'Sair da tela inteira' : 'Tela inteira';
        }
    }

    nextLevel() {
        const next = (this.chatLevel + 1) % 3;
        this.setLevel(next);
    }

    toggleChat() {
        if (this.chatLevel === 0) this.setLevel(1);
        else this.setLevel(0);
    }

    /* =========================
       HEADER / FULLSCREEN
    ========================= */
    addFullscreenButton() {
        if (!this.chatHeader) return;
        if (this.chatHeader.querySelector('.fullscreen-toggle')) return;

        const actions = document.createElement('div');
        actions.className = 'chat-header-actions';

        const fsBtn = document.createElement('button');
        fsBtn.className = 'fullscreen-toggle';
        fsBtn.innerHTML = '⛶';
        fsBtn.title = 'Tela inteira';

        fsBtn.onclick = (e) => {
            e.stopPropagation();
            this.nextLevel();
        };

        actions.appendChild(fsBtn);
        this.chatHeader.appendChild(actions);

        // clique no header abre/fecha
        this.chatHeader.addEventListener('click', (e) => {
            if (e.target.closest('.fullscreen-toggle')) return;
            this.toggleChat();
        });
    }

    /* =========================
       EVENTOS
    ========================= */
    setupEventListeners() {
        this.sendBtn?.addEventListener('click', () => this.send());

        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.send();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatLevel === 2) {
                this.setLevel(1);
            }
        });
    }

    /* =========================
       MENSAGENS
    ========================= */
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'asura'}`;

        const time = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${isUser ? '👤' : this.config.icon}
            </div>
            <div class="message-content">
                <div>${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // limita histórico
        while (this.messagesContainer.children.length > 50) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild);
        }

        return messageDiv;
    }

    /* =========================
       ENVIO
    ========================= */
    send() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, true);
        this.input.value = '';

        const thinking = this.addMessage('🧠 processando...', false);
        thinking.querySelector('.message-content').innerHTML = `<em>🧠 processando...</em>`;

        setTimeout(() => {
            thinking.remove();

            const response = this.config.getResponse(message);
            this.addMessage(response, false);

            if (this.onSpeak) this.onSpeak(response);
        }, 800);
    }

    /* =========================
       STORAGE (MEMÓRIA LOCAL)
    ========================= */
    loadMessages() {
        const key = `chat_${this.config.name}`;
        const stored = localStorage.getItem(key);
        if (!stored) return;

        const messages = JSON.parse(stored);

        messages.forEach(msg => {
            this.addMessage(msg.text, msg.isUser);
        });
    }

    saveMessages() {
        const key = `chat_${this.config.name}`;
        const messages = [];

        this.messagesContainer.querySelectorAll('.message').forEach(el => {
            messages.push({
                text: el.querySelector('.message-content div').innerText,
                isUser: el.classList.contains('user')
            });
        });

        localStorage.setItem(key, JSON.stringify(messages.slice(-50)));
    }

    /* =========================
       UTIL
    ========================= */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /* =========================
       ANEXOS (SIMPLIFICADO E OPCIONAL)
    ========================= */
    addAttachButton() {
        const inputArea = this.container.querySelector('.chat-input-area');
        if (!inputArea || inputArea.querySelector('.attach-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'attach-btn';
        btn.innerHTML = '📎';
        btn.title = 'Anexar arquivo';

        const file = document.createElement('input');
        file.type = 'file';
        file.style.display = 'none';

        btn.onclick = () => file.click();

        file.onchange = (e) => {
            const f = e.target.files[0];
            if (f) {
                this.addMessage(`📎 Arquivo enviado: ${f.name}`, true);
            }
        };

        inputArea.insertBefore(btn, inputArea.firstChild);
        inputArea.appendChild(file);
    }
}