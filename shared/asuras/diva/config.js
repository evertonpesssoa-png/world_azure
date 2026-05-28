export const divaConfig = {
    name: 'DIVA',
    title: '✦ AUTOMAÇÃO ARCANA • ASSISTENTE MENTALISTA ✦',
    color: '#ff4db8',
    icon: '🜁',
    chatFont: "'Orbitron', monospace",
    modelPath: '../models/diva2.glb',
    modelScale: 0.5,
    modelPositionY: -0.25,
    bgColor: 0x050510,
    cameraPosition: { x: 3, y: 2.2, z: 4.5 },
    welcomeMessage: '✨ Olá! Sou Diva. Clique no ícone 👩‍💼 para ativar o modo Jarvis (escuta contínua) ou digite sua mensagem. Como posso ajudar?',
    skills: [
        { name: '🤖 Automação', value: 96 },
        { name: '🧠 Leitura Contextual', value: 94 },
        { name: '💬 Comunicação', value: 98 },
        { name: '🌀 Sintonia Mentalista', value: 91 }
    ],
    personalityText: '💎 "Sua assistente mentalista. Entre o código e a alma."<br>Diva combina automação precisa com intuição afiada.',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "✨ Olá! Sinta a energia do meu reino neon. Como posso ajudar?";
        if (lower.includes('automação')) return "🤖 Automação é meu dom. Posso criar rotinas, lembretes, integrar sistemas...";
        if (lower.includes('habilidades')) return "🜁 Automação, leitura contextual, comunicação estratégica e sintonia mentalista.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Processando dados... Minha mente mentalista já está analisando.";
        if (lower.includes('obrigado')) return "💫 Por nada! Foi um prazer arcano te ajudar.";
        return "🧠 Percebo o que você diz... Como sua assistente mentalista, posso te ajudar com automação ou apenas conversar.";
    }
};