// ============================================
// 🗝️ HÉCATE - FIREWALL PRINCIPAL
// Apenas detecta interação e chama o sistema de teste
// Mantém toda a estrutura modular existente
// ============================================

(function() {
    'use strict';
    
    let testeAtivo = false;
    let autenticado = false;
    
    // Inicializar quando a página carregar
    window.addEventListener('load', function() {
        console.log('🗝️ Hécate: Firewall carregado');
        
        // Verificar se já passou no teste (usando as keys existentes)
        if (localStorage.getItem('hecate_auth_complete') === 'true' ||
            localStorage.getItem('wz_obscuratil_complete') === 'true') {
            console.log('✅ Usuário já autenticado');
            autenticado = true;
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
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.style.pointerEvents = '';
            item.style.opacity = '';
            item.style.filter = '';
        });
        console.log('🔓 Cards liberados!');
    }
    
    function ativarHecate(e) {
        // Não ativar se já autenticado
        if (autenticado) return;
        if (localStorage.getItem('hecate_auth_complete') === 'true') return;
        
        // Não ativar se já está mostrando o teste
        if (testeAtivo) return;
        
        console.log('🔥 Toque/clique detectado! Ativando Hécate...');
        
        // Remover listeners para não ativar múltiplas vezes
        document.body.removeEventListener('click', ativarHecate);
        document.body.removeEventListener('touchstart', ativarHecate);
        
        // Chamar o sistema de teste existente
        chamarTesteExistente();
    }
    
    function chamarTesteExistente() {
        testeAtivo = true;
        
        // Tentar usar o HecateTest existente
        if (typeof HecateTest !== 'undefined' && HecateTest.show) {
            console.log('📜 Chamando HecateTest.show()');
            HecateTest.show(function(success) {
                if (success) {
                    autenticado = true;
                    liberarCards();
                    console.log('✅ Teste aprovado! Cards liberados.');
                } else {
                    // Falhou, reagir listeners para nova tentativa
                    document.body.addEventListener('click', ativarHecate);
                    document.body.addEventListener('touchstart', ativarHecate);
                    testeAtivo = false;
                    console.log('❌ Teste falhou. Aguardando nova tentativa.');
                }
            });
        }
        // Tentar usar o ObscuratilTest antigo (fallback)
        else if (typeof ObscuratilTest !== 'undefined' && ObscuratilTest.show) {
            console.log('📜 Chamando ObscuratilTest.show() (fallback)');
            ObscuratilTest.show(function(success) {
                if (success) {
                    autenticado = true;
                    liberarCards();
                    console.log('✅ Teste aprovado! Cards liberados.');
                } else {
                    document.body.addEventListener('click', ativarHecate);
                    document.body.addEventListener('touchstart', ativarHecate);
                    testeAtivo = false;
                    console.log('❌ Teste falhou.');
                }
            });
        }
        else {
            console.error('❌ Nenhum sistema de teste encontrado!');
            // Fallback de emergência
            alert('⚠️ Sistema de teste não encontrado! Contate o administrador.');
            liberarCards(); // Libera para não travar
            testeAtivo = false;
        }
    }
    
})();