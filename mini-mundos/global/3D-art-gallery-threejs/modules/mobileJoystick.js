// ============================================================
// 📱 JOYSTICK VIRTUAL
// ============================================================

import {
  moveForward,
  moveBackward,
  moveLeft,
  moveRight
} from "./movement.js";

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export function setupMobileJoystick() {

  if (!isMobile) {
    return;
  }

  const controls = [
    {
      id: "joy-up",
      action: moveForward
    },

    {
      id: "joy-down",
      action: moveBackward
    },

    {
      id: "joy-left",
      action: moveLeft
    },

    {
      id: "joy-right",
      action: moveRight
    }
  ];

  controls.forEach(({ id, action }) => {

    const button =
      document.getElementById(id);

    if (!button) {
      console.warn(
        `⚠️ Joystick: #${id} não encontrado`
      );
      return;
    }

    const activate = (event) => {

      event.preventDefault();
      event.stopPropagation();

      button.classList.add("active");

      action();

    };

    const deactivate = (event) => {

      event.preventDefault();

      button.classList.remove("active");

    };

    button.addEventListener(
      "touchstart",
      activate,
      {
        passive: false
      }
    );

    button.addEventListener(
      "touchend",
      deactivate,
      {
        passive: false
      }
    );

    button.addEventListener(
      "touchcancel",
      deactivate,
      {
        passive: false
      }
    );

    // Compatibilidade com mouse
    button.addEventListener(
      "mousedown",
      activate
    );

    button.addEventListener(
      "mouseup",
      deactivate
    );

    button.addEventListener(
      "mouseleave",
      deactivate
    );

  });

  console.log(
    "📱 Joystick virtual ativado"
  );
}