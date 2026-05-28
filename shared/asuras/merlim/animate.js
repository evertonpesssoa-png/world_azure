// shared/asuras/merlim/animate.js
// Versão CORRIGIDA para MERLIM - com símbolos de código, anéis tecnológicos e partículas digitais

export function startAnimation(scene, camera, renderer, controls, particles, ring1, ring2, ring3, hologramRing, fillLight, circleGlow, symbols) {
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
        
        // 2. PARTÍCULAS DIGITAIS
        if (particles) {
            particles.rotation.y = time * 0.06;
            particles.rotation.x = Math.sin(time * 0.12) * 0.08;
        }
        
        // 3. ANÉIS DE ENERGIA
        if (ring1) ring1.rotation.z = time * 0.35;
        if (ring2) ring2.rotation.z = -time * 0.28;
        if (ring3) ring3.rotation.z = time * 0.2;
        if (hologramRing) hologramRing.rotation.z = time * 0.15;
        
        // 4. SÍMBOLOS DE CÓDIGO FLUTUANTES
        if (symbols && Array.isArray(symbols)) {
            symbols.forEach((symbol, idx) => {
                if (symbol && symbol.material) {
                    symbol.material.opacity = 0.25 + Math.sin(time * 1.5 + idx) * 0.15;
                }
                if (symbol && symbol.position) {
                    symbol.position.y += 0.001;
                    if (symbol.position.y > 2.5) symbol.position.y = 0;
                }
            });
        }
        
        // 5. LUZES PULSANTES
        if (fillLight) fillLight.intensity = 0.6 + Math.sin(time * 2.8) * 0.2;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.3 + Math.sin(time * 2.2) * 0.2;
        if (hologramRing) hologramRing.material.emissiveIntensity = 0.3 + Math.sin(time * 1.5) * 0.15;
        
        // 6. CONTROLES E RENDERIZAÇÃO
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { 
        setMixer: (m) => { 
            mixer = m; 
            console.log("✅ Mixer da MERLIM conectado!");
        },
        stop: () => { animating = false; }
    };
}