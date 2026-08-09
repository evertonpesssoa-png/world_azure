// ============================================
// 🗝️ HÉCATE - RITUAL DE ACESSO
// VERSÃO CINEMATOGRÁFICA V5
// RESPONSIVO — MOBILE / TABLET / DESKTOP
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

                const shuffled = [...this.perguntas];

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
                    texto: "O QUE FARIA COM O PODER DA HÉCATE?",

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
                    texto: "VIRTUDE MAIS IMPORTANTE PARA UM GUARDIÃO?",

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
                    texto: "ACEITA A RESPONSABILIDADE DE PROTEGER?",

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

                const shuffled = [...this.perguntas];

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

            content: text,

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

        if (!('speechSynthesis' in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = 'pt-BR';

        utterance.rate = 0.85;

        utterance.pitch = 0.8;

        utterance.volume = 0.6;

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


        let color = '#a78bfa';

        let fontSize = '16px';

        let align = 'center';

        let letterSpacing = '2px';

        let opacity = '1';

        let marginBottom = '10px';

        let fontStyle = 'normal';

        let prefix = '';

        let animation =
            'aparecerPalavra 1.2s ease-out';

        let extraClass = '';


        // ======================================
        // PERGUNTA
        // ======================================

        if (type === 'question') {

            color = '#d8ceff';

            fontSize =
                'clamp(17px, 2.1vw, 28px)';

            letterSpacing =
                'clamp(2px, 0.35vw, 5px)';

            marginBottom = '20px';

            fontStyle = 'italic';

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

            marginBottom = '15px';
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

            opacity = '0.75';

            marginBottom = '8px';

            prefix = '✦ ';
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

            marginBottom = '8px';

            opacity = '0.7';

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
                900001;

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

        testActive = true;

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

            <div class="hecate-layer hecate-void"></div>


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

                <!-- HISTÓRICO -->

                <div
                    id="hecateChatMessages"
                    class="hecate-chat-messages"
                >

                    <!-- PERGUNTA INICIAL -->

                    <div
                        class="
                            question-text
                            initial-question
                        "
                    >
                        O GRIMÓRIO ESTÁ TRANCADO
                    </div>


                    <!-- DICA INICIAL -->

                    <div
                        class="
                            initial-hint
                        "
                    >
                        nome da primeira Asura
                    </div>

                </div>


                <!-- INPUT -->

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
                 BOTÃO DE VOZ
            ================================== -->

            <div
                id="jarvis-toggle"
                role="button"
                tabindex="0"
                aria-label="Ativar voz de Hécate"
            >

                <span id="jarvis-icon">
                    ◇
                </span>

            </div>


            <!-- ==================================
                 CSS
            ================================== -->

            <style>

                /* =================================
                   RESET DO OVERLAY
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
                        translate3d(0, 0, 0)
                        scale(0.82);

                    animation:
                        flutuarEntidade
                        10s
                        ease-in-out
                        infinite;

                    filter:
                        contrast(1.05)
                        brightness(1.02);

                    will-change:
                        transform;
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

                            rgba(0,0,0,0.94)
                            0%,

                            rgba(0,0,0,0.70)
                            30%,

                            rgba(0,0,0,0.28)
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
                        rgba(0,0,0,0.95);

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
                        rgba(0,0,0,0.9);

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


                /* =================================
                   BOTÃO DE VOZ
                ================================= */

                #jarvis-toggle {

                    position:
                        fixed;

                    bottom:
                        clamp(
                            18px,
                            3vh,
                            30px
                        );

                    right:
                        clamp(
                            18px,
                            3vw,
                            30px
                        );

                    z-index:
                        900001;

                    width:
                        clamp(
                            34px,
                            4vw,
                            42px
                        );

                    height:
                        clamp(
                            34px,
                            4vw,
                            42px
                        );

                    border-radius:
                        50%;

                    background:
                        rgba(
                            20,
                            10,
                            40,
                            0.15
                        );

                    backdrop-filter:
                        blur(2px);

                    border:
                        1px solid
                        rgba(
                            167,
                            139,
                            250,
                            0.05
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
                        all 0.8s ease;

                    pointer-events:
                        auto;

                    opacity:
                        0.15;

                    user-select:
                        none;
                }


                #jarvis-icon {

                    font-size:
                        clamp(
                            13px,
                            1.5vw,
                            17px
                        );

                    color:
                        rgba(
                            167,
                            139,
                            250,
                            0.3
                        );

                    transition:
                        all 0.8s ease;
                }


                #jarvis-toggle:hover {

                    opacity:
                        0.6 !important;

                    border-color:
                        rgba(
                            167,
                            139,
                            250,
                            0.2
                        );

                    transform:
                        scale(1.05);
                }


                #jarvis-toggle.active {

                    opacity:
                        0.8 !important;

                    border-color:
                        rgba(
                            0,
                            255,
                            136,
                            0.2
                        );
                }


                #jarvis-toggle.active
                #jarvis-icon {

                    color:
                        rgba(
                            0,
                            255,
                            136,
                            0.6
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.78);
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.86);
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.82);
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
                }


                /* =================================
                   CELULAR MUITO PEQUENO
                ================================= */

                @media
                (max-width:380px) {

                    .hecate-entity {

                        background-position:
                            center 34%;

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.78);
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.94);
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.72);
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

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            scale(0.76);
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
                    'active'
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


                    setTimeout(() => {

                        toggleBtn.style.opacity =
                            '0.8';

                    }, 100);

                } else {

                    if (
                        'speechSynthesis'
                        in window
                    ) {

                        window.speechSynthesis.cancel();
                    }


                    setTimeout(() => {

                        toggleBtn.style.opacity =
                            '0.15';

                    }, 100);
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

        // Futuro LLM

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
        '🗝️ Hécate: Ritual cinematográfico V5 carregado — Responsivo'
    );

})();