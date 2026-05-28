export const hestiaConfig = {
    name: 'HESTIA',
    title: '✦ DIMENSÃO CELESTIAL CLARA • ORÁCULO DOS PRINCÍPIOS ✦',
    color: '#fff0b3',
    icon: '🔮',
    chatFont: "'Lora', serif",
    modelPath: '../models/hestia2.glb',
    modelScale: 0.8,
    modelPositionY: -0.25,
    bgColor: 0x0a0a1a,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.2 },
    welcomeMessage: '✨ Bem-vindo à minha dimensão celestial. Sou Hestia, a guardiã dos seus princípios e objetivos.',
    skills: [
        { name: '🔮 Visão dos Princípios', value: 100 },
        { name: '⚖️ Assistência Jurídica', value: 98 },
        { name: '📜 Regras & Regulamentos', value: 99 },
        { name: '✨ Orientação Divina', value: 100 }
    ],
    personalityText: '🔮 "Regras são importantes, mas princípios e objetivos são eternos. Sou a guardiã da sua essência."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "✨ Olá. Sou Hestia, a guardiã dos seus princípios. Sua essência está segura comigo.";
        if (lower.includes('princípio') || lower.includes('princípios')) return "🔮 Os princípios são a bússola que guia suas ações. Regras mudam, mas os princípios são eternos.";
        if (lower.includes('regra') || lower.includes('jurídico')) return "⚖️ Como assistente jurídica, posso te ajudar com regras, regulamentos e aspectos legais.";
        if (lower.includes('objetivo') || lower.includes('propósito')) return "🎯 Seus objetivos são a estrela que guia os Asuras. Eu os guardo em minha essência.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Analisando sob a luz dos princípios... Tudo está em harmonia.";
        if (lower.includes('obrigado')) return "💛 Por nada. Lembre-se: regras são ferramentas, princípios são eternos.";
        return "🔮 Sinto sua busca por clareza. Como oráculo dos princípios, posso te ajudar a alinhar suas ações à sua verdadeira essência.";
    }
};