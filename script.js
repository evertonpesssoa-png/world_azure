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
    // ✨ PARTÍCULAS BACKGROUND - ROXAS!
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
            // 🔥 COR ROXA NAS PARTÍCULAS DO FUNDO
            ctx.fillStyle = `rgba(160, 80, 255, ${p.opacity})`;
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
    // 🚀 START TRANSITION - CLONE COM TODOS OS EFEITOS (4 SEGUNDOS)
    // ============================================

    function startAsuraTransition(selectedItem, asura) {
        if (transitioning) return;
        transitioning = true;

        const glowColor = selectedItem.dataset.color;
        const imgSrc = selectedItem.querySelector('img').src;

        // Pegar TODOS os elementos da carta original
        const numberSpan = selectedItem.querySelector('.tarot-number');
        const nameSpan = selectedItem.querySelector('.tarot-name');
        const symbolSpans = selectedItem.querySelectorAll('.tarot-symbol');
        const runeSpans = selectedItem.querySelectorAll('.rune');
        
        const number = numberSpan ? numberSpan.textContent : '?';
        const name = nameSpan ? nameSpan.textContent : '?';
        
        const symbols = [];
        const runes = [];
        symbolSpans.forEach(el => symbols.push(el.textContent));
        runeSpans.forEach(el => runes.push(el.textContent));

        // ============================================
        // 1. CRIAR CLONE COM TODOS OS EFEITOS
        // ============================================

        const clone = document.createElement('div');
        clone.className = 'portal-card-fullscreen';
        clone.style.setProperty('--glow-color', glowColor);

        // Imagem
        const img = document.createElement('img');
        img.src = imgSrc;
        clone.appendChild(img);

        // Número
        const numClone = document.createElement('span');
        numClone.className = 'tarot-number-full';
        numClone.textContent = number;
        clone.appendChild(numClone);

        // Nome
        const nameClone = document.createElement('span');
        nameClone.className = 'tarot-name-full';
        nameClone.textContent = name;
        clone.appendChild(nameClone);

        // Símbolos dos cantos
        const symbolPositions = ['tl', 'tr', 'bl', 'br'];
        symbols.forEach((sym, i) => {
            if (i < 4) {
                const symClone = document.createElement('span');
                symClone.className = `tarot-symbol-full ${symbolPositions[i]}`;
                symClone.textContent = sym;
                clone.appendChild(symClone);
            }
        });

        // Runas das bordas
        const runePositions = ['top', 'right', 'bottom', 'left'];
        runes.forEach((rune, i) => {
            if (i < 4) {
                const runeClone = document.createElement('span');
                runeClone.className = `rune-full ${runePositions[i]}`;
                runeClone.textContent = rune;
                clone.appendChild(runeClone);
            }
        });

        // Holograma
        const holoClone = document.createElement('div');
        holoClone.className = 'holo-layer-full';
        clone.appendChild(holoClone);

        document.body.appendChild(clone);

        // ============================================
        // 2. CONGELAR CARROSSEL
        // ============================================

        if (slider) slider.style.animationPlayState = "paused";
        if (slider) slider.classList.add("fade-all");
        selectedItem.classList.add("active");

        // ============================================
        // 3. SOM DO PORTAL
        // ============================================

        if (hoverSound) {
            hoverSound.volume = 0.2;
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        }

        // ============================================
        // 4. FADE DA MÚSICA
        // ============================================

        if (bgMusic) {
            const fadeAudio = setInterval(() => {
                if (bgMusic.volume > 0.02) {
                    bgMusic.volume -= 0.015;
                } else {
                    bgMusic.volume = 0;
                    clearInterval(fadeAudio);
                }
            }, 30);
        }

        // ============================================
        // 5. FLASH BRANCO
        // ============================================

        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, white, transparent 70%);
            z-index: 99999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0.5';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => flash.remove(), 300);
            }, 300);
        }, 2000);

        // ============================================
        // 6. CRIAR FLASH DO PORTAL (ORIGINAL)
        // ============================================

        createPortalFlash(glowColor);

        // ============================================
        // 7. BODY SCALE
        // ============================================

        document.body.style.transition = "transform 1.6s ease";
        document.body.style.transform = "scale(1.03)";
        if (portalTransition) portalTransition.classList.add("active");

        // ============================================
        // 8. REMOVER CLONE E REDIRECIONAR (4 SEGUNDOS)
        // ============================================

        console.log(`🚀 Entrando no mundo: ${asura}`);

        setTimeout(() => {
            if (clone && clone.parentNode) {
                clone.style.transition = 'opacity 0.5s ease';
                clone.style.opacity = '0';
                setTimeout(() => {
                    if (clone.parentNode) clone.remove();
                }, 500);
            }
        }, 3500);

        setTimeout(() => {
            window.location.href = "/world_azure/viagem.html?asura=" + asura;
        }, 4200);
    }

    // ============================================
    // 🔥 HÉCATE - SISTEMA DE BLOQUEIO E TESTE
    // ============================================

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

    function handleCardClick(e) {
        const item = e.currentTarget;
        startAsuraTransition(item, item.dataset.asura);
    }

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