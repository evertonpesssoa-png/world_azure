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