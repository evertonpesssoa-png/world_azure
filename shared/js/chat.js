// Chat System com 3 Níveis (Fechado / Normal / Tela Inteira)
export class EnhancedChatSystem {
    constructor(containerId, config, onSpeak) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.onSpeak = onSpeak;
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChatBtn');
        
        this.level = 0; // 0=fechado, 1=normal, 2=tela inteira
        
        this.init();
        this.setupEventListeners();
        this.loadMessages();
        this.setupHeaderButtons();
    }
    
    init() {
        this.addAttachButton();
        this.container.classList.add('level-0');
        this.container.classList.remove('level-1', 'level-2');
    }
    
    setupHeaderButtons() {
        const header = this.container.querySelector('.chat-header');
        if (!header) return;
        
        // Verifica se já tem actions
        let actionsDiv = header.querySelector('.chat-header-actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'chat-header-actions';
            
            // Botão tela inteira
            const fsBtn = document.createElement('button');
            fsBtn.className = 'fullscreen-toggle';
            fsBtn.innerHTML = '⛶';
            fsBtn.title = 'Tela inteira';
            fsBtn.onclick = (e) => {
                e.stopPropagation();
                this.nextLevel();
            };
            actionsDiv.appendChild(fsBtn);
            
            // Move o toggle existente ou cria novo
            let existingToggle = this.container.querySelector('.chat-toggle');
            if (!existingToggle) {
                existingToggle = document.createElement('button');
                existingToggle.className = 'chat-toggle';
                existingToggle.innerHTML = '▲';
                existingToggle.onclick = (e) => {
                    e.stopPropagation();
                    this.toggle();
                };
            } else {
                existingToggle.onclick = (e) => {
                    e.stopPropagation();
                    this.toggle();
                };
            }
            actionsDiv.appendChild(existingToggle);
            
            // Adiciona ao header
            const headerInfo = header.querySelector('.chat-header-info');
            if (headerInfo) {
                headerInfo.after(actionsDiv);
            } else {
                header.appendChild(actionsDiv);
            }
        }
        
        // Header click toggle (exceto nos botões)
        header.onclick = (e) => {
            if (e.target.closest('.fullscreen-toggle')) return;
            if (e.target.closest('.chat-toggle')) return;
            this.toggle();
        };
    }
    
    nextLevel() {
        this.level = (this.level + 1) % 3;
        this.updateUI();
    }
    
    toggle() {
        if (this.level === 2) {
            this.level = 1; // Sai da tela inteira
        } else if (this.level === 1) {
            this.level = 0; // Fecha
        } else {
            this.level = 1; // Abre normal
        }
        this.updateUI();
    }
    
    updateUI() {
        // Atualiza classes
        this.container.classList.remove('level-0', 'level-1', 'level-2');
        this.container.classList.add(`level-${this.level}`);
        
        // Atualiza botões
        const toggleBtn = this.container.querySelector('.chat-toggle');
        const fsBtn = this.container.querySelector('.fullscreen-toggle');
        
        if (toggleBtn) {
            toggleBtn.innerHTML = this.level === 0 ? '▲' : '▼';
        }
        
        if (fsBtn) {
            fsBtn.innerHTML = this.level === 2 ? '✖' : '⛶';
            fsBtn.title = this.level === 2 ? 'Sair da tela inteira' : 'Tela inteira';
        }
        
        // Evento ESC para sair da tela inteira
        if (this.level === 2) {
            this.escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.level = 1;
                    this.updateUI();
                }
            };
            document.addEventListener('keydown', this.escHandler);
        } else if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
            delete this.escHandler;
        }
    }
    
    addAttachButton() {
        const inputArea = this.container.querySelector('.chat-input-area');
        if (!inputArea || inputArea.querySelector('.attach-btn')) return;
        
        const attachBtn = document.createElement('button');
        attachBtn.className = 'attach-btn';
        attachBtn.innerHTML = '📎';
        attachBtn.title = 'Enviar arquivo (imagem, PDF, DOC, etc)';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '*/*';
        fileInput.style.display = 'none';
        fileInput.multiple = false;
        
        attachBtn.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) this.handleFileUpload(file);
            fileInput.value = '';
        };
        
        const textInput = inputArea.querySelector('input[type="text"]');
        if (textInput) {
            inputArea.insertBefore(attachBtn, textInput);
            inputArea.insertBefore(fileInput, textInput);
        }
    }
    
    handleFileUpload(file) {
        const fileType = file.type;
        const fileName = file.name;
        const fileSize = this.formatFileSize(file.size);
        const fileExtension = fileName.split('.').pop().toUpperCase();
        
        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => this.addImageMessage(ev.target.result, fileName, fileSize);
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (ev) => this.addFileMessage(ev.target.result, fileName, fileSize, fileExtension);
            reader.readAsDataURL(file);
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    getFileIcon(extension) {
        const icons = {
            'PDF': '📄', 'DOC': '📃', 'DOCX': '📃',
            'XLS': '📊', 'XLSX': '📊', 'PPT': '📽️', 'PPTX': '📽️',
            'TXT': '📝', 'ZIP': '🗜️', 'RAR': '🗜️',
            'MP3': '🎵', 'MP4': '🎬', 'JPG': '🖼️', 'PNG': '🖼️',
            'GIF': '🎞️', 'JSON': '🔧', 'XML': '🔧', 'HTML': '🌐'
        };
        return icons[extension] || '📎';
    }
    
    addImageMessage(imageUrl, fileName, fileSize) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <div>🖼️ ${fileName} <span style="font-size:9px; color:#888;">(${fileSize})</span></div>
                <img src="${imageUrl}" class="chat-image" onclick="window.open('${imageUrl}')">
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        const messages = this.getMessages();
        messages.push({ text: `🖼️ ${fileName} (${fileSize})`, image: imageUrl, isUser: true, timestamp: Date.now() });
        this.saveMessages(messages);
    }
    
    addFileMessage(fileData, fileName, fileSize, extension) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const fileIcon = this.getFileIcon(extension);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <div>📎 Arquivo anexado</div>
                <div class="chat-file" onclick="window.open('${fileData}')">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-info">
                        <div class="file-name">${fileName}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                    <div class="file-badge">${extension}</div>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        const messages = this.getMessages();
        messages.push({ text: `📎 ${fileName} (${fileSize})`, fileData: fileData, isUser: true, timestamp: Date.now() });
        this.saveMessages(messages);
    }
    
    addMessage(text, isUser, image = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user' : 'message asura';
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        if (!isUser) {
            messageDiv.innerHTML = `
                <div class="message-avatar">${this.config.icon}</div>
                <div class="message-content">
                    <div>${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-content">
                    <div>${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        const messages = this.getMessages();
        messages.push({ text, image, isUser, timestamp: Date.now() });
        this.saveMessages(messages);
    }
    
    getMessages() {
        const stored = localStorage.getItem(`chat_messages_${this.config.name}`);
        return stored ? JSON.parse(stored) : [];
    }
    
    saveMessages(messages) {
        if (messages.length > 100) messages.shift();
        localStorage.setItem(`chat_messages_${this.config.name}`, JSON.stringify(messages));
    }
    
    loadMessages() {
        const messages = this.getMessages();
        if (messages.length === 0) return;
        
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = msg.isUser ? 'message user' : 'message asura';
            const time = new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            if (!msg.isUser) {
                messageDiv.innerHTML = `
                    <div class="message-avatar">${this.config.icon}</div>
                    <div class="message-content">
                        <div>${msg.text}</div>
                        <div class="message-time">${time}</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-avatar">👤</div>
                    <div class="message-content">
                        <div>${msg.text}</div>
                        <div class="message-time">${time}</div>
                    </div>
                `;
            }
            
            if (msg.image) {
                const img = document.createElement('img');
                img.src = msg.image;
                img.className = 'chat-image';
                img.onclick = () => window.open(msg.image);
                messageDiv.querySelector('.message-content').appendChild(img);
            }
            
            this.messagesContainer.appendChild(messageDiv);
        });
        this.scrollToBottom();
    }
    
    send() {
        const text = this.input.value.trim();
        if (!text) return;
        
        this.addMessage(text, true);
        this.input.value = '';
        
        setTimeout(() => {
            const response = this.config.getResponse(text);
            this.addMessage(response, false);
            if (this.onSpeak) this.onSpeak(response);
        }, 500);
    }
    
    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.send());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.send();
            });
        }
    }
    
    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }
}