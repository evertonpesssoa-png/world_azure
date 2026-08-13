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
   Adiciona as partículas ao Saturno  
------------------------------------------------- */  

saturn.appendChild(  
    particleContainer  
);

}

/* =========================================================
ZOOM POR PINÇA - MOBILE

Dois dedos se afastando:
→ aproxima

Dois dedos se juntando:
→ afasta

O zoom é aplicado somente ao .container.

As estrelas continuam paradas no fundo.
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
   Calcula a distância entre dois dedos  
------------------------------------------------- */  

function getTouchDistance(touch1, touch2) {  

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
   Aplica o zoom  
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
   INÍCIO DO GESTO  
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
   MOVIMENTO DOS DOIS DEDOS  
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


        /* -------------------------------------------------  
           Proporção da distância:  

           dedos afastando  
           → distância aumenta  
           → zoom aumenta  

           dedos juntando  
           → distância diminui  
           → zoom diminui  
        ------------------------------------------------- */  

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
   FINAL DO GESTO  
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
   Segurança para cancelamento do toque  
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
       Criar estrelas  
    ------------------------------------------------- */  

    createStars();  


    /* -------------------------------------------------  
       Criar partículas de Saturno  
    ------------------------------------------------- */  

    createSaturnRingParticles();  


    /* -------------------------------------------------  
       Ativar zoom por dois dedos  
    ------------------------------------------------- */  

    setupPinchZoom();  

}

);
