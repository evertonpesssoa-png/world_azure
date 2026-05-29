import { ChatSystem } from './chat.js';

export class EnhancedChatSystem extends ChatSystem {

    constructor(containerId, config, onSpeak) {
        super(containerId, config, onSpeak);

        this.chatLevel = 0;

        this.addAttachButton();
        this.setupThreeLevels();

        this.ensureBaseState();
    }

    ensureBaseState() {
        setTimeout(() => {
            this.container.classList.remove('level-0','level-1','level-2');
            this.container.classList.add('level-0');
        }, 50);
    }

    setupThreeLevels() {
        const header = this.container.querySelector('.chat-header');
        if (!header) return;

        // evita duplicar
        if (header.querySelector('.chat-header-actions')) return;

        const actions = document.createElement('div');
        actions.className = 'chat-header-actions';

        // fullscreen
        const fsBtn = document.createElement('button');
        fsBtn.className = 'fullscreen-toggle';
        fsBtn.innerHTML = '⛶';

        fsBtn.onclick = (e) => {
            e.stopPropagation();
            this.nextLevel();
        };

        // toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chat-toggle';
        toggleBtn.innerHTML = '▲';

        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggle();
        };

        actions.appendChild(fsBtn);
        actions.appendChild(toggleBtn);
        header.appendChild(actions);

        header.onclick = (e) => {
            if (e.target.closest('button')) return;
            this.toggle();
        };
    }

    nextLevel() {
        this.chatLevel = (this.chatLevel + 1) % 3;
        this.updateUI();
    }

    toggle() {
        this.chatLevel = this.chatLevel === 0 ? 1 : 0;
        this.updateUI();
    }

    updateUI() {
        this.container.classList.remove('level-0','level-1','level-2');
        this.container.classList.add(`level-${this.chatLevel}`);

        const toggleBtn = this.container.querySelector('.chat-toggle');
        const fsBtn = this.container.querySelector('.fullscreen-toggle');

        if (toggleBtn) {
            toggleBtn.innerHTML = this.chatLevel === 0 ? '▲' : '▼';
        }

        if (fsBtn) {
            fsBtn.innerHTML = this.chatLevel === 2 ? '✖' : '⛶';
        }
    }

    // ===== FILE ATTACH =====
    addAttachButton() {
        const inputArea = this.container.querySelector('.chat-input-area');
        if (!inputArea || inputArea.querySelector('.attach-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'attach-btn';
        btn.innerHTML = '📎';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';

        btn.onclick = () => fileInput.click();

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) this.handleFile(file);
        };

        inputArea.prepend(fileInput);
        inputArea.prepend(btn);
    }

    handleFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const url = e.target.result;

            const content = file.type.startsWith('image/')
                ? `<img src="${url}" class="chat-image">`
                : `📎 ${file.name}`;

            this.addMessage(content, true);
        };

        reader.readAsDataURL(file);
    }
}