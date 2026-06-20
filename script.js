(function() {
    const items = document.querySelectorAll(".item");
    const slider = document.querySelector(".slider");
    const hoverSound = document.getElementById("hoverSound");
    const bgMusic = document.getElementById("bgMusic");
    const portalTransition = document.getElementById("portalTransition");

    // ============================================
    // 🎴 INFORMAÇÕES DAS CARTAS DE TAROT
    // ============================================

    const tarotInfo = {
        'diva': {
            number: 'I',
            name: 'A ILUSIONISTA',
            symbols: ['🌀', '✦', '🌀', '✦'],
            runes: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ']
        },
        'siria': {
            number: 'VII',
            name: 'A FORTUNA',
            symbols: ['🌳', '💰', '🌳', '💰'],
            runes: ['ᚱ', 'ᚲ', 'ᚷ', 'ᚹ']
        },
        'astreia': {
            number: 'XII',
            name: 'A PROTETORA',
            symbols: ['🛡️', '⚔️', '🛡️', '⚔️'],
            runes: ['ᚺ', 'ᚾ', 'ᛁ', 'ᛃ']
        },
        'merlim': {
            number: 'V',
            name: 'A FEITICEIRA',
            symbols: ['⚗️', '🔮', '⚗️', '🔮'],
            runes: ['ᛈ', 'ᛇ', 'ᛉ', 'ᛊ']
        },
        'umbra': {
            number: 'XIII',
            name: 'A CAÇADORA',
            symbols: ['🗡️', '🎯', '🗡️', '🎯'],
            runes: ['ᛏ', 'ᛒ', 'ᛖ', 'ᛗ']
        },
        'atena': {
            number: 'III',
            name: 'A MESTRA',
            symbols: ['📚', '🦉', '📚', '🦉'],
            runes: ['ᛚ', 'ᛝ', 'ᛟ', 'ᛞ']
        },
        'victoria': {
            number: 'VI',
            name: 'A GENERAL',
            symbols: ['⚔️', '🏛️', '⚔️', '🏛️'],
            runes: ['ᚪ', 'ᚫ', 'ᚣ', 'ᛡ']
        },
        'hestia': {
            number: 'XV',
            name: 'A ORÁCULO',
            symbols: ['🔮', '👁️', '🔮', '👁️'],
            runes: ['ᛠ', 'ᛢ', 'ᛣ', 'ᛤ']
        },
        'daedala': {
            number: 'IV',
            name: 'A INVENTORA',
            symbols: ['⚙️', '🔧', '⚙️', '🔧'],
            runes: ['ᛥ', 'ᛦ', 'ᛧ', 'ᛨ']
        }
    };

    // ============================================
    // 🎴 APLICAR ESTILO TAROT NOS CARDS
    // ============================================

    items.forEach(item => {
        const asura = item.dataset.asura;
        const info = tarotInfo[asura];

        if (info) {
            item.classList.add('tarot-card');

            const numberSpan = document.createElement('span');
            numberSpan.className = 'tarot-number';
            numberSpan.textContent = info.number;
            item.appendChild(numberSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'tarot-name';
            nameSpan.textContent = info.name;
            item.appendChild(nameSpan);

            const positions = ['tl', 'tr', 'bl', 'br'];
            info.symbols.forEach((sym, i) => {
                const symSpan = document.createElement('span');
                symSpan.className = `tarot-symbol ${positions[i]}`;
                symSpan.textContent = sym;
                item.appendChild(symSpan);
            });

            const runePositions = ['top', 'right', 'bottom', 'left'];
            info.runes.forEach((rune, i) => {
                const runeSpan = document.createElement('span');
                runeSpan.className = `rune ${runePositions[i]}`;
                runeSpan.textContent = rune;
                item.appendChild(runeSpan);
            });

            const cornerRunas = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ'];
            const cornerPositions = ['corner-tl', 'corner-tr', 'corner-bl', 'corner-br'];
            cornerRunas.forEach((rune, i) => {
                const runeSpan = document.createElement('span');
                runeSpan.className = `rune ${cornerPositions[i]}`;
                runeSpan.textContent = rune;
                runeSpan.style.fontSize = '10px';
                item.appendChild(runeSpan);
            });

            const holoLayer = document.createElement('div');
            holoLayer.className = 'holo-layer';
            item.appendChild(holoLayer);

            createCardParticles(item);
        }
    });

    // ============================================
    // 💫 PARTÍCULAS DA CARTA TAROT
    // ============================================

    function createCardParticles(item) {
        const container = document.createElement('div');
        container.className = 'particle-container';
        item.appendChild(container);

        setInterval(() => {
            if (item.classList.contains('fade-all') || item.classList.contains('active')) return;
            if (item.style.opacity === '0' || item.style.opacity === '0.08') return;

            const rect = item.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const count = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30 + 10;
                const startX = centerX + Math.cos(angle) * distance - 2;
                const startY = centerY + Math.sin(angle) * distance - 2;

                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';

                const dirAngle = Math.random() * Math.PI * 2;
                const speed = 20 + Math.random() * 40;
                const tx = Math.cos(dirAngle) * speed;
                const ty = Math.sin(dirAngle) * speed;

                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                particle.style.setProperty('--glow-color', item.dataset.color);

                const size = 2 + Math.random() * 4;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = item.dataset.color;
                particle.style.boxShadow = `0 0 ${size * 2}px ${item.dataset.color}`;

                container.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }
        }, 400);
    }

    // ============================================
    // 🎨 CORES DINÂMICAS
    // ============================================

    items.forEach(item => {
        const color = item.dataset.color;
        item.style.setProperty("--glow-color", color);
    });

    // ============================================
    // 🔊 SOM HOVER
    // ============================================

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (hoverSound) {
                hoverSound.volume = 0.12;
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => {});
            }
        });
    });

    // ============================================
    // ✨ PARTÍCULAS BACKGROUND
    // ============================================

    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // ============================================
    // 🎵 MÚSICA AMBIENTE
    // ============================================

    if (bgMusic) {
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            setTimeout(() => bgMusic.volume = 0.12, 800);
        }).catch(() => {
            window.addEventListener("click", () => { bgMusic.volume = 0.12;
                bgMusic.play(); }, { once: true });
            window.addEventListener("touchstart", () => { bgMusic.volume = 0.12;
                bgMusic.play(); }, { once: true });
        });
    }

    // ============================================
    // 🌌 TRANSIÇÃO PORTAL
    // ============================================

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

    // ============================================
    // 🚀 START TRANSITION - EFEITO "ENTRANDO NA CARTA"
    // ============================================

    function startAsuraTransition(selectedItem, asura) {
        if (transitioning) return;
        transitioning = true;

        const color = selectedItem.dataset.color;

        // ============================================
        // DETECTAR DISPOSITIVO
        // ============================================

        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isSmallMobile = window.innerWidth <= 480;
        const isLargeScreen = window.innerWidth >= 1920;

        let sparkCount = 60;
        let sparkSize = [2, 6];
        let animationDuration = 2400;
        let flashDelay = 1500;
        let overlayDelay = 300;

        if (isSmallMobile) {
            sparkCount = 25;
            sparkSize = [1, 3];
            animationDuration = 2000;
            flashDelay = 1000;
            overlayDelay = 200;
        } else if (isMobile) {
            sparkCount = 35;
            sparkSize = [1, 4];
            animationDuration = 2100;
            flashDelay = 1200;
            overlayDelay = 250;
        } else if (isTablet) {
            sparkCount = 45;
            sparkSize = [2, 5];
            animationDuration = 2200;
            flashDelay = 1300;
            overlayDelay = 280;
        } else if (isLargeScreen) {
            sparkCount = 80;
            sparkSize = [3, 8];
            animationDuration = 2600;
            flashDelay = 1700;
            overlayDelay = 350;
        }

        // ============================================
        // 1. CONGELAR CARROSSEL
        // ============================================

        if (slider) slider.style.animationPlayState = "paused";

        // ============================================
        // 2. SOM DO PORTAL
        // ============================================

        if (hoverSound) {
            hoverSound.volume = isMobile ? 0.15 : 0.25;
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        }

        // ============================================
        // 3. FADE DA MÚSICA
        // ============================================

        if (bgMusic) {
            const fadeAudio = setInterval(() => {
                if (bgMusic.volume > 0.02) {
                    bgMusic.volume -= isMobile ? 0.02 : 0.015;
                } else {
                    bgMusic.volume = 0;
                    clearInterval(fadeAudio);
                }
            }, isMobile ? 20 : 30);
        }

        // ============================================
        // 4. APLICAR EXPANSÃO NA CARTA
        // ============================================

        if (slider) slider.classList.add("fade-all");
        selectedItem.classList.add("active");
        selectedItem.classList.add("portal-expanding");

        // ============================================
        // 5. CRIAR OVERLAY
        // ============================================

        const overlay = document.createElement('div');
        overlay.className = 'portal-overlay';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('active');
        }, overlayDelay);

        // ============================================
        // 6. CRIAR PARTÍCULAS DO PORTAL
        // ============================================

        const sparkColors = [color, '#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4'];
        const centerOffset = isMobile ? 15 : 20;

        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'portal-spark';
            
            const size = sparkSize[0] + Math.random() * (sparkSize[1] - sparkSize[0]);
            const angle = Math.random() * Math.PI * 2;
            const distance = isMobile ? (50 + Math.random() * 150) : (100 + Math.random() * 300);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            spark.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${sparkColors[Math.floor(Math.random() * sparkColors.length)]};
                top: ${50 + (Math.random() - 0.5) * centerOffset}%;
                left: ${50 + (Math.random() - 0.5) * centerOffset}%;
                box-shadow: 0 0 ${size * (isMobile ? 2 : 3)}px ${color};
                --tx: ${tx}px;
                --ty: ${ty}px;
                animation-delay: ${Math.random() * (isMobile ? 0.5 : 0.8)}s;
                animation-duration: ${(isMobile ? 1.2 : 1.5) + Math.random() * (isMobile ? 0.8 : 1)}s;
            `;
            document.body.appendChild(spark);
            
            setTimeout(() => spark.remove(), isMobile ? 2500 : 3000);
        }

        // ============================================
        // 7. FLASH BRANCO
        // ============================================

        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, white, transparent 70%);
            z-index: 99999;
            opacity: 0;
            pointer-events: none;
            transition: opacity ${isMobile ? '0.3s' : '0.5s'} ease;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = isMobile ? '0.4' : '0.6';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => flash.remove(), 300);
            }, isMobile ? 200 : 300);
        }, flashDelay);

        // ============================================
        // 8. CRIAR FLASH DO PORTAL (ORIGINAL)
        // ============================================

        createPortalFlash(color);

        // ============================================
        // 9. BODY SCALE
        // ============================================

        document.body.style.transition = "transform 1.6s ease";
        document.body.style.transform = isMobile ? "scale(1.01)" : "scale(1.03)";

        // ============================================
        // 10. PORTAL TRANSITION (ORIGINAL)
        // ============================================

        if (portalTransition) portalTransition.classList.add("active");

        // ============================================
        // 11. LOG E REDIRECIONAMENTO
        // ============================================

        console.log(`🚀 Entrando no mundo: ${asura} (${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'})`);

        setTimeout(() => {
            window.location.href = "/world_azure/viagem.html?asura=" + asura;
        }, animationDuration);
    }

    // ============================================
    // 🔥 HÉCATE - SISTEMA DE BLOQUEIO E TESTE (CORRIGIDO)
    // ============================================

    // Função para liberar os cards
    function liberarCards() {
        console.log('🔓 Liberando cards...');
        items.forEach(item => {
            item.classList.remove('hecate-blocked');
            item.style.pointerEvents = "";
            item.style.opacity = "";
            item.style.filter = "";
            item.removeEventListener('click', handleCardClick);
            item.addEventListener('click', handleCardClick);
        });
    }

    // Função para bloquear os cards
    function bloquearCards() {
        console.log('🔒 Bloqueando cards...');
        items.forEach(item => {
            item.classList.add('hecate-blocked');
            item.style.pointerEvents = "none";
            item.style.opacity = "0.4";
            item.style.filter = "blur(2px)";
            item.removeEventListener('click', handleCardClick);
        });
    }

    // Handler do clique nos cards
    function handleCardClick(e) {
        const item = e.currentTarget;
        startAsuraTransition(item, item.dataset.asura);
    }

    // ============================================
    // EXECUTAR HÉCATE (COM DELAY PARA GARANTIR)
    // ============================================

    setTimeout(function() {
        console.log('🔍 Verificando autenticação...');
        console.log('localStorage hecate_auth_complete:', localStorage.getItem('hecate_auth_complete'));
        console.log('HecateTest:', typeof HecateTest);

        if (localStorage.getItem('hecate_auth_complete') === 'true') {
            console.log('✅ Usuário já autenticado - Liberando cards');
            liberarCards();
        } else {
            console.log('🔒 Usuário NÃO autenticado - Bloqueando cards');
            bloquearCards();

            let testeAtivo = false;

            function ativarHecate() {
                if (testeAtivo) return;
                testeAtivo = true;

                console.log('🔥 Ativando Hécate...');
                document.body.removeEventListener('click', ativarHecate);
                document.body.removeEventListener('touchstart', ativarHecate);

                if (typeof HecateTest !== 'undefined' && HecateTest.show) {
                    console.log('✅ HecateTest encontrado! Mostrando teste...');
                    HecateTest.show(function(success) {
                        console.log('📝 Resultado do teste:', success);
                        if (success) {
                            console.log('✅ Teste aprovado! Liberando cards...');
                            localStorage.setItem('hecate_auth_complete', 'true');
                            liberarCards();
                        } else {
                            console.log('❌ Teste falhou');
                            testeAtivo = false;
                            document.body.addEventListener('click', ativarHecate);
                            document.body.addEventListener('touchstart', ativarHecate);
                        }
                    });
                } else {
                    console.error('❌ HecateTest NÃO encontrado!');
                    console.warn('⚠️ Fallback: Liberando cards sem teste');
                    liberarCards();
                }
            }

            document.body.addEventListener('click', ativarHecate);
            document.body.addEventListener('touchstart', ativarHecate);
            console.log('🗝️ Hécate: Toque na tela para ativar o teste');
        }
    }, 200);

})();