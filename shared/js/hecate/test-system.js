// ============================================
// 🗝️ HÉCATE - SISTEMA DE TESTE (DIMENSÃO & VOZ)
// ============================================

(function() {
    'use strict';
    
    // 🔥 BANCO DE PERGUNTAS (INTOCÁVEL) 🔥
    const QUESTION_BANK = {
        senha: {
            pergunta: "🔐 DIGITE A SENHA DE ACESSO AO GRIMÓRIO",
            dica: "⚡ Dica: Nome da primeira Asura (minúsculo)",
            validar: (r) => r.toLowerCase().trim() === "astreia"
        },
        sabedoria: {
            perguntas: [
                { texto: "📜 O que significa WZ no nome do projeto?", dica: "⚡ World _ _ _ _ _", validar: (r) => r.toLowerCase().includes("azure") || r.toLowerCase().includes("azul") },
                { texto: "🔮 Quantos Asuras existem no Grimório?", dica: "⚡ Conte os cards giratórios", validar: (r) => r === "9" || r === "nove" },
                { texto: "🕷️ Qual Asura controla as sombras e o vazio?", dica: "⚡ Começa com 'U'", validar: (r) => r.toLowerCase().includes("umbra") },
                { texto: "⚡ Qual Asura é conhecida como 'A Maga das Invenções'?", dica: "⚡ Começa com 'D'", validar: (r) => r.toLowerCase().includes("daedala") },
                { texto: "🌟 Qual Asura representa a Justiça e as constelações?", dica: "⚡ Começa com 'A'", validar: (r) => r.toLowerCase().includes("astreia") },
                { texto: "🏆 Qual Asura representa a Vitória?", dica: "⚡ Começa com 'V'", validar: (r) => r.toLowerCase().includes("victoria") },
                { texto: "🔥 Qual Asura protege o lar e a sacralidade?", dica: "⚡ Começa com 'H'", validar: (r) => r.toLowerCase().includes("hestia") }
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
                { texto: "⚖️ O QUE FARIA COM O PODER DA HÉCATE?", opcoes: ["Proteger os fracos", "Fazer justiça", "Compartilhar o poder"], pontos: [10, 9, 7] },
                { texto: "❤️ VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?", opcoes: ["Compaixão", "Justiça", "Sabedoria"], pontos: [10, 9, 8] },
                { texto: "🕯️ ACEITA A RESPONSABILIDADE DE PROTEGER?", opcoes: ["Sim, aceito", "Sim, com honra", "Aceito"], pontos: [10, 10, 10] }
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
    let isVoiceEnabled = false; // 🔥 Estado da voz (JARVIS)

    // 🔥 FUNÇÃO DE VOZ (JARVIS) 🔥
    function speakText(text) {
        if (!isVoiceEnabled) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Para qualquer fala anterior
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0; // Velocidade da fala
            utterance.pitch = 0.9; // Tom de voz (mais grave = mais "divino")
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }

    // 🔥 FUNÇÃO PARA ADICIONAR TEXTO NO CHAT INVISÍVEL 🔥
    function addMessageToChat(text, isUser = false) {
        const chatMsg = document.getElementById('hecateChatMessages');
        if (!chatMsg) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'user-message' : 'hecate-message';
        msgDiv.style.cssText = `
            font-family: 'Georgia', serif;
            font-size: 16px;
            color: ${isUser ? '#a78bfa' : '#e0e0e0'};
            text-shadow: 0 0 15px rgba(155, 48, 255, 0.6), 0 0 30px rgba(155, 48, 255, 0.3);
            background: transparent;
            text-align: ${isUser ? 'right' : 'center'};
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            animation: aparecerPalavra 0.8s ease-out;
        `;
        msgDiv.textContent = text;
        chatMsg.appendChild(msgDiv);
        chatMsg.scrollTop = chatMsg.scrollHeight;
    }

    // 🔥 MENSAGEM DE STATUS (FLUTUANTE) 🔥
    function showMessage(text, color, duration = 2000) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            border: 1px solid ${color};
            color: ${color};
            padding: 10px 25px;
            border-radius: 30px;
            z-index: 900001;
            font-family: 'Georgia', serif;
            font-size: 16px;
            box-shadow: 0 0 30px rgba(155, 48, 255, 0.2);
            text-shadow: 0 0 10px ${color};
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
            width: 100%;
            height: 100%;
            z-index: 900000;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Georgia', serif;
            overflow: hidden;
        `;

        overlay.innerHTML = `
            <!-- 🔥 CAMADA 1: FUNDO ESCURO COM PROFUNDIDADE (BREU) -->
            <div style="position: absolute; inset: 0; z-index: 0; background: #000000;"></div>

            <!-- 🔥 CAMADA 2: A ENTIDADE (HÉCATE JULGADORA - BRILHANTE) -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <!-- A Imagem da Deusa (sem opacity, com blend mode para brilhar) -->
                <div id="hecate-entity" style="
                    width: 100%;
                    height: 100%;
                    background-image: url('../../../images/hecate1_hq.png');
                    background-repeat: no-repeat;
                    background-position: center bottom;
                    background-size: contain;
                    mix-blend-mode: screen;
                    animation: flutuarEntidade 6s ease-in-out infinite;
                "></div>
                
                <!-- 🔥 MÁSCARA ESCURA (Vignette) para o texto aparecer sem apagar a Deusa -->
                <div style="
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.85) 100%);
                    pointer-events: none;
                "></div>
            </div>

            <!-- 🔥 CAMADA 3: O DIÁLOGO (PALAVRAS NO AR - ANCORADO NO FUNDO) -->
            <div id="hecate-chat-container" style="
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 3;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                padding: 20px 20px 30px 20px;
                pointer-events: auto;
                background: linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 100%);
            ">
                <!-- Área das Mensagens (Onde as palavras mágicas aparecem) -->
                <div id="hecateChatMessages" style="
                    width: 100%;
                    max-height: 30vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 15px;
                    padding-right: 5px;
                    scroll-behavior: smooth;
                    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                ">
                    <!-- Mensagem Inicial da Hécate -->
                    <div class="hecate-message" style="
                        font-size: 18px;
                        color: #a78bfa;
                        text-shadow: 0 0 15px rgba(155, 48, 255, 0.8), 0 0 30px rgba(155, 48, 255, 0.4);
                        background: transparent;
                        text-align: center;
                        align-self: center;
                        animation: aparecerPalavra 1s ease-out;
                    ">
                        🌙 "O Grimório está trancado. Mostre-me que você é digno."
                    </div>
                </div>

                <!-- Área de Input (Invisível, flutuando) -->
                <div id="hecateTestContent" style="
                    pointer-events: auto; 
                    width: 100%; 
                    max-width: 400px; 
                    margin: 15px auto 0 auto;
                ">
                    <!-- O input será gerado aqui -->
                </div>
            </div>

            <!-- 🔥 ÍCONE DE VOZ (JARVIS) NO CANTO SUPERIOR DIREITO 🔥 -->
            <div id="jarvis-toggle" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 900001;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(20, 10, 40, 0.6);
                backdrop-filter: blur(4px);
                border: 1px solid #9b30ff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 20px rgba(155, 48, 255, 0.2);
                pointer-events: auto;
            ">
                <span id="jarvis-icon" style="font-size: 24px; color: #9b30ff;">🗝️</span>
                <span style="position: absolute; top: -5px; right: -5px; font-size: 10px; opacity: 0.5;">🔊</span>
            </div>

            <style>
                @keyframes flutuarEntidade {
                    0%, 100% { transform: translate(-50%, -50%) scale(0.8); }
                    50% { transform: translate(-50%, -55%) scale(0.82); }
                }
                @keyframes aparecerPalavra {
                    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                #hecateChatMessages::-webkit-scrollbar {
                    width: 0px;
                }
                #jarvis-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 30px rgba(155, 48, 255, 0.6);
                }
                #jarvis-toggle.active {
                    border-color: #00ff88;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.4);
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
        
        // 🔥 LIGAR O BOTÃO DE VOZ 🔥
        const toggleBtn = document.getElementById('jarvis-toggle');
        toggleBtn.addEventListener('click', () => {
            isVoiceEnabled = !isVoiceEnabled;
            toggleBtn.classList.toggle('active');
            document.getElementById('jarvis-icon').textContent = isVoiceEnabled ? '🗣️' : '🗝️';
            if (isVoiceEnabled) {
                speakText("Sistema de voz ativado. A Guardiã está ouvindo.");
            } else {
                window.speechSynthesis.cancel();
                speakText("Sistema de voz desativado.");
            }
        });

        startLevel(1);
    }
    
    function startLevel(level) {
        currentLevel = level;
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        if (level === 1) {
            // 🔥 MENSAGEM DA HÉCATE NO CHAT 🔥
            addMessageToChat("🔐 " + QUESTION_BANK.senha.pergunta);
            addMessageToChat("💡 " + QUESTION_BANK.senha.dica);
            if (isVoiceEnabled) {
                speakText(QUESTION_BANK.senha.pergunta + ". " + QUESTION_BANK.senha.dica);
            }
            
            content.innerHTML = `
                <div style="
                    width: 100%; 
                    color: rgba(255,255,255,0.3); 
                    font-size: 12px; 
                    text-align: center; 
                    margin-bottom: 10px; 
                    font-family: 'Georgia', serif;
                ">✦ Escreva sua resposta e pressione Enter ✦</div>
                
                <input type="password" id="hecateInput" placeholder="..." style="
                    width: 100%;
                    padding: 12px;
                    background: rgba(0,0,0,0.3);
                    border: none;
                    border-bottom: 1px solid rgba(155, 48, 255, 0.5);
                    color: #a78bfa;
                    text-align: center;
                    font-size: 18px;
                    outline: none;
                    transition: border-color 0.3s;
                    font-family: 'Georgia', serif;
                    letter-spacing: 2px;
                ">
                <button id="hecateBtn" style="display: none;"></button>
            `;
            
            const btn = document.getElementById('hecateBtn');
            const input = document.getElementById('hecateInput');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            const verify = () => {
                if (QUESTION_BANK.senha.validar(input.value)) {
                    addMessageToChat(input.value, true);
                    if (isVoiceEnabled) speakText("Senha correta. Aprovado.");
                    showMessage("✅ Senha correta!", "#00ff88");
                    startLevel(2);
                } else {
                    addMessageToChat("❌ " + input.value, true);
                    if (isVoiceEnabled) speakText("Senha incorreta. Reprovado.");
                    failTest();
                }
            };
            
            newBtn.onclick = verify;
            input.onkeypress = (e) => { if (e.key === 'Enter') verify(); };
            setTimeout(() => input.focus(), 300);
            
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

        // 🔥 MENSAGEM DA HÉCATE NO CHAT 🔥
        addMessageToChat("📜 " + q.texto);
        addMessageToChat("💡 " + q.dica);
        if (isVoiceEnabled) {
            speakText(q.texto + ". " + q.dica);
        }
        
        content.innerHTML = `
            <div style="
                width: 100%; 
                color: rgba(255,255,255,0.3); 
                font-size: 12px; 
                text-align: center; 
                margin-bottom: 10px; 
                font-family: 'Georgia', serif;
            ">✦ Escreva sua resposta e pressione Enter ✦</div>

            <input type="text" id="hecateInput" placeholder="..." style="
                width: 100%;
                padding: 12px;
                background: rgba(0,0,0,0.3);
                border: none;
                border-bottom: 1px solid rgba(0, 255, 204, 0.5);
                color: #00ffcc;
                text-align: center;
                font-size: 18px;
                outline: none;
                transition: border-color 0.3s;
                font-family: 'Georgia', serif;
                letter-spacing: 2px;
            ">
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
                    showMessage("✅ Sabedoria comprovada!", "#00ffcc");
                    startLevel(3);
                } else {
                    showWisdomQuestion();
                }
            } else {
                addMessageToChat("❌ " + input.value, true);
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

        // 🔥 MENSAGEM DA HÉCATE NO CHAT 🔥
        addMessageToChat("🌟 " + q.texto);
        if (isVoiceEnabled) {
            speakText(q.texto + ". Escolha uma opção.");
        }
        
        let optionsHtml = '';
        q.opcoes.forEach((op, idx) => {
            optionsHtml += `<button class="virtue-opt" data-pontos="${q.pontos[idx]}" style="
                display: block; 
                width: 100%; 
                margin: 8px 0; 
                padding: 12px; 
                background: rgba(255,215,0,0.05); 
                border: 1px solid rgba(255,215,0,0.3); 
                border-radius: 15px; 
                color: #ffd700; 
                cursor: pointer; 
                font-size: 14px; 
                font-family: 'Georgia', serif;
                transition: all 0.3s ease;
            ">${op}</button>`;
        });
        
        content.innerHTML = `
            <div id="virtueOptions">${optionsHtml}</div>
            <div style="margin-top: 15px; color: #ffd700; font-size: 12px;">Pontuação: ${virtueScore}/${MIN_VIRTUE_SCORE}</div>
        `;
        
        const botoes = document.querySelectorAll('.virtue-opt');
        botoes.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.onclick = () => {
                const pontos = parseInt(newBtn.dataset.pontos);
                virtueScore += pontos;
                addMessageToChat("✨ " + newBtn.textContent, true);
                if (isVoiceEnabled) speakText("Você escolheu " + newBtn.textContent + ". Pontos de virtude: " + virtueScore);
                currentIndex++;
                
                if (currentIndex >= currentQuestions.length) {
                    if (virtueScore >= MIN_VIRTUE_SCORE) {
                        showMessage(`🌟 APROVADA! (${virtueScore}/${MIN_VIRTUE_SCORE}) 🌟`, "#ffd700");
                        if (isVoiceEnabled) speakText("Aprovada. O Grimório está aberto para você.");
                        completeTest(true);
                    } else {
                        showMessage(`❌ REPROVADA (${virtueScore}/${MIN_VIRTUE_SCORE})`, "#ff3300");
                        if (isVoiceEnabled) speakText("Reprovada. O Grimório não se abrirá.");
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
            console.log('✅ Hécate: Autenticação salva! Cards serão liberados.');
        }
        
        if (overlay) overlay.remove();
        testActive = false;
        if (onCompleteCallback) onCompleteCallback(success);
    }
    
    function failTest() {
        showMessage(`❌ FALHA!`, "#ff3300");
        if (overlay) overlay.remove();
        testActive = false;
        if (onCompleteCallback) onCompleteCallback(false);
    }
    
    window.HecateTest = {
        show: showTestInterface,
        isActive: () => testActive
    };
    
    console.log('🗝️ HecateTest carregado');
})();