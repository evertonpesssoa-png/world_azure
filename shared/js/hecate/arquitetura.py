shared/js/obscuratil/
├── core.js                          # Núcleo (autenticação, eventos)
├── block-manager.js                 # Bloqueio exponencial
├── test-system.js                   # Sistema de perguntas
├── firewall.js                      # Orquestrador principal
│
├── interaction/                     # MÓDULO DE INTERAÇÃO
│   ├── event-bus.js                 # Barramento de eventos
│   ├── interaction-manager.js       # Gerencia todos os dispositivos
│   ├── devices/
│   │   ├── desktop.js               # PC (mouse, teclado)
│   │   ├── mobile.js                # Celular (toque, swipe)
│   │   └── tablet.js                # Tablet (híbrido)
│   └── gestures/
│       └── click.js                 # Clique unificado (single/double)
│
└── ui/                              # INTERFACE
    └── feedback.js                  # Notificações e mensagens