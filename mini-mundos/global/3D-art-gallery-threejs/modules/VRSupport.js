// ==============================================
// CORREÇÃO DE CAMINHO ABSOLUTO PARA O GITHUB PAGES
// ==============================================
// Importando o VRButton direto da CDN (mesma versão que você está usando)
import { VRButton } from "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/webxr/VRButton.js";

// Detecta se é celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Verifica se o dispositivo suporta WebXR
const supportsWebXR = () => {
  return 'xr' in navigator && navigator.xr !== undefined;
};

export const setupVR = (renderer) => {
  // Em celular, verificar suporte antes de ativar
  if (isMobile) {
    if (!supportsWebXR()) {
      console.log("📱 Dispositivo móvel sem suporte WebXR. VR desativado.");
      return;
    }
    
    // Verificar se o navegador suporta session de realidade imersiva
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      if (!supported) {
        console.log("📱 VR imersivo não suportado neste navegador.");
        return;
      }
      
      console.log("📱 VR suportado! Ativando...");
      enableVR(renderer);
    }).catch(() => {
      console.log("📱 Não foi possível verificar suporte VR.");
    });
  } else {
    // Desktop: ativar VR normalmente
    enableVR(renderer);
  }
};

const enableVR = (renderer) => {
  try {
    renderer.xr.enabled = true;

    renderer.xr.addEventListener("sessionstart", () => {
      console.log("🕶️ WebXR session started");
    });

    renderer.xr.addEventListener("sessionend", () => {
      console.log("🕶️ WebXR session ended");
    });

    // Adicionar botão VR apenas em desktop (no celular fica pequeno demais)
    if (!isMobile) {
      const vrButton = VRButton.createButton(renderer);
      vrButton.style.position = 'fixed';
      vrButton.style.bottom = '20px';
      vrButton.style.left = '20px';
      vrButton.style.right = 'auto';
      vrButton.style.top = 'auto';
      vrButton.style.zIndex = '1000';
      document.body.appendChild(vrButton);
      console.log("🕶️ Botão VR adicionado (desktop)");
    } else {
      console.log("📱 VR disponível mas botão oculto no celular (use gestos)");
    }
  } catch (error) {
    console.warn("⚠️ Erro ao configurar VR:", error);
  }
};

// Função para entrar em VR programaticamente
export const enterVR = (renderer) => {
  if (renderer.xr.enabled && renderer.xr.isPresenting === false) {
    renderer.xr.enable();
    renderer.xr.getSession().catch(() => {
      console.log("🔘 Clique no botão VR para entrar no modo imersivo");
    });
  }
};

// Função para sair do VR
export const exitVR = (renderer) => {
  if (renderer.xr.isPresenting) {
    renderer.xr.getSession()?.end();
  }
};