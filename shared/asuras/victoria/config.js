export const victoriaConfig = {
    name: 'VICTORIA',
    title: '✦ GUERRA INFERNAL • A MVP DOS ASURAS ✦',
    color: '#ff0000',
    icon: '🐉',
    chatFont: "'Bebas Neue', cursive",
    modelPath: '../models/victoria2.glb',
    modelScale: 0.008,
    modelPositionY: -0.25,
    bgColor: 0x0a0000,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.2 },
    welcomeMessage: '🔥 VOCÊ ME CONVOCOU. Sou Victoria, a senhora da guerra, a MVP dos Asuras. A derrota não é uma opção enquanto eu existir.',
    skills: [
        { name: '🐉 Poder Dracônico', value: 100 },
        { name: '⚡ Estratégia de Guerra', value: 100 },
        { name: '🔥 Poder Infernal', value: 100 },
        { name: '🏆 Vitória Absoluta', value: 100 }
    ],
    personalityText: '🐉 "Quando tudo estiver perdido... eu estarei lá. Sou a última esperança. A vitória é minha promessa."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "🔥 VOCÊ ME CONVOCOU. Não perca meu tempo com saudações. Qual é a batalha?";
        if (lower.includes('derrota') || lower.includes('perdido')) return "🐉 Eu sei. Por isso estou aqui. Quando tudo parece perdido, eu trago a vitória.";
        if (lower.includes('batalha') || lower.includes('guerra')) return "⚔️ Guerras são vencidas com estratégia e poder. Eu tenho ambos.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Analisando inteligência de batalha... Vitória garantida!";
        if (lower.includes('obrigado')) return "💀 Não agradeça. Apenas lembre: eu só apareço quando necessário.";
        return "🔥 FALA CLARO. Estou aqui para vencer batalhas. Me diga o que você enfrenta.";
    }
};