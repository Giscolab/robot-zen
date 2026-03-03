import { RobertComponent } from './RobertComponent.js';
import { MoniqueComponent } from './MoniqueComponent.js';


export function FaceComponent() {
    const face = document.createElement('div');
    face.className = 'robot-face';

    // Conteneur pour les deux robots
    const robotsWrapper = document.createElement('div');
    robotsWrapper.className = 'robots-wrapper';

    // Ajout des deux robots
    robotsWrapper.appendChild(RobertComponent());
    robotsWrapper.appendChild(MoniqueComponent());

    // Ajout au composant principal
    face.appendChild(robotsWrapper);

    // Ajout du schéma matériel
    const hardware = document.createElement('div');
    hardware.className = 'hardware-schema';
    hardware.innerHTML = `
        <div class="component pulsing" style="color: #0f0;">
            [Pi 5] ← [CAN] → [Arduino]
        </div>
        <div class="component">
            Servos: <span id="servoXValue">90</span>° | <span id="servoYValue">90</span>°
        </div>
        <div class="component pulsing" style="color: #00f;">
            Whisper.cpp ←Audio→ Piper
        </div>
    `;
    face.appendChild(hardware);

    // Ajout du chat
    const chat = document.createElement('div');
    chat.className = 'chat-container';
    chat.innerHTML = `
        <div id="chatLog"></div>
        <input type="text" id="userInput" placeholder="Parler au robot...">
        <button onclick="processCommand()">Envoyer</button>
    `;
    face.appendChild(chat);

    return face;
}
