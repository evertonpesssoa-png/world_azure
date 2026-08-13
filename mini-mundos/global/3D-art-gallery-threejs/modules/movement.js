// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

// object to hold the keys pressed
export const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

// Detecta celular
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// OTIMIZAÇÃO: Criar objetos uma única vez para reutilizar na colisão (evita garbage collector)
const _playerBoundingBox = new THREE.Box3();
const _cameraWorldPosition = new THREE.Vector3();
const _playerSize = new THREE.Vector3(1, 1, 1);

// Se for celular, adicionar listeners para os botões de toque
if (isMobile) {
  // Função para capturar comandos dos botões móveis
  window.addEventListener('load', () => {
    // Os botões já disparam eventos de teclado simulados
    // Só precisamos garantir que o keysPressed seja atualizado
    // Os eventos keydown/keyup já fazem isso automaticamente
    console.log("📱 Movimento móvel pronto - use os botões na tela");
  });
}

// Função auxiliar para movimento com toque (chamada pelos botões)
export const moveForward = () => {
  keysPressed.w = true;
  setTimeout(() => { keysPressed.w = false; }, 150);
};

export const moveBackward = () => {
  keysPressed.s = true;
  setTimeout(() => { keysPressed.s = false; }, 150);
};

export const moveLeft = () => {
  keysPressed.a = true;
  setTimeout(() => { keysPressed.a = false; }, 150);
};

export const moveRight = () => {
  keysPressed.d = true;
  setTimeout(() => { keysPressed.d = false; }, 150);
};

// parameters we get from setupRendering where updateMovement is called
export const updateMovement = (delta, controls, camera, walls) => {
  // moveSpeed é a distância que a câmera vai se mover em um segundo
  const moveSpeed = 5 * delta;
  const previousPosition = camera.position.clone();

  // Movimentos (funciona tanto para teclado quanto para toque simulado)
  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
  }

  // Verificar colisão
  if (checkCollision(camera, walls)) {
    camera.position.copy(previousPosition);
  }
};

// checkCollision: verifica se o jogador colidiu com alguma parede
export const checkCollision = (camera, walls) => {
  // Reutilizando os objetos criados acima para evitar alocação de memória a cada frame
  camera.getWorldPosition(_cameraWorldPosition);
  
  _playerBoundingBox.setFromCenterAndSize(
    _cameraWorldPosition,
    _playerSize
  );

  // Verificar se walls existe e tem children
  if (!walls || !walls.children) return false;
  
  for (let i = 0; i < walls.children.length; i++) {
    const wall = walls.children[i];
    if (wall.BoundingBox && _playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }

  return false;
};

// Função para resetar todas as teclas (útil quando o menu abre)
export const resetKeys = () => {
  Object.keys(keysPressed).forEach(key => {
    keysPressed[key] = false;
  });
};

// Função para verificar se alguma tecla está pressionada
export const isMoving = () => {
  return keysPressed.w || keysPressed.s || keysPressed.a || keysPressed.d ||
         keysPressed.ArrowUp || keysPressed.ArrowDown || 
         keysPressed.ArrowLeft || keysPressed.ArrowRight;
};