/* =========================================================
   SISTEMA SOLAR - SCRIPT.JS
========================================================= */


/* =========================================================
   ESTRELAS
========================================================= */

function createStars() {
    const container = document.body;

    if (!container) return;

    for (let i = 0; i < 1000; i++) {

        const star = document.createElement("div");

        star.className = "star";

        // Tamanho aleatório: 1px até 3px
        const size = Math.random() * 2 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        // Posição aleatória
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";

        // Brilho aleatório
        star.style.opacity =
            Math.random() * 0.7 + 0.3;

        // Atraso aleatório da animação
        star.style.animationDelay =
            Math.random() * 5 + "s";

        container.appendChild(star);
    }
}


/* =========================================================
   PARTÍCULAS DOS ANÉIS DE SATURNO
========================================================= */

function createSaturnRingParticles() {

    const saturn = document.querySelector(".saturn");

    if (!saturn) return;


    /*
     * Evita criar partículas duplicadas
     * caso a função seja chamada novamente.
     */
    if (saturn.querySelector(".saturn-particles")) {
        return;
    }


    /*
     * Container das partículas.
     */
    const particleContainer =
        document.createElement("div");

    particleContainer.className =
        "saturn-particles";


    /*
     * Quantidade pequena para manter
     * boa performance principalmente no mobile.
     */
    const particleCount =
        window.innerWidth <= 768 ? 18 : 30;


    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "saturn-particle";


        /*
         * Posição ao redor do anel.
         *
         * Usamos uma distribuição circular
         * para evitar que todas fiquem juntas.
         */
        const angle =
            Math.random() * Math.PI * 2;


        /*
         * Distância aleatória do centro.
         *
         * Isso cria diferentes "faixas"
         * de partículas no anel.
         */
        const radius =
            25 + Math.random() * 18;


        const x =
            Math.cos(angle) * radius;

        const y =
            Math.sin(angle) * radius * 0.32;


        /*
         * Tamanho pequeno e variado.
         */
        const size =
            Math.random() * 1.8 + 0.7;


        /*
         * Brilho variado.
         */
        const opacity =
            Math.random() * 0.55 + 0.25;


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


        /*
         * Cada partícula possui uma
         * velocidade ligeiramente diferente.
         */
        particle.style.animationDelay =
            Math.random() * 4 + "s";

        particle.style.animationDuration =
            2.5 + Math.random() * 3 + "s";


        particleContainer.appendChild(
            particle
        );
    }


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

        createStars();

        createSaturnRingParticles();

    }
);