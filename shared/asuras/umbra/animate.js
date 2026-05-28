// shared/js/three-animate.js
// Versão CORRIGIDA que funciona para TODAS as asuras

let mixerGlobal = null;
let extrasGlobal = {};

export function setMixer(mixer) {
    mixerGlobal = mixer;
    console.log("✅ Mixer conectado à animação:", mixer ? "sim" : "não");
}

export function setExtras(extras) {
    extrasGlobal = extras;
    console.log("✅ Extras conectados:", Object.keys(extras));
}

export function startAnimation(scene, camera, renderer, controls, config) {
    let time = 0;
    let deltaTime = 0.016;
    let lastTime = performance.now();
    let animating = true;
    
    // Elementos que serão animados (serão configurados depois)
    let particles = null;
    let ring1 = null;
    let ring2 = null;
    let fillLight = null;
    let circleGlow = null;
    let customItems = {};
    
    function updateDelta() {
        if (!animating) return;
        const now = performance.now();
        deltaTime = Math.min(0.033, (now - lastTime) / 1000);
        lastTime = now;
        requestAnimationFrame(updateDelta);
    }
    updateDelta();
    
    // Função para configurar os elementos da asura
    function setup(elements) {
        particles = elements.particles || null;
        ring1 = elements.ring1 || null;
        ring2 = elements.ring2 || null;
        fillLight = elements.fillLight || null;
        circleGlow = elements.circleGlow || null;
        customItems = elements.custom || {};
        console.log("✅ Elementos configurados para animação:", {
            particles: !!particles,
            ring1: !!ring1,
            ring2: !!ring2,
            fillLight: !!fillLight,
            circleGlow: !!circleGlow,
            custom: Object.keys(customItems)
        });
    }
    
    function animate() {
        if (!animating) return;
        requestAnimationFrame(animate);
        time += 0.008;
        
        // 1. ANIMAÇÃO DO MODELO 3D
        if (mixerGlobal) {
            mixerGlobal.update(deltaTime);
        }
        
        // 2. PARTÍCULAS
        if (particles && particles.rotation) {
            particles.rotation.y = time * 0.05;
            if (particles.rotation.x !== undefined) {
                particles.rotation.x = Math.sin(time * 0.1) * 0.05;
            }
        }
        
        // 3. ANÉIS
        if (ring1) ring1.rotation.z = time * 0.3;
        if (ring2) ring2.rotation.z = -time * 0.25;
        
        // 4. LUZ PULSANTE
        if (fillLight) fillLight.intensity = 0.5 + Math.sin(time * 2.2) * 0.2;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.25 + Math.sin(time * 1.8) * 0.15;
        
        // 5. ELEMENTOS PERSONALIZADOS POR ASURA
        
        // Victoria (coroa de louros)
        if (customItems.laurelRing) {
            customItems.laurelRing.rotation.z = time * 0.25;
        }
        
        // Victoria (partículas de fogo)
        if (customItems.fireParticles && customItems.fireParticles.rotation) {
            customItems.fireParticles.rotation.y = time * 0.07;
        }
        
        // Merlim (anel holográfico)
        if (customItems.hologramRing) {
            customItems.hologramRing.rotation.z = time * 0.15;
        }
        
        // Merlim (símbolos de código flutuantes)
        if (customItems.symbols && Array.isArray(customItems.symbols)) {
            customItems.symbols.forEach((symbol, idx) => {
                if (symbol && symbol.material) {
                    symbol.material.opacity = 0.25 + Math.sin(time * 1.5 + idx) * 0.15;
                }
                if (symbol && symbol.position) {
                    symbol.position.y += 0.001;
                    if (symbol.position.y > 2.5) symbol.position.y = 0;
                }
            });
        }
        
        // Astreia (escudo)
        if (customItems.shield) {
            customItems.shield.material.emissiveIntensity = 0.08 + Math.sin(time * 2) * 0.04;
        }
        
        // Hestia (balanças da justiça)
        if (customItems.scaleGroup && customItems.scaleGroup.children[1]) {
            customItems.scaleGroup.children[1].rotation.z = Math.sin(time * 1.5) * 0.03;
        }
        if (customItems.scaleGroup2 && customItems.scaleGroup2.children[1]) {
            customItems.scaleGroup2.children[1].rotation.z = Math.sin(time * 1.5 + 1) * 0.03;
        }
        
        // Diva (glow/halo)
        if (customItems.glowHalo) {
            const scale = 1 + Math.sin(time * 2) * 0.03;
            customItems.glowHalo.scale.set(scale, scale, scale);
            if (customItems.glowHalo.material) {
                customItems.glowHalo.material.opacity = 0.08 + Math.sin(time * 1.5) * 0.04;
            }
        }
        
        // Daedala (luz de laboratório)
        if (customItems.labLight) {
            customItems.labLight.intensity = 0.35 + Math.sin(time * 2.5) * 0.15;
        }
        
        // Umbra (luz de sombra)
        if (customItems.shadowLight) {
            customItems.shadowLight.intensity = 0.3 + Math.sin(time * 2) * 0.1;
        }
        
        // Atena (luz dourada)
        if (customItems.goldenLight) {
            customItems.goldenLight.intensity = 0.4 + Math.sin(time * 1.5) * 0.15;
        }
        
        // 6. CONTROLES E RENDERIZAÇÃO
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { 
        setup: setup,
        setMixer: setMixer,
        setExtras: setExtras,
        stop: () => { animating = false; }
    };
}