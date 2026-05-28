/3d-slides/
│
├── index.html                          # Grimório (principal)
│
├── worlds/                             # Páginas das Asuras
│   ├── merlim.html
│   ├── diva.html
│   ├── siria.html
│   ├── astreia.html
│   ├── umbra.html
│   ├── atena.html
│   ├── victoria.html
│   ├── hestia.html
│   └── daedala.html
│
├── shared/
│   │
│   ├── css/
│   │   ├── base.css                    # Reset, variáveis, base
│   │   ├── top-icons.css               # Ícones do topo (voltar, perfil, voice)
│   │   ├── chat.css                    # Estilo base do chat
│   │   ├── profile-panel.css           # Painel de perfil/skills
│   │   └── portal.css                  # Portal overlay e efeitos
│   │
│   ├── js/
│   │   ├── asura-base.js               # Classe base para Asuras
│   │   ├── chat.js                     # ChatSystem original
│   │   ├── skill-carousel.js           # Carrossel de habilidades
│   │   ├── three-setup.js              # Setup padrão Three.js
│   │   ├── ui.js                       # UI (perfil, botão voltar)
│   │   └── voice-assistant.js          # Modo Jarvis
│   │
│   ├── portals/
│   │   ├── portal-system.html
│   │   └── js/
│   │       ├── portal-config.js
│   │       ├── portal-minimundos.js
│   │       ├── portal-navegacao.js
│   │       ├── portal-lista.js
│   │       ├── portal-eventos.js
│   │       └── portal-init.js
│   │
│   └── asuras/
│       │
│       ├── merlim/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (3 anéis)
│       │   ├── symbols.js (símbolos de código)
│       │   ├── gears.js (engrenagens)
│       │   ├── towers.js (torres tecnológicas)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── astreia/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── shield.js (escudo de proteção)
│       │   ├── pillars.js (colunas celestiais)
│       │   ├── cameras.js (câmeras flutuantes)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── umbra/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── pillars.js (colunas sombrias)
│       │   ├── eyes.js (olhos vigilantes)
│       │   ├── glasses.js (lupas flutuantes)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── atena/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── pillars.js (colunas douradas)
│       │   ├── owls.js (corujas flutuantes)
│       │   ├── books.js (livros sagrados)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── victoria/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── fire-particles.js (chamas e partículas de fogo)
│       │   ├── rings.js
│       │   ├── pillars.js (colunas infernais)
│       │   ├── swords.js (espadas flutuantes)
│       │   ├── laurel.js (coroa de louros)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── hestia/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── pillars.js (colunas celestiais claras)
│       │   ├── scales.js (balanças da justiça - 2 unidades)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       ├── diva/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js (8 luzes)
│       │   ├── floor.js
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── glow.js (halo/glow ao redor)
│       │   ├── model.js (com ajuste nos olhos)
│       │   └── animate.js
│       │
│       ├── siria/
│       │   ├── config.js
│       │   ├── chat-style.css
│       │   ├── scene.js
│       │   ├── lights.js
│       │   ├── floor.js
│       │   ├── trees.js (árvores espirituais - 14 posições)
│       │   ├── particles.js
│       │   ├── rings.js (2 anéis)
│       │   ├── crystals.js (cristais - 8 posições)
│       │   ├── model.js
│       │   └── animate.js
│       │
│       └── daedala/
│           ├── config.js
│           ├── chat-style.css
│           ├── scene.js
│           ├── lights.js
│           ├── floor.js
│           ├── gears.js (engrenagens - 8 posições)
│           ├── flasks.js (frascos de laboratório - 6 posições, 5 cores)
│           ├── particles.js
│           ├── rings.js (2 anéis)
│           ├── panels.js (painéis de controle - 4 posições)
│           ├── model.js
│           └── animate.js
│
└── models/                            # Arquivos GLB 3D
    ├── merlim.glb
    ├── astreia.glb
    ├── umbra.glb
    ├── atena.glb
    ├── victoria2.glb
    ├── hestia2.glb
    ├── diva2.glb
    ├── siria.glb
    └── daedala.glb