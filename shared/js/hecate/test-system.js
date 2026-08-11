// ============================================
// 🗝️ HÉCATE - RITUAL DE ACESSO
// VERSÃO CINEMATOGRÁFICA V6
// RESPONSIVO — MOBILE / TABLET / DESKTOP
//
// ✦ HÉCATE FLUTUA DE FORMA LEVE
// ✦ BOTÃO DE VOZ MAIS VISÍVEL
// ============================================

(function () {

    'use strict';


    // ==========================================
    // 🔥 BANCO DE PERGUNTAS
    // ==========================================

    const QUESTION_BANK = {

        senha: {

            pergunta: "O GRIMÓRIO ESTÁ TRANCADO",

            dica: "nome da primeira Asura",

            validar: (r) =>
                r.toLowerCase().trim() === "astreia"
        },


        sabedoria: {

            perguntas: [

                {
                    texto: "O que significa WZ no nome do projeto?",
                    dica: "World _ _ _ _ _",

                    validar: (r) =>
                        r.toLowerCase().includes("azure") ||
                        r.toLowerCase().includes("azul")
                },


                {
                    texto: "Quantos Asuras existem no Grimório?",
                    dica: "Conte os cards giratórios",

                    validar: (r) =>
                        r.trim() === "9" ||
                        r.toLowerCase().trim() === "nove"
                },


                {
                    texto: "Qual Asura controla as sombras e o vazio?",
                    dica: "Começa com 'U'",

                    validar: (r) =>
                        r.toLowerCase().includes("umbra")
                },


                {
                    texto: "Qual Asura é conhecida como 'A Maga das Invenções'?",
                    dica: "Começa com 'D'",

                    validar: (r) =>
                        r.toLowerCase().includes("daedala")
                },


                {
                    texto: "Qual Asura representa a Justiça e as constelações?",
                    dica: "Começa com 'A'",

                    validar: (r) =>
                        r.toLowerCase().includes("astreia")
                },


                {
                    texto: "Qual Asura representa a Vitória?",
                    dica: "Começa com 'V'",

                    validar: (r) =>
                        r.toLowerCase().includes("victoria")
                },


                {
                    texto: "Qual Asura protege o lar e a sacralidade?",
                    dica: "Começa com 'H'",

                    validar: (r) =>
                        r.toLowerCase().includes("hestia")
                }

            ],


            getRandomQuestions: function () {

                const shuffled =
                    [...this.perguntas];


                for (
                    let i = shuffled.length - 1;
                    i > 0;
                    i--
                ) {

                    const j =
                        Math.floor(
                            Math.random() * (i + 1)
                        );


                    [
                        shuffled[i],
                        shuffled[j]
                    ] = [
                        shuffled[j],
                        shuffled[i]
                    ];
                }


                return shuffled.slice(0, 3);
            }
        },


        virtude: {

            perguntas: [

                {
                    texto:
                        "O QUE FARIA COM O PODER DA HÉCATE?",

                    opcoes: [
                        "Proteger os fracos",
                        "Fazer justiça",
                        "Compartilhar o poder"
                    ],

                    pontos: [
                        10,
                        9,
                        7
                    ]
                },


                {
                    texto:
                        "VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?",

                    opcoes: [
                        "Compaixão",
                        "Justiça",
                        "Sabedoria"
                    ],

                    pontos: [
                        10,
                        9,
                        8
                    ]
                },


                {
                    texto:
                        "ACEITA A RESPONSABILIDADE DE PROTEGER?",

                    opcoes: [
                        "Sim, aceito",
                        "Sim, com honra",
                        "Aceito"
                    ],

                    pontos: [
                        10,
                        10,
                        10
                    ]
                }

            ],


            getRandomQuestions: function () {

                const shuffled =
                    [...this.perguntas];


                for (
                    let i = shuffled.length - 1;
                    i > 0;
                    i--
                ) {

                    const j =
                        Math.floor(
                            Math.random() * (i + 1)
                        );


                    [
                        shuffled[i],
                        shuffled[j]
                    ] = [
                        shuffled[j],
                        shuffled[i]
                    ];
                }


                return shuffled.slice(0, 3);
            }
        }
    };


    // ==========================================
    // ⚙️ ESTADO
    // ==========================================

    const MIN_VIRTUE_SCORE = 20;


    let testActive = false;

    let currentLevel = 1;

    let currentQuestions = [];

    let currentIndex = 0;

    let virtueScore = 0;

    let onCompleteCallback = null;

    let overlay = null;

    let isVoiceEnabled = false;


    // ==========================================
    // 🧠 HISTÓRICO
    // ==========================================

    const conversationHistory = [];


    function registerMessage(
        text,
        isUser,
        type
    ) {

        conversationHistory.push({

            role:
                isUser
                    ? 'user'
                    : 'assistant',

            content:
                text,

            type:
                type || 'normal',

            timestamp:
                Date.now()
        });
    }


    // ==========================================
    // 🔊 VOZ
    // ==========================================

    function speakText(text) {

        if (!isVoiceEnabled) return;


        if (
            !('speechSynthesis' in window)
        ) {

            return;
        }


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        utterance.lang =
            'pt-BR';

        utterance.rate =
            0.85;

        utterance.pitch =
            0.8;

        utterance.volume =
            0.6;


        window.speechSynthesis.speak(
            utterance
        );
    }


    // ==========================================
    // 💬 CHAT / HISTÓRICO VISUAL
    // ==========================================

    function addMessageToChat(
        text,
        isUser = false,
        type = 'normal'
    ) {

        const chatMsg =
            document.getElementById(
                'hecateChatMessages'
            );


        if (!chatMsg) return;


        registerMessage(
            text,
            isUser,
            type
        );


        const msgDiv =
            document.createElement('div');


        let color =
            '#a78bfa';

        let fontSize =
            '16px';

        let align =
            'center';

        let letterSpacing =
            '2px';

        let opacity =
            '1';

        let marginBottom =
            '10px';

        let fontStyle =
            'normal';

        let prefix =
            '';

        let animation =
            'aparecerPalavra 1.2s ease-out';

        let extraClass =
            '';


        // ======================================
        // PERGUNTA
        // ======================================

        if (type === 'question') {

            color =
                '#d8ceff';


            fontSize =
                'clamp(17px, 2.1vw, 28px)';


            letterSpacing =
                'clamp(2px, 0.35vw, 5px)';


            marginBottom =
                '20px';


            fontStyle =
                'italic';


            animation =
                'aparecerPalavra 1.5s ease-out, ' +
                'perguntaRespirar 4s ease-in-out 1.5s infinite';


            extraClass =
                'question-text';
        }


        // ======================================
        // DICA
        // ======================================

        else if (type === 'hint') {

            color =
                'rgba(167,139,250,0.48)';


            fontSize =
                'clamp(11px, 1.2vw, 14px)';


            letterSpacing =
                'clamp(2px, 0.3vw, 4px)';


            marginBottom =
                '15px';
        }


        // ======================================
        // USUÁRIO
        // ======================================

        else if (isUser) {

            color =
                'rgba(167,139,250,0.68)';


            fontSize =
                'clamp(12px, 1.2vw, 15px)';


            letterSpacing =
                'clamp(2px, 0.25vw, 4px)';


            opacity =
                '0.75';


            marginBottom =
                '8px';


            prefix =
                '✦ ';
        }


        // ======================================
        // SISTEMA
        // ======================================

        else if (type === 'system') {

            color =
                'rgba(255,255,255,0.28)';


            fontSize =
                'clamp(9px, 1vw, 12px)';


            letterSpacing =
                'clamp(3px, 0.5vw, 7px)';


            marginBottom =
                '8px';


            opacity =
                '0.7';


            animation =
                'aparecerSimbolo 1.2s ease-out';
        }


        msgDiv.style.cssText = `

            font-family:
                'Georgia',
                serif;

            font-size:
                ${fontSize};

            color:
                ${color};

            text-shadow:
                0 2px 3px #000,
                0 0 8px #000,
                0 0 18px
                rgba(0,0,0,0.9);

            background:
                transparent;

            text-align:
                ${align};

            width:
                100%;

            max-width:
                100%;

            margin-bottom:
                ${marginBottom};

            padding:
                2px 8px;

            box-sizing:
                border-box;

            animation:
                ${animation};

            letter-spacing:
                ${letterSpacing};

            opacity:
                ${opacity};

            font-style:
                ${fontStyle};

            line-height:
                1.45;

            transition:
                opacity 0.5s ease,
                transform 0.5s ease;
        `;


        if (extraClass) {

            msgDiv.className =
                extraClass;
        }


        msgDiv.textContent =
            prefix + text;


        chatMsg.appendChild(
            msgDiv
        );


        requestAnimationFrame(() => {

            chatMsg.scrollTo({

                top:
                    chatMsg.scrollHeight,

                behavior:
                    'smooth'
            });

        });
    }


    // ==========================================
    // ✦ MENSAGEM DE STATUS
    // ==========================================

    function showMessage(
        text,
        color,
        duration = 1500
    ) {

        const msg =
            document.createElement('div');


        msg.textContent =
            text;


        msg.style.cssText = `

            position:
                fixed;

            bottom:
                30%;

            left:
                50%;

            transform:
                translateX(-50%);

            max-width:
                calc(100vw - 40px);

            box-sizing:
                border-box;

            text-align:
                center;

            background:
                rgba(0,0,0,0.82);

            border:
                1px solid ${color};

            color:
                ${color};

            padding:
                7px 20px;

            border-radius:
                20px;

            z-index:
                900010;

            font-family:
                'Georgia',
                serif;

            font-size:
                clamp(10px, 1.5vw, 14px);

            letter-spacing:
                clamp(2px, 0.5vw, 6px);

            box-shadow:
                0 0 40px
                rgba(155,48,255,0.05);

            text-shadow:
                0 2px 8px
                rgba(0,0,0,0.95);

            backdrop-filter:
                blur(8px);

            opacity:
                0.85;

            pointer-events:
                none;

            animation:
                aparecerPalavra
                0.7s
                ease-out;
        `;


        document.body.appendChild(
            msg
        );


        setTimeout(() => {

            msg.style.transition =
                'opacity 1s ease';

            msg.style.opacity =
                '0';


            setTimeout(() => {

                if (msg.parentNode) {

                    msg.remove();
                }

            }, 1000);

        }, duration);
    }


    // ==========================================
    // ✦ TRANSIÇÃO ENTRE NÍVEIS
    // ==========================================

    function levelTransition(
        nextLevel,
        delay = 800
    ) {

        addMessageToChat(
            "✦",
            false,
            'system'
        );


        if (isVoiceEnabled) {

            const phrases = {

                2:
                    "A sabedoria será colocada à prova.",

                3:
                    "Agora, revele sua virtude."
            };


            if (phrases[nextLevel]) {

                speakText(
                    phrases[nextLevel]
                );
            }
        }


        setTimeout(() => {

            startLevel(
                nextLevel
            );

        }, delay);
    }


    // ==========================================
    // 🎬 INTERFACE PRINCIPAL
    // ==========================================

    function showTestInterface(
        callback
    ) {

        if (testActive) return;


        testActive =
            true;


        onCompleteCallback =
            callback;


        conversationHistory.length =
            0;


        overlay =
            document.createElement('div');


        overlay.id =
            'hecate-test-overlay';


        overlay.innerHTML = `

            <!-- ==================================
                 CAMADA 1 — VAZIO
            ================================== -->

            <div
                class="hecate-layer hecate-void"
            ></div>


            <!-- ==================================
                 CAMADA 2 — HÉCATE
            ================================== -->

            <div
                id="hecate-entity"
                class="hecate-layer hecate-entity"
            ></div>


            <!-- ==================================
                 CAMADA 3 — ATMOSFERA
            ================================== -->

            <div
                id="hecate-dialog-atmosphere"
                class="hecate-layer hecate-atmosphere"
            ></div>


            <!-- ==================================
                 CAMADA 4 — DIÁLOGO
            ================================== -->

            <div
                id="hecate-chat-container"
                class="hecate-chat-container"
            >

                <div
                    id="hecateChatMessages"
                    class="hecate-chat-messages"
                >

                    <div
                        class="
                            question-text
                            initial-question
                        "
                    >
                        O GRIMÓRIO ESTÁ TRANCADO
                    </div>


                    <div
                        class="
                            initial-hint
                        "
                    >
                        nome da primeira Asura
                    </div>

                </div>


                <div
                    id="hecateTestContent"
                    class="hecate-test-content"
                >

                    <input
                        type="password"
                        id="hecateInput"
                        placeholder="—"
                        autocomplete="off"
                        aria-label="Resposta para Hécate"
                    >


                    <div
                        id="magic-line"
                        class="magic-line"
                    ></div>


                    <button
                        id="hecateBtn"
                        type="button"
                        style="display:none;"
                    ></button>

                </div>

            </div>


            <!-- ==================================
                 🔊 BOTÃO DE VOZ HÉCATE
            ================================== -->

            <div
                id="jarvis-toggle"
                role="button"
                tabindex="0"
                aria-label="Ativar voz de Hécate"
                title="Voz de Hécate"
            >

                <span
                    class="jarvis-ring jarvis-ring-1"
                ></span>

                <span
                    class="jarvis-ring jarvis-ring-2"
                ></span>

                <span
                    id="jarvis-icon"
                >
                    ◇
                </span>

            </div>


            <!-- ==================================
                 CSS
            ================================== -->

            <style>

                /* =================================
                   RESET
                ================================= */

                #hecate-test-overlay {

                    position:
                        fixed;

                    inset:
                        0;

                    width:
                        100vw;

                    height:
                        100dvh;

                    z-index:
                        900000;

                    background:
                        #000;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    font-family:
                        'Georgia',
                        serif;

                    overflow:
                        hidden;

                    opacity:
                        1;

                    isolation:
                        isolate;

                    box-sizing:
                        border-box;
                }


                #hecate-test-overlay *,
                #hecate-test-overlay *::before,
                #hecate-test-overlay *::after {

                    box-sizing:
                        border-box;
                }


                /* =================================
                   CAMADAS
                ================================= */

                .hecate-layer {

                    position:
                        absolute;

                    inset:
                        0;

                    pointer-events:
                        none;
                }


                /* =================================
                   VAZIO
                ================================= */

                .hecate-void {

                    background:
                        #000;

                    z-index:
                        0;
                }


                /* =================================
                   HÉCATE
                ================================= */

                .hecate-entity {

                    z-index:
                        1;

                    background-image:
                        url('/world_azure/images/hecate1_hq.png');

                    background-repeat:
                        no-repeat;

                    background-position:
                        center center;

                    background-size:
                        contain;

                    transform:
                        translate3d(
                            0,
                            0,
                            0
                        )
                        scale(0.82);

                    /*
                     * ✦ FLUTUAÇÃO LEVE
                     *
                     * Não sobe muito.
                     * Não gira.
                     * É uma oscilação
                     * espiritual bem sutil.
                     */

                    animation:
                        hecateFlutuar
                        9s
                        ease-in-out
                        infinite;

                    filter:
                        contrast(1.05)
                        brightness(1.02);

                    will-change:
                        transform;
                }


                /* =================================
                   ✦ FLUTUAÇÃO DE HÉCATE
                ================================= */

                @keyframes hecateFlutuar {

                    0% {

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.82);
                    }


                    25% {

                        transform:
                            translate3d(
                                0,
                                -7px,
                                0
                            )
                            scale(0.82);
                    }


                    50% {

                        transform:
                            translate3d(
                                0,
                                -12px,
                                0
                            )
                            scale(0.82);
                    }


                    75% {

                        transform:
                            translate3d(
                                0,
                                -6px,
                                0
                            )
                            scale(0.82);
                    }


                    100% {

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.82);
                    }
                }


                /* =================================
                   ATMOSFERA
                ================================= */

                .hecate-atmosphere {

                    z-index:
                        2;

                    background:

                        radial-gradient(
                            ellipse 80% 32%
                            at 50% 88%,

                            rgba(
                                0,
                                0,
                                0,
                                0.94
                            )
                            0%,

                            rgba(
                                0,
                                0,
                                0,
                                0.70
                            )
                            30%,

                            rgba(
                                0,
                                0,
                                0,
                                0.28
                            )
                            55%,

                            transparent
                            80%
                        );
                }


                /* =================================
                   CHAT
                ================================= */

                .hecate-chat-container {

                    position:
                        absolute;

                    left:
                        0;

                    bottom:
                        0;

                    width:
                        100%;

                    z-index:
                        3;

                    display:
                        flex;

                    flex-direction:
                        column;

                    justify-content:
                        flex-end;

                    align-items:
                        center;

                    padding:
                        clamp(16px, 3vw, 32px)
                        clamp(16px, 5vw, 60px)
                        clamp(28px, 5vh, 55px);

                    pointer-events:
                        auto;

                    background:
                        transparent;
                }


                /* =================================
                   HISTÓRICO
                ================================= */

                .hecate-chat-messages {

                    width:
                        min(
                            100%,
                            850px
                        );

                    max-height:
                        min(
                            38vh,
                            420px
                        );

                    overflow-y:
                        auto;

                    display:
                        flex;

                    flex-direction:
                        column;

                    align-items:
                        center;

                    justify-content:
                        flex-end;

                    gap:
                        5px;

                    padding:
                        12px
                        8px
                        8px;

                    scroll-behavior:
                        smooth;

                    mask-image:
                        linear-gradient(
                            to bottom,
                            transparent 0%,
                            black 12%,
                            black 100%
                        );

                    -webkit-mask-image:
                        linear-gradient(
                            to bottom,
                            transparent 0%,
                            black 12%,
                            black 100%
                        );
                }


                #hecateChatMessages::-webkit-scrollbar {

                    width:
                        0;
                }


                /* =================================
                   PERGUNTA INICIAL
                ================================= */

                .initial-question {

                    font-size:
                        clamp(
                            17px,
                            2.2vw,
                            28px
                        );

                    color:
                        #d8ceff;

                    opacity:
                        1;

                    text-shadow:
                        0 2px 3px #000,
                        0 0 8px #000,
                        0 0 18px
                        rgba(
                            0,
                            0,
                            0,
                            0.95
                        );

                    background:
                        transparent;

                    text-align:
                        center;

                    align-self:
                        center;

                    animation:
                        aparecerPalavra
                        2s
                        ease-out,

                        perguntaRespirar
                        4s
                        ease-in-out
                        2s
                        infinite;

                    letter-spacing:
                        clamp(
                            2px,
                            0.4vw,
                            5px
                        );

                    font-style:
                        italic;

                    line-height:
                        1.4;

                    margin-bottom:
                        15px;

                    max-width:
                        850px;
                }


                /* =================================
                   DICA INICIAL
                ================================= */

                .initial-hint {

                    font-size:
                        clamp(
                            11px,
                            1.1vw,
                            14px
                        );

                    color:
                        rgba(
                            167,
                            139,
                            250,
                            0.38
                        );

                    opacity:
                        1;

                    text-shadow:
                        0 2px 3px #000,
                        0 0 8px #000;

                    text-align:
                        center;

                    letter-spacing:
                        clamp(
                            2px,
                            0.35vw,
                            4px
                        );

                    animation:
                        aparecerPalavra
                        2.5s
                        ease-out;

                    margin-bottom:
                        5px;
                }


                /* =================================
                   ÁREA DO INPUT
                ================================= */

                .hecate-test-content {

                    pointer-events:
                        auto;

                    width:
                        min(
                            100%,
                            420px
                        );

                    margin:
                        8px auto 0;

                    position:
                        relative;
                }


                /* =================================
                   INPUT
                ================================= */

                #hecateInput {

                    width:
                        100%;

                    padding:
                        9px 4px;

                    background:
                        transparent;

                    border:
                        none;

                    color:
                        #f0eaff;

                    text-align:
                        center;

                    font-size:
                        clamp(
                            18px,
                            2vw,
                            23px
                        );

                    outline:
                        none;

                    font-family:
                        'Georgia',
                        serif;

                    letter-spacing:
                        clamp(
                            4px,
                            0.7vw,
                            9px
                        );

                    text-shadow:
                        0 2px 3px #000,
                        0 0 8px #000,
                        0 0 18px
                        rgba(
                            0,
                            0,
                            0,
                            0.9
                        );

                    transition:
                        all 0.5s ease;

                    border-radius:
                        0;

                    appearance:
                        none;
                }


                #hecateInput::placeholder {

                    color:
                        rgba(
                            216,
                            206,
                            255,
                            0.25
                        );

                    opacity:
                        1;
                }


                #hecateInput:focus {

                    letter-spacing:
                        clamp(
                            5px,
                            0.9vw,
                            10px
                        );
                }


                /* =================================
                   LINHA MÁGICA
                ================================= */

                .magic-line {

                    position:
                        absolute;

                    bottom:
                        0;

                    left:
                        0;

                    width:
                        100%;

                    height:
                        1px;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(
                                167,
                                139,
                                250,
                                0.15
                            ),
                            transparent
                        );

                    transition:
                        all 0.8s ease;
                }


                #hecateInput:focus
                + .magic-line {

                    animation:
                        magicPulse
                        3s
                        ease-in-out
                        infinite;
                }


                /* =========================================
                   🔊 BOTÃO DE VOZ — VISÍVEL
                ========================================= */

                #jarvis-toggle {

                    position:
                        fixed;

                    bottom:
                        clamp(
                            18px,
                            3vh,
                            32px
                        );

                    right:
                        clamp(
                            18px,
                            3vw,
                            32px
                        );

                    z-index:
                        900020;

                    width:
                        52px;

                    height:
                        52px;

                    border-radius:
                        50%;

                    background:
                        radial-gradient(
                            circle,
                            rgba(
                                167,
                                139,
                                250,
                                0.20
                            ) 0%,

                            rgba(
                                30,
                                10,
                                60,
                                0.82
                            ) 55%,

                            rgba(
                                0,
                                0,
                                0,
                                0.92
                            ) 100%
                        );

                    border:
                        1px solid
                        rgba(
                            167,
                            139,
                            250,
                            0.55
                        );

                    box-shadow:
                        0 0 10px
                        rgba(
                            167,
                            139,
                            250,
                            0.25
                        ),

                        0 0 25px
                        rgba(
                            167,
                            139,
                            250,
                            0.12
                        ),

                        inset 0 0 12px
                        rgba(
                            167,
                            139,
                            250,
                            0.12
                        );

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    cursor:
                        pointer;

                    transition:
                        transform 0.35s ease,
                        opacity 0.35s ease,
                        border-color 0.35s ease,
                        box-shadow 0.35s ease;

                    pointer-events:
                        auto;

                    opacity:
                        0.82;

                    user-select:
                        none;

                    touch-action:
                        manipulation;

                    overflow:
                        visible;
                }


                /* =================================
                   ANÉIS DO BOTÃO
                ================================= */

                .jarvis-ring {

                    position:
                        absolute;

                    left:
                        50%;

                    top:
                        50%;

                    width:
                        100%;

                    height:
                        100%;

                    border-radius:
                        50%;

                    transform:
                        translate(
                            -50%,
                            -50%
                        );

                    pointer-events:
                        none;
                }


                .jarvis-ring-1 {

                    border:
                        1px solid
                        rgba(
                            167,
                            139,
                            250,
                            0.20
                        );

                    animation:
                        jarvisPulse
                        3.5s
                        ease-in-out
                        infinite;
                }


                .jarvis-ring-2 {

                    width:
                        125%;

                    height:
                        125%;

                    border:
                        1px solid
                        rgba(
                            167,
                            139,
                            250,
                            0.08
                        );

                    animation:
                        jarvisRing
                        4s
                        ease-in-out
                        infinite;
                }


                /* =================================
                   ÍCONE
                ================================= */

                #jarvis-icon {

                    position:
                        relative;

                    z-index:
                        5;

                    font-size:
                        24px;

                    color:
                        #c7b5ff;

                    line-height:
                        1;

                    transition:
                        all 0.35s ease;

                    text-shadow:
                        0 0 8px
                        rgba(
                            167,
                            139,
                            250,
                            0.8
                        ),

                        0 0 18px
                        rgba(
                            167,
                            139,
                            250,
                            0.45
                        );
                }


                /* =================================
                   HOVER / TOQUE
                ================================= */

                #jarvis-toggle:hover {

                    opacity:
                        1;

                    transform:
                        scale(1.08);

                    border-color:
                        rgba(
                            200,
                            180,
                            255,
                            0.9
                        );

                    box-shadow:
                        0 0 15px
                        rgba(
                            167,
                            139,
                            250,
                            0.45
                        ),

                        0 0 35px
                        rgba(
                            167,
                            139,
                            250,
                            0.25
                        ),

                        inset 0 0 15px
                        rgba(
                            167,
                            139,
                            250,
                            0.18
                        );
                }


                #jarvis-toggle:active {

                    transform:
                        scale(0.94);
                }


                /* =================================
                   VOZ ATIVA
                ================================= */

                #jarvis-toggle.active {

                    opacity:
                        1;

                    border-color:
                        rgba(
                            0,
                            255,
                            136,
                            0.8
                        );

                    background:
                        radial-gradient(
                            circle,
                            rgba(
                                0,
                                255,
                                136,
                                0.18
                            ) 0%,

                            rgba(
                                10,
                                50,
                                35,
                                0.85
                            ) 55%,

                            rgba(
                                0,
                                0,
                                0,
                                0.95
                            ) 100%
                        );

                    box-shadow:
                        0 0 15px
                        rgba(
                            0,
                            255,
                            136,
                            0.35
                        ),

                        0 0 35px
                        rgba(
                            0,
                            255,
                            136,
                            0.20
                        ),

                        inset 0 0 15px
                        rgba(
                            0,
                            255,
                            136,
                            0.15
                        );
                }


                #jarvis-toggle.active
                #jarvis-icon {

                    color:
                        #5dffae;

                    text-shadow:
                        0 0 8px
                        rgba(
                            0,
                            255,
                            136,
                            0.9
                        ),

                        0 0 20px
                        rgba(
                            0,
                            255,
                            136,
                            0.5
                        );

                    animation:
                        vozAtiva
                        2s
                        ease-in-out
                        infinite;
                }


                #jarvis-toggle.active
                .jarvis-ring-1 {

                    border-color:
                        rgba(
                            0,
                            255,
                            136,
                            0.25
                        );
                }


                #jarvis-toggle.active
                .jarvis-ring-2 {

                    border-color:
                        rgba(
                            0,
                            255,
                            136,
                            0.12
                        );
                }


                /* =================================
                   VIRTUDE
                ================================= */

                .virtue-opt {

                    display:
                        block;

                    width:
                        100%;

                    margin:
                        5px 0;

                    padding:
                        clamp(
                            8px,
                            1.2vh,
                            12px
                        )
                        clamp(
                            10px,
                            1.5vw,
                            18px
                        );

                    background:
                        rgba(
                            255,
                            215,
                            0,
                            0.02
                        );

                    border:
                        1px solid
                        rgba(
                            255,
                            215,
                            0,
                            0.06
                        );

                    border-radius:
                        10px;

                    color:
                        rgba(
                            255,
                            215,
                            0,
                            0.6
                        );

                    cursor:
                        pointer;

                    font-size:
                        clamp(
                            11px,
                            1.2vw,
                            14px
                        );

                    font-family:
                        'Georgia',
                        serif;

                    transition:
                        all 0.6s ease;

                    text-shadow:
                        0 2px 3px #000,
                        0 0 8px #000;

                    letter-spacing:
                        clamp(
                            1px,
                            0.25vw,
                            3px
                        );

                    text-align:
                        center;

                    line-height:
                        1.4;

                    touch-action:
                        manipulation;
                }


                .virtue-opt:hover {

                    background:
                        rgba(
                            255,
                            215,
                            0,
                            0.04
                        );

                    border-color:
                        rgba(
                            255,
                            215,
                            0,
                            0.15
                        );

                    transform:
                        scale(1.01);

                    color:
                        rgba(
                            255,
                            215,
                            0,
                            0.8
                        );
                }


                .virtue-opt:active {

                    transform:
                        scale(0.98);

                    background:
                        rgba(
                            255,
                            215,
                            0,
                            0.08
                        );
                }


                /* =================================
                   ANIMAÇÕES
                ================================= */

                @keyframes aparecerPalavra {

                    from {

                        opacity:
                            0;

                        transform:
                            translateY(
                                12px
                            );
                    }

                    to {

                        opacity:
                            1;

                        transform:
                            translateY(
                                0
                            );
                    }
                }


                @keyframes aparecerSimbolo {

                    from {

                        opacity:
                            0;

                        transform:
                            scale(
                                0.7
                            );
                    }

                    to {

                        opacity:
                            0.7;

                        transform:
                            scale(
                                1
                            );
                    }
                }


                @keyframes perguntaRespirar {

                    0%,
                    100% {

                        opacity:
                            1;
                    }

                    50% {

                        opacity:
                            0.72;
                    }
                }


                @keyframes magicPulse {

                    0%,
                    100% {

                        opacity:
                            0.35;

                        box-shadow:
                            0 0 4px
                            rgba(
                                167,
                                139,
                                250,
                                0.1
                            );
                    }

                    50% {

                        opacity:
                            1;

                        box-shadow:
                            0 0 12px
                            rgba(
                                167,
                                139,
                                250,
                                0.35
                            );
                    }
                }


                @keyframes jarvisPulse {

                    0%,
                    100% {

                        transform:
                            translate(
                                -50%,
                                -50%
                            )
                            scale(1);

                        opacity:
                            0.55;
                    }

                    50% {

                        transform:
                            translate(
                                -50%,
                                -50%
                            )
                            scale(1.08);

                        opacity:
                            1;
                    }
                }


                @keyframes jarvisRing {

                    0%,
                    100% {

                        transform:
                            translate(
                                -50%,
                                -50%
                            )
                            scale(0.92);

                        opacity:
                            0.15;
                    }

                    50% {

                        transform:
                            translate(
                                -50%,
                                -50%
                            )
                            scale(1.08);

                        opacity:
                            0.45;
                    }
                }


                @keyframes vozAtiva {

                    0%,
                    100% {

                        transform:
                            scale(1);
                    }

                    50% {

                        transform:
                            scale(1.12);
                    }
                }


                /* =================================
                   TABLET
                   481px — 1024px
                ================================= */

                @media
                (min-width:481px)
                and
                (max-width:1024px) {

                    .hecate-entity {

                        background-position:
                            center 45%;

                        background-size:
                            contain;

                        animation:
                            hecateFlutuarTablet
                            9s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarTablet {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.78);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -10px,
                                    0
                                )
                                scale(0.78);
                        }
                    }


                    .hecate-chat-container {

                        padding-left:
                            8vw;

                        padding-right:
                            8vw;

                        padding-bottom:
                            5vh;
                    }


                    .hecate-chat-messages {

                        width:
                            min(
                                90vw,
                                720px
                            );

                        max-height:
                            36vh;
                    }


                    .hecate-test-content {

                        width:
                            min(
                                80vw,
                                390px
                            );
                    }
                }


                /* =================================
                   DESKTOP
                   1025px+
                ================================= */

                @media
                (min-width:1025px) {

                    .hecate-entity {

                        background-position:
                            center 43%;

                        animation:
                            hecateFlutuarDesktop
                            10s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarDesktop {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.86);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -13px,
                                    0
                                )
                                scale(0.86);
                        }
                    }


                    .hecate-chat-container {

                        padding-bottom:
                            4vh;
                    }


                    .hecate-chat-messages {

                        max-height:
                            34vh;

                        width:
                            min(
                                80vw,
                                900px
                            );
                    }


                    .hecate-test-content {

                        width:
                            420px;
                    }
                }


                /* =================================
                   TELAS PEQUENAS
                ================================= */

                @media
                (max-width:480px) {

                    .hecate-entity {

                        background-position:
                            center 38%;

                        background-size:
                            contain;

                        animation:
                            hecateFlutuarMobile
                            9s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarMobile {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.82);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -8px,
                                    0
                                )
                                scale(0.82);
                        }
                    }


                    .hecate-chat-container {

                        padding:
                            15px
                            14px
                            30px
                            14px;
                    }


                    .hecate-chat-messages {

                        width:
                            100%;

                        max-height:
                            38vh;
                    }


                    .hecate-test-content {

                        width:
                            min(
                                100%,
                                320px
                            );
                    }


                    #hecateInput {

                        font-size:
                            18px;

                        letter-spacing:
                            5px;
                    }


                    #hecateInput:focus {

                        letter-spacing:
                            4px;
                    }


                    .virtue-opt {

                        font-size:
                            12px;

                        padding:
                            10px 8px;
                    }


                    /* botão ligeiramente menor no celular */

                    #jarvis-toggle {

                        width:
                            50px;

                        height:
                            50px;

                        right:
                            16px;

                        bottom:
                            16px;
                    }


                    #jarvis-icon {

                        font-size:
                            22px;
                    }
                }


                /* =================================
                   CELULAR MUITO PEQUENO
                ================================= */

                @media
                (max-width:380px) {

                    .hecate-entity {

                        background-position:
                            center 34%;

                        animation:
                            hecateFlutuarSmall
                            9s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarSmall {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.78);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -6px,
                                    0
                                )
                                scale(0.78);
                        }
                    }


                    #hecateInput {

                        font-size:
                            16px;

                        letter-spacing:
                            4px;
                    }


                    #hecateInput:focus {

                        letter-spacing:
                            2px;
                    }


                    .hecate-chat-messages {

                        max-height:
                            40vh;
                    }


                    .hecate-chat-container {

                        padding-bottom:
                            25px;
                    }


                    #jarvis-toggle {

                        width:
                            48px;

                        height:
                            48px;

                        right:
                            13px;

                        bottom:
                            13px;
                    }


                    #jarvis-icon {

                        font-size:
                            21px;
                    }
                }


                /* =================================
                   TELAS MUITO ALTAS
                ================================= */

                @media
                (min-height:800px) {

                    .hecate-chat-messages {

                        max-height:
                            32vh;
                    }
                }


                /* =================================
                   TELAS MUITO LARGAS
                ================================= */

                @media
                (min-width:1400px) {

                    .hecate-entity {

                        animation:
                            hecateFlutuarLarge
                            11s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarLarge {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.94);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -15px,
                                    0
                                )
                                scale(0.94);
                        }
                    }


                    .hecate-chat-messages {

                        width:
                            min(
                                65vw,
                                950px
                            );
                    }
                }


                /* =================================
                   LANDSCAPE MOBILE
                ================================= */

                @media
                (max-height:500px)
                and
                (orientation:landscape) {

                    .hecate-entity {

                        background-position:
                            center 35%;

                        animation:
                            hecateFlutuarLandscape
                            8s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarLandscape {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.72);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -6px,
                                    0
                                )
                                scale(0.72);
                        }
                    }


                    .hecate-chat-container {

                        padding:
                            8px
                            12px
                            12px;
                    }


                    .hecate-chat-messages {

                        max-height:
                            38vh;
                    }


                    .initial-question {

                        font-size:
                            clamp(
                                14px,
                                3vw,
                                20px
                            );

                        margin-bottom:
                            8px;
                    }


                    .initial-hint {

                        font-size:
                            10px;

                        margin-bottom:
                            2px;
                    }


                    #hecateInput {

                        padding:
                            5px 2px;

                        font-size:
                            16px;
                    }


                    #jarvis-toggle {

                        bottom:
                            10px;

                        right:
                            12px;

                        width:
                            46px;

                        height:
                            46px;
                    }
                }


                /* =================================
                   LANDSCAPE TABLET
                ================================= */

                @media
                (min-width:700px)
                and
                (max-height:600px)
                and
                (orientation:landscape) {

                    .hecate-entity {

                        animation:
                            hecateFlutuarLandscapeTablet
                            9s
                            ease-in-out
                            infinite;
                    }


                    @keyframes hecateFlutuarLandscapeTablet {

                        0%,
                        100% {

                            transform:
                                translate3d(
                                    0,
                                    0,
                                    0
                                )
                                scale(0.76);
                        }

                        50% {

                            transform:
                                translate3d(
                                    0,
                                    -9px,
                                    0
                                )
                                scale(0.76);
                        }
                    }


                    .hecate-chat-container {

                        padding-bottom:
                            18px;
                    }


                    .hecate-chat-messages {

                        max-height:
                            34vh;
                    }
                }


                /* =================================
                   REDUÇÃO DE MOVIMENTO
                ================================= */

                @media
                (prefers-reduced-motion: reduce) {

                    #hecate-entity {

                        animation:
                            none !important;
                    }


                    .question-text {

                        animation:
                            none !important;
                    }


                    .jarvis-ring {

                        animation:
                            none !important;
                    }


                    #jarvis-icon {

                        animation:
                            none !important;
                    }


                    * {

                        scroll-behavior:
                            auto !important;
                    }
                }

            </style>
        `;


        document.body.appendChild(
            overlay
        );


        // ==========================================
        // 🔊 BOTÃO DE VOZ
        // ==========================================

        const toggleBtn =
            document.getElementById(
                'jarvis-toggle'
            );


        if (toggleBtn) {

            const toggleVoice = () => {

                isVoiceEnabled =
                    !isVoiceEnabled;


                toggleBtn.classList.toggle(
                    'active',
                    isVoiceEnabled
                );


                const icon =
                    document.getElementById(
                        'jarvis-icon'
                    );


                if (icon) {

                    icon.textContent =
                        isVoiceEnabled
                            ? '◈'
                            : '◇';
                }


                if (isVoiceEnabled) {

                    speakText(
                        "Estou ouvindo."
                    );


                    toggleBtn.style.opacity =
                        '1';

                } else {

                    if (
                        'speechSynthesis'
                        in window
                    ) {

                        window.speechSynthesis.cancel();
                    }


                    toggleBtn.style.opacity =
                        '0.82';
                }
            };


            toggleBtn.addEventListener(
                'click',
                toggleVoice
            );


            toggleBtn.addEventListener(
                'keydown',
                (event) => {

                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {

                        event.preventDefault();

                        toggleVoice();
                    }
                }
            );
        }


        // ==========================================
        // 🎯 FOCO INICIAL
        // ==========================================

        setTimeout(() => {

            const input =
                document.getElementById(
                    'hecateInput'
                );


            if (input) {

                input.focus();

                input.placeholder =
                    '—';
            }

        }, 800);


        // ==========================================
        // ⌨️ INPUT
        // ==========================================

        setupInputHandler();
    }


    // ==========================================
    // ⌨️ CONFIGURAR INPUT
    // ==========================================

    function setupInputHandler() {

        const btn =
            document.getElementById(
                'hecateBtn'
            );


        const input =
            document.getElementById(
                'hecateInput'
            );


        if (!btn || !input) return;


        const newBtn =
            btn.cloneNode(true);


        btn.parentNode.replaceChild(
            newBtn,
            btn
        );


        const handleSubmit = () => {

            const value =
                input.value.trim();


            if (!value) return;


            // ======================================
            // NÍVEL 1 — SENHA
            // ======================================

            if (currentLevel === 1) {

                if (
                    QUESTION_BANK
                        .senha
                        .validar(value)
                ) {

                    addMessageToChat(
                        value,
                        true
                    );


                    if (isVoiceEnabled) {

                        speakText(
                            "Aprovado."
                        );
                    }


                    showMessage(
                        "✦ APROVADO ✦",
                        "#a78bfa"
                    );


                    input.value =
                        '';

                    input.placeholder =
                        '...';


                    levelTransition(
                        2,
                        800
                    );

                } else {

                    addMessageToChat(
                        value,
                        true
                    );


                    if (isVoiceEnabled) {

                        speakText(
                            "Reprovado."
                        );
                    }


                    failTest();
                }


                return;
            }


            // ======================================
            // NÍVEL 2 — SABEDORIA
            // ======================================

            if (currentLevel === 2) {

                const q =
                    currentQuestions[
                        currentIndex
                    ];


                if (!q) return;


                if (q.validar(value)) {

                    addMessageToChat(
                        value,
                        true
                    );


                    if (isVoiceEnabled) {

                        speakText(
                            "Sabedoria comprovada."
                        );
                    }


                    currentIndex++;


                    input.value =
                        '';


                    if (
                        currentIndex >=
                        currentQuestions.length
                    ) {

                        showMessage(
                            "✦ SABEDORIA ✦",
                            "#00ffcc"
                        );


                        input.placeholder =
                            '✦';


                        levelTransition(
                            3,
                            800
                        );

                    } else {

                        setTimeout(() => {

                            showWisdomQuestion();

                        }, 400);
                    }

                } else {

                    addMessageToChat(
                        value,
                        true
                    );


                    if (isVoiceEnabled) {

                        speakText(
                            "Resposta incorreta."
                        );
                    }


                    failTest();
                }
            }
        };


        newBtn.onclick =
            handleSubmit;


        input.onkeypress =
            (event) => {

                if (
                    event.key === 'Enter'
                ) {

                    event.preventDefault();

                    handleSubmit();
                }
            };
    }


    // ==========================================
    // 🚪 INICIAR NÍVEL
    // ==========================================

    function startLevel(level) {

        currentLevel =
            level;


        const content =
            document.getElementById(
                'hecateTestContent'
            );


        if (!content) return;


        // ======================================
        // NÍVEL 1
        // ======================================

        if (level === 1) {

            const input =
                document.getElementById(
                    'hecateInput'
                );


            if (input) {

                input.type =
                    'password';

                input.placeholder =
                    '—';

                input.value =
                    '';


                setTimeout(() => {

                    input.focus();

                }, 300);
            }


            return;
        }


        // ======================================
        // NÍVEL 2
        // ======================================

        if (level === 2) {

            currentQuestions =
                QUESTION_BANK
                    .sabedoria
                    .getRandomQuestions();


            currentIndex =
                0;


            showWisdomQuestion();

            return;
        }


        // ======================================
        // NÍVEL 3
        // ======================================

        if (level === 3) {

            currentQuestions =
                QUESTION_BANK
                    .virtude
                    .getRandomQuestions();


            currentIndex =
                0;


            virtueScore =
                0;


            showVirtueQuestion();
        }
    }


    // ==========================================
    // 🧹 LIMPAR PERGUNTAS ANTIGAS
    // ==========================================

    function clearPreviousMessages() {

        const chatMsg =
            document.getElementById(
                'hecateChatMessages'
            );


        if (!chatMsg) return;


        const messages =
            chatMsg.children;


        Array.from(messages).forEach(
            (msg) => {

                if (
                    msg.classList.contains(
                        'initial-question'
                    )
                ) {

                    return;
                }


                msg.remove();
            }
        );
    }


    // ==========================================
    // 🧠 SABEDORIA
    // ==========================================

    function showWisdomQuestion() {

        const q =
            currentQuestions[
                currentIndex
            ];


        if (!q) return;


        clearPreviousMessages();


        addMessageToChat(
            q.texto,
            false,
            'question'
        );


        addMessageToChat(
            "💡 " + q.dica,
            false,
            'hint'
        );


        if (isVoiceEnabled) {

            speakText(
                q.texto +
                ". " +
                q.dica
            );
        }


        const input =
            document.getElementById(
                'hecateInput'
            );


        if (input) {

            input.type =
                'text';

            input.placeholder =
                '...';

            input.value =
                '';


            setTimeout(() => {

                input.focus();

            }, 300);
        }
    }


    // ==========================================
    // ⚖️ VIRTUDE
    // ==========================================

    function showVirtueQuestion() {

        const q =
            currentQuestions[
                currentIndex
            ];


        if (!q) return;


        clearPreviousMessages();


        addMessageToChat(
            q.texto,
            false,
            'question'
        );


        if (isVoiceEnabled) {

            speakText(
                q.texto
            );
        }


        const content =
            document.getElementById(
                'hecateTestContent'
            );


        if (!content) return;


        let optionsHtml =
            '';


        q.opcoes.forEach(
            (op, idx) => {

                optionsHtml += `

                    <button
                        class="virtue-opt"
                        type="button"
                        data-pontos="${q.pontos[idx]}"
                    >
                        ${op}
                    </button>

                `;
            }
        );


        content.innerHTML = `

            <div
                id="virtueOptions"
                style="width:100%;"
            >
                ${optionsHtml}
            </div>


            <div
                id="virtueScoreDisplay"
                style="
                    margin-top:12px;

                    color:
                        rgba(
                            255,
                            215,
                            0,
                            0.15
                        );

                    font-size:
                        clamp(
                            9px,
                            1vw,
                            11px
                        );

                    text-align:
                        center;

                    letter-spacing:
                        clamp(
                            3px,
                            0.5vw,
                            7px
                        );

                    text-shadow:
                        0 2px 3px #000;

                    transition:
                        color 0.5s ease,
                        text-shadow 0.5s ease;
                "
            >
                ✦ ${virtueScore} ✦
            </div>
        `;


        const botoes =
            content.querySelectorAll(
                '.virtue-opt'
            );


        botoes.forEach(
            (btn) => {

                btn.onclick = () => {

                    const pontos =
                        parseInt(
                            btn.dataset.pontos,
                            10
                        );


                    virtueScore +=
                        pontos;


                    addMessageToChat(
                        btn.textContent.trim(),
                        true
                    );


                    if (isVoiceEnabled) {

                        speakText(
                            "Você escolheu " +
                            btn.textContent.trim()
                        );
                    }


                    currentIndex++;


                    const scoreDisplay =
                        document.getElementById(
                            'virtueScoreDisplay'
                        );


                    if (scoreDisplay) {

                        scoreDisplay.textContent =
                            `✦ ${virtueScore} ✦`;

                        scoreDisplay.style.color =
                            'rgba(255,215,0,0.2)';
                    }


                    // ==========================
                    // FINAL
                    // ==========================

                    if (
                        currentIndex >=
                        currentQuestions.length
                    ) {

                        if (
                            virtueScore >=
                            MIN_VIRTUE_SCORE
                        ) {

                            showMessage(
                                "✦ APROVADA ✦",
                                "#ffd700"
                            );


                            if (isVoiceEnabled) {

                                speakText(
                                    "Aprovada. " +
                                    "O Grimório está aberto."
                                );
                            }


                            setTimeout(
                                () => {

                                    completeTest(
                                        true
                                    );

                                },
                                800
                            );

                        } else {

                            showMessage(
                                "✦ REPROVADA ✦",
                                "#ff3300"
                            );


                            if (isVoiceEnabled) {

                                speakText(
                                    "Reprovada."
                                );
                            }


                            setTimeout(
                                () => {

                                    failTest();

                                },
                                800
                            );
                        }

                    } else {

                        setTimeout(
                            () => {

                                showVirtueQuestion();

                            },
                            400
                        );
                    }
                };
            }
        );
    }


    // ==========================================
    // 🔓 CONCLUSÃO
    // ==========================================

    function completeTest(success) {

        if (success) {

            localStorage.setItem(
                'hecate_auth_complete',
                'true'
            );


            console.log(
                '✅ Hécate: Autenticação salva!'
            );
        }


        setTimeout(() => {

            if (!overlay) return;


            overlay.style.transition =
                'opacity 1.5s ease';


            overlay.style.opacity =
                '0';


            setTimeout(() => {

                if (overlay) {

                    overlay.remove();
                }


                overlay =
                    null;


                testActive =
                    false;


                if (onCompleteCallback) {

                    onCompleteCallback(
                        success
                    );
                }

            }, 1500);

        }, 500);
    }


    // ==========================================
    // ❌ FALHA
    // ==========================================

    function failTest() {

        setTimeout(() => {

            if (!overlay) return;


            overlay.style.transition =
                'opacity 1s ease';


            overlay.style.opacity =
                '0';


            setTimeout(() => {

                if (overlay) {

                    overlay.remove();
                }


                overlay =
                    null;


                testActive =
                    false;


                if (onCompleteCallback) {

                    onCompleteCallback(
                        false
                    );
                }

            }, 1000);

        }, 500);
    }


    // ==========================================
    // 🌐 API HÉCATE
    // ==========================================

    window.HecateTest = {

        show:
            showTestInterface,


        isActive:
            () => testActive,


        toggleVoice:
            () => {

                isVoiceEnabled =
                    !isVoiceEnabled;


                return isVoiceEnabled;
            },


        getHistory:
            () =>
                [...conversationHistory],


        clearHistory:
            () =>
                conversationHistory.length = 0
    };


    // ==========================================
    // 🗝️ READY
    // ==========================================

    console.log(
        '🗝️ Hécate: Ritual cinematográfico V6 carregado — Flutuação + Voz'
    );

})();