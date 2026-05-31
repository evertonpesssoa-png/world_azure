// ============================================
// 🕷️ OBSCURÁTIL - SISTEMA DE DEFESA MÁGICO/CYBERPUNK
// ============================================

const Obscuratil = {
    active: false,
    level: 0,
    usuarioAutenticado: false,
    nivelAutenticado: 0,
    autenticacaoEmProgresso: false,
    
    isFullyAuthenticated: function() {
        const nivelCompleto = localStorage.getItem('obscuratil_virtude_completa');
        const senhaApenas = localStorage.getItem('obscuratil_senha_aprovada');
        
        if(nivelCompleto === 'true') {
            return true;
        }
        
        if(senhaApenas === 'true' && nivelCompleto !== 'true') {
            console.log("🕷️ OBSCURÁTIL: Detectado aprovação parcial. Forçando reavaliação...");
            localStorage.removeItem('obscuratil_senha_aprovada');
            localStorage.removeItem('obscuratil_nivel');
            return false;
        }
        
        return false;
    },
    
    saveFullAuth: function() {
        localStorage.setItem('obscuratil_virtude_completa', 'true');
        localStorage.setItem('obscuratil_aprovado_em', new Date().toISOString());
        this.usuarioAutenticado = true;
        console.log("✅ OBSCURÁTIL: Autenticação COMPLETA salva");
    },
    
    ativarEfeito: function(nivel) {
        const overlay = document.createElement('div');
        
        if(nivel === 1) {
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: radial-gradient(circle, rgba(255,51,0,0.3), transparent);
                pointer-events: none;
                z-index: 99999;
                animation: obscuratilFlash 0.3s ease-in-out 3;
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 2000);
        } else if(nivel === 2) {
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: repeating-linear-gradient(0deg, rgba(155,48,255,0.15) 0px, rgba(155,48,255,0.15) 2px, transparent 2px, transparent 8px);
                pointer-events: none;
                z-index: 99998;
                animation: obscuratilGlitch 0.1s infinite;
            `;
            document.body.appendChild(overlay);
            
            const worldAzure = document.querySelector('.banner, .slider, .content');
            if(worldAzure) {
                worldAzure.style.transition = 'opacity 0.5s ease';
                worldAzure.style.opacity = '0.4';
                worldAzure.style.filter = 'blur(2px)';
            }
            
            setTimeout(() => {
                overlay.remove();
                if(worldAzure) {
                    worldAzure.style.opacity = '1';
                    worldAzure.style.filter = 'none';
                }
            }, 8000);
        }
    },
    
    mostrarMensagem: function(texto, cor) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            border: 2px solid ${cor};
            color: ${cor};
            padding: 12px 24px;
            border-radius: 30px;
            z-index: 200001;
            font-family: monospace;
            font-size: 14px;
            text-align: center;
            animation: fadeInOut 3s ease;
        `;
        msg.textContent = texto;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    },
    
    init: function(items, portalTransition) {
        console.log('🕷️ OBSCURÁTIL: Sistema de defesa ativado');
        
        if(!document.getElementById('obscuratil-styles')) {
            const style = document.createElement('style');
            style.id = 'obscuratil-styles';
            style.textContent = `
                @keyframes obscuratilFlash { 0%,100%{opacity:0;} 50%{opacity:1;} }
                @keyframes obscuratilGlitch { 0%{transform:translate(0);} 20%{transform:translate(-2px,1px);} 40%{transform:translate(2px,-1px);} 60%{transform:translate(-1px,2px);} 80%{transform:translate(1px,-2px);} 100%{transform:translate(0);} }
                @keyframes fadeInOut { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.9);} 15%{opacity:1;transform:translate(-50%,-50%) scale(1);} 85%{opacity:1;} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.9);} }
            `;
            document.head.appendChild(style);
        }
        
        if(this.isFullyAuthenticated()) {
            console.log("✅ OBSCURÁTIL: Usuário já autenticado. Grimório liberado.");
            if(items) {
                items.forEach(item => {
                    item.style.pointerEvents = "";
                    item.style.opacity = "";
                });
            }
            return;
        }
        
        if(items) {
            items.forEach(item => {
                item.style.pointerEvents = "none";
                item.style.opacity = "0.5";
                item.style.transition = "all 0.3s ease";
            });
        }
        
        let autenticacaoIniciada = false;
        
        const iniciarAutenticacao = (e) => {
            if(autenticacaoIniciada) return;
            if(this.autenticacaoEmProgresso) return;
            if(this.isFullyAuthenticated()) return;
            
            autenticacaoIniciada = true;
            this.autenticacaoEmProgresso = true;
            
            console.log("🕷️ OBSCURÁTIL: Interação detectada! Tipo:", e.type);
            
            // Remove todos os listeners após primeira interação
            const eventos = ['click', 'touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keyup', 'scroll', 'wheel'];
            eventos.forEach(evento => {
                document.body.removeEventListener(evento, iniciarAutenticacao);
                document.removeEventListener(evento, iniciarAutenticacao);
                window.removeEventListener(evento, iniciarAutenticacao);
            });
            
            if(navigator.vibrate) navigator.vibrate(50);
            
            if(typeof EnigmaSystem !== 'undefined') {
                EnigmaSystem.autenticarCompleto((aprovado) => {
                    this.autenticacaoEmProgresso = false;
                    
                    if(aprovado) {
                        this.saveFullAuth();
                        if(items) {
                            items.forEach(item => {
                                item.style.pointerEvents = "";
                                item.style.opacity = "";
                            });
                        }
                        console.log("✅ OBSCURÁTIL: Autenticação aprovada! Grimório liberado.");
                        this.mostrarMensagem("✨ Grimório liberado! Toque nos Asuras para viajar. ✨", "#00ff88");
                    } else {
                        console.log("❌ OBSCURÁTIL: Falha na autenticação.");
                        this.ativarEfeito(2);
                        this.mostrarMensagem("🕷️ VOCÊ NÃO PASSOU NO TESTE • RECARREGUE PARA TENTAR NOVAMENTE 🕷️", "#ff3300");
                        setTimeout(() => {
                            autenticacaoIniciada = false;
                        }, 5000);
                    }
                });
            } else {
                console.error("❌ EnigmaSystem não encontrado!");
                if(items) {
                    items.forEach(item => {
                        item.style.pointerEvents = "";
                        item.style.opacity = "";
                    });
                }
            }
        };
        
        // ============================================
        // EVENTOS PARA PC E CELULAR (todos os dispositivos)
        // ============================================
        
        const eventosInteracao = [
            'click', 'touchstart', 'touchend', 'touchmove',
            'mousedown', 'mouseup', 'mousemove',
            'keydown', 'keyup',
            'scroll', 'wheel'
        ];
        
        eventosInteracao.forEach(evento => {
            document.body.addEventListener(evento, iniciarAutenticacao);
            document.addEventListener(evento, iniciarAutenticacao);
            window.addEventListener(evento, iniciarAutenticacao);
        });
        
        // Garantia específica para touch no celular
        const touchEvents = ['touchstart', 'touchend', 'touchcancel'];
        touchEvents.forEach(evento => {
            document.body.addEventListener(evento, iniciarAutenticacao);
        });
        
        console.log("🕷️ OBSCURÁTIL: Aguardando interação (toque/clique/movimento)...");
    }
};

