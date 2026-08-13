/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS
========================================================= */


/* =========================================================
   ESTRELAS DE FUNDO
========================================================= */

function createStars() {

    const container = document.querySelector("body");

    if (!container) return;


    for (let i = 0; i < 1000; i++) {

        const star = document.createElement("div");

        star.className = "star";


        /* -------------------------------------------------
           Tamanho variado
           1px até 3px
        ------------------------------------------------- */

        const size =
            Math.random() * 2 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";


        /* -------------------------------------------------
           Posição aleatória
        ------------------------------------------------- */

        star.style.top =
            Math.random() * 100 + "%";

        star.style.left =
            Math.random() * 100 + "%";


        /* -------------------------------------------------
           Opacidade variada
        ------------------------------------------------- */

        star.style.opacity =
            Math.random() * 0.7 + 0.3;


        /* -------------------------------------------------
           Delay aleatório
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


    /* -------------------------------------------------
       Segurança
    ------------------------------------------------- */

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
       Container das partículas
    ------------------------------------------------- */

    const particleContainer =
        document.createElement("div");

    particleContainer.className =
        "saturn-particles";


    /* -------------------------------------------------
       Quantidade responsiva

       Mobile:
       18 partículas

       PC:
       30 partículas
    ------------------------------------------------- */

    const particleCount =
        window.innerWidth <= 768
            ? 18
            : 30;


    /* =================================================
       CRIAÇÃO DAS PARTÍCULAS
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
           Ângulo aleatório
        ------------------------------------------------- */

        const angle =
            Math.random() *
            Math.PI *
            2;


        /* -------------------------------------------------
           Distância do centro

           Cria diferentes posições
           dentro dos anéis.
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

           Pequeno para parecer poeira
           espacial.
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
           Aplicação das propriedades
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
           Animação individual

           Cada partícula recebe um
           comportamento ligeiramente diferente.
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


    /* -------------------------------------------------
       Adiciona o conjunto ao Saturno
    ------------------------------------------------- */

    saturn.appendChild(
        particleContainer
    );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Criar estrelas */
        createStars();


        /* Criar partículas de Saturno */
        createSaturnRingParticles();

    }
);