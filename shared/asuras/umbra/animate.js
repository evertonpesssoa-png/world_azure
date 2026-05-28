export function startAnimation(scene, camera, renderer, controls, particles, ring, ring2, fillLight, circleGlow) {
    let time = 0;
    let deltaTime = 0.016;
    let lastTime = performance.now();
    let mixer = null;
    
    function updateDelta() {
        const now = performance.now();
        deltaTime = Math.min(0.033, (now - lastTime) / 1000);
        lastTime = now;
        requestAnimationFrame(updateDelta);
    }
    updateDelta();
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        
        if (mixer) mixer.update(deltaTime);
        
        if (particles) {
            particles.rotation.y = time * 0.04;
            particles.rotation.x = Math.sin(time * 0.1) * 0.05;
        }
        
        if (ring) ring.rotation.z = time * 0.28;
        if (ring2) ring2.rotation.z = -time * 0.22;
        
        if (fillLight) fillLight.intensity = 0.4 + Math.sin(time * 2.2) * 0.15;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.2 + Math.sin(time * 1.8) * 0.12;
        
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { setMixer: (m) => { mixer = m; } };
}