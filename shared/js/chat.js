export class ChatSystem {
    constructor(containerId, config, onResponse) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.onResponse = onResponse;

        this.init();
    }

    init() {
        this.messagesContainer = this.container.querySelector('#chatMessages');
        this.input = this.container.querySelector('#chatInput');
        this.sendBtn = this.container.querySelector('#sendChatBtn');
        this.chatHeader = this.container.querySelector('#chatHeader');
        this.chatBody = this.container.querySelector('#chatBody');

        // mensagem inicial
        this.addMessage(
            `✨ Bem-vindo ao meu reino. Sou ${this.config.name}. ${
                this.config.welcomeMessage || 'Como posso ajudar?'
            }`,
            false
        );

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.send());
        }

        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.send();
                }
            });
        }
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');

        messageDiv.className = `message ${
            isUser ? 'user' : 'asura'
        }`;

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

                <div class="message-time">
                    ${time}
                </div>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);

        this.scrollToBottom();

        while (this.messagesContainer.children.length > 50) {
            this.messagesContainer.removeChild(
                this.messagesContainer.firstChild
            );
        }

        return messageDiv;
    }

    send() {
        const message = this.input.value.trim();

        if (!message) return;

        this.addMessage(message, true);

        this.input.value = '';

        const thinkingDiv = this.addMessage(
            '🧠 processando...',
            false
        );

        thinkingDiv.querySelector('.message-content').innerHTML = `
            <em>🧠 processando...</em>
        `;

        setTimeout(() => {
            thinkingDiv.remove();

            const response =
                this.config.getResponse(message);

            this.addMessage(response, false);

            if (this.onResponse) {
                this.onResponse(response);
            }
        }, 800);
    }

    scrollToBottom() {
        if (!this.messagesContainer) return;

        this.messagesContainer.scrollTop =
            this.messagesContainer.scrollHeight;
    }
}