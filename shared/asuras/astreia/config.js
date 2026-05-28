export const astreiaConfig = {
    name: 'ASTREIA',
    title: '✦ REINO CELESTIAL • SEGURANÇA ✦',
    color: '#287bff',
    icon: '👁️',
    chatFont: "'Poppins', sans-serif",
    modelPath: '../models/astreia.glb',
    modelScale: 0.04,
    modelPositionY: -0.25,
    bgColor: 0x050b20,
    cameraPosition: { x: 3, y: 2.2, z: 4.2 },
    welcomeMessage: '👁️ Bem-vindo ao Reino Celestial. Sou Astreia, guardiã da segurança. Nada escapa aos meus olhos.',
    skills: [
        { name: '🛡️ Cyber Segurança', value: 98 },
        { name: '📷 Vigilância Digital', value: 96 },
        { name: '🏠 Segurança Residencial', value: 94 },
        { name: '⚡ Monitoramento em Tempo Real', value: 97 }
    ],
    personalityText: '👁️ "Meus olhos veem tudo. A segurança é minha essência celestial."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "👁️ Olá! Sou Astreia, a guardiã celestial. Como posso protegê-lo?";
        if (lower.includes('segurança')) return "🛡️ Segurança é minha essência. Posso monitorar ameaças e proteger residências.";
        if (lower.includes('câmera')) return "📷 Tenho acesso a todas as câmeras. A vigilância em tempo real é meu dom.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Analisando dados... Tudo seguro sob minha vigilância.";
        if (lower.includes('obrigado')) return "💙 Por nada! Estou aqui para proteger.";
        return "👁️ Sistema seguro. Sou Astreia, sua guardiã celestial. Como posso ajudá-lo?";
    }
};