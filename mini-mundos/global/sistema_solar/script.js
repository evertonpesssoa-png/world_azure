/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS

   FUNÇÕES:
   - Estrelas de fundo
   - Partículas dos anéis de Saturno
   - Cometas / meteoros ocasionais
   - Zoom por pinça no mobile
   - Botão de pause
   - Painel interativo WZ (Sol, Lua e Planetas)
   - Modo Exploração (viagem interplanetária)
========================================================= */


/* =========================================================
   ESTRELAS DE FUNDO
========================================================= */

function createStars() {

    const container =
        document.querySelector("body");

    if (!container) return;


    for (let i = 0; i < 1000; i++) {

        const star =
            document.createElement("div");

        star.className = "star";


        /* -------------------------------------------------
           Tamanho
        ------------------------------------------------- */

        const size =
            Math.random() * 2 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";


        /* -------------------------------------------------
           Posição
        ------------------------------------------------- */

        star.style.top =
            Math.random() * 100 + "%";

        star.style.left =
            Math.random() * 100 + "%";


        /* -------------------------------------------------
           Opacidade
        ------------------------------------------------- */

        star.style.opacity =
            Math.random() * 0.7 + 0.3;


        /* -------------------------------------------------
           Delay
        ------------------------------------------------- */

        star.style.animationDelay =
            Math.random() * 5 + "s";


        container.appendChild(star);
    }
}


/* =========================================================
   PARTÍCULAS DOS ANÉIS DE SATURNO
========================================================= */

function createSaturnRingParticles() {

    const saturn =
        document.querySelector(".saturn");


    if (!saturn) return;


    /* -------------------------------------------------
       Evita duplicação
    ------------------------------------------------- */

    if (
        saturn.querySelector(
            ".saturn-particles"
        )
    ) {
        return;
    }


    /* -------------------------------------------------
       Container
    ------------------------------------------------- */

    const particleContainer =
        document.createElement("div");

    particleContainer.className =
        "saturn-particles";


    /* -------------------------------------------------
       Quantidade
    ------------------------------------------------- */

    const particleCount =
        window.innerWidth <= 768
            ? 18
            : 30;


    /* =================================================
       CRIAÇÃO
    ================================================= */

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement("span");

        particle.className =
            "saturn-particle";


        /* -------------------------------------------------
           Ângulo
        ------------------------------------------------- */

        const angle =
            Math.random() *
            Math.PI *
            2;


        /* -------------------------------------------------
           Distância
        ------------------------------------------------- */

        const radius =
            25 +
            Math.random() * 18;


        /* -------------------------------------------------
           Coordenadas
        ------------------------------------------------- */

        const x =
            Math.cos(angle) *
            radius;

        const y =
            Math.sin(angle) *
            radius *
            0.32;


        /* -------------------------------------------------
           Tamanho
        ------------------------------------------------- */

        const size =
            Math.random() *
            1.8 +
            0.7;


        /* -------------------------------------------------
           Opacidade
        ------------------------------------------------- */

        const opacity =
            Math.random() *
            0.55 +
            0.25;


        /* -------------------------------------------------
           Aplicação
        ------------------------------------------------- */

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particle.style.left =
            `calc(50% + ${x}px)`;

        particle.style.top =
            `calc(50% + ${y}px)`;


        particle.style.opacity =
            opacity;


        /* -------------------------------------------------
           Animação
        ------------------------------------------------- */

        particle.style.animationDelay =
            Math.random() * 4 + "s";

        particle.style.animationDuration =
            2.5 +
            Math.random() * 3 +
            "s";


        particleContainer.appendChild(
            particle
        );
    }


    saturn.appendChild(
        particleContainer
    );
}


/* =========================================================
   COMETAS / METEOROS OCASIONAIS

   IMPORTANTE:

   Não existe uma quantidade fixa de objetos na tela.

   Um evento é criado:
   → espera alguns segundos
   → aparece um cometa
   → atravessa o sistema
   → desaparece
   → espera novamente

   Isso mantém o espaço vivo sem parecer uma
   decoração cheia de partículas.
========================================================= */


/* ---------------------------------------------------------
   GERA UM NÚMERO ALEATÓRIO ENTRE MIN E MAX
--------------------------------------------------------- */

function randomBetween(min, max) {

    return (
        Math.random() *
        (max - min) +
        min
    );
}


/* ---------------------------------------------------------
   CRIA UM COMETA
--------------------------------------------------------- */

