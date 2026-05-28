// shared/asuras/[nome-da-asura]/animate.js
// Versão CORRIGIDA - com anéis dourados, partículas e luzes pulsantes

export function startAnimation(scene, camera, renderer, controls, particles, ring, ring2, fillLight, circleGlow) {
    let time = 0;
    let deltaTime = 0.016;
    let lastTime = performance.now();
    let mixer = null;
    let animating = true;
    
    function updateDelta() {
        if (!animating) return;
        const now = performance.now();
        deltaTime = Math.min(0.033, (now - lastTime) / 1000);
        lastTime = now;
        requestAnimationFrame(updateDelta);
    }
    updateDelta();
    
    function animate() {
        if (!animating) return;
        requestAnimationFrame(animate);
        time += 0.008;
        
        // 1. ANIMAÇÃO DO MODELO 3D (MIXER)
        if (mixer) {
            mixer.update(deltaTime);
        }
        
        // 2. PARTÍCULAS GIRATÓRIAS
        if (particles) {
            particles.rotation.y = time * 0.05;
            particles.rotation.x = Math.sin(time * 0.15) * 0.1;
        }
        
        // 3. ANÉIS DOURADOS
        if (ring) ring.rotation.z = time * 0.25;
        if (ring2) ring2.rotation.z = -time * 0.2;
        
        // 4. LUZES PULSANTES
        if (fillLight) fillLight.intensity = 0.5 + Math.sin(time * 2) * 0.15;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.25 + Math.sin(time * 1.8) * 0.15;
        
        // 5. CONTROLES E RENDERIZAÇÃO
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { 
        setMixer: (m) => { 
            mixer = m; 
            console.log("✅ Mixer da asura conectado!");
        },
        stop: () => { animating = false; }
    };
}