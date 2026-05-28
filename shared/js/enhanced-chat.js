import { ChatSystem } from './chat.js';

export class EnhancedChatSystem extends ChatSystem {

    constructor(containerId, config, onSpeak) {
        super(containerId, config, onSpeak);

        this.chatLevel = 0;

        this.addAttachButton();
        this.setupThreeLevels();

        setTimeout(() => {
            this.container.classList.add('level-0');
        }, 100);
    }

    setupThreeLevels() {

        const header = this.container.querySelector('.chat-header');

        const actions = document.createElement('div');
        actions.className = 'chat-header-actions';

        const fsBtn = document.createElement('button');
        fsBtn.className = 'fullscreen-toggle';
        fsBtn.innerHTML = '⛶';

        fsBtn.onclick = (e) => {
            e.stopPropagation();
            this.nextLevel();
        };

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

        header.onclick = () => {
            this.toggle();
        };
    }

    nextLevel() {

        this.chatLevel++;

        if (this.chatLevel > 2) {
            this.chatLevel = 0;
        }

        this.updateUI();
    }

    toggle() {

        if (this.chatLevel === 0) {
            this.chatLevel = 1;
        } else {
            this.chatLevel = 0;
        }

        this.updateUI();
    }

    updateUI() {

        this.container.classList.remove(
            'level-0',
            'level-1',
            'level-2'
        );

        this.container.classList.add(
            `level-${this.chatLevel}`
        );
    }

    addAttachButton() {

        const inputArea =
            this.container.querySelector('.chat-input-area');

        if (!inputArea) return;

        const attachBtn = document.createElement('button');

        attachBtn.className = 'attach-btn';
        attachBtn.innerHTML = '📎';

        const fileInput = document.createElement('input');

        fileInput.type = 'file';
        fileInput.style.display = 'none';

        attachBtn.onclick = () => {
            fileInput.click();
        };

        fileInput.onchange = (e) => {

            const file = e.target.files[0];

            if (!file) return;

            this.handleFile(file);
        };

        inputArea.prepend(fileInput);
        inputArea.prepend(attachBtn);
    }

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