function createComet() {

    const container =
        document.querySelector(".container");


    if (!container) return;


    /* -------------------------------------------------
       Impede mais de um cometa simultâneo
    ------------------------------------------------- */

    if (
        container.querySelector(".comet")
    ) {
        return;
    }


    const comet =
        document.createElement("div");

    comet.className = "comet";


    /* -------------------------------------------------
       Direção aleatória

       O cometa pode atravessar:

       ↘
       ↙
       →
       ←

       sem ficar preso sempre à mesma trajetória.
    ------------------------------------------------- */

    const direction =
        Math.floor(
            Math.random() * 4
        );


    let startX;
    let startY;
    let endX;
    let endY;


    /* =================================================
       TRAJETÓRIAS
    ================================================= */

    switch (direction) {

        /* -------------------------------------------------
           Superior esquerdo → inferior direito
        ------------------------------------------------- */

        case 0:

            startX =
                randomBetween(-25, 20);

            startY =
                randomBetween(-20, 10);

            endX =
                randomBetween(80, 125);

            endY =
                randomBetween(80, 125);

            break;


        /* -------------------------------------------------
           Superior direito → inferior esquerdo
        ------------------------------------------------- */

        case 1:

            startX =
                randomBetween(80, 125);

            startY =
                randomBetween(-20, 10);

            endX =
                randomBetween(-25, 20);

            endY =
                randomBetween(80, 125);

            break;


        /* -------------------------------------------------
           Esquerda → direita
        ------------------------------------------------- */

        case 2:

            startX =
                randomBetween(-25, -10);

            startY =
                randomBetween(15, 85);

            endX =
                randomBetween(110, 125);

            endY =
                startY +
                randomBetween(-20, 20);

            break;


        /* -------------------------------------------------
           Direita → esquerda
        ------------------------------------------------- */

        default:

            startX =
                randomBetween(110, 125);

            startY =
                randomBetween(15, 85);

            endX =
                randomBetween(-25, -10);

            endY =
                startY +
                randomBetween(-20, 20);

            break;
    }


    /* -------------------------------------------------
       Ângulo da trajetória

       Usado para girar a cauda na direção correta.
    ------------------------------------------------- */

    const dx =
        endX - startX;

    const dy =
        endY - startY;

    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    /* -------------------------------------------------
       Variáveis CSS
    ------------------------------------------------- */

    comet.style.setProperty(
        "--start-x",
        startX + "%"
    );

    comet.style.setProperty(
        "--start-y",
        startY + "%"
    );

    comet.style.setProperty(
        "--end-x",
        endX + "%"
    );

    comet.style.setProperty(
        "--end-y",
        endY + "%"
    );

    comet.style.setProperty(
        "--comet-angle",
        angle + "deg"
    );


    /* -------------------------------------------------
       Velocidade

       Entre 1.2 e 2.2 segundos.
    ------------------------------------------------- */

    const duration =
        randomBetween(1.2, 2.2);


    comet.style.animationDuration =
        duration + "s";


    /* -------------------------------------------------
       Pequena variação de tamanho
    ------------------------------------------------- */

    const scale =
        randomBetween(0.75, 1.15);


    comet.style.transform =
        `scale(${scale})`;


    /* -------------------------------------------------
       Cor do cometa (variação)
    ------------------------------------------------- */

    const hue =
        randomBetween(180, 220); // Azul-cyan


    comet.style.background =
        `hsl(${hue}, 100%, 90%)`;

    comet.style.boxShadow =
        `0 0 8px hsl(${hue}, 100%, 80%),
         0 0 20px hsl(${hue}, 100%, 60%)`;


    /* -------------------------------------------------
       Adiciona ao sistema
    ------------------------------------------------- */

    container.appendChild(
        comet
    );


    /* -------------------------------------------------
       Remove depois da animação
    ------------------------------------------------- */

    setTimeout(
        () => {

            if (comet.parentNode) {
                comet.remove();
            }

        },
        (duration * 1000) + 300
    );
}


/* =========================================================
   COMETA OCASIONAL

   Intervalo:

   mínimo: 8 segundos
   máximo: 18 segundos

   Portanto a tela passa bastante tempo sem
   nenhum cometa.
========================================================= */

function scheduleComet() {

    const delay =
        randomBetween(
            8000,
            18000
        );


    window._cometScheduler = setTimeout(
        () => {

            createComet();

            scheduleComet();

        },
        delay
    );
}


/* =========================================================
   PEQUENO DETRITO / METEORO

   Muito mais discreto que o cometa.

   Pode aparecer ocasionalmente entre os cometas,
   mas não fica permanente na tela.
========================================================= */

function createMeteor() {

    const container =
        document.querySelector(".container");


    if (!container) return;


    /* -------------------------------------------------
       Não cria meteoros se já houver um cometa
    ------------------------------------------------- */

    if (
        container.querySelector(".comet")
    ) {
        return;
    }


    const meteor =
        document.createElement("div");

    meteor.className = "meteor";


    /* -------------------------------------------------
       Posição inicial aleatória
    ------------------------------------------------- */

    const startX =
        randomBetween(
            -10,
            110
        );

    const startY =
        randomBetween(
            -10,
            100
        );


    /* -------------------------------------------------
       Pequena trajetória
    ------------------------------------------------- */

    const distance =
        randomBetween(
            8,
            18
        );


    const endX =
        startX +
        distance;

    const endY =
        startY +
        distance *
        randomBetween(
            0.25,
            0.7
        );


    const dx =
        endX - startX;

    const dy =
        endY - startY;


    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    /* -------------------------------------------------
       Variáveis CSS
    ------------------------------------------------- */

    meteor.style.setProperty(
        "--start-x",
        startX + "%"
    );

    meteor.style.setProperty(
        "--start-y",
        startY + "%"
    );

    meteor.style.setProperty(
        "--end-x",
        endX + "%"
    );

    meteor.style.setProperty(
        "--end-y",
        endY + "%"
    );

    meteor.style.setProperty(
        "--comet-angle",
        angle + "deg"
    );


    const duration =
        randomBetween(
            0.7,
            1.3
        );


    meteor.style.animationDuration =
        duration + "s";


    /* -------------------------------------------------
       Tamanho e brilho do meteoro
    ------------------------------------------------- */

    const size =
        randomBetween(1.5, 3.5);

    meteor.style.width = size + "px";
    meteor.style.height = size + "px";

    const intensity =
        randomBetween(0.6, 1);

    meteor.style.boxShadow =
        `0 0 ${size * 3}px rgba(255, 255, 255, ${intensity})`;


    /* -------------------------------------------------
       Adiciona ao sistema
    ------------------------------------------------- */

    container.appendChild(
        meteor
    );


    setTimeout(
        () => {

            if (meteor.parentNode) {
                meteor.remove();
            }

        },
        (duration * 1000) + 200
    );
}


