import * as THREE from 'three';
import { initThree, addBasicLights, addGround, addParticles, addRings, loadModel, startAnimation } from './three-setup.js';
import { VoiceAssistant } from './voice-assistant.js';
import { ChatSystem } from './chat.js';
import { initUI } from './ui.js';

export async function initWorld(config) {
    // Setup 3D
    const { scene, camera, renderer, controls } = initThree(config);
    const { fillLight } = addBasicLights(scene, config.color);
    const { circleGlow } = addGround(scene, config.color);
    const { particles } = addParticles(scene, config.color);
    const { ring, ring2 } = addRings(scene, config.color);
    
    // Carregar modelo
    const { mixer } = await loadModel(scene, config);
    
    // UI (ícones do topo, perfil, etc.)
    initUI(config);
    
    // Chat
    const chat = new ChatSystem('chatContainer', config, (response) => {
        if (voice && voice.isJarvisActive && voice.isJarvisActive()) {
            voice.speak(response);
        }
    });
    
    // Voice Assistant (Modo Jarvis REAL)
    const voiceButton = document.getElementById('voiceButton');
    let voice = null;
    
    if (voiceButton) {
        voice = new VoiceAssistant(
            voiceButton,
            (text, isContinuous) => {
                // Callback quando um comando de voz é reconhecido
                console.log('🎤 Comando de voz recebido:', text, 'Modo contínuo:', isContinuous);
                document.getElementById('chatInput').value = text;
                chat.send();
            },
            (interimText) => {
                // Feedback enquanto fala (opcional)
                // console.log('🎤 Ouvindo:', interimText);
            },
            {
                asuraName: config.name,
                continuous: true
            }
        );
    }
    
    // Animação 3D
    startAnimation(scene, camera, renderer, controls, {
        mixer,
        particles,
        ring,
        ring2,
        fillLight,
        circleGlow
    });
    
    console.log(`🟢 Mundo da ${config.name} carregado com MODO JARVIS REAL!`);
    
    return { scene, camera, renderer, controls, chat, voice };
}