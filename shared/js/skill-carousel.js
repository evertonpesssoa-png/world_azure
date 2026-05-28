// =========================
// SKILL CARROSSEL - MÓDULO COMPLETAMENTE PARAMETRIZÁVEL
// =========================
// Uso:
// initSkillCarousel(scene, camera, renderer, asuraColor, asuraName, skillsArray)
// skillsArray = [ { id, name, icon, action, color, html }, ... ]
// Se skillsArray não for fornecido, usa um array padrão (Merlim).

export function initSkillCarousel(scene, camera, renderer, asuraColor, asuraName = 'merlim', customSkills = null) {
    
    // Skills padrão (caso não seja passado um array customizado)
    const defaultSkills = [
        { id: 'monitor', name: 'MONITOR', icon: '📊', action: 'monitor', color: '#00ff88', html: 'monitor.html' },
        { id: 'manutencao', name: 'REPARO', icon: '⚙️', action: 'manutencao', color: '#ffaa00', html: 'manutencao.html' },
        { id: 'biblioteca', name: 'BIBLIOTECA', icon: '📚', action: 'biblioteca', color: '#44aaff', html: 'biblioteca.html' },
        { id: 'sistema', name: 'SISTEMA', icon: '🔧', action: 'sistema', color: asuraColor || '#00d9ff', html: 'sistema.html' },
        { id: 'codigo', name: 'CÓDIGO', icon: '⚡', action: 'codigo', color: '#ffff00', html: 'codigo.html' },
        { id: 'perfil', name: 'PERFIL', icon: '👤', action: 'perfil', color: '#ff44aa', html: 'perfil.html' }
    ];

    const skills = (customSkills && customSkills.length) ? customSkills : defaultSkills;
    const skillCount = skills.length;
    const circleRadius = 2.4;
    const carrosselGroup = new THREE.Group();
    
    let isDragging = false;
    let dragStartX = 0;
    let currentRotation = 0;
    
    // =========================
    // 1. CRIAR ANÉIS DE LUZ
    // =========================
    const ringMain = new THREE.Mesh(
        new THREE.TorusGeometry(circleRadius + 0.05, 0.04, 128, 200),
        new THREE.MeshStandardMaterial({ color: asuraColor || 0x00d9ff, emissive: asuraColor || 0x00d9ff, emissiveIntensity: 0.7, transparent: true, opacity: 0.9 })
    );
    ringMain.rotation.x = Math.PI / 2;
    ringMain.position.y = 0.7;
    carrosselGroup.add(ringMain);
    
    const ringOuter = new THREE.Mesh(
        new THREE.TorusGeometry(circleRadius + 0.2, 0.02, 128, 200),
        new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 0.4, transparent: true, opacity: 0.6 })
    );
    ringOuter.rotation.x = Math.PI / 2;
    ringOuter.position.y = 0.72;
    carrosselGroup.add(ringOuter);
    
    const ringInner = new THREE.Mesh(
        new THREE.TorusGeometry(circleRadius - 0.15, 0.02, 128, 200),
        new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.4, transparent: true, opacity: 0.6 })
    );
    ringInner.rotation.x = Math.PI / 2;
    ringInner.position.y = 0.68;
    carrosselGroup.add(ringInner);
    
    // =========================
    // 2. ARMAZENAR ÍCONES
    // =========================
    const iconSpheres = [];
    const linePoints = [];
    
    // =========================
    // 3. CRIAR ÍCONES E CONEXÕES
    // =========================
    for (let i = 0; i < skillCount; i++) {
        const angle = (i / skillCount) * Math.PI * 2;
        const x = Math.cos(angle) * circleRadius;
        const z = Math.sin(angle) * circleRadius;
        const skill = skills[i];
        
        linePoints.push({ x, z, color: skill.color });
        
        // Esfera base
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: skill.color, 
            emissive: skill.color, 
            emissiveIntensity: 0.8,
            metalness: 0.6,
            roughness: 0.2
        });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), sphereMat);
        sphere.position.set(x, 0.7, z);
        sphere.userData = skill;
        carrosselGroup.add(sphere);
        iconSpheres.push(sphere);
        
        // Ícone CSS2D
        const div = document.createElement('div');
        div.textContent = skill.icon;
        div.style.fontSize = '36px';
        div.style.filter = `drop-shadow(0 0 10px ${skill.color})`;
        div.style.cursor = 'pointer';
        div.style.textShadow = `0 0 15px ${skill.color}`;
        div.style.animation = `floatSkill${i} 2s ease infinite alternate`;
        
        const label = new CSS2DObject(div);
        label.position.set(x, 1.0, z);
        label.userData = skill;
        carrosselGroup.add(label);
        
        // Animação individual
        const style = document.createElement('style');
        style.textContent = `@keyframes floatSkill${i} { 0% { transform: translateY(-8px); } 100% { transform: translateY(8px); } }`;
        document.head.appendChild(style);
    }
    
    // =========================
    // 4. LINHAS DE LUZ (CONEXÕES)
    // =========================
    const lineMaterial = new THREE.LineBasicMaterial({ color: asuraColor || 0x00d9ff });
    for (let i = 0; i < skillCount; i++) {
        const current = linePoints[i];
        const next = linePoints[(i + 1) % skillCount];
        
        const points = [
            new THREE.Vector3(current.x, 0.72, current.z),
            new THREE.Vector3(next.x, 0.72, next.z)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        carrosselGroup.add(line);
        
        // Raios do centro
        const centerPoints = [
            new THREE.Vector3(0, 0.72, 0),
            new THREE.Vector3(current.x, 0.72, current.z)
        ];
        const centerGeo = new THREE.BufferGeometry().setFromPoints(centerPoints);
        const centerLine = new THREE.Line(centerGeo, new THREE.LineBasicMaterial({ color: 0xff00ff }));
        carrosselGroup.add(centerLine);
    }
    
    // =========================
    // 5. PARTÍCULAS ORBITANDO
    // =========================
    const orbitParticles = [];
    for (let i = 0; i < 36; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.9 })
        );
        particle.userData = { angle: (i / 36) * Math.PI * 2 };
        carrosselGroup.add(particle);
        orbitParticles.push(particle);
    }
    
    carrosselGroup.position.y = 0.2;
    scene.add(carrosselGroup);
    
    // =========================
    // 6. ANIMAÇÃO DAS PARTÍCULAS
    // =========================
    let orbitTime = 0;
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        orbitTime += 0.02;
        orbitParticles.forEach(p => {
            const angle = p.userData.angle + orbitTime;
            const x = Math.cos(angle) * (circleRadius + 0.12);
            const z = Math.sin(angle) * (circleRadius + 0.12);
            p.position.set(x, 0.75, z);
        });
    }
    animateParticles();
    
    // =========================
    // 7. CONTROLE DE GIRO (TOQUE/ARRASTO)
    // =========================
    function startDrag(clientX) {
        isDragging = true;
        dragStartX = clientX;
    }
    
    function onDrag(clientX) {
        if (!isDragging) return;
        const delta = clientX - dragStartX;
        currentRotation += delta * 0.008;
        carrosselGroup.rotation.y = currentRotation;
        dragStartX = clientX;
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    renderer.domElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag(e.touches[0].clientX);
    });
    renderer.domElement.addEventListener('touchmove', (e) => {
        e.preventDefault();
        onDrag(e.touches[0].clientX);
    });
    renderer.domElement.addEventListener('touchend', () => endDrag());
    
    // =========================
    // 8. INTERAÇÃO DE CLIQUE (ABRIR HTML DA SKILL)
    // =========================
    const raycaster = new THREE.Raycaster();
    const clickPos = new THREE.Vector2();
    
    function onSkillClick(event) {
        if (isDragging) return;
        
        const clientX = event.clientX ?? (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY ?? (event.touches ? event.touches[0].clientY : 0);
        
        clickPos.x = (clientX / renderer.domElement.clientWidth) * 2 - 1;
        clickPos.y = -(clientY / renderer.domElement.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(clickPos, camera);
        const hits = raycaster.intersectObjects(iconSpheres);
        
        if (hits.length > 0) {
            const skill = hits[0].object.userData;
            openSkillHTML(skill);
        }
    }
    
    function openSkillHTML(skill) {
        // Caminho dinâmico: shared/skills/[asuraName]/[skill.html]
        const skillPath = `../shared/skills/${asuraName}/${skill.html}`;
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'skill-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            z-index: 30000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Iframe
        const iframe = document.createElement('iframe');
        iframe.src = skillPath;
        iframe.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            height: 80%;
            max-height: 600px;
            background: transparent;
            border: 2px solid ${skill.color};
            border-radius: 20px;
            box-shadow: 0 0 30px ${skill.color};
            z-index: 30001;
        `;
        
        // Botão fechar
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ FECHAR';
        closeBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: ${skill.color};
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            color: #000;
            font-weight: bold;
            cursor: pointer;
            z-index: 30002;
            font-family: monospace;
        `;
        closeBtn.onclick = () => overlay.remove();
        
        overlay.appendChild(iframe);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        
        // Animação fadeIn
        const style = document.createElement('style');
        style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
        document.head.appendChild(style);
    }
    
    // Eventos globais
    window.addEventListener('click', onSkillClick);
    window.addEventListener('touchstart', (e) => {
        if (!isDragging) onSkillClick(e);
    });
    
    // Retornar objeto com método destroy e updateSkills
    return {
        destroy: () => {
            scene.remove(carrosselGroup);
            window.removeEventListener('click', onSkillClick);
        },
        // Método para atualizar as skills dinamicamente (recria o carrossel)
        updateSkills: (newSkills) => {
            // Remove todos os filhos do grupo, exceto os anéis? (simplificado: recria tudo)
            while(carrosselGroup.children.length > 3) {
                carrosselGroup.remove(carrosselGroup.children[carrosselGroup.children.length-1]);
            }
            // Limpar arrays e referências
            iconSpheres.length = 0;
            linePoints.length = 0;
            // Recriar habilidades
            // (Implementação simplificada – na prática você pode querer recriar todo o carrossel)
            console.warn('updateSkills não implementado totalmente. Recrie o carrossel chamando initSkillCarousel novamente.');
        }
    };
}