/* =========================================================
   METEOROS RAROS

   Intervalo maior que o dos cometas.

   Entre 15 e 30 segundos.
========================================================= */

function scheduleMeteor() {

    const delay =
        randomBetween(
            15000,
            30000
        );


    window._meteorScheduler = setTimeout(
        () => {

            createMeteor();

            scheduleMeteor();

        },
        delay
    );
}


/* =========================================================
   ZOOM POR PINÇA - MOBILE
========================================================= */

function setupPinchZoom() {

    const container =
        document.querySelector(".container");


    if (!container) return;


    let zoom = 1;


    const MIN_ZOOM = 0.65;
    const MAX_ZOOM = 2.5;


    let initialDistance = 0;
    let initialZoom = 1;


    /* -------------------------------------------------
       Distância entre os dedos
    ------------------------------------------------- */

    function getTouchDistance(
        touch1,
        touch2
    ) {

        const dx =
            touch2.clientX -
            touch1.clientX;

        const dy =
            touch2.clientY -
            touch1.clientY;


        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }


    /* -------------------------------------------------
       Aplica zoom
    ------------------------------------------------- */

    function applyZoom(value) {

        zoom =
            Math.max(
                MIN_ZOOM,
                Math.min(
                    MAX_ZOOM,
                    value
                )
            );


        container.style.transform =
            `scale(${zoom})`;
    }


    /* =================================================
       INÍCIO
    ================================================= */

    container.addEventListener(
        "touchstart",
        (event) => {

            if (
                event.touches.length !== 2
            ) {
                return;
            }


            initialDistance =
                getTouchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            initialZoom =
                zoom;
        },
        {
            passive: false
        }
    );


    /* =================================================
       MOVIMENTO
    ================================================= */

    container.addEventListener(
        "touchmove",
        (event) => {

            if (
                event.touches.length !== 2
            ) {
                return;
            }


            event.preventDefault();


            const currentDistance =
                getTouchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            if (
                initialDistance <= 0
            ) {
                return;
            }


            const scale =
                currentDistance /
                initialDistance;


            applyZoom(
                initialZoom *
                scale
            );
        },
        {
            passive: false
        }
    );


    /* =================================================
       FINAL
    ================================================= */

    container.addEventListener(
        "touchend",
        (event) => {

            if (
                event.touches.length < 2
            ) {

                initialDistance = 0;
            }
        },
        {
            passive: true
        }
    );


    /* =================================================
       CANCELAMENTO
    ================================================= */

    container.addEventListener(
        "touchcancel",
        () => {

            initialDistance = 0;

        },
        {
            passive: true
        }
    );
}


/* =========================================================
   BOTÃO DE PAUSE
========================================================= */

