// shared/asuras/diva/animate.js
// Versão CORRIGIDA para DIVA - com glow, anéis e luzes neon

export function startAnimation(scene, camera, renderer, controls, particles, ring1, ring2, fillLight, circleGlow, bottomLight, frontLight, glowHalo) {
    let time = 0;
    let deltaTime = 0.016;
    let lastTime = performance.now();
    let mixer = null;
    let glowMaterial = null;
    let animating = true;
    
    if (glowHalo && glowHalo.material) {
        glowMaterial = glowHalo.material;
    }
    
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
        
        // 2. PARTÍCULAS ROSAS
        if (particles) {
            particles.rotation.y = time * 0.1;
            particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        }
        
        // 3. ANÉIS FLUTUANTES
        if (ring1) ring1.rotation.z = time * 0.3;
        if (ring2) ring2.rotation.z = -time * 0.2;
        
        // 4. LUZES PULSANTES (NEON)
        if (fillLight) fillLight.intensity = 0.9 + Math.sin(time * 4) * 0.25;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.3 + Math.sin(time * 2.5) * 0.2;
        if (bottomLight) bottomLight.intensity = 0.5 + Math.sin(time * 3) * 0.2;
        if (frontLight) frontLight.intensity = 0.4 + Math.sin(time * 2) * 0.15;
        
        // 5. HALO/GLOW AO REDOR (PULSAÇÃO)
        if (glowHalo) {
            const scale = 1 + Math.sin(time * 2) * 0.03;
            glowHalo.scale.set(scale, scale, scale);
            if (glowMaterial) {
                glowMaterial.opacity = 0.08 + Math.sin(time * 1.5) * 0.04;
            }
        }
        
        // 6. CONTROLES E RENDERIZAÇÃO
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { 
        setMixer: (m) => { 
            mixer = m; 
            console.log("✅ Mixer da DIVA conectado!");
        },
        stop: () => { animating = false; }
    };
}