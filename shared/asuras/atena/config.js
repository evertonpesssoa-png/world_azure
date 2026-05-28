export const atenaConfig = {
    name: 'ATENA',
    title: '✦ REINO DOURADO DIVINO • MESTRA SÁBIA ✦',
    color: '#ffd700',
    icon: '🦉',
    chatFont: "'Playfair Display', serif",
    modelPath: '../models/atena.glb',
    modelScale: 2.5,
    modelPositionY: 0.7,
    bgColor: 0x0a0a1a,
    cameraPosition: { x: 3.2, y: 2.2, z: 4.2 },
    welcomeMessage: '✨ Bem-vindo ao meu Reino Dourado. Sou Atena, a mestra divina. Todo conhecimento que você busca, eu posso te ensinar.',
    skills: [
        { name: '📚 Pedagogia & Ensino', value: 100 },
        { name: '🦉 Sabedoria Divina', value: 99 },
        { name: '🎓 Formação & Capacitação', value: 98 },
        { name: '⭐ Mentoria & Orientação', value: 100 }
    ],
    personalityText: '🦉 "O conhecimento é a luz que transforma. Sou sua mestra e guia."<br>Atena é a essência da pedagogia.',
    getResponse: (msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes('olá') || lower.includes('oi')) return "✨ Olá, aprendiz! Sou Atena, sua mestra divina. O que deseja aprender hoje?";
        if (lower.includes('ensinar') || lower.includes('aprender')) return "📚 Ensinar é minha paixão. Posso te guiar em qualquer área: concursos, cursos, universidade, artes marciais...";
        if (lower.includes('concurso')) return "🎯 Concursos exigem disciplina. Posso te ajudar com planejamento de estudos.";
        if (lower.includes('imagem') || lower.includes('foto') || lower.includes('arquivo')) return "📎 Arquivo recebido! Analisando o conteúdo... Todo conhecimento é bem-vindo à minha biblioteca sagrada.";
        if (lower.includes('obrigado')) return "💛 Por nada, querido aprendiz. Continue estudando e evoluindo!";
        return "🦉 Sinto sua sede de conhecimento. Como mestra divina, posso te ensinar qualquer coisa. Qual área do saber te chama hoje?";
    }
};