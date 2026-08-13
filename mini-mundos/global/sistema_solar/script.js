/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS

   FUNÇÕES:
   - Estrelas de fundo
   - Partículas dos anéis de Saturno
   - Cometas / meteoros ocasionais
   - Zoom por pinça no mobile
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
        container.querySelector(".space-comet")
    ) {
        return;
    }


    const comet =
        document.createElement("div");

    comet.className =
        "space-comet";


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


    comet.style.setProperty(
        "--comet-duration",
        duration + "s"
    );


    /* -------------------------------------------------
       Pequena variação de tamanho
    ------------------------------------------------- */

    const scale =
        randomBetween(0.75, 1.15);


    comet.style.setProperty(
        "--comet-scale",
        scale
    );


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

            comet.remove();

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


    setTimeout(
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
        container.querySelector(
            ".space-comet"
        )
    ) {
        return;
    }


    const meteor =
        document.createElement("div");

    meteor.className =
        "space-meteor";


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
        "--meteor-start-x",
        startX + "%"
    );

    meteor.style.setProperty(
        "--meteor-start-y",
        startY + "%"
    );

    meteor.style.setProperty(
        "--meteor-end-x",
        endX + "%"
    );

    meteor.style.setProperty(
        "--meteor-end-y",
        endY + "%"
    );

    meteor.style.setProperty(
        "--meteor-angle",
        angle + "deg"
    );


    const duration =
        randomBetween(
            0.7,
            1.3
        );


    meteor.style.setProperty(
        "--meteor-duration",
        duration + "s"
    );


    container.appendChild(
        meteor
    );


    setTimeout(
        () => {

            meteor.remove();

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


    setTimeout(
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
           Cometas

           O primeiro não aparece imediatamente.
           O sistema começa calmo.
        ------------------------------------------------- */

        scheduleComet();


        /* -------------------------------------------------
           Meteoros

           Ainda mais raros.
        ------------------------------------------------- */

        scheduleMeteor();

    }
);