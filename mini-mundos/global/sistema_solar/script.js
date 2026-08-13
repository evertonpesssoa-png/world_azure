/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS
   ÓRBITA + ROTAÇÃO PRÓPRIA + LUA + ZOOM MOBILE
========================================================= */


/* =========================================================
   ESTRELAS DE FUNDO
========================================================= */

function createStars() {

    const container = document.querySelector("body");

    if (!container) return;

    /* Evita duplicar estrelas */

    if (container.querySelector(".star")) {
        return;
    }

    for (let i = 0; i < 1000; i++) {

        const star = document.createElement("div");

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

    /* Evita duplicação */

    if (
        saturn.querySelector(
            ".saturn-particles"
        )
    ) {
        return;
    }

    const particleContainer =
        document.createElement("div");

    particleContainer.className =
        "saturn-particles";

    /* -------------------------------------------------
       Quantidade responsiva
    ------------------------------------------------- */

    const particleCount =
        window.innerWidth <= 768
            ? 18
            : 30;

    /* =================================================
       CRIA PARTÍCULAS
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
   PREPARAÇÃO DOS PLANETAS
=========================================================

   IMPORTANTE:

   Cada planeta precisa ter duas camadas:

       .earth
           └── .planet-body

   A .earth gira ao redor do Sol.

   A .planet-body gira sobre o próprio eixo.

   São duas animações independentes.
========================================================= */

function setupPlanetBodies() {

    const planets = [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto"
    ];

    planets.forEach(
        (planetName) => {

            const planet =
                document.querySelector(
                    `.${planetName}`
                );

            if (!planet) return;

            /* -------------------------------------------------
               Evita criar duas vezes
            ------------------------------------------------- */

            if (
                planet.querySelector(
                    ".planet-body"
                )
            ) {
                return;
            }

            /* -------------------------------------------------
               Cria corpo interno
            ------------------------------------------------- */

            const body =
                document.createElement("div");

            body.className =
                "planet-body";

            /* -------------------------------------------------
               Marca qual planeta é
            ------------------------------------------------- */

            body.dataset.planet =
                planetName;

            /* -------------------------------------------------
               Insere antes dos elementos existentes
               como a Lua da Terra
            ------------------------------------------------- */

            planet.insertBefore(
                body,
                planet.firstChild
            );
        }
    );
}


/* =========================================================
   ROTAÇÃO PRÓPRIA DOS PLANETAS
=========================================================

   Cada planeta recebe uma velocidade diferente.

   Isso NÃO interfere na órbita.

   A órbita está no elemento externo.

   A rotação está no .planet-body.
========================================================= */

function setupPlanetRotation() {

    const rotationSpeeds = {

        mercury: "4s",
        venus: "7s",
        earth: "3s",
        mars: "3.5s",
        jupiter: "2s",
        saturn: "2.5s",
        uranus: "2.8s",
        neptune: "3s",
        pluto: "4s"
    };

    Object.entries(
        rotationSpeeds
    ).forEach(
        ([planetName, duration]) => {

            const body =
                document.querySelector(
                    `.${planetName} .planet-body`
                );

            if (!body) return;

            body.style.animation =
                `planetRotation ${duration} linear infinite`;
        }
    );
}


/* =========================================================
   ZOOM POR PINÇA - MOBILE
=========================================================

   Dois dedos afastando:
   → aproxima

   Dois dedos juntando:
   → afasta

   O zoom é aplicado somente ao container.

   As estrelas permanecem paradas.
========================================================= */

function setupPinchZoom() {

    const container =
        document.querySelector(".container");

    if (!container) return;

    /* -------------------------------------------------
       Configurações
    ------------------------------------------------- */

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
       INÍCIO DO PINCH
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
       MOVIMENTO DO PINCH
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
                initialZoom * scale
            );
        },
        {
            passive: false
        }
    );

    /* =================================================
       FINAL DO PINCH
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

    /* -------------------------------------------------
       Cancelamento
    ------------------------------------------------- */

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
           Prepara corpos internos
        ------------------------------------------------- */

        setupPlanetBodies();

        /* -------------------------------------------------
           Ativa rotação própria
        ------------------------------------------------- */

        setupPlanetRotation();

        /* -------------------------------------------------
           Saturno
        ------------------------------------------------- */

        createSaturnRingParticles();

        /* -------------------------------------------------
           Zoom mobile
        ------------------------------------------------- */

        setupPinchZoom();

    }
);