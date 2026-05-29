import { ChatSystem } from './chat.js';

export class EnhancedChatSystem extends ChatSystem {

    constructor(containerId, config, onSpeak) {
        super(containerId, config, onSpeak);

        this.chatLevel = 1; // 0 fechado, 1 normal, 2 fullscreen

        this.setupEnhancements();

        setTimeout(() => {
            this.applyLevel();
        }, 50);
    }

    // =========================
    // SETUP PRINCIPAL
    // =========================
    setupEnhancements() {
        this.setupThreeLevels();
        this.addAttachButton();
    }

    // =========================
    // HEADER CONTROLS (SEGURO)
    // =========================
    setupThreeLevels() {
        const header = this.container?.querySelector('.chat-header');
        if (!header) return;

        // evita duplicar botões
        if (header.querySelector('.chat-header-actions')) return;

        const actions = document.createElement('div');
        actions.className = 'chat-header-actions';

        // BOTÃO FULLSCREEN
        const fsBtn = document.createElement('button');
        fsBtn.className = 'fullscreen-toggle';
        fsBtn.innerHTML = '⛶';
        fsBtn.title = 'Tela inteira';

        fsBtn.onclick = (e) => {
            e.stopPropagation();
            this.nextLevel();
        };

        // BOTÃO TOGGLE
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chat-toggle';
        toggleBtn.innerHTML = '▲';
        toggleBtn.title = 'Minimizar / Expandir';

        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggle();
        };

        actions.appendChild(fsBtn);
        actions.appendChild(toggleBtn);

        header.appendChild(actions);

        // clique no header (sem quebrar botões)
        header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            this.toggle();
        });
    }

    // =========================
    // CONTROLE DE NÍVEIS
    // =========================
    nextLevel() {
        this.chatLevel = (this.chatLevel + 1) % 3;
        this.applyLevel();
    }

    toggle() {
        this.chatLevel = this.chatLevel === 1 ? 0 : 1;
        this.applyLevel();
    }

    applyLevel() {
        this.container.classList.remove('level-0', 'level-1', 'level-2');
        this.container.classList.add(`level-${this.chatLevel}`);

        const toggleBtn = this.container.querySelector('.chat-toggle');
        const fsBtn = this.container.querySelector('.fullscreen-toggle');

        if (toggleBtn) {
            toggleBtn.innerHTML = this.chatLevel === 0 ? '▲' : '▼';
        }

        if (fsBtn) {
            fsBtn.innerHTML = this.chatLevel === 2 ? '✖' : '⛶';
            fsBtn.title = this.chatLevel === 2 ? 'Sair da tela inteira' : 'Tela inteira';
        }

        // fullscreen real (CSS depende disso)
        if (this.chatLevel === 2) {
            this.container.classList.add('fullscreen');
        } else {
            this.container.classList.remove('fullscreen');
        }
    }

    // =========================
    // ANEXOS (SEGURADO)
    // =========================
    addAttachButton() {
        const inputArea = this.container?.querySelector('.chat-input-area');
        if (!inputArea) return;

        // evita duplicar
        if (inputArea.querySelector('.attach-btn')) return;

        const attachBtn = document.createElement('button');
        attachBtn.className = 'attach-btn';
        attachBtn.innerHTML = '📎';
        attachBtn.title = 'Anexar arquivo';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';

        attachBtn.onclick = () => fileInput.click();

        fileInput.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) this.handleFile(file);
            fileInput.value = '';
        };

        inputArea.prepend(fileInput);
        inputArea.prepend(attachBtn);
    }

    // =========================
    // HANDLER DE ARQUIVO
    // =========================
    handleFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const url = e.target.result;

            if (file.type.startsWith('image/')) {
                this.addMessage(
                    `<img src="${url}" class="chat-image">`,
                    true
                );
            } else {
                this.addMessage(
                    `
                    <div class="chat-file">
                        <div>📎</div>
                        <div>${file.name}</div>
                    </div>
                    `,
                    true
                );
            }
        };

        reader.readAsDataURL(file);
    }
}