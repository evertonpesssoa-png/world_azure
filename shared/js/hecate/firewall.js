// ============================================
// 🗝️ HÉCATE - FIREWALL SIMPLES E DIRETO
// Funciona com toque/clique em qualquer dispositivo
// ============================================

(function() {
    'use strict';
    
    let testeAtivo = false;
    let cardsLiberados = false;
    
    // Inicializar quando a página carregar
    window.addEventListener('load', function() {
        console.log('🗝️ Hécate: Firewall carregado');
        
        // Verificar se já passou no teste antes
        if (localStorage.getItem('hecate_auth_complete') === 'true') {
            console.log('✅ Usuário já autenticado');
            liberarCards();
            return;
        }
        
        // Bloquear cards inicialmente
        bloquearCards();
        
        // Aguardar toque/clique em qualquer lugar
        document.body.addEventListener('click', ativarHecate);
        document.body.addEventListener('touchstart', ativarHecate);
        
        console.log('🗝️ Hécate: Aguardando toque/clique na tela...');
    });
    
    function bloquearCards() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.4';
            item.style.filter = 'blur(2px)';
        });
        console.log('🔒 Cards bloqueados');
    }
    
    function liberarCards() {
        if (cardsLiberados) return;
        cardsLiberados = true;
        
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.pointerEvents = '';
            item.style.opacity = '';
            item.style.filter = '';
        });
        console.log('🔓 Cards liberados!');
    }
    
    function ativarHecate(e) {
        // Não ativar se já passou no teste
        if (localStorage.getItem('hecate_auth_complete') === 'true') return;
        
        // Não ativar se já está mostrando o teste
        if (testeAtivo) return;
        
        console.log('🔥 Toque/clique detectado! Ativando Hécate...');
        
        // Remover listeners para não ativar múltiplas vezes
        document.body.removeEventListener('click', ativarHecate);
        document.body.removeEventListener('touchstart', ativarHecate);
        
        mostrarTeste();
    }
    
    function mostrarTeste() {
        testeAtivo = true;
        
        // Criar modal de teste
        const modal = document.createElement('div');
        modal.id = 'hecate-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.97);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #0a0a1a, #1a0a2a); border: 2px solid #9b30ff; border-radius: 30px; padding: 40px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 0 50px rgba(155,48,255,0.3);">
                <div style="font-size: 60px;">🗝️</div>
                <h2 style="color: #9b30ff;">HÉCATE - TESTE DE ACESSO</h2>
                <p style="color: #aaa; margin: 15px 0;">Digite a senha do grimório:</p>
                <input type="password" id="hecateSenha" placeholder="Digite a senha" style="width: 100%; padding: 12px; margin: 15px 0; background: #000; border: 1px solid #9b30ff; border-radius: 15px; color: #9b30ff; text-align: center; font-size: 16px;">
                <button id="hecateBtn" style="background: #9b30ff; border: none; padding: 12px 30px; border-radius: 30px; color: white; cursor: pointer; width: 100%; font-size: 16px; font-weight: bold;">✦ VERIFICAR ✦</button>
                <p style="font-size: 11px; color: #666; margin-top: 15px;">⚡ Dica: Nome da primeira Asura (minúsculo)</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const input = document.getElementById('hecateSenha');
        const btn = document.getElementById('hecateBtn');
        
        function verificarSenha() {
            const senha = input.value;
            
            if (senha.toLowerCase() === 'astreia') {
                // Senha correta!
                localStorage.setItem('hecate_auth_complete', 'true');
                modal.remove();
                
                // Mostrar mensagem de sucesso
                const msg = document.createElement('div');
                msg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, #0a0a2a, #000);
                    border: 2px solid #00ff88;
                    border-radius: 20px;
                    padding: 30px 50px;
                    z-index: 1000000;
                    text-align: center;
                `;
                msg.innerHTML = `
                    <div style="font-size: 60px;">🔓</div>
                    <div style="color: #00ff88; font-size: 24px;">HÉCATE DESTRAVADA!</div>
                    <div style="color: white;">Bem-vindo ao World Azure!</div>
                `;
                document.body.appendChild(msg);
                
                setTimeout(() => msg.remove(), 3000);
                
                liberarCards();
                testeAtivo = false;
            } else {
                alert('❌ SENHA INCORRETA! Tente novamente.');
                // Reativar para nova tentativa
                document.body.addEventListener('click', ativarHecate);
                document.body.addEventListener('touchstart', ativarHecate);
                testeAtivo = false;
                modal.remove();
            }
        }
        
        btn.onclick = verificarSenha;
        input.onkeypress = function(e) {
            if (e.key === 'Enter') verificarSenha();
        };
        input.focus();
    }
    
})();