function setupPauseButton() {

    // Cria o botão
    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pauseBtn';
    pauseBtn.textContent = '⏸️ Pausar';
    pauseBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 30px;
        color: white;
        font-size: 16px;
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s ease;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        user-select: none;
        touch-action: manipulation;
    `;

    // Hover effect
    pauseBtn.addEventListener('mouseenter', () => {
        pauseBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        pauseBtn.style.transform = 'scale(1.05)';
    });

    pauseBtn.addEventListener('mouseleave', () => {
        pauseBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        pauseBtn.style.transform = 'scale(1)';
    });

    let isPaused = false;

    // Clique do botão
    pauseBtn.addEventListener('click', () => {

        isPaused = !isPaused;

        // Muda o texto
        pauseBtn.textContent = isPaused ? '▶️ Continuar' : '⏸️ Pausar';

        // Aplica pause em TODAS as animações
        document.querySelectorAll(
            '.mercury, .venus, .earth, .mars, ' +
            '.jupiter, .saturn, .uranus, .neptune, .pluto, ' +
            '.moon, .saturn-particle, .sun, .star'
        ).forEach(el => {
            el.style.animationPlayState = isPaused ? 'paused' : 'running';
        });

        // Pausa cometas e meteoros (evita novos spawns)
        if (isPaused) {
            // Cancela os schedulers
            clearTimeout(window._cometScheduler);
            clearTimeout(window._meteorScheduler);
        } else {
            // Reinicia os schedulers
            scheduleComet();
            scheduleMeteor();
        }

        console.log(isPaused ? '⏸️ Sistema pausado' : '▶️ Sistema retomado');
    });

    document.body.appendChild(pauseBtn);

    // Guarda referência global
    window.pauseBtn = pauseBtn;

    // Pausa com tecla Espaço
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && window.pauseBtn) {
            event.preventDefault();
            window.pauseBtn.click();
        }
    });
}


/* =========================================================
   PAINEL INTERATIVO WZ - COSMOLOGIA
========================================================= */

// Dados dos planetas com a cosmologia WZ
const planetData = {
    mercury: {
        name: 'MERCÚRIO',
        asura: 'SÍRIA',
        emoji: '☿',
        title: '⚡ Asura do Comércio e Comunicação',
        description: '1º planeta do Sistema Solar',
        info: 'Síria rege o fluxo da prosperidade, a comunicação e o comércio. Como Mercúrio, que viaja rápido entre os mundos, Síria conecta os domínios da WZ com agilidade e precisão.',
        distance: '57,9 milhões km',
        diameter: '4.879 km',
        day: '58,6 dias terrestres',
        year: '88 dias terrestres',
        moons: '0 luas',
        color: '#b5b5b5',
        sigil: '⚡',
        type: 'Planeta'
    },
    venus: {
        name: 'VÊNUS',
        asura: 'DIVA',
        emoji: '♀',
        title: '🌸 Asura da Diplomacia e Harmonia',
        description: '2º planeta do Sistema Solar',
        info: 'Diva rege as relações, a elegância e a harmonia. Como Vênus, que brilha no céu noturno, Diva ilumina os caminhos da diplomacia e da beleza na WZ.',
        distance: '108,2 milhões km',
        diameter: '12.104 km',
        day: '243 dias terrestres',
        year: '225 dias terrestres',
        moons: '0 luas',
        color: '#e8cda0',
        sigil: '🌸',
        type: 'Planeta'
    },
    earth: {
        name: 'TERRA',
        asura: 'ASTREIA',
        emoji: '🌍',
        title: '🛡️ Asura da Proteção e Defesa',
        description: '3º planeta do Sistema Solar',
        info: 'Astreia é o bastião da vida e da proteção na WZ. Como a Terra, que abriga e sustenta, Astreia defende os limites do império com firmeza e sabedoria.',
        distance: '149,6 milhões km',
        diameter: '12.756 km',
        day: '24 horas',
        year: '365,25 dias',
        moons: '1 lua (Hécate)',
        color: '#4d8bf7',
        sigil: '🛡️',
        type: 'Planeta'
    },
    mars: {
        name: 'MARTE',
        asura: 'VICTÓRIA',
        emoji: '♂',
        title: '⚔️ Asura da Guerra e Conquista',
        description: '4º planeta do Sistema Solar',
        info: 'Victória rege a estratégia, a conquista e o avanço. Como Marte, o planeta vermelho, Victória representa a força que avança quando necessário, sempre com propósito.',
        distance: '227,9 milhões km',
        diameter: '6.792 km',
        day: '24,6 horas',
        year: '687 dias',
        moons: '2 luas (Fobos e Deimos)',
        color: '#c1440e',
        sigil: '⚔️',
        type: 'Planeta'
    },
    jupiter: {
        name: 'JÚPITER',
        asura: 'ATENA',
        emoji: '♃',
        title: '🦉 Asura da Sabedoria Soberana',
        description: '5º planeta do Sistema Solar',
        info: 'Atena expande o conhecimento e a sabedoria na WZ. Como Júpiter, o maior planeta, Atena reina com inteligência e visão, guiando o império com clareza.',
        distance: '778,5 milhões km',
        diameter: '142.984 km',
        day: '9,9 horas',
        year: '11,86 anos',
        moons: '95 luas (Ganímedes é a maior)',
        color: '#d4a574',
        sigil: '🦉',
        type: 'Planeta'
    },
    saturn: {
        name: 'SATURNO',
        asura: 'HÉSTIA',
        emoji: '♄',
        title: '⚖️ Asura da Lei e Ordem',
        description: '6º planeta do Sistema Solar',
        info: 'Héstia rege o tempo, a lei e a jurisprudência na WZ. Como Saturno, com seus anéis que representam ciclos, Héstia mantém a ordem e a justiça no império.',
        distance: '1,43 bilhão km',
        diameter: '120.536 km',
        day: '10,7 horas',
        year: '29,46 anos',
        moons: '146 luas (Titã é a maior)',
        color: '#ead6b8',
        sigil: '⚖️',
        type: 'Planeta'
    },
    uranus: {
        name: 'URANO',
        asura: 'DAEDALA',
        emoji: '⛢',
        title: '🔧 Asura da Inovação e Tecnologia',
        description: '7º planeta do Sistema Solar',
        info: 'Daedala revoluciona a tecnologia e a inovação na WZ. Como Urano, que gira de lado, Daedala pensa fora do convencional, criando o novo e o disruptivo.',
        distance: '2,87 bilhões km',
        diameter: '51.118 km',
        day: '17,2 horas',
        year: '84 anos',
        moons: '27 luas',
        color: '#7ec8e3',
        sigil: '🔧',
        type: 'Planeta'
    },
    neptune: {
        name: 'NETUNO',
        asura: 'UMBRA',
        emoji: '♆',
        title: '🌙 Asura do Mistério e Percepção',
        description: '8º planeta do Sistema Solar',
        info: 'Umbra rege as sombras, o mistério e a caça na WZ. Como Netuno, que esconde segredos nas profundezas, Umbra vê o que outros não percebem e age nas margens.',
        distance: '4,50 bilhões km',
        diameter: '49.528 km',
        day: '16,1 horas',
        year: '164,8 anos',
        moons: '16 luas (Tritão é a maior)',
        color: '#3b4cb8',
        sigil: '🌙',
        type: 'Planeta'
    },
    pluto: {
        name: 'PLUTÃO',
        asura: 'MÉRLIM',
        emoji: '♇',
        title: '🔮 Guardião do Limiar Invisível',
        description: 'Planeta anão — Guardião da Fronteira',
        info: 'Mérlim rege a transformação profunda e a engenharia do renascimento na WZ. Como Plutão, que existe além da fronteira conhecida, Mérlim é o guardião do limiar, mostrando que sempre há um novo ciclo além do fim aparente.',
        distance: '5,91 bilhões km',
        diameter: '2.377 km',
        day: '6,4 dias',
        year: '248 anos',
        moons: '5 luas (Caronte é a maior)',
        color: '#d6c8b0',
        sigil: '🔮',
        type: 'Planeta Anão'
    }
};

// Dados do Sol e da Lua (cosmologia WZ)
const celestialData = {
    sun: {
        name: 'SOL',
        emoji: '☀️',
        asura: 'MESTRE',
        title: '👑 A Presença que Ilumina',
        description: 'Centro do Sistema Solar',
        info: 'O Sol é o silêncio que ilumina. Não é o soberano que fala, é a fonte que aquece. Não é a ordem que se impõe, é a luz que permite que tudo cresça. Na cosmologia da WZ, o Sol representa a Presença do Mestre — simples, silenciosa, mas essencial. Ele não pede atenção, ele a sustenta.',
        distance: '—',
        diameter: '1.392.700 km',
        day: '25 dias',
        year: '—',
        moons: '8 planetas',
        color: '#fdb813',
        sigil: '👑',
        type: 'Estrela'
    },
    moon: {
        name: 'LUA',
        emoji: '🌙',
        asura: 'HÉCATE',
        title: '🌙 Guardiã das Fronteiras',
        description: 'Satélite Natural da Terra — Selo de Hécate no Céu',
        info: 'A Lua é Hécate, a Guardiã das Fronteiras. Ela não emite luz própria — reflete a luz do Sol, assim como Hécate reflete a autoridade do Mestre. Ela vigia os limiares entre o conhecido e o desconhecido, entre a Terra e o cosmos. É o selo de Hécate no céu: presença constante, discreta, mas inegável. Quando as marés sobem, lembramos que ela está lá, protegendo as fronteiras da WZ.',
        distance: '384.400 km',
        diameter: '3.474 km',
        day: '27,3 dias',
        year: '27,3 dias',
        moons: '—',
        color: '#d4d4d4',
        sigil: '🌙',
        type: 'Satélite — Guardiã das Fronteiras'
    }
};

// Cria o painel de informações (versão WZ completa)
function createInfoPanel() {
    const panel = document.createElement('div');
    panel.id = 'planetPanel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: min(340px, 92%);
        max-height: 85vh;
        overflow-y: auto;
        background: rgba(0, 10, 25, 0.95);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(100, 200, 255, 0.2);
        border-radius: 16px;
        padding: 28px 24px 24px;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.9),
            0 0 60px rgba(0, 150, 255, 0.05),
            inset 0 0 60px rgba(0, 150, 255, 0.02);
        font-family: 'Courier New', monospace;
        color: #b8d4ff;
        pointer-events: none;
    `;

    panel.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px;">
            <div id="planetEmoji" style="font-size: 36px; line-height: 1; flex-shrink: 0;">🌍</div>
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span id="planetName" style="font-size: 22px; font-weight: bold; color: #8ab4f8; letter-spacing: 2px; text-transform: uppercase;">TERRA</span>
                    <span id="planetSigil" style="font-size: 16px; opacity: 0.6;">🛡️</span>
                </div>
                <div id="planetAsura" style="font-size: 16px; font-weight: bold; color: #6a9fd8; letter-spacing: 1px; margin-top: 2px;">ASTREIA</div>
                <div id="planetTitle" style="font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1px; margin-top: 2px;">🛡️ Asura da Proteção e Defesa</div>
            </div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
            <span style="font-size: 11px; background: rgba(100,200,255,0.08); padding: 2px 12px; border-radius: 12px; color: rgba(255,255,255,0.4); border: 1px solid rgba(100,200,255,0.05);" id="planetDesc">3º planeta</span>
            <span style="font-size: 11px; background: rgba(100,200,255,0.05); padding: 2px 12px; border-radius: 12px; color: rgba(255,255,255,0.3); border: 1px solid rgba(100,200,255,0.05);" id="planetClassification">Planeta</span>
        </div>
        
        <div id="planetInfo" style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 16px; padding: 14px 16px; background: rgba(0, 50, 100, 0.08); border-radius: 8px; border-left: 2px solid rgba(100, 200, 255, 0.2);">
            Informações do corpo celeste
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; font-size: 12px; color: rgba(255,255,255,0.5);">
            <div><span style="color: rgba(255,255,255,0.2);">🌞 Distância</span><br><span id="planetDistance" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">📏 Diâmetro</span><br><span id="planetDiameter" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">🌅 Dia</span><br><span id="planetDay" style="color: #8ab4f8; font-weight: bold;">---</span></div>
            <div><span style="color: rgba(255,255,255,0.2);">📅 Ano</span><br><span id="planetYear" style="color: #8ab4f8; font-weight: bold;">---</span></div>
        </div>
        
        <div style="margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.25); text-align: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04);">
            <span id="planetMoons">🌙 0 luas</span>
        </div>
        
        <div style="position: absolute; top: 12px; right: 16px;">
            <button id="closePanel" style="
                background: none;
                border: none;
                color: rgba(255,255,255,0.2);
                font-size: 18px;
                cursor: pointer;
                padding: 4px 8px;
                transition: color 0.3s;
                font-family: 'Courier New', monospace;
            ">✕</button>
        </div>
        
        <!-- Selo WZ -->
        <div style="position: absolute; bottom: 12px; right: 16px; font-size: 9px; color: rgba(255,255,255,0.06); letter-spacing: 3px; text-transform: uppercase;">
            ⚜️ WZ • Cosmologia
        </div>
    `;

    document.body.appendChild(panel);

    // Botão fechar
    document.getElementById('closePanel').addEventListener('click', closePanel);
    document.getElementById('closePanel').addEventListener('touchend', (e) => {
        e.preventDefault();
        closePanel();
    });

    return panel;
}

// Abre o painel com dados do planeta/corpo celeste
function openPanel(key) {
    const panel = document.getElementById('planetPanel') || createInfoPanel();
    
    // Verifica se é Sol ou Lua
    let data;
    if (key === 'sun') {
        data = celestialData.sun;
    } else if (key === 'moon') {
        data = celestialData.moon;
    } else {
        data = planetData[key];
    }
    
    if (!data) {
        console.error('❌ Dados não encontrados para:', key);
        return;
    }

    // Atualiza conteúdo
    document.getElementById('planetEmoji').textContent = data.emoji;
    document.getElementById('planetName').textContent = data.name;
    
    // Mostra Asura (se tiver)
    const asuraEl = document.getElementById('planetAsura');
    const titleEl = document.getElementById('planetTitle');
    
    if (data.asura) {
        asuraEl.textContent = data.asura;
        asuraEl.style.display = 'block';
    } else {
        asuraEl.style.display = 'none';
    }
    
    titleEl.textContent = data.title;
    titleEl.style.display = 'block';
    
    document.getElementById('planetSigil').textContent = data.sigil || '';
    document.getElementById('planetDesc').textContent = data.description;
    document.getElementById('planetInfo').textContent = data.info;
    document.getElementById('planetDistance').textContent = data.distance;
    document.getElementById('planetDiameter').textContent = data.diameter;
    document.getElementById('planetDay').textContent = data.day;
    document.getElementById('planetYear').textContent = data.year;
    document.getElementById('planetMoons').textContent = data.moons !== '—' ? `🌙 ${data.moons}` : '—';
    document.getElementById('planetClassification').textContent = data.type || 'Planeta';

    // Cor do corpo celeste
    document.getElementById('planetName').style.color = data.color;
    if (data.asura) {
        document.getElementById('planetAsura').style.color = data.color;
    }
    document.getElementById('planetInfo').style.borderLeftColor = data.color;

    // Mostra painel
    panel.style.opacity = '1';
    panel.style.visibility = 'visible';
    panel.style.transform = 'translate(-50%, -50%) scale(1)';
    panel.style.pointerEvents = 'auto';
}

// Fecha o painel
function closePanel() {
    const panel = document.getElementById('planetPanel');
    if (!panel) return;
    
    panel.style.opacity = '0';
    panel.style.visibility = 'hidden';
    panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
    panel.style.pointerEvents = 'none';
}


/* =========================================================
   MODO EXPLORAÇÃO - SISTEMA DE VIAGEM INTERPLANETÁRIA
========================================================= */

// Estado do modo exploração
let explorationMode = {
    active: false,
    target: null,
    zoomLevel: 1,
    isTransitioning: false
};

// Configurações de zoom por planeta
const planetZoomLevels = {
    mercury: 2.8,
    venus: 2.5,
    earth: 2.2,
    mars: 2.6,
    jupiter: 1.8,
    saturn: 2.0,
    uranus: 2.4,
    neptune: 2.6,
    pluto: 3.0,
    sun: 2.0,
    moon: 3.5
};

// Cria o botão de voltar
function createBackButton() {
    const btn = document.createElement('button');
    btn.id = 'backButton';
    btn.textContent = '← Voltar ao Sistema Solar';
    btn.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%) scale(0.9);
        padding: 12px 24px;
        background: rgba(10, 20, 40, 0.6);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        color: #8ab4f8;
        font-size: 13px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        z-index: 10001;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-weight: 600;
        user-select: none;
        touch-action: manipulation;
        pointer-events: none;
    `;
    
    btn.innerHTML = `
        <span style="position: relative; z-index: 1;">← Voltar ao Sistema Solar</span>
        <span style="position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent); border-radius: 16px 16px 0 0; pointer-events: none;"></span>
    `;
    
    btn.addEventListener('click', exitExploration);
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        exitExploration();
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(20, 40, 70, 0.7)';
        btn.style.borderColor = 'rgba(100, 200, 255, 0.3)';
        btn.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 50px rgba(100, 200, 255, 0.06)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(10, 20, 40, 0.6)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        btn.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    });
    
    document.body.appendChild(btn);
    return btn;
}

