// shared/asuras/victoria/animate.js
// Versão CORRIGIDA para VICTORIA - com fogo, hellLight e coroa de louros

export function startAnimation(scene, camera, renderer, controls, fireParticles, fillLight, circleGlow, hellLight, laurelRing) {
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
        time += 0.01;
        
        // 1. ANIMAÇÃO DO MODELO 3D (MIXER)
        if (mixer) {
            mixer.update(deltaTime);
        }
        
        // 2. PARTÍCULAS DE FOGO
        if (fireParticles) {
            fireParticles.rotation.y = time * 0.07;
            fireParticles.rotation.x = Math.sin(time * 0.15) * 0.1;
        }
        
        // 3. COROA DE LOUROS
        if (laurelRing) {
            laurelRing.rotation.z = time * 0.25;
        }
        
        // 4. LUZES PULSANTES
        if (fillLight) {
            fillLight.intensity = 0.7 + Math.sin(time * 3.5) * 0.25;
        }
        if (circleGlow) {
            circleGlow.material.emissiveIntensity = 0.4 + Math.sin(time * 2.5) * 0.2;
        }
        if (hellLight) {
            hellLight.intensity = 0.45 + Math.sin(time * 4) * 0.2;
        }
        
        // 5. CONTROLES E RENDERIZAÇÃO
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { 
        setMixer: (m) => { 
            mixer = m; 
            console.log("✅ Mixer da VICTORIA conectado!");
        },
        stop: () => { animating = false; }
    };
}