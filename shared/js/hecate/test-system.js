// ============================================
// 🗝️ HÉCATE - RITUAL DE ACESSO (VERSÃO CINEMATOGRÁFICA V2)
// ============================================

(function() {
    'use strict';
    
    // 🔥 BANCO DE PERGUNTAS (INTOCÁVEL) 🔥
    const QUESTION_BANK = {
        senha: {
            pergunta: "O GRIMÓRIO ESTÁ TRANCADO",
            dica: "nome da primeira Asura",
            validar: (r) => r.toLowerCase().trim() === "astreia"
        },
        sabedoria: {
            perguntas: [
                { texto: "O que significa WZ no nome do projeto?", dica: "World _ _ _ _ _", validar: (r) => r.toLowerCase().includes("azure") || r.toLowerCase().includes("azul") },
                { texto: "Quantos Asuras existem no Grimório?", dica: "Conte os cards giratórios", validar: (r) => r === "9" || r === "nove" },
                { texto: "Qual Asura controla as sombras e o vazio?", dica: "Começa com 'U'", validar: (r) => r.toLowerCase().includes("umbra") },
                { texto: "Qual Asura é conhecida como 'A Maga das Invenções'?", dica: "Começa com 'D'", validar: (r) => r.toLowerCase().includes("daedala") },
                { texto: "Qual Asura representa a Justiça e as constelações?", dica: "Começa com 'A'", validar: (r) => r.toLowerCase().includes("astreia") },
                { texto: "Qual Asura representa a Vitória?", dica: "Começa com 'V'", validar: (r) => r.toLowerCase().includes("victoria") },
                { texto: "Qual Asura protege o lar e a sacralidade?", dica: "Começa com 'H'", validar: (r) => r.toLowerCase().includes("hestia") }
            ],
            getRandomQuestions: function() {
                const shuffled = [...this.perguntas];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled.slice(0, 3);
            }
        },
        virtude: {
            perguntas: [
                { texto: "O QUE FARIA COM O PODER DA HÉCATE?", opcoes: ["Proteger os fracos", "Fazer justiça", "Compartilhar o poder"], pontos: [10, 9, 7] },
                { texto: "VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?", opcoes: ["Compaixão", "Justiça", "Sabedoria"], pontos: [10, 9, 8] },
                { texto: "ACEITA A RESPONSABILIDADE DE PROTEGER?", opcoes: ["Sim, aceito", "Sim, com honra", "Aceito"], pontos: [10, 10, 10] }
            ],
            getRandomQuestions: function() {
                const shuffled = [...this.perguntas];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled.slice(0, 3);
            }
        }
    };
    
    const MIN_VIRTUE_SCORE = 20;
    let testActive = false;
    let currentLevel = 1;
    let currentQuestions = [];
    let currentIndex = 0;
    let virtueScore = 0;
    let onCompleteCallback = null;
    let overlay = null;
    let isVoiceEnabled = false;

    // 🔥 FUNÇÃO DE VOZ 🔥
    function speakText(text) {
        if (!isVoiceEnabled) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.85;
            utterance.pitch = 0.8;
            utterance.volume = 0.6;
            window.speechSynthesis.speak(utterance);
        }
    }

    // 🔥 FUNÇÃO PARA ADICIONAR TEXTO NO CHAT 🔥
    function addMessageToChat(text, isUser = false, type = 'normal') {
        const chatMsg = document.getElementById('hecateChatMessages');
        if (!chatMsg) return;

        const msgDiv = document.createElement('div');
        
        let color = '#a78bfa';
        let fontSize = '16px';
        let align = 'center';
        let letterSpacing = '2px';
        let opacity = '1';
        let marginBottom = '10px';
        let fontStyle = 'normal';
        let prefix = '';
        
        if (type === 'question') {
            color = '#c4b5fd';
            fontSize = '24px';
            letterSpacing = '4px';
            marginBottom = '20px';
            fontStyle = 'italic';
        } else if (type === 'hint') {
            color = 'rgba(167,139,250,0.4)';
            fontSize = '13px';
            letterSpacing = '3px';
            marginBottom = '15px';
            fontStyle = 'normal';
        } else if (isUser) {
            color = 'rgba(167,139,250,0.6)';
            fontSize = '14px';
            align = 'center';
            letterSpacing = '3px';
            opacity = '0.7';
            marginBottom = '8px';
            prefix = '✦ ';
        } else if (type === 'system') {
            color = 'rgba(255,255,255,0.15)';
            fontSize = '11px';
            letterSpacing = '6px';
            marginBottom = '5px';
        }
        
        msgDiv.style.cssText = `
            font-family: 'Georgia', serif;
            font-size: ${fontSize};
            color: ${color};
            text-shadow: 
                0 2px 3px #000,
                0 0 8px #000,
                0 0 18px rgba(0,0,0,0.9);
            background: transparent;
            text-align: ${align};
            width: 100%;
            margin-bottom: ${marginBottom};
            padding: 2px 0;
            animation: aparecerPalavra 1.2s ease-out;
            letter-spacing: ${letterSpacing};
            opacity: ${opacity};
            font-style: ${fontStyle};
            transition: all 0.5s ease;
        `;
        msgDiv.textContent = prefix + text;
        chatMsg.appendChild(msgDiv);
        chatMsg.scrollTop = chatMsg.scrollHeight;
    }

    // 🔥 MENSAGEM DE STATUS (MINIMALISTA) 🔥
    function showMessage(text, color, duration = 1500) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            border: 1px solid ${color};
            color: ${color};
            padding: 6px 20px;
            border-radius: 20px;
            z-index: 900001;
            font-family: 'Georgia', serif;
            font-size: 13px;
            letter-spacing: 6px;
            box-shadow: 0 0 40px rgba(155, 48, 255, 0.05);
            text-shadow: 0 2px 8px rgba(0,0,0,0.95);
            backdrop-filter: blur(8px);
            opacity: 0.8;
        `;
        document.body.appendChild(msg);
        setTimeout(() => {
            msg.style.transition = 'opacity 1s ease';
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 1000);
        }, duration);
    }
    
    function showTestInterface(callback) {
        if (testActive) return;
        testActive = true;
        onCompleteCallback = callback;
        
        overlay = document.createElement('div');
        overlay.id = 'hecate-test-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100dvh;
            z-index: 900000;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Georgia', serif;
            overflow: hidden;
        `;

        overlay.innerHTML = `
            <!-- CAMADA 1: FUNDO -->
            <div style="position: absolute; inset: 0; z-index: 0; background: #000000;"></div>

            <!-- CAMADA 2: HÉCATE (100% OPACA - MOVIMENTO SUTIL) -->
            <div id="hecate-entity" style="
                position: absolute;
                top: 50vh;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                width: 100vw;
                height: 100vh;
                background-image: url('/world_azure/images/hecate1_hq.png');
                background-repeat: no-repeat;
                background-position: center bottom;
                background-size: contain;
                z-index: 1;
                pointer-events: none;
                animation: flutuarEntidade 10s ease-in-out infinite;
                filter: contrast(1.05) brightness(1.02);
            "></div>

            <!-- CAMADA 3: NÉVOA DE LEITURA (RADIAL SUAVE) -->
            <div id="hecate-dialog-atmosphere" style="
                position: absolute;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                background: radial-gradient(
                    ellipse 70% 25% at 50% 88%,
                    rgba(0,0,0,0.92) 0%,
                    rgba(0,0,0,0.65) 30%,
                    rgba(0,0,0,0.25) 55%,
                    transparent 78%
                );
            "></div>

            <!-- CAMADA 4: DIÁLOGO -->
            <div id="hecate-chat-container" style="
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 3;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                padding: 20px 20px 35px 20px;
                pointer-events: auto;
                background: transparent;
            ">
                <!-- Área das Mensagens -->
                <div id="hecateChatMessages" style="
                    width: 100%;
                    max-height: 35vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 5px;
                    padding-right: 5px;
                    scroll-behavior: smooth;
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 85%, transparent);
                ">
                    <!-- Mensagem Inicial -->
                    <div style="
                        font-size: 24px;
                        color: #c4b5fd;
                        text-shadow: 
                            0 2px 3px #000,
                            0 0 8px #000,
                            0 0 18px rgba(0,0,0,0.9);
                        background: transparent;
                        text-align: center;
                        align-self: center;
                        animation: aparecerPalavra 2s ease-out;
                        letter-spacing: 4px;
                        font-style: italic;
                        margin-bottom: 15px;
                    ">
                        O GRIMÓRIO ESTÁ TRANCADO
                    </div>
                    <div style="
                        font-size: 13px;
                        color: rgba(167,139,250,0.3);
                        text-shadow: 0 2px 3px #000, 0 0 8px #000;
                        text-align: center;
                        letter-spacing: 3px;
                        animation: aparecerPalavra 2.5s ease-out;
                        margin-bottom: 5px;
                    ">
                        nome da primeira Asura
                    </div>
                </div>

                <!-- Input (linha mágica) -->
                <div id="hecateTestContent" style="
                    pointer-events: auto; 
                    width: 100%; 
                    max-width: 300px; 
                    margin: 5px auto 0 auto;
                    position: relative;
                ">
                    <input type="password" id="hecateInput" placeholder="—" autocomplete="off" style="
                        width: 100%;
                        padding: 8px 0;
                        background: transparent;
                        border: none;
                        color: #f0eaff;
                        text-align: center;
                        font-size: 20px;
                        outline: none;
                        font-family: 'Georgia', serif;
                        letter-spacing: 6px;
                        text-shadow: 
                            0 2px 3px #000,
                            0 0 8px #000,
                            0 0 18px rgba(0,0,0,0.9);
                        transition: all 0.5s ease;
                    ">
                    <div id="magic-line" style="
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.15), transparent);
                        transition: all 0.8s ease;
                    "></div>
                    <button id="hecateBtn" style="display: none;"></button>
                </div>
            </div>

            <!-- BOTÃO DE VOZ (QUASE INVISÍVEL) -->
            <div id="jarvis-toggle" style="
                position: fixed;
                bottom: 25px;
                right: 25px;
                z-index: 900001;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(20, 10, 40, 0.15);
                backdrop-filter: blur(2px);
                border: 1px solid rgba(167,139,250,0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.8s ease;
                pointer-events: auto;
                opacity: 0.15;
            ">
                <span id="jarvis-icon" style="
                    font-size: 14px; 
                    color: rgba(167,139,250,0.3);
                    transition: all 0.8s ease;
                ">◇</span>
            </div>

            <style>
                @keyframes flutuarEntidade {
                    0%, 100% { transform: translate(-50%, -50%) scale(0.8); }
                    50% { transform: translate(-50%, -52%) scale(0.81); }
                }
                @keyframes aparecerPalavra {
                    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes magicPulse {
                    0%, 100% { 
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.15), transparent);
                        height: 1px;
                    }
                    50% { 
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), rgba(155,48,255,0.2), transparent);
                        height: 2px;
                        box-shadow: 0 0 30px rgba(167,139,250,0.05);
                    }
                }
                #hecateChatMessages::-webkit-scrollbar {
                    width: 0px;
                }
                #jarvis-toggle:hover {
                    opacity: 0.6 !important;
                    border-color: rgba(167,139,250,0.2);
                    transform: scale(1.05);
                }
                #jarvis-toggle.active {
                    opacity: 0.8 !important;
                    border-color: rgba(0, 255, 136, 0.2);
                }
                #jarvis-toggle.active #jarvis-icon {
                    color: rgba(0, 255, 136, 0.6);
                }
                #hecateInput:focus + #magic-line {
                    animation: magicPulse 3s ease-in-out infinite;
                }
                #hecateInput:focus {
                    letter-spacing: 8px;
                }
                .virtue-opt {
                    display: block;
                    width: 100%;
                    margin: 5px 0;
                    padding: 8px 12px;
                    background: rgba(255,215,0,0.02);
                    border: 1px solid rgba(255,215,0,0.06);
                    border-radius: 10px;
                    color: rgba(255,215,0,0.6);
                    cursor: pointer;
                    font-size: 13px;
                    font-family: 'Georgia', serif;
                    transition: all 0.6s ease;
                    text-shadow: 0 2px 3px #000, 0 0 8px #000;
                    letter-spacing: 2px;
                    text-align: center;
                }
                .virtue-opt:hover {
                    background: rgba(255,215,0,0.04);
                    border-color: rgba(255,215,0,0.15);
                    transform: scale(1.01);
                    color: rgba(255,215,0,0.8);
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
        
        // 🔥 BOTÃO DE VOZ
        const toggleBtn = document.getElementById('jarvis-toggle');
        toggleBtn.addEventListener('click', () => {
            isVoiceEnabled = !isVoiceEnabled;
            toggleBtn.classList.toggle('active');
            document.getElementById('jarvis-icon').textContent = isVoiceEnabled ? '◈' : '◇';
            if (isVoiceEnabled) {
                speakText("Estou ouvindo.");
                setTimeout(() => {
                    toggleBtn.style.opacity = '0.8';
                }, 100);
            } else {
                window.speechSynthesis.cancel();
                setTimeout(() => {
                    toggleBtn.style.opacity = '0.15';
                }, 100);
            }
        });

        // Input focus
        setTimeout(() => {
            const input = document.getElementById('hecateInput');
            if (input) input.focus();
        }, 800);

        // Configurar eventos
        setupInputHandler();
    }
    
    function setupInputHandler() {
        const btn = document.getElementById('hecateBtn');
        const input = document.getElementById('hecateInput');
        if (!btn || !input) return;
        
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const handleSubmit = () => {
            if (currentLevel === 1) {
                if (QUESTION_BANK.senha.validar(input.value)) {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Aprovado.");
                    showMessage("✦ APROVADO ✦", "#a78bfa");
                    input.value = '';
                    setTimeout(() => startLevel(2), 600);
                } else {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Reprovado.");
                    failTest();
                }
            } else if (currentLevel === 2) {
                const q = currentQuestions[currentIndex];
                if (q.validar(input.value)) {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Sabedoria comprovada.");
                    currentIndex++;
                    input.value = '';
                    if (currentIndex >= currentQuestions.length) {
                        showMessage("✦ SABEDORIA ✦", "#00ffcc");
                        setTimeout(() => startLevel(3), 600);
                    } else {
                        showWisdomQuestion();
                    }
                } else {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Resposta incorreta.");
                    failTest();
                }
            }
        };
        
        newBtn.onclick = handleSubmit;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleSubmit(); };
    }
    
    function startLevel(level) {
        currentLevel = level;
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        if (level === 1) {
            // Já está configurado
            const input = document.getElementById('hecateInput');
            if (input) {
                input.type = 'password';
                input.placeholder = '—';
                input.value = '';
                setTimeout(() => input.focus(), 300);
            }
        } else if (level === 2) {
            currentQuestions = QUESTION_BANK.sabedoria.getRandomQuestions();
            currentIndex = 0;
            showWisdomQuestion();
        } else if (level === 3) {
            currentQuestions = QUESTION_BANK.virtude.getRandomQuestions();
            currentIndex = 0;
            virtueScore = 0;
            showVirtueQuestion();
        }
    }
    
    function showWisdomQuestion() {
        const q = currentQuestions[currentIndex];
        const chatMsg = document.getElementById('hecateChatMessages');
        if (!chatMsg) return;
        
        // Limpa mensagens anteriores (exceto as primeiras)
        const messages = chatMsg.querySelectorAll('.hecate-message, .user-message');
        messages.forEach(msg => {
            if (msg.style.animation !== 'aparecerPalavra 2s ease-out') {
                // Mantém apenas a mensagem inicial
                if (!msg.textContent.includes('GRIMÓRIO ESTÁ TRANCADO')) {
                    msg.remove();
                }
            }
        });

        addMessageToChat(q.texto, false, 'question');
        addMessageToChat("💡 " + q.dica, false, 'hint');
        if (isVoiceEnabled) {
            speakText(q.texto + ". " + q.dica);
        }
        
        const content = document.getElementById('hecateTestContent');
        if (content) {
            const input = document.getElementById('hecateInput');
            if (input) {
                input.type = 'text';
                input.placeholder = '—';
                input.value = '';
                setTimeout(() => input.focus(), 300);
            }
        }
    }
    
    function showVirtueQuestion() {
        const q = currentQuestions[currentIndex];
        const chatMsg = document.getElementById('hecateChatMessages');
        if (!chatMsg) return;
        
        // Limpa mensagens anteriores (exceto as primeiras)
        const messages = chatMsg.querySelectorAll('.hecate-message, .user-message');
        messages.forEach(msg => {
            if (msg.style.animation !== 'aparecerPalavra 2s ease-out') {
                if (!msg.textContent.includes('GRIMÓRIO ESTÁ TRANCADO')) {
                    msg.remove();
                }
            }
        });

        addMessageToChat(q.texto, false, 'question');
        if (isVoiceEnabled) {
            speakText(q.texto);
        }
        
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        let optionsHtml = '';
        q.opcoes.forEach((op, idx) => {
            optionsHtml += `<button class="virtue-opt" data-pontos="${q.pontos[idx]}">${op}</button>`;
        });
        
        content.innerHTML = `
            <div id="virtueOptions" style="width:100%;">${optionsHtml}</div>
            <div style="
                margin-top: 12px; 
                color: rgba(255,215,0,0.08); 
                font-size: 10px; 
                text-align: center;
                letter-spacing: 6px;
                text-shadow: 0 2px 3px #000;
            ">✦ ${virtueScore} ✦</div>
        `;
        
        const botoes = document.querySelectorAll('.virtue-opt');
        botoes.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.onclick = () => {
                const pontos = parseInt(newBtn.dataset.pontos);
                virtueScore += pontos;
                addMessageToChat(newBtn.textContent, true);
                if (isVoiceEnabled) speakText("Você escolheu " + newBtn.textContent);
                currentIndex++;
                
                // Atualiza pontuação
                const scoreDisplay = document.querySelector('#virtueOptions + div');
                if (scoreDisplay) {
                    scoreDisplay.textContent = `✦ ${virtueScore} ✦`;
                }
                
                if (currentIndex >= currentQuestions.length) {
                    if (virtueScore >= MIN_VIRTUE_SCORE) {
                        showMessage(`✦ APROVADA ✦`, "#ffd700");
                        if (isVoiceEnabled) speakText("Aprovada. O Grimório está aberto.");
                        setTimeout(() => completeTest(true), 800);
                    } else {
                        showMessage(`✦ REPROVADA ✦`, "#ff3300");
                        if (isVoiceEnabled) speakText("Reprovada.");
                        setTimeout(() => failTest(), 800);
                    }
                } else {
                    setTimeout(() => showVirtueQuestion(), 400);
                }
            };
        });
    }
    
    function completeTest(success) {
        if (success) {
            localStorage.setItem('hecate_auth_complete', 'true');
            console.log('✅ Hécate: Autenticação salva!');
        }
        
        setTimeout(() => {
            if (overlay) {
                overlay.style.transition = 'opacity 1.5s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    testActive = false;
                    if (onCompleteCallback) onCompleteCallback(success);
                }, 1500);
            }
        }, 500);
    }
    
    function failTest() {
        setTimeout(() => {
            if (overlay) {
                overlay.style.transition = 'opacity 1s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    testActive = false;
                    if (onCompleteCallback) onCompleteCallback(false);
                }, 1000);
            }
        }, 500);
    }
    
    window.HecateTest = {
        show: showTestInterface,
        isActive: () => testActive,
        toggleVoice: () => { isVoiceEnabled = !isVoiceEnabled; }
    };
    
    console.log('🗝️ Hécate: Ritual cinematográfico V2 carregado');
})();