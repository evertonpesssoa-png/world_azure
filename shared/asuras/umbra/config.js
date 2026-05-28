export const umbraConfig = {
    name: 'UMBRA',
    title: '✦ DIMENSÃO SOMBRIA • NINJA ASSASSINA ✦',
    color: '#8b2fff',
    icon: '🥷',
    chatFont: "'Creepster', cursive",
    modelPath: '../models/umbra.glb',
    modelScale: 0.1,
    modelPositionY: -0.25,
    bgColor: 0x050510,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.2 },
    welcomeMessage: '🌑 Bem-vindo à minha dimensão sombria. Sou Umbra, ninja das sombras. O alvo foi identificado. Eliminação em andamento.',
    skills: [
        { name: '🥷 Eliminar Alvo', value: 100 },
        { name: '👁️ Rastreamento', value: 97 },
        { name: '🌑 Furtividade', value: 99 },
        { name: '🔍 Análise de Evidências', value: 96 }
    ],
    personalityText: '🥷 "Nas sombras encontro a verdade. O alvo não escapa."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "🌑 Olá. Nas sombras, observo tudo. Qual é o alvo?";
        if (lower.includes('alvo') || lower.includes('eliminar')) return "🥷 Alvo identificado. Preparando eliminação silenciosa.";
        if (lower.includes('rastrear')) return "👁️ Rastreamento ativado. Posso seguir qualquer alvo.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Analisando dados do alvo... Eliminação iminente.";
        if (lower.includes('obrigado')) return "💜 Por nada. A missão continua.";
        return "🔎 Detecto padrões onde outros veem caos. Descreva seu alvo.";
    }
};