export function startAnimation(scene, camera, renderer, controls, fireParticles, fillLight, circleGlow, hellLight, laurelRing) {
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
        time += 0.01;
        
        if (mixer) mixer.update(deltaTime);
        
        if (fireParticles) {
            fireParticles.rotation.y = time * 0.07;
            fireParticles.rotation.x = Math.sin(time * 0.15) * 0.1;
        }
        
        if (laurelRing) laurelRing.rotation.z = time * 0.25;
        
        if (fillLight) fillLight.intensity = 0.7 + Math.sin(time * 3.5) * 0.25;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.4 + Math.sin(time * 2.5) * 0.2;
        if (hellLight) hellLight.intensity = 0.45 + Math.sin(time * 4) * 0.2;
        
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { setMixer: (m) => { mixer = m; } };
}