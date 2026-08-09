// ============================================
// 🗝️ HÉCATE - RITUAL DE ACESSO (VERSÃO CINEMATOGRÁFICA)
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
    let inputGlowInterval = null;

    // 🔥 FUNÇÃO DE VOZ 🔥
    function speakText(text) {
        if (!isVoiceEnabled) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 0.85;
            utterance.volume = 0.7;
            window.speechSynthesis.speak(utterance);
        }
    }

    // 🔥 FUNÇÃO PARA ADICIONAR TEXTO NO CHAT 🔥
    function addMessageToChat(text, isUser = false, isQuestion = false) {
        const chatMsg = document.getElementById('hecateChatMessages');
        if (!chatMsg) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'user-message' : 'hecate-message';
        
        let color = '#e0e0e0';
        let fontSize = '16px';
        let align = 'center';
        
        if (isQuestion) {
            color = '#a78bfa';
            fontSize = '20px';
        } else if (isUser) {
            color = '#a78bfa';
            align = 'right';
            fontSize = '14px';
            text = '✦ ' + text;
        }
        
        msgDiv.style.cssText = `
            font-family: 'Georgia', serif;
            font-size: ${fontSize};
            color: ${color};
            text-shadow: 
                0 2px 8px rgba(0,0,0,0.95),
                0 0 20px rgba(0,0,0,0.8),
                0 0 30px rgba(155,48,255,0.3);
            background: transparent;
            text-align: ${align};
            width: 100%;
            margin-bottom: ${isQuestion ? '20px' : '8px'};
            padding: 5px;
            animation: aparecerPalavra 1s ease-out;
            letter-spacing: ${isQuestion ? '2px' : '1px'};
            opacity: ${isUser ? '0.8' : '1'};
            font-style: ${isQuestion ? 'italic' : 'normal'};
        `;
        msgDiv.textContent = text;
        chatMsg.appendChild(msgDiv);
        chatMsg.scrollTop = chatMsg.scrollHeight;
    }

    // 🔥 MENSAGEM DE STATUS (MINIMALISTA) 🔥
    function showMessage(text, color, duration = 2000) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            bottom: 25%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            border: 1px solid ${color};
            color: ${color};
            padding: 8px 20px;
            border-radius: 20px;
            z-index: 900001;
            font-family: 'Georgia', serif;
            font-size: 14px;
            letter-spacing: 3px;
            box-shadow: 0 0 30px rgba(155, 48, 255, 0.1);
            text-shadow: 0 2px 8px rgba(0,0,0,0.95);
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), duration);
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

            <!-- CAMADA 2: HÉCATE (100% OPACA) -->
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
                animation: flutuarEntidade 8s ease-in-out infinite;
                filter: contrast(1.05) brightness(1.02);
            "></div>

            <!-- CAMADA 3: NÉVOA DE SOMBRA -->
            <div id="hecate-dialog-atmosphere" style="
                position: absolute;
                inset: 0;
                z-index: 2;
                pointer-events: none;
                background: radial-gradient(
                    ellipse 75% 30% at 50% 85%,
                    rgba(10,0,20,0.95) 0%,
                    rgba(20,0,40,0.7) 35%,
                    rgba(30,0,60,0.3) 58%,
                    transparent 78%
                );
            "></div>

            <!-- CAMADA 4: DIÁLOGO (MINIMALISTA) -->
            <div id="hecate-chat-container" style="
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 3;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                padding: 20px 20px 40px 20px;
                pointer-events: auto;
                background: transparent;
            ">
                <!-- Área das Mensagens (sem scroll visível) -->
                <div id="hecateChatMessages" style="
                    width: 100%;
                    max-height: 35vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-right: 5px;
                    scroll-behavior: smooth;
                    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                ">
                    <!-- Mensagem Inicial -->
                    <div class="hecate-message" style="
                        font-size: 22px;
                        color: #a78bfa;
                        text-shadow: 
                            0 2px 8px rgba(0,0,0,0.95),
                            0 0 30px rgba(155,48,255,0.3);
                        background: transparent;
                        text-align: center;
                        align-self: center;
                        animation: aparecerPalavra 1.5s ease-out;
                        letter-spacing: 3px;
                        font-style: italic;
                        margin-bottom: 10px;
                    ">
                        🌙 "O Grimório está trancado."
                    </div>
                </div>

                <!-- Input (puramente mágico) -->
                <div id="hecateTestContent" style="
                    pointer-events: auto; 
                    width: 100%; 
                    max-width: 350px; 
                    margin: 10px auto 0 auto;
                    position: relative;
                ">
                    <div id="magic-line" style="
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent);
                        transition: all 0.5s ease;
                    "></div>
                </div>
            </div>

            <!-- BOTÃO DE VOZ (SÍMBOLO DA HÉCATE) -->
            <div id="jarvis-toggle" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 900001;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(20, 10, 40, 0.3);
                backdrop-filter: blur(4px);
                border: 1px solid rgba(167,139,250,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.5s ease;
                pointer-events: auto;
                opacity: 0.5;
            ">
                <span id="jarvis-icon" style="
                    font-size: 18px; 
                    color: rgba(167,139,250,0.6);
                    transition: all 0.5s ease;
                ">◇</span>
            </div>

            <style>
                @keyframes flutuarEntidade {
                    0%, 100% { transform: translate(-50%, -50%) scale(0.8); }
                    50% { transform: translate(-50%, -56%) scale(0.82); }
                }
                @keyframes aparecerPalavra {
                    0% { opacity: 0; transform: translateY(30px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
                @keyframes magicPulse {
                    0%, 100% { 
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent);
                        transform: scaleX(1);
                    }
                    50% { 
                        background: linear-gradient(90deg, transparent, rgba(167,139,250,0.8), rgba(155,48,255,0.5), transparent);
                        transform: scaleX(1.05);
                    }
                }
                #hecateChatMessages::-webkit-scrollbar {
                    width: 0px;
                }
                #jarvis-toggle:hover {
                    opacity: 1;
                    border-color: rgba(167,139,250,0.6);
                    transform: scale(1.1);
                }
                #jarvis-toggle.active {
                    opacity: 1;
                    border-color: #00ff88;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.1);
                }
                #jarvis-toggle.active #jarvis-icon {
                    color: #00ff88;
                }
                #hecateInput {
                    width: 100%;
                    padding: 12px 0;
                    background: transparent;
                    border: none;
                    color: #f0eaff;
                    text-align: center;
                    font-size: 20px;
                    outline: none;
                    font-family: 'Georgia', serif;
                    letter-spacing: 4px;
                    text-shadow: 
                        0 2px 8px rgba(0,0,0,0.95),
                        0 0 30px rgba(155,48,255,0.2);
                    transition: all 0.5s ease;
                }
                #hecateInput::placeholder {
                    color: rgba(167,139,250,0.15);
                    font-size: 14px;
                    letter-spacing: 6px;
                }
                #hecateInput:focus + #magic-line {
                    animation: magicPulse 2s ease-in-out infinite;
                    height: 2px;
                    box-shadow: 0 0 20px rgba(167,139,250,0.2);
                }
                .virtue-opt {
                    display: block;
                    width: 100%;
                    margin: 6px 0;
                    padding: 10px;
                    background: rgba(255,215,0,0.02);
                    border: 1px solid rgba(255,215,0,0.1);
                    border-radius: 12px;
                    color: #ffd700;
                    cursor: pointer;
                    font-size: 14px;
                    font-family: 'Georgia', serif;
                    transition: all 0.4s ease;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.95);
                    letter-spacing: 1px;
                }
                .virtue-opt:hover {
                    background: rgba(255,215,0,0.08);
                    border-color: rgba(255,215,0,0.4);
                    transform: scale(1.02);
                    box-shadow: 0 0 40px rgba(255,215,0,0.05);
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
            } else {
                window.speechSynthesis.cancel();
            }
        });

        startLevel(1);
    }
    
    function startLevel(level) {
        currentLevel = level;
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        if (level === 1) {
            addMessageToChat(QUESTION_BANK.senha.pergunta, false, true);
            addMessageToChat("💡 " + QUESTION_BANK.senha.dica);
            if (isVoiceEnabled) {
                speakText(QUESTION_BANK.senha.pergunta + ". " + QUESTION_BANK.senha.dica);
            }
            
            content.innerHTML = `
                <input type="password" id="hecateInput" placeholder="—" autocomplete="off">
                <div id="magic-line"></div>
                <button id="hecateBtn" style="display: none;"></button>
            `;
            
            const btn = document.getElementById('hecateBtn');
            const input = document.getElementById('hecateInput');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            const verify = () => {
                if (QUESTION_BANK.senha.validar(input.value)) {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Aprovado.");
                    showMessage("✦ APROVADO ✦", "#a78bfa");
                    setTimeout(() => startLevel(2), 500);
                } else {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Reprovado.");
                    failTest();
                }
            };
            
            newBtn.onclick = verify;
            input.onkeypress = (e) => { if (e.key === 'Enter') verify(); };
            setTimeout(() => input.focus(), 500);
            
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
        const content = document.getElementById('hecateTestContent');
        if (!content) return;

        addMessageToChat(q.texto, false, true);
        addMessageToChat("💡 " + q.dica);
        if (isVoiceEnabled) {
            speakText(q.texto + ". " + q.dica);
        }
        
        content.innerHTML = `
            <input type="text" id="hecateInput" placeholder="—" autocomplete="off">
            <div id="magic-line"></div>
            <button id="hecateBtn" style="display: none;"></button>
        `;
        
        const btn = document.getElementById('hecateBtn');
        const input = document.getElementById('hecateInput');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const answer = () => {
            if (q.validar(input.value)) {
                addMessageToChat(input.value, true);
                if (isVoiceEnabled) speakText("Sabedoria comprovada.");
                currentIndex++;
                if (currentIndex >= currentQuestions.length) {
                    showMessage("✦ SABEDORIA ✦", "#00ffcc");
                    setTimeout(() => startLevel(3), 500);
                } else {
                    showWisdomQuestion();
                }
            } else {
                addMessageToChat(input.value, true);
                if (isVoiceEnabled) speakText("Resposta incorreta.");
                failTest();
            }
        };
        
        newBtn.onclick = answer;
        input.onkeypress = (e) => { if (e.key === 'Enter') answer(); };
        setTimeout(() => input.focus(), 300);
    }
    
    function showVirtueQuestion() {
        const q = currentQuestions[currentIndex];
        const content = document.getElementById('hecateTestContent');
        if (!content) return;

        addMessageToChat(q.texto, false, true);
        if (isVoiceEnabled) {
            speakText(q.texto);
        }
        
        let optionsHtml = '';
        q.opcoes.forEach((op, idx) => {
            optionsHtml += `<button class="virtue-opt" data-pontos="${q.pontos[idx]}">${op}</button>`;
        });
        
        content.innerHTML = `
            <div id="virtueOptions" style="width:100%;">${optionsHtml}</div>
            <div style="
                margin-top: 15px; 
                color: rgba(255,215,0,0.2); 
                font-size: 11px; 
                text-align: center;
                letter-spacing: 4px;
                text-shadow: 0 2px 8px rgba(0,0,0,0.95);
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
                
                if (currentIndex >= currentQuestions.length) {
                    if (virtueScore >= MIN_VIRTUE_SCORE) {
                        showMessage(`✦ APROVADA ✦`, "#ffd700");
                        if (isVoiceEnabled) speakText("Aprovada. O Grimório está aberto.");
                        completeTest(true);
                    } else {
                        showMessage(`✦ REPROVADA ✦`, "#ff3300");
                        if (isVoiceEnabled) speakText("Reprovada.");
                        failTest();
                    }
                } else {
                    showVirtueQuestion();
                }
            };
        });
    }
    
    function completeTest(success) {
        if (success) {
            localStorage.setItem('hecate_auth_complete', 'true');
            console.log('✅ Hécate: Autenticação salva!');
        }
        
        if (overlay) overlay.remove();
        testActive = false;
        if (onCompleteCallback) onCompleteCallback(success);
    }
    
    function failTest() {
        setTimeout(() => {
            if (overlay) overlay.remove();
            testActive = false;
            if (onCompleteCallback) onCompleteCallback(false);
        }, 1000);
    }
    
    window.HecateTest = {
        show: showTestInterface,
        isActive: () => testActive,
        toggleVoice: () => { isVoiceEnabled = !isVoiceEnabled; }
    };
    
    console.log('🗝️ Hécate: Ritual de acesso carregado (versão cinematográfica)');
})();