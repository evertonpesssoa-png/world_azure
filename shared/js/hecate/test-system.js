// ============================================
// 🗝️ HÉCATE - SISTEMA DE TESTE
// Deusa da Magia - Teste de Conhecimento, Sabedoria e Virtude
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // DETECTAR DEPENDÊNCIAS (com fallback)
    // ============================================
    
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    const Block = typeof HecateBlock !== 'undefined' ? HecateBlock :
                  (typeof BlockManager !== 'undefined' ? BlockManager : null);
    
    if (!Core || !Block) {
        console.error('❌ Hécate Test: Dependências não encontradas!');
        console.error('Core:', Core, 'Block:', Block);
        return;
    }
    
    // ============================================
    // BANCO DE PERGUNTAS EXPANDIDO
    // ============================================
    
    const QUESTION_BANK = {
        // 🔐 SENHA (Nível 1)
        senha: {
            pergunta: "🔐 DIGITE A SENHA DE ACESSO AO GRIMÓRIO",
            dica: "⚡ Dica: Nome da primeira Asura (minúsculo)",
            validar: (r) => r.toLowerCase().trim() === "astreia"
        },
        
        // 📜 SABEDORIA (Nível 2)
        sabedoria: {
            perguntas: [
                { 
                    texto: "📜 O que significa WZ no nome do projeto?", 
                    dica: "⚡ World _ _ _ _ _", 
                    validar: (r) => r.toLowerCase().includes("azure") || r.toLowerCase().includes("azul") 
                },
                { 
                    texto: "🔮 Quantos Asuras existem no Grimório?", 
                    dica: "⚡ Conte os cards giratórios no centro", 
                    validar: (r) => r === "9" || r === "nove" 
                },
                { 
                    texto: "🕷️ Qual Asura controla as sombras e o vazio?", 
                    dica: "⚡ Começa com 'U'", 
                    validar: (r) => r.toLowerCase().includes("umbra") 
                },
                { 
                    texto: "⚡ Qual Asura é conhecida como 'A Maga das Invenções'?", 
                    dica: "⚡ Começa com 'D'", 
                    validar: (r) => r.toLowerCase().includes("daedala") 
                },
                { 
                    texto: "🌟 Qual Asura representa a Justiça e as constelações?", 
                    dica: "⚡ Começa com 'A' e termina com 'a'", 
                    validar: (r) => r.toLowerCase().includes("astreia") 
                },
                {
                    texto: "🏆 Qual Asura representa a Vitória?",
                    dica: "⚡ Começa com 'V'",
                    validar: (r) => r.toLowerCase().includes("victoria")
                },
                {
                    texto: "🔥 Qual Asura protege o lar e a sacralidade?",
                    dica: "⚡ Começa com 'H'",
                    validar: (r) => r.toLowerCase().includes("hestia")
                }
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
        
        // 🌟 VIRTUDE (Nível 3)
        virtude: {
            perguntas: [
                { 
                    texto: "⚖️ O QUE FARIA COM O PODER DA HÉCATE?", 
                    dica: "⚡ Proteger? Justiça? Compartilhar?", 
                    opcoes: ["Proteger os fracos", "Fazer justiça", "Compartilhar o poder"], 
                    validar: (r) => { 
                        const rl = r.toLowerCase(); 
                        if(rl.includes("proteger")) return 10; 
                        if(rl.includes("justiça")) return 9; 
                        if(rl.includes("compartilhar")) return 7; 
                        return 5; 
                    }
                },
                { 
                    texto: "❤️ VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?", 
                    dica: "⚡ Compaixão, Justiça, Sabedoria...", 
                    opcoes: ["Compaixão", "Justiça", "Sabedoria"], 
                    validar: (r) => { 
                        const rl = r.toLowerCase(); 
                        if(rl.includes("compaixão")) return 10; 
                        if(rl.includes("justiça")) return 9; 
                        if(rl.includes("sabedoria")) return 8; 
                        return 5; 
                    }
                },
                { 
                    texto: "🕯️ ACEITA A RESPONSABILIDADE DE PROTEGER O MULTIVERSO?", 
                    dica: "⚡ Sim ou Não", 
                    opcoes: ["Sim, aceito", "Sim, com honra", "Aceito"], 
                    validar: (r) => { 
                        const rl = r.toLowerCase(); 
                        if(rl.includes("sim") || rl.includes("aceito")) return 10; 
                        return 0; 
                    }
                },
                {
                    texto: "🌙 VOCÊ RESPEITARIA AS REGRAS DA HÉCATE?",
                    dica: "⚡ Sim ou Não",
                    opcoes: ["Sim, sempre", "Sim, na maioria", "Depende"],
                    validar: (r) => {
                        const rl = r.toLowerCase();
                        if(rl.includes("sempre")) return 10;
                        if(rl.includes("maioria")) return 7;
                        if(rl.includes("depende")) return 5;
                        return 3;
                    }
                }
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
    
    // ============================================
    // ESTADO DO TESTE
    // ============================================
    
    let testActive = false;
    let currentLevel = 1;
    let currentQuestions = [];
    let currentIndex = 0;
    let virtueScore = 0;
    let onCompleteCallback = null;
    
    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    
    function showMessage(text, color, duration = 2000) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.95);
            border: 2px solid ${color};
            color: ${color};
            padding: 12px 24px;
            border-radius: 30px;
            z-index: 900001;
            font-family: monospace;
            font-size: 14px;
            white-space: nowrap;
            animation: fadeOutMsg ${duration/1000}s ease forwards;
        `;
        msg.textContent = text;
        document.body.appendChild(msg);
        
        // Adicionar animação se não existir
        if (!document.getElementById('hecate-msg-styles')) {
            const style = document.createElement('style');
            style.id = 'hecate-msg-styles';
            style.textContent = `
                @keyframes fadeOutMsg {
                    0% { opacity: 0; transform: translateX(-50%) scale(0.9); }
                    15% { opacity: 1; transform: translateX(-50%) scale(1); }
                    85% { opacity: 1; transform: translateX(-50%) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => msg.remove(), duration);
    }
    
    // ============================================
    // INTERFACE DO TESTE
    // ============================================
    
    function showTestInterface(onComplete) {
        if (testActive) {
            console.warn('Teste já está ativo');
            return;
        }
        
        testActive = true;
        onCompleteCallback = onComplete;
        
        // Criar overlay
        const overlay = document.createElement('div');
        overlay.id = 'hecate-test-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.97);
            backdrop-filter: blur(20px);
            z-index: 900000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #0a0a1a, #1a0a2a);
                border: 2px solid #9b30ff;
                border-radius: 30px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 0 50px rgba(155,48,255,0.3);
            ">
                <div style="font-size: 60px;">🗝️</div>
                <h2 style="color: #9b30ff;">HÉCATE - TESTE DA GUARDIÃ</h2>
                <p style="color: #aaa;">Demonstre seu valor para desbloquear o grimório</p>
                
                <div style="margin: 30px 0;">
                    <div style="display: flex; justify-content: space-between; gap: 10px;">
                        <div style="flex:1; text-align: center;"><span style="font-size: 30px;">🔐</span><br><span style="color: #888;">Senha</span></div>
                        <div style="flex:1; text-align: center;"><span style="font-size: 30px;">📜</span><br><span style="color: #888;">Sabedoria</span></div>
                        <div style="flex:1; text-align: center;"><span style="font-size: 30px;">🌟</span><br><span style="color: #888;">Virtude</span></div>
                    </div>
                </div>
                
                <div id="hecateTestContent"></div>
                
                <div style="margin-top: 20px; font-size: 11px; color: #555;">
                    Tentativas restantes: <span id="hecateAttemptsLeft">${Block.getAttempts ? Block.getAttempts() : 0}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Adicionar estilo de animação
        if (!document.getElementById('hecate-test-styles')) {
            const style = document.createElement('style');
            style.id = 'hecate-test-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        startLevel(1);
    }
    
    function startLevel(level) {
        currentLevel = level;
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        // Atualizar tentativas restantes
        if (Block.getAttempts) {
            const remaining = Block.CONFIG?.MAX_ATTEMPTS - Block.getAttempts() || 3;
            const attemptsSpan = document.getElementById('hecateAttemptsLeft');
            if (attemptsSpan) attemptsSpan.textContent = remaining;
        }
        
        if (level === 1) {
            // NÍVEL 1: SENHA
            content.innerHTML = `
                <div style="color: #9b30ff; font-size: 18px; margin-bottom: 15px;">${QUESTION_BANK.senha.pergunta}</div>
                <div style="color: #666; font-size: 11px; margin-bottom: 20px;">${QUESTION_BANK.senha.dica}</div>
                <input type="password" id="hecateTestInput" placeholder="Digite a senha" style="
                    width: 100%;
                    padding: 12px;
                    background: #000;
                    border: 1px solid #9b30ff;
                    border-radius: 15px;
                    color: #9b30ff;
                    margin-bottom: 15px;
                    text-align: center;
                    font-size: 16px;
                ">
                <button id="hecateTestBtn" style="
                    background: #9b30ff;
                    border: none;
                    padding: 12px;
                    border-radius: 30px;
                    color: white;
                    cursor: pointer;
                    width: 100%;
                    font-size: 16px;
                ">✦ VERIFICAR ✦</button>
            `;
            
            const btn = document.getElementById('hecateTestBtn');
            const input = document.getElementById('hecateTestInput');
            
            const verify = () => {
                if (QUESTION_BANK.senha.validar(input.value)) {
                    showMessage("✅ Senha correta!", "#00ff88", 1500);
                    startLevel(2);
                } else {
                    failTest();
                }
            };
            
            btn.onclick = verify;
            input.onkeypress = (e) => { if (e.key === 'Enter') verify(); };
            setTimeout(() => input.focus(), 100);
            
        } else if (level === 2) {
            // NÍVEL 2: SABEDORIA
            currentQuestions = QUESTION_BANK.sabedoria.getRandomQuestions();
            currentIndex = 0;
            showSabedoriaQuestion();
            
        } else if (level === 3) {
            // NÍVEL 3: VIRTUDE
            currentQuestions = QUESTION_BANK.virtude.getRandomQuestions();
            currentIndex = 0;
            virtueScore = 0;
            showVirtudeQuestion();
        }
    }
    
    function showSabedoriaQuestion() {
        const q = currentQuestions[currentIndex];
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        content.innerHTML = `
            <div style="color: #00ffcc; font-size: 12px;">SABEDORIA (${currentIndex + 1}/${currentQuestions.length})</div>
            <div style="color: white; font-size: 18px; margin: 15px 0;">${q.texto}</div>
            <div style="color: #666; font-size: 11px; margin-bottom: 20px;">${q.dica}</div>
            <input type="text" id="hecateTestInput" placeholder="Digite sua resposta" style="
                width: 100%;
                padding: 12px;
                background: #000;
                border: 1px solid #00ffcc;
                border-radius: 15px;
                color: #00ffcc;
                margin-bottom: 15px;
                text-align: center;
                font-size: 16px;
            ">
            <button id="hecateTestBtn" style="
                background: #00ffcc;
                border: none;
                padding: 12px;
                border-radius: 30px;
                color: #000;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
            ">✦ RESPONDER ✦</button>
        `;
        
        const btn = document.getElementById('hecateTestBtn');
        const input = document.getElementById('hecateTestInput');
        
        const answer = () => {
            if (q.validar(input.value)) {
                currentIndex++;
                if (currentIndex >= currentQuestions.length) {
                    showMessage("✅ Sabedoria comprovada!", "#00ffcc", 1500);
                    startLevel(3);
                } else {
                    showSabedoriaQuestion();
                }
            } else {
                failTest();
            }
        };
        
        btn.onclick = answer;
        input.onkeypress = (e) => { if (e.key === 'Enter') answer(); };
        setTimeout(() => input.focus(), 100);
    }
    
    function showVirtudeQuestion() {
        const q = currentQuestions[currentIndex];
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        content.innerHTML = `
            <div style="color: #ffd700; font-size: 12px;">VIRTUDE (${currentIndex + 1}/${currentQuestions.length})</div>
            <div style="color: white; font-size: 16px; margin: 15px 0;">${q.texto}</div>
            <div style="color: #666; font-size: 11px; margin-bottom: 20px;">${q.dica}</div>
            <div id="hecateVirtudeOptions">
                ${q.opcoes.map(op => `
                    <button class="hecate-virtue-opt" data-value="${op}" style="
                        display: block;
                        width: 100%;
                        margin: 8px 0;
                        padding: 12px;
                        background: rgba(255,215,0,0.1);
                        border: 1px solid #ffd700;
                        border-radius: 15px;
                        color: #ffd700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 14px;
                    ">${op}</button>
                `).join('')}
            </div>
            <div style="margin-top: 15px; color: #ffd700;">Pontuação: ${virtueScore}/${MIN_VIRTUE_SCORE}</div>
        `;
        
        document.querySelectorAll('.hecate-virtue-opt').forEach(btn => {
            btn.onclick = () => {
                const pontos = q.validar(btn.dataset.value);
                virtueScore += pontos;
                currentIndex++;
                
                if (currentIndex >= currentQuestions.length) {
                    if (virtueScore >= MIN_VIRTUE_SCORE) {
                        showMessage(`🌟 APROVADA! (${virtueScore}/${MIN_VIRTUE_SCORE}) 🌟`, "#ffd700", 2000);
                        completeTest(true);
                    } else {
                        showMessage(`❌ REPROVADA (${virtueScore}/${MIN_VIRTUE_SCORE})`, "#ff3300", 2000);
                        failTest();
                    }
                } else {
                    showVirtudeQuestion();
                }
            };
        });
    }
    
    function completeTest(success) {
        const overlay = document.getElementById('hecate-test-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => overlay.remove(), 500);
        }
        
        testActive = false;
        
        if (onCompleteCallback) {
            onCompleteCallback(success);
        }
    }
    
    function failTest() {
        // Registrar tentativa falha
        let result = { blocked: false, blockInfo: null };
        if (Block && Block.incrementAttempts) {
            result = Block.incrementAttempts();
        }
        
        const remaining = Block && Block.getAttempts ? 
            (Block.CONFIG?.MAX_ATTEMPTS - Block.getAttempts()) : 0;
        
        showMessage(`❌ FALHA! Tentativas restantes: ${remaining}`, "#ff3300", 2000);
        
        const overlay = document.getElementById('hecate-test-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => overlay.remove(), 500);
        }
        
        testActive = false;
        
        if (result.blocked && onCompleteCallback) {
            onCompleteCallback(false);
        } else if (onCompleteCallback) {
            onCompleteCallback(false);
        }
    }
    
    // ============================================
    // API PÚBLICA
    // ============================================
    
    window.HecateTest = {
        show: showTestInterface,
        isActive: () => testActive,
        getCurrentLevel: () => currentLevel
    };
    
    // Compatibilidade com nome antigo
    window.ObscuratilTest = window.HecateTest;
    
    console.log('🗝️ Hécate Test System carregado');
    
})();