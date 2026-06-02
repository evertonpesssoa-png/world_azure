// ============================================
// 🗝️ HÉCATE - FIREWALL PRINCIPAL
// Deusa da Magia e Proteção do World Azure
// Integra todos os módulos do sistema
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // DETECTAR MÓDULOS (com fallback para nomes antigos)
    // ============================================
    
    const Core = typeof HecateCore !== 'undefined' ? HecateCore :
                 (typeof ObscuratilCore !== 'undefined' ? ObscuratilCore : null);
    
    const Events = typeof HecateEvents !== 'undefined' ? HecateEvents :
                   (typeof ObscuratilEvents !== 'undefined' ? ObscuratilEvents : null);
    
    const BlockMgr = typeof HecateBlock !== 'undefined' ? HecateBlock :
                     (typeof BlockManager !== 'undefined' ? BlockManager : null);
    
    const Feedback = typeof HecateFeedback !== 'undefined' ? HecateFeedback :
                      (typeof ObscuratilFeedback !== 'undefined' ? ObscuratilFeedback : null);
    
    const TestSys = typeof HecateTest !== 'undefined' ? HecateTest :
                     (typeof ObscuratilTest !== 'undefined' ? ObscuratilTest : null);
    
    const InteractionMgr = typeof InteractionManager !== 'undefined' ? InteractionManager : null;
    
    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    
    const CONFIG = {
        AUTO_ACTIVATE_DELAY: 10000,  // 10 segundos sem interação ativa automaticamente
        TEST_DELAY: 1500,            // Delay antes de mostrar teste
        FADE_DURATION: 500,          // Duração das animações
        BLOCK_CHECK_INTERVAL: 60000   // Verificar bloqueio a cada minuto
    };
    
    // ============================================
    // ESTADO
    // ============================================
    
    let initialized = false;
    let testActive = false;
    let testPassed = false;
    let autoActivateTimeout = null;
    
    // ============================================
    // FUNÇÕES PRINCIPAIS
    // ============================================
    
    async function init() {
        if (initialized) return;
        
        console.log('🗝️ HÉCATE - Firewall Mágico do World Azure');
        console.log('🌙 Deusa da Magia, Encruzilhadas e Proteção');
        
        // 1. Inicializar feedback visual
        if (Feedback && Feedback.init) {
            Feedback.init();
            if (Feedback.addStyles) Feedback.addStyles();
        }
        
        // 2. Verificar autenticação
        if (Core && Core.isAuthenticated && Core.isAuthenticated()) {
            console.log('✅ Grimório liberado. Bem-vindo, Guardião!');
            testPassed = true;
            
            // Garantir que os cards estão visíveis
            liberarCards();
            return;
        }
        
        // 3. Verificar bloqueio
        if (BlockMgr && BlockMgr.isBlocked) {
            const blockStatus = BlockMgr.isBlocked();
            if (blockStatus.blocked) {
                console.log(`🔒 Hécate: Sistema bloqueado por ${blockStatus.remainingHours} horas`);
                mostrarTelaBloqueio(blockStatus);
                return;
            }
        }
        
        // 4. Inicializar Interaction Manager
        if (InteractionMgr && InteractionMgr.init) {
            InteractionMgr.init();
            
            // Aguardar primeira interação do usuário
            if (Events && Events.on) {
                Events.on('user:firstInteraction', (data) => {
                    console.log('👆 Primeira interação detectada!', data);
                    ativarFirewall();
                });
                
                // Fallback: se não houver interação, ativar automaticamente
                autoActivateTimeout = setTimeout(() => {
                    if (!testActive && !testPassed) {
                        console.log('⏰ Timeout - ativando firewall automaticamente');
                        ativarFirewall();
                    }
                }, CONFIG.AUTO_ACTIVATE_DELAY);
            }
        }
        
        initialized = true;
    }
    
    function ativarFirewall() {
        if (testActive || testPassed) return;
        
        testActive = true;
        
        // Limpar timeout automático
        if (autoActivateTimeout) {
            clearTimeout(autoActivateTimeout);
            autoActivateTimeout = null;
        }
        
        // Bloquear cards visualmente
        bloquearCards();
        
        // Mostrar mensagem
        if (Feedback && Feedback.info) {
            Feedback.info('🔐 HÉCATE: Ativando firewall...', 1500);
        }
        
        // Pequeno delay antes de mostrar o teste
        setTimeout(() => {
            mostrarTeste();
        }, CONFIG.TEST_DELAY);
    }
    
    function bloquearCards() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.4';
            item.style.filter = 'blur(2px)';
            item.style.transition = `all ${CONFIG.FADE_DURATION}ms ease`;
        });
    }
    
    function liberarCards() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.pointerEvents = '';
            item.style.opacity = '';
            item.style.filter = '';
        });
    }
    
    function mostrarTeste() {
        if (TestSys && TestSys.show) {
            TestSys.show((success) => {
                if (success) {
                    aoPassarTeste();
                } else {
                    aoFalharTeste();
                }
            });
        } else {
            console.error('❌ Sistema de teste não encontrado!');
            // Fallback: liberar para não quebrar
            aoPassarTeste();
        }
    }
    
    function aoPassarTeste() {
        testPassed = true;
        testActive = false;
        
        // Salvar autenticação
        if (Core && Core.setAuthenticated) {
            Core.setAuthenticated();
        }
        
        // Resetar bloqueios
        if (BlockMgr) {
            if (BlockMgr.resetBlockCount) BlockMgr.resetBlockCount();
            if (BlockMgr.resetAttempts) BlockMgr.resetAttempts();
        }
        
        // Liberar cards
        liberarCards();
        
        // Mostrar mensagem de sucesso
        if (Feedback && Feedback.success) {
            Feedback.success('🔓 HÉCATE DESTRAVADA! Bem-vindo ao World Azure!', 4000);
        }
        
        // Recriar handlers dos Asuras
        recriarHandlersAsuras();
        
        // Emitir evento global
        if (Events && Events.emit) {
            Events.emit('hecate:unlocked', { timestamp: Date.now() });
        }
        
        console.log('✅ Hécate: Firewall destravado! Acesso liberado.');
    }
    
    function aoFalharTeste() {
        testActive = false;
        
        // Verificar se está bloqueado
        if (BlockMgr && BlockMgr.isBlocked) {
            const blockStatus = BlockMgr.isBlocked();
            if (blockStatus.blocked) {
                mostrarTelaBloqueio(blockStatus);
                
                // Manter cards bloqueados
                const items = document.querySelectorAll('.item');
                items.forEach(item => {
                    item.style.opacity = '0.2';
                });
                return;
            }
        }
        
        // Liberar cards para nova tentativa
        liberarCards();
        
        // Resetar Interaction Manager para nova tentativa
        if (InteractionMgr && InteractionMgr.resetInteraction) {
            InteractionMgr.resetInteraction();
        }
        
        if (Feedback && Feedback.warning) {
            Feedback.warning('⚠️ Teste falhou. Toque em qualquer lugar para tentar novamente.', 3000);
        }
    }
    
    function mostrarTelaBloqueio(blockStatus) {
        const hours = blockStatus.remainingHours;
        const hoursText = hours >= 24 ? `${Math.floor(hours/24)} dias` : `${hours} horas`;
        
        // Remover tela anterior se existir
        const existingBlocker = document.getElementById('hecate-blocker');
        if (existingBlocker) existingBlocker.remove();
        
        const blocker = document.createElement('div');
        blocker.id = 'hecate-blocker';
        blocker.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(ellipse at center, #0a0a0a, #000000);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            animation: fadeIn 0.5s ease;
        `;
        
        blocker.innerHTML = `
            <div style="background: rgba(0,0,0,0.95); border: 2px solid #9b30ff; border-radius: 30px; padding: 40px; max-width: 400px;">
                <div style="font-size: 80px;">🗝️</div>
                <h2 style="color: #9b30ff;">HÉCATE - FIREWALL</h2>
                <p style="color: #aaa; margin: 20px 0;">A Deusa da Magia bloqueou este acesso.</p>
                <div style="background: rgba(155,48,255,0.1); border-radius: 15px; padding: 15px; margin: 20px 0;">
                    <div style="font-size: 12px; color: #9b30ff;">BLOQUEIO #${blockStatus.blockCount}</div>
                    <div style="font-size: 36px; color: #ffd700; font-weight: bold;">${hoursText}</div>
                    <div style="font-size: 12px; color: #aaa;">Tempo restante</div>
                </div>
                <p style="color: #888; font-size: 12px;">O tempo dobra a cada bloqueio.</p>
                <button onclick="location.reload()" style="
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #9b30ff, #ff3300);
                    border: none;
                    border-radius: 30px;
                    color: white;
                    cursor: pointer;
                ">⟳ VERIFICAR NOVAMENTE</button>
            </div>
        `;
        
        document.body.appendChild(blocker);
        document.body.style.overflow = 'hidden';
        
        // Verificar periodicamente se o bloqueio expirou
        const checkInterval = setInterval(() => {
            if (BlockMgr && BlockMgr.isBlocked) {
                const newStatus = BlockMgr.isBlocked();
                if (!newStatus.blocked) {
                    clearInterval(checkInterval);
                    location.reload();
                }
            }
        }, CONFIG.BLOCK_CHECK_INTERVAL);
    }
    
    function recriarHandlersAsuras() {
        // Preservar funcionalidade original do grimório
        const items = document.querySelectorAll(".item");
        const slider = document.querySelector(".slider");
        const hoverSound = document.getElementById("hoverSound");
        const bgMusic = document.getElementById("bgMusic");
        const portalTransition = document.getElementById("portalTransition");
        
        let transitioning = false;
        
        function createPortalFlash(color) {
            const flash = document.createElement("div");
            flash.className = "portal-flash";
            flash.style.setProperty("--flash-color", color);
            document.body.appendChild(flash);
            requestAnimationFrame(() => flash.classList.add("show"));
            setTimeout(() => {
                flash.classList.remove("show");
                setTimeout(() => flash.remove(), 1000);
            }, 900);
        }
        
        function startAsuraTransition(selectedItem, asura) {
            if (typeof PortalAuth !== 'undefined') {
                PortalAuth.generateToken(asura);
            }
            
            if (slider) slider.style.animationPlayState = "paused";
            
            if (hoverSound) {
                hoverSound.volume = 0.2;
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            }
            
            if (bgMusic) {
                const fadeAudio = setInterval(() => {
                    if (bgMusic.volume > 0.02) {
                        bgMusic.volume -= 0.01;
                    } else {
                        bgMusic.volume = 0;
                        clearInterval(fadeAudio);
                    }
                }, 40);
            }
            
            if (slider) slider.classList.add("fade-all");
            selectedItem.classList.add("active");
            
            document.body.style.transition = "transform 1.6s ease";
            document.body.style.transform = "scale(1.03)";
            
            if (portalTransition) portalTransition.classList.add("active");
            
            createPortalFlash(selectedItem.dataset.color);
            
            setTimeout(() => {
                window.location.href = `viagem.html?asura=${asura}`;
            }, 2200);
        }
        
        // Remover listeners antigos e adicionar novos
        items.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            const color = newItem.dataset.color;
            if (color) newItem.style.setProperty("--glow-color", color);
            
            newItem.addEventListener("click", () => {
                if (transitioning) return;
                transitioning = true;
                const asura = newItem.dataset.asura;
                startAsuraTransition(newItem, asura);
            });
            
            if (hoverSound) {
                newItem.addEventListener("mouseenter", () => {
                    hoverSound.volume = 0.12;
                    hoverSound.currentTime = 0;
                    hoverSound.play().catch(() => {});
                });
            }
        });
    }
    
    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exportar API pública
    window.HecateFirewall = {
        init,
        activate: ativarFirewall,
        isActive: () => testActive,
        isUnlocked: () => testPassed,
        reset: () => {
            testActive = false;
            testPassed = false;
            liberarCards();
        }
    };
    
})();