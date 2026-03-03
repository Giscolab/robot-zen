import { emotionConfig, currentEmotion } from './emotion.js';
import { log } from '../core/logger.js';

export function updateServo(axis, value) {
  const valueDisplay = document.getElementById(`servo${axis}Value`);
  if (valueDisplay) valueDisplay.textContent = value;

  log(`Servo ${axis} → ${value}°`);

  // Met à jour la couleur de l'œil selon émotion actuelle
  document.documentElement.style.setProperty(
    '--eye-color',
    emotionConfig[currentEmotion].eye
  );
}
