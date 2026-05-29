import { keysPressed } from "./movement.js";
import { showMenu, hideMenu, isMenuVisible } from "./menu.js";
import { startAudio, stopAudio } from "./audioGuide.js";

let lockPointer = true;
let showMenuOnUnlock = false;

const isMobile =
/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
navigator.userAgent
);

export const setupEventListeners = (controls, camera, scene) => {

document.addEventListener(
"keydown",
(event) => onKeyDown(event, controls),
false
);

document.addEventListener(
"keyup",
(event) => onKeyUp(event, controls),
false
);

if (isMobile) {
const canvas = document.querySelector("canvas");

if (canvas) {
  canvas.addEventListener("touchstart", (e) => {
    if (isMenuVisible()) {
      e.preventDefault();
    }
  });
}

}

controls.addEventListener("unlock", () => {
if (showMenuOnUnlock) {
showMenu();
}

showMenuOnUnlock = false;

});

const startAudioBtn = document.getElementById("start_audio");
const stopAudioBtn = document.getElementById("stop_audio");

if (startAudioBtn) {
const newStartBtn = startAudioBtn.cloneNode(true);
startAudioBtn.parentNode.replaceChild(
newStartBtn,
startAudioBtn
);

newStartBtn.addEventListener("click", () => startAudio());

newStartBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startAudio();
});

}

if (stopAudioBtn) {
const newStopBtn = stopAudioBtn.cloneNode(true);
stopAudioBtn.parentNode.replaceChild(
newStopBtn,
stopAudioBtn
);

newStopBtn.addEventListener("click", () => stopAudio());

newStopBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  stopAudio();
});

}

const toggleBtn = document.getElementById("toggle-info");

if (toggleBtn) {
const newToggleBtn = toggleBtn.cloneNode(true);

toggleBtn.parentNode.replaceChild(
  newToggleBtn,
  toggleBtn
);

const togglePanel = () => {
  const panel = document.getElementById("info-panel");

  panel.classList.toggle("collapsed");

  newToggleBtn.innerText =
    panel.classList.contains("collapsed")
      ? "Show"
      : "Hide";
};

newToggleBtn.addEventListener("click", togglePanel);

newToggleBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  togglePanel();
});

}
};

function togglePointerLock(controls) {
if (lockPointer) {
controls.lock();
} else {
showMenuOnUnlock = false;
controls.unlock();
}

lockPointer = !lockPointer;
}

function onKeyDown(event, controls) {
if (event.key in keysPressed) {
keysPressed[event.key] = true;
}

if (event.key === "Escape") {
showMenu();
showMenuOnUnlock = true;
controls.unlock();
lockPointer = false;
}

if (event.key === "Enter" || event.key === "Return") {
hideMenu();

if (!isMobile) {
  controls.lock();
  lockPointer = true;
}

}

if (event.key === " ") {
togglePointerLock(controls);
}

if (event.key === "g") {
startAudio();
}

if (event.key === "p") {
stopAudio();
}

if (event.key === "m") {
showMenu();
showMenuOnUnlock = true;
controls.unlock();
lockPointer = false;
}

if (event.key === "r") {
location.reload();
}
}

function onKeyUp(event) {
if (event.key in keysPressed) {
keysPressed[event.key] = false;
}
}