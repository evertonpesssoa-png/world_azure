// ============================================
// 🗝️ HÉCATE - SISTEMA DE TESTE
// ============================================

(function() {
    'use strict';
    
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
    
    function showMessage(text, color, duration = 2000) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.95);
            border: 2px solid ${color};
            color: ${color};
            padding: 10px 20px;
            border-radius: 30px;
            z-index: 900001;
            font-family: monospace;
            font-size: 14px;
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
            background: rgba(0,0,0,0.97);
            z-index: 900000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            overflow-y: auto;
            padding: 20px;
        `;
        
        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #0a0a1a, #1a0a2a); border: 2px solid #9b30ff; border-radius: 30px; padding: 30px 25px; max-width: 450px; width: 100%; text-align: center; margin: auto;">
                <div style="font-size: 50px;">🗝️</div>
                <h2 style="color: #9b30ff; margin: 10px 0;">HÉCATE - TESTE</h2>
                <div id="hecateTestContent"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        startLevel(1);
    }
    
    function startLevel(level) {
        currentLevel = level;
        const content = document.getElementById('hecateTestContent');
        if (!content) return;
        
        if (level === 1) {
            content.innerHTML = `
                <div style="color: #9b30ff; margin: 10px 0;">${QUESTION_BANK.senha.pergunta}</div>
                <div style="color: #666; font-size: 11px; margin-bottom: 15px;">${QUESTION_BANK.senha.dica}</div>
                <input type="password" id="hecateInput" placeholder="Digite a senha" style="width: 100%; padding: 12px; background: #000; border: 1px solid #9b30ff; border-radius: 15px; color: #9b30ff; text-align: center; font-size: 16px; margin-bottom: 15px;">
                <button id="hecateBtn" style="background: #9b30ff; border: none; padding: 12px; border-radius: 30px; color: white; cursor: pointer; width: 100%; font-size: 16px;">✦ VERIFICAR ✦</button>
            `;
            
            const btn = document.getElementById('hecateBtn');
            const input = document.getElementById('hecateInput');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            const verify = () => {
                if (QUESTION_BANK.senha.validar(input.value)) {
                    showMessage("✅ Senha correta!", "#00ff88");
                    startLevel(2);
                } else {
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
        
        content.innerHTML = `
            <div style="color: #00ffcc; font-size: 12px; margin-bottom: 10px;">📜 SABEDORIA (${currentIndex + 1}/${currentQuestions.length})</div>
            <div style="color: white; font-size: 18px; margin: 10px 0;">${q.texto}</div>
            <div style="color: #666; font-size: 11px; margin-bottom: 15px;">${q.dica}</div>
            <input type="text" id="hecateInput" placeholder="Digite sua resposta" style="width: 100%; padding: 12px; background: #000; border: 1px solid #00ffcc; border-radius: 15px; color: #00ffcc; text-align: center; font-size: 16px; margin-bottom: 15px;">
            <button id="hecateBtn" style="background: #00ffcc; border: none; padding: 12px; border-radius: 30px; color: #000; cursor: pointer; width: 100%; font-size: 16px;">✦ RESPONDER ✦</button>
        `;
        
        const btn = document.getElementById('hecateBtn');
        const input = document.getElementById('hecateInput');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        const answer = () => {
            if (q.validar(input.value)) {
                currentIndex++;
                if (currentIndex >= currentQuestions.length) {
                    showMessage("✅ Sabedoria comprovada!", "#00ffcc");
                    startLevel(3);
                } else {
                    showWisdomQuestion();
                }
            } else {
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
        
        let optionsHtml = '';
        q.opcoes.forEach((op, idx) => {
            optionsHtml += `<button class="virtue-opt" data-pontos="${q.pontos[idx]}" style="display: block; width: 100%; margin: 8px 0; padding: 12px; background: rgba(255,215,0,0.1); border: 1px solid #ffd700; border-radius: 15px; color: #ffd700; cursor: pointer; font-size: 14px;">${op}</button>`;
        });
        
        content.innerHTML = `
            <div style="color: #ffd700; font-size: 12px; margin-bottom: 10px;">🌟 VIRTUDE (${currentIndex + 1}/${currentQuestions.length})</div>
            <div style="color: white; font-size: 16px; margin: 10px 0;">${q.texto}</div>
            <div id="virtueOptions">${optionsHtml}</div>
            <div style="margin-top: 15px; color: #ffd700;">Pontuação: ${virtueScore}/${MIN_VIRTUE_SCORE}</div>
        `;
        
        const botoes = document.querySelectorAll('.virtue-opt');
        botoes.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.onclick = () => {
                const pontos = parseInt(newBtn.dataset.pontos);
                virtueScore += pontos;
                currentIndex++;
                
                if (currentIndex >= currentQuestions.length) {
                    if (virtueScore >= MIN_VIRTUE_SCORE) {
                        showMessage(`🌟 APROVADA! (${virtueScore}/${MIN_VIRTUE_SCORE}) 🌟`, "#ffd700");
                        completeTest(true);
                    } else {
                        showMessage(`❌ REPROVADA (${virtueScore}/${MIN_VIRTUE_SCORE})`, "#ff3300");
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
            // 🔥 SALVAR AUTENTICAÇÃO NO LOCALSTORAGE
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