// ============================================
// 🔮 SISTEMA DE ENIGMA - SENHA + SABEDORIA + VIRTUDE
// ============================================

const EnigmaSystem = {
    active: false,
    tentativas: 0,
    maxTentativas: 3,
    nivelAtual: 1,
    
    enigmas: {
        senha: {
            pergunta: "🔐 DIGITE A SENHA DE ACESSO AO GRIMÓRIO",
            dica: "⚡ Dica: Nome da primeira Asura (minúsculo)",
            validar: (r) => r.toLowerCase().trim() === "astreia"
        },
        
        sabedoria: {
            perguntas: [
                { texto: "📜 NOME DO PORTAL QUE RASGA A REALIDADE?", dica: "⚡ Técnica dos Hollows em Bleach", validar: (r) => r.toLowerCase().includes("garganta") || r.toLowerCase().includes("descorrer") },
                { texto: "🔮 QUANTAS ASURAS EXISTEM NO GRIMÓRIO?", dica: "⚡ Conte os cards giratórios", validar: (r) => r === "9" || r === "nove" },
                { texto: "🕷️ NOME DO SISTEMA DE DEFESA MÁGICO?", dica: "⚡ Começa com 'O' termina com 'il'", validar: (r) => r.toLowerCase().includes("obscuratil") }
            ],
            indiceAtual: 0,
            reset: function() { this.indiceAtual = 0; }
        },
        
        virtude: {
            perguntas: [
                { texto: "⚖️ O QUE FARIA COM O PODER DO OBSCURÁTIL?", dica: "⚡ Proteger? Justiça? Compartilhar?", opcoes: ["Proteger os fracos", "Fazer justiça", "Compartilhar o poder"], validar: (r) => { const rl = r.toLowerCase(); if(rl.includes("proteger")) return 10; if(rl.includes("justiça")) return 9; if(rl.includes("compartilhar")) return 7; return 5; } },
                { texto: "❤️ VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?", dica: "⚡ Compaixão, Justiça, Sabedoria...", opcoes: ["Compaixão", "Justiça", "Sabedoria"], validar: (r) => { const rl = r.toLowerCase(); if(rl.includes("compaixão")) return 10; if(rl.includes("justiça")) return 9; if(rl.includes("sabedoria")) return 8; return 5; } },
                { texto: "🕯️ ACEITA A RESPONSABILIDADE DE PROTEGER?", dica: "⚡ Sim ou Não", validar: (r) => { const rl = r.toLowerCase(); if(rl.includes("sim") || rl.includes("aceito")) return 10; return 0; } }
            ],
            indiceAtual: 0,
            pontuacaoTotal: 0,
            pontuacaoNecessaria: 20,
            reset: function() { this.indiceAtual = 0; this.pontuacaoTotal = 0; }
        }
    },
    
    mostrarMensagem: function(texto, cor, tempo = 1500) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.95);
            border: 2px solid ${cor};
            color: ${cor};
            padding: 12px 24px;
            border-radius: 10px;
            z-index: 200002;
            font-family: monospace;
            font-size: 16px;
            text-align: center;
            animation: fadeInOut ${tempo/1000}s ease;
        `;
        msg.textContent = texto;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), tempo);
    },
    
    mostrarInterface: function(callback) {
        const nivel = this.nivelAtual;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.96);
            backdrop-filter: blur(8px);
            z-index: 200000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        `;
        
        let html = '';
        
        if(nivel === 1) {
            html = `<div style="background: #0a0a1a; border: 2px solid #9b30ff; border-radius: 20px; padding: 30px; max-width: 90%; width: 350px; text-align: center;">
                <div style="font-size: 50px;">🔐</div>
                <div style="color: #9b30ff; font-size: 18px; margin: 10px 0;">${this.enigmas.senha.pergunta}</div>
                <div style="color: #666; font-size: 11px; margin-bottom: 20px;">${this.enigmas.senha.dica}</div>
                <input type="password" id="enigResp" placeholder="Senha" style="width: 100%; padding: 12px; background: #000; border: 1px solid #9b30ff; border-radius: 10px; color: #9b30ff; margin-bottom: 15px;">
                <button id="enigBtn" style="background: #9b30ff; border: none; padding: 12px; border-radius: 10px; color: #000; font-weight: bold; width: 100%;">✦ VERIFICAR ✦</button>
            </div>`;
        } else if(nivel === 2) {
            const p = this.enigmas.sabedoria.perguntas[this.enigmas.sabedoria.indiceAtual];
            html = `<div style="background: #0a0a1a; border: 2px solid #00ffcc; border-radius: 20px; padding: 30px; max-width: 90%; width: 350px; text-align: center;">
                <div style="font-size: 50px;">📜</div>
                <div style="color: #00ffcc; font-size: 12px;">SABEDORIA (${this.enigmas.sabedoria.indiceAtual + 1}/3)</div>
                <div style="color: #fff; font-size: 16px; margin: 15px 0;">${p.texto}</div>
                <div style="color: #666; font-size: 11px; margin-bottom: 20px;">${p.dica}</div>
                <input type="text" id="enigResp" placeholder="Resposta" style="width: 100%; padding: 12px; background: #000; border: 1px solid #00ffcc; border-radius: 10px; color: #00ffcc; margin-bottom: 15px;">
                <button id="enigBtn" style="background: #00ffcc; border: none; padding: 12px; border-radius: 10px; color: #000; font-weight: bold; width: 100%;">✦ RESPONDER ✦</button>
            </div>`;
        } else {
            const p = this.enigmas.virtude.perguntas[this.enigmas.virtude.indiceAtual];
            html = `<div style="background: #0a0a1a; border: 2px solid #ffd700; border-radius: 20px; padding: 30px; max-width: 90%; width: 350px; text-align: center;">
                <div style="font-size: 50px;">🌟</div>
                <div style="color: #ffd700; font-size: 12px;">VIRTUDE (${this.enigmas.virtude.indiceAtual + 1}/3)</div>
                <div style="color: #fff; font-size: 16px; margin: 15px 0;">${p.texto}</div>
                <div style="margin-bottom: 15px;">
                    ${p.opcoes.map(op => `<button class="opcao-virt" data-val="${op}" style="display: block; width: 100%; margin: 6px 0; padding: 10px; background: rgba(255,215,0,0.1); border: 1px solid #ffd700; border-radius: 8px; color: #ffd700;">${op}</button>`).join('')}
                </div>
                <div style="font-size: 11px; color: #ffd700;">Pontuação: ${this.enigmas.virtude.pontuacaoTotal}</div>
            </div>`;
        }
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        const tratarResposta = () => {
            let resposta = '';
            const input = document.getElementById('enigResp');
            if(input) resposta = input.value;
            
            if(nivel === 1) {
                if(this.enigmas.senha.validar(resposta)) {
                    this.mostrarMensagem("✅ Senha correta!", "#00ff88", 1000);
                    overlay.remove();
                    this.nivelAtual = 2;
                    this.mostrarInterface(callback);
                } else {
                    this.tentativas++;
                    this.mostrarMensagem(`❌ Errada! ${this.tentativas}/3`, "#ff3300", 1000);
                    if(this.tentativas >= 3) {
                        this.mostrarMensagem("🔒 Bloqueado!", "#ff3300", 1500);
                        overlay.remove();
                        if(callback) callback(false);
                    }
                }
            }
            else if(nivel === 2) {
                const sab = this.enigmas.sabedoria;
                const pergunta = sab.perguntas[sab.indiceAtual];
                
                if(pergunta.validar(resposta)) {
                    sab.indiceAtual++;
                    if(sab.indiceAtual >= sab.perguntas.length) {
                        this.mostrarMensagem("✅ Sabedoria comprovada!", "#00ffcc", 1000);
                        overlay.remove();
                        this.nivelAtual = 3;
                        this.mostrarInterface(callback);
                    } else {
                        this.mostrarMensagem("✅ Correto!", "#00ffcc", 800);
                        overlay.remove();
                        this.mostrarInterface(callback);
                    }
                } else {
                    this.mostrarMensagem("❌ Incorreto!", "#ff3300", 800);
                }
            }
        };
        
        const btn = document.getElementById('enigBtn');
        if(btn) btn.onclick = tratarResposta;
        
        document.querySelectorAll('.opcao-virt').forEach(btn => {
            btn.onclick = () => {
                const virt = this.enigmas.virtude;
                const pergunta = virt.perguntas[virt.indiceAtual];
                const pontos = pergunta.validar(btn.dataset.val);
                
                virt.pontuacaoTotal += pontos;
                virt.indiceAtual++;
                
                if(virt.indiceAtual >= virt.perguntas.length) {
                    const aprovado = virt.pontuacaoTotal >= virt.pontuacaoNecessaria;
                    if(aprovado) {
                        this.mostrarMensagem(`🌟 APROVADO! (${virt.pontuacaoTotal}/${virt.pontuacaoNecessaria}) 🌟`, "#ffd700", 2000);
                        overlay.remove();
                        if(callback) callback(true);
                    } else {
                        this.mostrarMensagem(`❌ REPROVADO (${virt.pontuacaoTotal}/${virt.pontuacaoNecessaria})`, "#ff3300", 2000);
                        overlay.remove();
                        if(callback) callback(false);
                    }
                } else {
                    this.mostrarMensagem(`✅ +${pontos} pts! Total: ${virt.pontuacaoTotal}`, "#ffd700", 1000);
                    overlay.remove();
                    this.mostrarInterface(callback);
                }
            };
        });
    },
    
    autenticarCompleto: function(callback) {
        this.nivelAtual = 1;
        this.enigmas.sabedoria.reset();
        this.enigmas.virtude.reset();
        this.tentativas = 0;
        this.mostrarInterface(callback);
    }
};

// CSS adicional
if(!document.getElementById('obscuratil-animations')) {
    const style = document.createElement('style');
    style.id = 'obscuratil-animations';
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
    `;
    document.head.appendChild(style);
}

// Exportar
if(typeof module !== 'undefined' && module.exports) {
    module.exports = { Obscuratil, EnigmaSystem };
}