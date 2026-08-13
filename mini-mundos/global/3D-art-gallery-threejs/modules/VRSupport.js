// ==============================================
// CORREÇÃO DE CAMINHO ABSOLUTO PARA O GITHUB PAGES
// ==============================================
import { VRButton } from "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/webxr/VRButton.js";

// Detecta se é celular
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

// Verifica se o dispositivo suporta WebXR
const supportsWebXR = () => {
  return "xr" in navigator && navigator.xr !== undefined;
};

export const setupVR = (renderer) => {
  // ==============================================
  // CELULAR
  // ==============================================
  if (isMobile) {
    if (!supportsWebXR()) {
      console.log(
        "📱 Dispositivo móvel sem suporte WebXR. VR desativado."
      );
      return;
    }

    navigator.xr
      .isSessionSupported("immersive-vr")
      .then((supported) => {
        if (!supported) {
          console.log(
            "📱 VR imersivo não suportado neste navegador."
          );
          return;
        }

        console.log("📱 VR suportado! Ativando...");
        enableVR(renderer);
      })
      .catch(() => {
        console.log(
          "📱 Não foi possível verificar suporte VR."
        );
      });
  } else {
    // ==============================================
    // DESKTOP
    // ==============================================
    enableVR(renderer);
  }
};

const enableVR = (renderer) => {
  try {
    renderer.xr.enabled = true;

    // ==============================================
    // EVENTO — ENTRADA NO VR
    // ==============================================
    renderer.xr.addEventListener(
      "sessionstart",
      () => {
        console.log("🕶️ WebXR session started");
      }
    );

    // ==============================================
    // EVENTO — SAÍDA DO VR
    // ==============================================
    renderer.xr.addEventListener(
      "sessionend",
      () => {
        console.log("🕶️ WebXR session ended");
      }
    );

    // ==============================================
    // CRIAÇÃO DO BOTÃO VR
    // ==============================================

    const vrButton = VRButton.createButton(renderer);

    // ==============================================
    // POSIÇÃO:
    //
    // VR = TOPO ESQUERDO
    //
    // CONTROLES = TOPO DIREITO
    //
    // O VR NÃO É POSICIONADO EM RELAÇÃO
    // AO BOTÃO DE CONTROLES.
    // É POSICIONADO EM RELAÇÃO À VIEWPORT.
    // ==============================================

    vrButton.style.setProperty(
      "position",
      "fixed",
      "important"
    );

    vrButton.style.setProperty(
      "top",
      "20px",
      "important"
    );

    vrButton.style.setProperty(
      "left",
      "20px",
      "important"
    );

    // Remove qualquer posição que possa
    // empurrar o botão para a direita
    vrButton.style.setProperty(
      "right",
      "auto",
      "important"
    );

    vrButton.style.setProperty(
      "bottom",
      "auto",
      "important"
    );

    // ==============================================
    // CAMADA
    // ==============================================

    vrButton.style.setProperty(
      "z-index",
      "999999",
      "important"
    );

    // ==============================================
    // TAMANHO
    // ==============================================

    vrButton.style.setProperty(
      "font-size",
      "12px",
      "important"
    );

    vrButton.style.setProperty(
      "padding",
      "6px 12px",
      "important"
    );

    // ==============================================
    // GARANTE QUE NÃO TENHA DESLOCAMENTO
    // ==============================================

    vrButton.style.setProperty(
      "margin",
      "0",
      "important"
    );

    vrButton.style.setProperty(
      "transform",
      "none",
      "important"
    );

    // ==============================================
    // GARANTE INTERAÇÃO NO CELULAR
    // ==============================================

    vrButton.style.setProperty(
      "pointer-events",
      "auto",
      "important"
    );

    vrButton.style.setProperty(
      "touch-action",
      "manipulation",
      "important"
    );

    // ==============================================
    // ADICIONA À TELA
    // ==============================================

    document.body.appendChild(vrButton);

    console.log(
      "🕶️ Botão VR adicionado no TOPO ESQUERDO"
    );

  } catch (error) {
    console.warn(
      "⚠️ Erro ao configurar VR:",
      error
    );
  }
};

// ==============================================
// FUNÇÃO PARA ENTRAR EM VR PROGRAMATICAMENTE
// ==============================================

export const enterVR = (renderer) => {
  if (
    renderer.xr.enabled &&
    renderer.xr.isPresenting === false
  ) {
    renderer.xr.enable();

    renderer.xr
      .getSession()
      .catch(() => {
        console.log(
          "🔘 Clique no botão VR para entrar no modo imersivo"
        );
      });
  }
};

// ==============================================
// FUNÇÃO PARA SAIR DO VR
// ==============================================

export const exitVR = (renderer) => {
  if (renderer.xr.isPresenting) {
    renderer.xr.getSession()?.end();
  }
};