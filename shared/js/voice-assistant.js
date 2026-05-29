// =========================
// VOICE ASSISTANT - MODO JARVIS REAL
// Escuta contínua até desativar manualmente ou por comando de voz
// =========================

export class VoiceAssistant {
    constructor(buttonElement, onResult, onInterimResult, config = {}) {
        this.button = buttonElement;
        this.onResult = onResult;           // Callback quando um comando é finalizado
        this.onInterimResult = onInterimResult; // Callback para feedback visual (enquanto fala)
        this.config = config;
        
        this.isContinuous = false;          // Modo Jarvis ativado? (escuta contínua)
        this.isListening = false;           // Está ouvindo no momento?
        this.recognition = null;
        this.conversationHistory = [];       // Histórico para contexto
        
        this.init();
    }
    
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Reconhecimento de voz não suportado neste navegador');
            this.button.style.opacity = '0.5';
            this.button.title = 'Voz não suportada';
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = true;      // ESCUTA CONTÍNUA (não para após uma fala)
        this.recognition.interimResults = true;  // Mostra resultado enquanto fala
        this.recognition.maxAlternatives = 1;
        
        // =========================
        // EVENTOS DO RECONHECIMENTO
        // =========================
        
        // Quando começa a ouvir
        this.recognition.onstart = () => {
            this.isListening = true;
            this.button.classList.add('listening');
            this.button.classList.add('continuous-mode');
            this.updateButtonTooltip('Ouvindo continuamente... (clique para parar)');
            this.showJarvisIndicator(true);
            console.log('🎤 Modo Jarvis ATIVADO - Escutando continuamente');
        };
        
        // Quando detecta fala
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Feedback enquanto fala (opcional)
            if (interimTranscript && this.onInterimResult) {
                this.onInterimResult(interimTranscript);
            }
            
