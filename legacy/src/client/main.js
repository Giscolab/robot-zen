// ======================================================
// ================== IMPORTS GLOBAUX ===================
// ======================================================

import { log } from '@/core/logger.js';

import { updateEnergyConsumption } from '@/robot/energy.js';
import { updateServo } from '@/robot/servo.js';
import { updateEmotion, animateEyes } from '@/robot/emotion.js';

import { processCommand, ChatComponent } from '@/components/ChatComponent.js';
import { FaceComponent } from '@/components/FaceComponent.js';
import { ControlPanel } from '@/components/ControlPanel.js';
import { TerminalComponent } from '@/components/TerminalComponent.js';
import { RobertComponent } from '@/components/RobertComponent.js';
import { MoniqueComponent } from '@/components/MoniqueComponent.js';

import { RobotWebSocket } from '@/core/websocket.js';


// ✅ Si ces modules existent dans ton projet
import { RobotTerminal } from '@/modules/RobotTerminal.js';
import { EnhancedRobot3D } from '@/modules/EnhancedRobot3D.js';
import { CoreSystem } from '@/core/CoreSystem.js';
import { initRobert } from '@/robot/robert.js';
import { initMonique } from '@/robot/monique.js';


// ======================================================
// ================= INITIALISATION APP =================
// ======================================================

document.addEventListener('DOMContentLoaded', async () => {

  const app = document.getElementById('app');
  if (!app) {
    console.error("Element #app introuvable");
    return;
  }

  // ================= UI =================

  app.appendChild(FaceComponent());
  app.appendChild(ControlPanel());
  app.appendChild(ChatComponent());
  app.appendChild(TerminalComponent());

  // ================= Robots DOM =================

  const robotContainer = app.querySelector('.robot-container');
  if (robotContainer) {
    robotContainer.appendChild(RobertComponent());
    robotContainer.appendChild(MoniqueComponent());
  }

  // ================= Emotion =================

  animateEyes();
  log("Système initialisé - Prêt à interagir");

  // ================= Terminal =================

  let terminal = null;
  try {
    terminal = new RobotTerminal();
  } catch (e) {
    console.warn("RobotTerminal non disponible");
  }

  // ================= Robots Animation =================

  try {
    initRobert();
    initMonique();
  } catch (e) {
    console.warn("Init Robert/Monique non disponible");
  }

  // ================= 3D Visualizer =================

  let visualizer = null;
  try {
    visualizer = new EnhancedRobot3D();
    visualizer.startAnimation();
  } catch (e) {
    console.warn("EnhancedRobot3D non disponible");
  }

  // ================= Core System =================

  try {

    const core = CoreSystem.getInstance();

    if (!core.auth.checkAuth()) {
      window.location.href = '/login';
      return;
    }

    await core.modules.loadFromFolder();
    core.config.setEnvironment('simu');

  } catch (e) {
    console.warn("CoreSystem non disponible");
  }

  // ================= WebSocket =================

  try {

    const core = CoreSystem.getInstance();
    const wsURL = core.config.services.ws[core.config.env] || 'ws://localhost:8080';

    const ws = new RobotWebSocket(wsURL, visualizer);

    setTimeout(() => ws.sendCommand('INIT'), 1000);

  } catch (e) {
    console.warn("WebSocket non initialisé");
  }

  // ================= Bouton Chat =================

  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', processCommand);
  }

  // ================= Env Toggle =================

  const envToggle = document.getElementById('env-toggle');
  if (envToggle) {
    envToggle.addEventListener('click', () => {
      const core = CoreSystem.getInstance();
      const newEnv = core.config.env === 'simu' ? 'prod' : 'simu';
      core.config.setEnvironment(newEnv);
    });
  }

});


// ======================================================
// ================= ENERGY MONITOR =====================
// ======================================================

class EnergyMonitor {

  static consumptionHistory = [];

  static update(telemetry) {

    const power = this.calculatePower(
      telemetry.voltage,
      telemetry.current,
      telemetry.motorLoad
    );

    this.consumptionHistory.push({
      timestamp: Date.now(),
      power,
      estimate: this.estimateBatteryLife(power)
    });

    if (typeof this.updateCharts === 'function') {
      this.updateCharts();
    }
  }

  static calculatePower(V = 0, I = 0, motorLoad = 0) {

    const basePower = V * I;
    const motorEfficiency = 0.85 - (motorLoad * 0.01);

    return basePower * Math.max(motorEfficiency, 0.1);
  }

  static estimateBatteryLife(power) {
    const batteryCapacityWh = 500; // Exemple
    if (power <= 0) return Infinity;
    return batteryCapacityWh / power;
  }

}


// ======================================================
// ================= UI MANAGER =========================
// ======================================================

class UIManager {

  static updateEnvIndicator(env) {
    const indicator = document.getElementById('env-indicator');
    if (!indicator) return;

    indicator.textContent = `Environnement: ${env.toUpperCase()}`;
    indicator.className = `env-${env}`;
  }

  static updateAuthStatus(user) {
    const el = document.getElementById('auth-status');
    if (!el) return;

    el.textContent = `Connecté en tant que: ${user.role} (${user.login})`;
  }

}


// ======================================================
// ================= ENERGY ANALYZER ====================
// ======================================================

class EnergyAnalyzer {

  constructor(logger) {
    this.logger = logger;
  }

  get averagePower() {
    if (!this.logger?.logs?.energy?.length) return 0;

    const total = this.logger.logs.energy
      .reduce((sum, entry) => sum + entry.power, 0);

    return total / this.logger.logs.energy.length;
  }

  generateReport() {
    return {
      summary: {
        totalEnergy: this.logger.logs.energy
          .reduce((sum, entry) => sum + entry.power, 0),
        peakHours: this.calculatePeakHours()
      },
      anomalies: this.detectAnomalies()
    };
  }

  calculatePeakHours() {
    return [];
  }

  detectAnomalies() {

    const avg = this.averagePower;

    return this.logger.logs.energy.filter(entry =>
      entry.power > (avg * 2)
    );
  }

}
