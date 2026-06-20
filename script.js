// =========================
// ASURAS - TAROT COM EFEITOS COMPLETOS
// =========================

const items = document.querySelectorAll(".item");
const slider = document.querySelector(".slider");

// =========================
// INFORMAÇÕES DAS CARTAS DE TAROT
// =========================

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

// =========================
// APLICAR ESTILO TAROT NOS CARDS
// =========================

items.forEach(item => {
    const asura = item.dataset.asura;
    const info = tarotInfo[asura];
    
    if (info) {
        item.classList.add('tarot-card');
        
        // Número da carta
        const numberSpan = document.createElement('span');
        numberSpan.className = 'tarot-number';
        numberSpan.textContent = info.number;
        item.appendChild(numberSpan);
        
        // Nome da carta
        const nameSpan = document.createElement('span');
        nameSpan.className = 'tarot-name';
        nameSpan.textContent = info.name;
        item.appendChild(nameSpan);
        
        // Símbolos dos cantos
        const positions = ['tl', 'tr', 'bl', 'br'];
        info.symbols.forEach((sym, i) => {
            const symSpan = document.createElement('span');
            symSpan.className = `tarot-symbol ${positions[i]}`;
            symSpan.textContent = sym;
            item.appendChild(symSpan);
        });
        
        // RUNAS NAS BORDAS
        const runePositions = ['top', 'right', 'bottom', 'left'];
        info.runes.forEach((rune, i) => {
            const runeSpan = document.createElement('span');
            runeSpan.className = `rune ${runePositions[i]}`;
            runeSpan.textContent = rune;
            item.appendChild(runeSpan);
        });
        
        // Runas nos cantos (extra)
        const cornerRunas = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ'];
        const cornerPositions = ['corner-tl', 'corner-tr', 'corner-bl', 'corner-br'];
        cornerRunas.forEach((rune, i) => {
            const runeSpan = document.createElement('span');
            runeSpan.className = `rune ${cornerPositions[i]}`;
            runeSpan.textContent = rune;
            runeSpan.style.fontSize = '10px';
            item.appendChild(runeSpan);
        });
        
        // CAMADA HOLOGRÁFICA
        const holoLayer = document.createElement('div');
        holoLayer.className = 'holo-layer';
        item.appendChild(holoLayer);
        
        // PARTÍCULAS DA CARTA
        createCardParticles(item);
    }
});

// =========================
// PARTÍCULAS DA CARTA TAROT
// =========================

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

// =========================
// CORES DINÂMICAS
// =========================

items.forEach(item => {
    const color = item.dataset.color;
    item.style.setProperty("--glow-color", color);
});

// =========================
// SOM HOVER
// =========================

const hoverSound = document.getElementById("hoverSound");

items.forEach(item => {
    item.addEventListener("mouseenter", () => {
        if(!hoverSound) return;
        hoverSound.volume = 0.12;
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
});

// =========================
// PARTICLES BACKGROUND
// =========================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

const particles = [];
const particleCount = 120;

for(let i = 0; i < particleCount; i++){
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5
    });
}

function drawParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if(particle.x < 0 || particle.x > canvas.width){
            particle.speedX *= -1;
        }
        if(particle.y < 0 || particle.y > canvas.height){
            particle.speedY *= -1;
        }
    });
    
    requestAnimationFrame(drawParticles);
}

drawParticles();

window.addEventListener("resize", () => {
    resizeCanvas();
});

// =========================
// AMBIENT MUSIC
// =========================

const bgMusic = document.getElementById("bgMusic");

if(bgMusic){
    bgMusic.volume = 0;
    bgMusic.play()
        .then(() => {
            setTimeout(() => {
                bgMusic.volume = 0.12;
            }, 800);
        })
        .catch(() => {
            window.addEventListener("click", handleFirstInteraction, { once: true });
            window.addEventListener("touchstart", handleFirstInteraction, { once: true });
        });
}

function handleFirstInteraction(){
    if(!bgMusic) return;
    bgMusic.volume = 0.12;
    bgMusic.play().catch(() => {});
}

// =========================
// PORTAL TRANSITION
// =========================

const portalTransition = document.getElementById("portalTransition");
let transitioning = false;

// =========================
// CLICK ASURA
// =========================

items.forEach(item => {
    item.addEventListener("click", () => {
        if(transitioning) return;
        transitioning = true;
        const asura = item.dataset.asura;
        startAsuraTransition(item, asura);
    });
});

// =========================
// START TRANSITION
// =========================

function startAsuraTransition(selectedItem, asura){
    slider.style.animationPlayState = "paused";
    
    if(hoverSound){
        hoverSound.volume = 0.2;
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    }
    
    if(bgMusic){
        const fadeAudio = setInterval(() => {
            if(bgMusic.volume > 0.02){
                bgMusic.volume -= 0.01;
            }else{
                bgMusic.volume = 0;
                clearInterval(fadeAudio);
            }
        }, 40);
    }
    
    slider.classList.add("fade-all");
    selectedItem.classList.add("active");
    
    document.body.style.transition = "transform 1.6s ease";
    document.body.style.transform = "scale(1.03)";
    
    if(portalTransition){
        portalTransition.classList.add("active");
    }
    
    createPortalFlash(selectedItem.dataset.color);
    
    console.log("Entrando no mundo:", asura);
    
    setTimeout(() => {
        window.location.href = `worlds/${asura}.html`;
    }, 2200);
}

// =========================
// FLASH PORTAL
// =========================

function createPortalFlash(color){
    const flash = document.createElement("div");
    flash.className = "portal-flash";
    flash.style.setProperty("--flash-color", color);
    document.body.appendChild(flash);
    
    requestAnimationFrame(() => {
        flash.classList.add("show");
    });
    
    setTimeout(() => {
        flash.classList.remove("show");
        setTimeout(() => {
            flash.remove();
        }, 1000);
    }, 900);
}