            // Processar comando final
            if (finalTranscript) {
                const lowerFinal = finalTranscript.toLowerCase().trim();
                console.log('🎤 Comando final recebido:', finalTranscript);
                
                // Verificar comando de desativação por voz
                if (this.isContinuous && (
                    lowerFinal.includes('parar de ouvir') || 
                    lowerFinal.includes('desativar') ||
                    lowerFinal.includes('encerrar') ||
                    lowerFinal.includes('modo jarvis desativar')
                )) {
                    this.deactivateJarvis();
                    this.speak("Modo escuta desativado. Fale comigo quando precisar.");
                    return;
                }
                
                // Enviar para o callback do chat
                if (this.onResult && finalTranscript) {
                    this.onResult(finalTranscript, this.isContinuous);
                }
                
                // Adicionar ao histórico
                this.addToHistory('user', finalTranscript);
            }
        };
        
        // Quando ocorre erro
        this.recognition.onerror = (event) => {
            console.error('Erro no reconhecimento:', event.error);
            
            if (event.error === 'no-speech') {
                // Sem fala, continua ouvindo (normal no modo contínuo)
                return;
            }
            
            if (event.error === 'not-allowed') {
                this.speak("Permissão do microfone negada. Por favor, permita o acesso ao microfone.");
                this.deactivateJarvis();
            }
            
            if (event.error === 'network') {
                this.speak("Erro de rede. Verifique sua conexão.");
                this.deactivateJarvis();
            }
        };
        
        // Quando para de ouvir (por erro ou desativação)
        this.recognition.onend = () => {
            console.log('🎤 Reconhecimento finalizado');
            
            if (this.isContinuous) {
                // Reinicia automaticamente (modo Jarvis contínuo)
                try {
                    this.recognition.start();
                    console.log('🎤 Reiniciando escuta contínua...');
                } catch (e) {
                    console.log('Erro ao reiniciar, tentando novamente em 500ms');
                    setTimeout(() => {
                        if (this.isContinuous) {
                            try {
                                this.recognition.start();
                            } catch (err) {
                                console.error('Falha ao reiniciar reconhecimento:', err);
                            }
                        }
                    }, 500);
                }
            } else {
                // Modo desativado
                this.isListening = false;
                this.button.classList.remove('listening');
                this.button.classList.remove('continuous-mode');
                this.updateButtonTooltip('Modo Jarvis (clique para ativar)');
                this.showJarvisIndicator(false);
            }
        };
        
        // =========================
        // EVENTO DE CLIQUE NO BOTÃO
        // =========================
        this.button.addEventListener('click', () => {
            if (this.isContinuous) {
                // Se está ativo, desativa
                this.deactivateJarvis();
                this.speak("Modo escuta desativado.");
            } else {
                // Se está desativado, ativa
                this.activateJarvis();
                const asuraName = this.config.asuraName || 'Assistente';
                this.speak(`${asuraName} ativado. Estou ouvindo...`);
            }
        });
        
        // Tooltip inicial
        this.updateButtonTooltip('Modo Jarvis (clique para ativar)');
    }
    
    // =========================
    // ATIVAR MODO JARVIS (escuta contínua)
    // =========================
    activateJarvis() {
        if (this.isContinuous) return;
        
        this.isContinuous = true;
        this.conversationHistory = [];
        this.button.classList.add('continuous-mode');
        
        try {
            this.recognition.start();
        } catch (e) {
            console.log('Reconhecimento já estava ativo ou erro ao iniciar:', e);
        }
    }
    
    // =========================
    // DESATIVAR MODO JARVIS
    // =========================
    deactivateJarvis() {
        this.isContinuous = false;
        this.button.classList.remove('continuous-mode');
        this.button.classList.remove('listening');
        this.updateButtonTooltip('Modo Jarvis (clique para ativar)');
        this.showJarvisIndicator(false);
        
        try {
            this.recognition.stop();
        } catch (e) {
            console.log('Erro ao parar reconhecimento:', e);
        }
    }
    
    // =========================
    // FALAR (síntese de voz)
    // =========================
    speak(text) {
        if (!window.speechSynthesis) return;
        
        // Cancela qualquer fala em andamento
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        window.speechSynthesis.speak(utterance);
    }
    
    // =========================
    // ATUALIZAR TOOLTIP DO BOTÃO
    // =========================
    updateButtonTooltip(text) {
        this.button.setAttribute('data-tooltip', text);
    }
    
    // =========================
    // MOSTRAR/ESCONDER INDICADOR VISUAL DO MODO JARVIS
    // =========================
    showJarvisIndicator(show) {
        let indicator = document.getElementById('jarvisIndicator');
        
        if (!indicator && show) {
            indicator = document.createElement('div');
            indicator.id = 'jarvisIndicator';
            indicator.className = 'jarvis-indicator';
            indicator.innerHTML = `
                <div class="jarvis-dot"></div>
                <div class="jarvis-wave">
                    <span></span><span></span><span></span><span></span>
                </div>
                <span class="jarvis-text">🎤 MODO JARVIS ATIVO • Sempre ouvindo</span>
                <span class="jarvis-command">(clique no ícone ou fale "parar de ouvir")</span>
            `;
            document.body.appendChild(indicator);
        }
        
        if (indicator) {
            if (show) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    }
    
    // =========================
    // ADICIONAR AO HISTÓRICO (para contexto futuro)
    // =========================
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content, timestamp: Date.now() });
        
        // Manter apenas últimas 20 interações
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }
    
    // =========================
    // OBTER HISTÓRICO
    // =========================
    getHistory() {
        return this.conversationHistory;
    }
    
    // =========================
    // VERIFICAR SE ESTÁ ATIVO
    // =========================
    isJarvisActive() {
        return this.isContinuous;
    }
    
    // =========================
    // ENVIAR TEXTO DIRETAMENTE (para digitação manual)
    // =========================
    sendTextManually(text) {
        if (text && this.onResult) {
            this.onResult(text, this.isContinuous);
            this.addToHistory('user', text);
        }
    }
}

