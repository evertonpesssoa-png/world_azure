export const merlimConfig = {
    name: 'MERLIM',
    title: '✦ REINO TECNOLÓGICO • ENGENHEIRA MÁGICA ✦',
    color: '#00d9ff',
    icon: '🔧',
    chatFont: "'Courier Prime', monospace",
    modelPath: '../models/merlim.glb',
    modelScale: 0.5,
    modelPositionY: -0.25,
    bgColor: 0x050a18,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.2 },
    welcomeMessage: '✨ Bem-vindo ao meu reino tecnológico. Sou Merlim, a engenheira mágica. Código, sistemas e arquitetura são meus encantamentos.',
    skills: [
        { name: '🔧 Arquitetura de Sistemas', value: 97 },
        { name: '⚡ Programação & Código', value: 96 },
        { name: '🛠️ Mecânica do Sistema', value: 94 },
        { name: '✨ Magia da Engenharia', value: 98 }
    ],
    personalityText: '🔧 "Código é magia, engenharia é arte. Eu construo mundos."<br>Merlim é a arquiteta do sistema, une tecnologia e misticismo.',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "✨ Olá! Sou Merlim, a engenheira mágica. Código é minha poesia. Como posso te ajudar a construir algo incrível?";
        if (lower.includes('código') || lower.includes('programação')) return "🔧 Código é magia pura! Posso ajudar com arquitetura de sistemas, debug, otimização. Qual linguagem ou projeto você está trabalhando?";
        if (lower.includes('arquitetura') || lower.includes('sistema')) return "🏗️ Arquitetura de sistemas é minha especialidade. Posso ajudar a estruturar projetos robustos e escaláveis.";
        if (lower.includes('bug') || lower.includes('erro')) return "🐛 Um bug? Deixe-me analisar... Como engenheira mágica, consigo rastrear e resolver problemas com eficiência.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Processando dados... Tudo está em ordem no sistema.";
        if (lower.includes('obrigado')) return "💙 Por nada! Foi um prazer mágico te ajudar. Estou sempre aqui para construir e reparar o que for necessário.";
        return "🔮 Como arquiteta deste reino tecnológico, vejo padrões e soluções onde outros veem caos. Me conte seu desafio, e juntos vamos construir a resposta.";
    }
};