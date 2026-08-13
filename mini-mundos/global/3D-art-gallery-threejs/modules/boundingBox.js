// ==============================================
// CORREÇÃO: Importando THREE direto da CDN
// ==============================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

// Detecta celular para reduzir precisão das bounding boxes
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const createBoundingBoxes = (objects) => {
  // objects will be either paintings or walls that we pass in from main.js
  if (!Array.isArray(objects)) {
    objects = objects.children;
  }

  objects.forEach((object) => {
    // Criar bounding box com precisão reduzida em celular (melhora performance)
    if (isMobile) {
      // Versão mais leve para celular
      const box = new THREE.Box3();
      const position = object.position || new THREE.Vector3();
      const scale = object.scale || new THREE.Vector3(1, 1, 1);
      
      // Aproximação rápida (menos precisa, mas mais leve)
      const halfSize = 0.5;
      box.min.set(position.x - halfSize, position.y - halfSize, position.z - halfSize);
      box.max.set(position.x + halfSize, position.y + halfSize, position.z + halfSize);
      object.BoundingBox = box;
    } else {
      // Versão completa para desktop
      object.BoundingBox = new THREE.Box3();
      object.BoundingBox.setFromObject(object);
    }
  });
};