/* =========================
   MODO JARVIS - ESTILOS DO VOICE ASSISTANT
   ========================= */

/* Estado normal do botão de voz */
.voice-icon {
    position: relative;
    transition: all 0.3s ease;
}

/* Quando está ouvindo (listening) */
.voice-icon.listening {
    animation: pulseGlow 1.2s ease-in-out infinite;
    box-shadow: 0 0 25px var(--asura-color, #287bff);
    border-color: white;
}

/* Quando está em modo contínuo (Jarvis ativo) */
.voice-icon.continuous-mode {
    border-color: #00ffcc;
    box-shadow: 0 0 20px #00ffcc;
    animation: jarvisPulse 1.5s ease-in-out infinite;
}

/* Animação de pulso para o modo listening */
@keyframes pulseGlow {
    0% {
        box-shadow: 0 0 0 0 rgba(40, 123, 255, 0.7);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 0 15px rgba(40, 123, 255, 0);
        transform: scale(1.05);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(40, 123, 255, 0);
        transform: scale(1);
    }
}

/* Animação para o modo Jarvis contínuo */
@keyframes jarvisPulse {
    0% {
        box-shadow: 0 0 0 0 #00ffcc, 0 0 10px #00ffcc;
        border-color: #00ffcc;
    }
    50% {
        box-shadow: 0 0 0 12px rgba(0, 255, 204, 0.3), 0 0 25px #00ffcc;
        border-color: #ffffff;
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 255, 204, 0), 0 0 10px #00ffcc;
        border-color: #00ffcc;
    }
}

/* =========================
   INDICADOR FLUTUANTE DO MODO JARVIS
   ========================= */
.jarvis-indicator {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 50px;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border: 1px solid #00ffcc;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.jarvis-indicator.active {
    opacity: 1;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

.jarvis-dot {
    width: 10px;
    height: 10px;
    background: #00ffcc;
    border-radius: 50%;
    animation: dotPulse 1s infinite;
}

@keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}

.jarvis-wave {
    display: flex;
    gap: 3px;
    align-items: center;
}

.jarvis-wave span {
    width: 3px;
    height: 12px;
    background: #00ffcc;
    border-radius: 2px;
    animation: wave 0.8s ease infinite alternate;
}

.jarvis-wave span:nth-child(1) { animation-delay: 0s; height: 8px; }
.jarvis-wave span:nth-child(2) { animation-delay: 0.1s; height: 14px; }
.jarvis-wave span:nth-child(3) { animation-delay: 0.2s; height: 18px; }
.jarvis-wave span:nth-child(4) { animation-delay: 0.3s; height: 14px; }

@keyframes wave {
    from { transform: scaleY(0.6); opacity: 0.5; }
    to { transform: scaleY(1.2); opacity: 1; }
}

.jarvis-text {
    color: #00ffcc;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
}

.jarvis-command {
    color: rgba(255,255,255,0.6);
    font-size: 11px;
}

@media (max-width: 768px) {
    .jarvis-indicator {
        bottom: 20px;
        padding: 8px 16px;
        gap: 8px;
    }
    .jarvis-text {
        font-size: 11px;
    }
    .jarvis-command {
        display: none;
    }
}

/* =========================
   ÍCONES DENTRO DO BOTÃO DE VOZ
   ========================= */
.brain-icon, .mic-icon {
    transition: all 0.3s ease;
}

.voice-icon .mic-icon {
    opacity: 0;
    transform: scale(0.8);
    position: absolute;
}

.voice-icon.listening .brain-icon,
.voice-icon.continuous-mode .brain-icon {
    opacity: 0;
    transform: scale(0.8);
}

.voice-icon.listening .mic-icon,
.voice-icon.continuous-mode .mic-icon {
    opacity: 1;
    transform: scale(1);
}