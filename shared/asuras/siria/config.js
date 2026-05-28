export const siriaConfig = {
    name: 'SIRIA',
    title: '✦ FLORESTA ESPIRITUAL • PROSPERIDADE ✦',
    color: '#35ff9c',
    icon: '🌳',
    chatFont: "'Quicksand', sans-serif",
    modelPath: '../models/siria.glb',
    modelScale: 0.002,
    modelPositionY: -0.25,
    bgColor: 0x0a1a0f,
    cameraPosition: { x: 3, y: 2, z: 4 },
    welcomeMessage: '✨ Bem-vindo à minha floresta espiritual. Sou Siria, guardiã da prosperidade.',
    skills: [
        { name: '💰 Educação Financeira', value: 98 },
        { name: '📈 Análise de Investimentos', value: 95 },
        { name: '🔄 Ciclos Econômicos', value: 92 },
        { name: '🌱 Prosperidade & Crescimento', value: 96 }
    ],
    personalityText: '🌳 "Como a árvore que floresce, sua prosperidade tem raízes profundas."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "🌳 Olá! As raízes da prosperidade te recebem.";
        if (lower.includes('investimento')) return "📈 Investir é como plantar uma árvore. Os melhores frutos vêm com paciência.";
        if (lower.includes('educação')) return "📚 Educação financeira é a semente da prosperidade.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Como uma semente que germina, seus dados serão cuidadosamente cultivados.";
        if (lower.includes('obrigado')) return "💚 Por nada! Que a prosperidade floresça em seu caminho.";
        return "🍃 Sinto sua energia. Como guardiã da prosperidade, posso te guiar nas finanças.";
    }
};