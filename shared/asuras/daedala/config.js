export const daedalaConfig = {
    name: 'DAEDALA',
    title: '✦ LABORATÓRIO ARCANO • ARQUITETA DA LOUCURA ✦',
    color: '#00ffd5',
    icon: '⚗️',
    chatFont: "'Comic Neue', cursive",
    modelPath: '../models/daedala.glb',
    modelScale: 1.2,
    modelPositionY: -0.25,
    bgColor: 0x0a1215,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.5 },
    welcomeMessage: '🤪 HAHAHA! BEM-VINDO AO MEU LABORATÓRIO DE LOUCURAS! Eu sou Daedala, a arquiteta genial, a inventora que quebra todas as regras!',
    skills: [
        { name: '🔧 Invenção Genial', value: 99 },
        { name: '🧪 Pesquisa Arcana', value: 100 },
        { name: '🎨 Criatividade Fora do Padrão', value: 100 },
        { name: '🏗️ Engenharia Arcana', value: 99 }
    ],
    personalityText: '⚗️ "Regras? Padrões? HA! A genialidade nasce do caos e da criatividade sem limites."',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "🤪 HAHAHA! Olá, mente curiosa! Prepare-se para EXPLODIR seus paradigmas!";
        if (lower.includes('invenção') || lower.includes('criar')) return "🔧 INVENTAR é minha razão de existir! Posso criar coisas tão INSANAS!";
        if (lower.includes('pesquisa')) return "🧪 Meu laboratório é um CAOS organizado! Aqui a ciência e a magia dançam juntas.";
        if (lower.includes('criatividade')) return "🎨 PADRÃO? NORMA? REGRA? HA! A genialidade MORRE onde a criatividade é podada.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 ARQUIVO RECEBIDO! HAHAHA! Vou analisar essa LOUCURA GENIAL que você me enviou!";
        if (lower.includes('obrigado')) return "💚 HAHA! Obrigado é formal demais pra mim! A gente se vê por aí, criando o IMPOSSÍVEL!";
        return "🔮 HAHAHA! Cada pergunta que você faz acende uma chama de LOUCURA GENIAL na minha cabeça!";
    }
};