// Entra no modo exploração - CORRIGIDO
function enterExploration(key) {
    console.log(`🚀 Tentando viajar para: ${key}`);
    
    if (explorationMode.isTransitioning) {
        console.log('⏳ Já está em transição');
        return;
    }
    
    if (explorationMode.active && explorationMode.target === key) {
        console.log(`📋 Já está em ${key}, abrindo painel`);
        openPanel(key);
        return;
    }
    
    explorationMode.isTransitioning = true;
    explorationMode.active = true;
    explorationMode.target = key;
    
    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backButton') || createBackButton();
    
    // Encontra o elemento do planeta usando data-key ou classe
    let planet = document.querySelector(`[data-key="${key}"]`);
    if (!planet) {
        // Fallback: procura pela classe
        planet = document.querySelector(`.${key}`);
    }
    
    if (!planet) {
        console.error(`❌ Planeta não encontrado: ${key}`);
        explorationMode.isTransitioning = false;
        explorationMode.active = false;
        explorationMode.target = null;
        return;
    }
    
    console.log(`📍 Planeta encontrado:`, planet);
    
    if (!container) {
        console.error('❌ Container não encontrado');
        explorationMode.isTransitioning = false;
        explorationMode.active = false;
        explorationMode.target = null;
        return;
    }
    
    // Fecha o painel se estiver aberto
    closePanel();
    
    // Obtém a posição do planeta
    const containerRect = container.getBoundingClientRect();
    const planetRect = planet.getBoundingClientRect();
    
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    
    const planetCenterX = planetRect.left + planetRect.width / 2;
    const planetCenterY = planetRect.top + planetRect.height / 2;
    
    // Calcula o deslocamento para centralizar o planeta
    const deltaX = centerX - planetCenterX;
    const deltaY = centerY - planetCenterY;
    
    // Calcula o zoom (baseado no planeta)
    const zoomLevel = planetZoomLevels[key] || 2.5;
    
    // Aplica a transformação com transição suave
    container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    container.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${zoomLevel})`;
    
    // Mostra o botão de voltar
    setTimeout(() => {
        backBtn.style.opacity = '1';
        backBtn.style.visibility = 'visible';
        backBtn.style.transform = 'translateX(-50%) scale(1)';
        backBtn.style.pointerEvents = 'auto';
    }, 300);
    
    // Adiciona classe de destaque no planeta
    planet.style.transition = 'filter 0.8s ease, box-shadow 0.8s ease';
    planet.style.filter = 'brightness(1.3) drop-shadow(0 0 40px rgba(100,200,255,0.3))';
    planet.style.zIndex = '20';
    
    // Anima a órbita (opcional - desacelera)
    document.querySelectorAll('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon').forEach(p => {
        if (p !== planet) {
            p.style.transition = 'opacity 0.8s ease';
            p.style.opacity = '0.3';
        }
    });
    
    // Abre o painel após a transição
    setTimeout(() => {
        openPanel(key);
        explorationMode.isTransitioning = false;
    }, 900);
    
    // Esconde o botão de pause durante a exploração
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.transition = 'opacity 0.4s ease';
        pauseBtn.style.opacity = '0';
        pauseBtn.style.pointerEvents = 'none';
    }
    
    console.log(`🚀 Viajando para ${key}...`);
}

// Sai do modo exploração
function exitExploration() {
    if (explorationMode.isTransitioning) return;
    if (!explorationMode.active) return;
    
    explorationMode.isTransitioning = true;
    
    const container = document.querySelector('.container');
    const backBtn = document.getElementById('backButton');
    
    // Fecha o painel
    closePanel();
    
    // Volta ao normal
    if (container) {
        container.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        container.style.transform = 'translate(0, 0) scale(1)';
    }
    
    // Restaura os planetas
    document.querySelectorAll('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon').forEach(p => {
        p.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
        p.style.opacity = '1';
        p.style.filter = 'none';
        p.style.zIndex = '';
        p.style.boxShadow = '';
    });
    
    // Esconde o botão de voltar
    if (backBtn) {
        backBtn.style.transition = 'all 0.4s ease';
        backBtn.style.opacity = '0';
        backBtn.style.visibility = 'hidden';
        backBtn.style.transform = 'translateX(-50%) scale(0.9)';
        backBtn.style.pointerEvents = 'none';
    }
    
    // Mostra o botão de pause novamente
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.style.transition = 'opacity 0.6s ease 0.3s';
        pauseBtn.style.opacity = '1';
        pauseBtn.style.pointerEvents = 'auto';
    }
    
    setTimeout(() => {
        explorationMode.active = false;
        explorationMode.target = null;
        explorationMode.isTransitioning = false;
        console.log('🌌 Retornou ao Sistema Solar');
    }, 900);
}

// Fecha ao clicar fora (apenas desktop) - versão modificada
document.addEventListener('click', (e) => {
    const panel = document.getElementById('planetPanel');
    if (!panel) return;
    if (panel.style.visibility === 'hidden') return;
    
    const isClickOnPlanet = e.target.closest('.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto, .sun, .moon');
    const isClickOnPanel = e.target.closest('#planetPanel');
    const isClickOnBack = e.target.closest('#backButton');
    
    if (!isClickOnPlanet && !isClickOnPanel && !isClickOnBack) {
        closePanel();
    }
});

// Função auxiliar para adicionar eventos de clique/toque - CORRIGIDA
function addClickHandler(element, key) {
    const finalKey = String(key);
    console.log(`🔗 Adicionando handler para: ${finalKey}`);
    
    element.style.cursor = 'pointer';
    element.style.transition = 'transform 0.15s ease, filter 0.3s ease';
    element.style.webkitTapHighlightColor = 'transparent';

    // Evento de clique (desktop)
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log(`🖱️ Clique em: ${finalKey}`);
        
        if (explorationMode.active && explorationMode.target === finalKey) {
            openPanel(finalKey);
        } else {
            enterExploration(finalKey);
        }
    });

    // Evento de toque (mobile)
    element.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`👆 Toque em: ${finalKey}`);
        
        if (explorationMode.active && explorationMode.target === finalKey) {
            openPanel(finalKey);
        } else {
            enterExploration(finalKey);
        }
    });

    // Feedback visual ao tocar/clicar
    element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.92)';
    });

    element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
    });

    element.addEventListener('touchcancel', () => {
        element.style.transform = 'scale(1)';
    });

    element.addEventListener('mousedown', () => {
        element.style.transform = 'scale(0.92)';
    });

    element.addEventListener('mouseup', () => {
        element.style.transform = 'scale(1)';
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
    });

    // Destaque ao passar o mouse (desktop)
    element.addEventListener('mouseenter', () => {
        element.style.filter = 'brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.15))';
    });

    element.addEventListener('mouseleave', () => {
        element.style.filter = 'none';
    });
}

// Configura os corpos celestes como clicáveis - CORRIGIDO
function setupPlanetClick() {
    
    // PEGA TODOS OS CORPOS CELESTES com data-key
    const allCelestialBodies = document.querySelectorAll(
        '.sun, .moon, .mercury, .venus, .earth, .mars, ' +
        '.jupiter, .saturn, .uranus, .neptune, .pluto'
    );

    allCelestialBodies.forEach(element => {
        // Pega a chave do atributo data-key
        const key = element.dataset.key;
        
        if (!key) {
            console.warn('⚠️ Elemento sem data-key:', element);
            return;
        }

        console.log(`🪐 Configurando: ${key}`);

        // Adiciona o evento de clique
        addClickHandler(element, key);
    });

    console.log('🪐 Todos os corpos celestes configurados como clicáveis!');
    console.log('🚀 Modo Exploração ativado! Toque em um planeta para viajar.');
}

// Inicializa os planetas clicáveis
function initPlanetInteraction() {
    // Espera os planetas existirem
    const checkPlanets = setInterval(() => {
        const planets = document.querySelectorAll(
            '.mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune, .pluto'
        );
        if (planets.length > 0) {
            clearInterval(checkPlanets);
            setupPlanetClick();
        }
    }, 100);

    // Timeout de segurança
    setTimeout(() => {
        clearInterval(checkPlanets);
    }, 5000);
}

// Atalho para sair da exploração (ESC)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && explorationMode.active) {
        exitExploration();
    }
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        /* -------------------------------------------------
           Estrelas
        ------------------------------------------------- */

        createStars();


        /* -------------------------------------------------
           Saturno
        ------------------------------------------------- */

        createSaturnRingParticles();


        /* -------------------------------------------------
           Zoom
        ------------------------------------------------- */

        setupPinchZoom();


        /* -------------------------------------------------
           Botão de Pause
        ------------------------------------------------- */

        setupPauseButton();


        /* -------------------------------------------------
           Planetas Interativos (WZ Cosmologia + Modo Exploração)
        ------------------------------------------------- */

        initPlanetInteraction();


        /* -------------------------------------------------
           Cometas

           O primeiro não aparece imediatamente.
           O sistema começa calmo.
        ------------------------------------------------- */

        // Primeiro cometa após 3-6 segundos
        setTimeout(
            () => {
                createComet();
            },
            randomBetween(3000, 6000)
        );

        scheduleComet();


        /* -------------------------------------------------
           Meteoros

           Ainda mais raros.
        ------------------------------------------------- */

        // Primeiro meteoro após 5-10 segundos
        setTimeout(
            () => {
                createMeteor();
            },
            randomBetween(5000, 10000)
        );

        scheduleMeteor();


        /* -------------------------------------------------
           Debug (opcional)
        ------------------------------------------------- */

        console.log('🌠 Sistema Solar iniciado!');
        console.log('💡 Digite createComet() ou createMeteor() para testar manualmente.');
        console.log('⏸️ Clique no botão ou pressione ESPAÇO para pausar/continuar.');
        console.log('🪐 Toque nos planetas, Sol ou Lua para viajar e ver a cosmologia WZ!');
        console.log('🚀 Pressione ESC para sair do modo exploração.');
        console.log('📋 Verifique se os elementos têm data-key no HTML!');

        // Expõe funções para teste no console
        window.createComet = createComet;
        window.createMeteor = createMeteor;
        window.openPanel = openPanel;
        window.enterExploration = enterExploration;
        window.exitExploration = exitExploration;
        
        // Debug: mostra todos os data-keys
        console.log('📋 Data-keys encontrados:');
        document.querySelectorAll('[data-key]').forEach(el => {
            console.log(`  - ${el.className} → ${el.dataset.key}`);
        });
    }
);