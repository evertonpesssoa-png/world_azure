export function startAnimation(scene, camera, renderer, controls, particles, ring, ring2, fillLight, circleGlow, divineLight, scaleGroup, scaleGroup2) {
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
        time += 0.007;
        
        if (mixer) mixer.update(deltaTime);
        
        if (particles) {
            particles.rotation.y = time * 0.05;
            particles.rotation.x = Math.sin(time * 0.1) * 0.06;
        }
        
        if (ring) ring.rotation.z = time * 0.28;
        if (ring2) ring2.rotation.z = -time * 0.22;
        
        if (fillLight) fillLight.intensity = 0.5 + Math.sin(time * 1.8) * 0.15;
        if (circleGlow) circleGlow.material.emissiveIntensity = 0.3 + Math.sin(time * 1.5) * 0.12;
        if (divineLight) divineLight.intensity = 0.4 + Math.sin(time * 1.2) * 0.12;
        
        if (scaleGroup && scaleGroup.children[1]) {
            scaleGroup.children[1].rotation.z = Math.sin(time * 1.5) * 0.03;
        }
        if (scaleGroup2 && scaleGroup2.children[1]) {
            scaleGroup2.children[1].rotation.z = Math.sin(time * 1.5 + 1) * 0.03;
        }
        
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    return { setMixer: (m) => { mixer = m; } };
}