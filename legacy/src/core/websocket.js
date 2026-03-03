import { CoreSystem } from './CoreSystem.js';
import { log } from './logger.js';
import { updateEnergyConsumption } from '../robot/energy.js';
import { updateServo } from '../robot/servo.js';

export class RobotWebSocket {

  constructor(url = null, visualizer = null) {
    this.url = url;
    this.visualizer = visualizer;
    this.socket = null;
    this.isOpen = false;
    this.queue = [];
    this.reconnectDelay = 3000;

    this.connect();
  }

  connect() {
    const configuredUrl = this.url || CoreSystem.getInstance().config.services.ws[CoreSystem.getInstance().config.env];
    this.socket = CoreSystem.getInstance().auth.secureWS(configuredUrl);

    this.socket.onopen = () => {
      this.isOpen = true;
      log('✅ WebSocket sécurisé connecté');

      this.flushQueue();
      this.sendCommand('INIT');
    };

    this.socket.onmessage = async (event) => {
      if (!await this.validateMessage(event.data)) {
        log('❌ Message non sécurisé');
        this.socket.close();
        return;
      }

      const data = JSON.parse(event.data.split('|')[0]);

      switch (data.type) {
        case 'telemetry':
          updateEnergyConsumption(data.sensors);
          this.visualizer?.updateState?.(data);
          break;
        case 'hardware':
          updateServo(data.axis, data.value);
          break;
        case 'alert':
          log(`⚠️ Alerte : ${data.message}`);
          break;
        default:
          log(`ℹ️ Message WS ignoré: ${data.type}`);
      }
    };

    this.socket.onerror = (err) => {
      log('❌ Erreur WebSocket');
      console.error(err);
    };

    this.socket.onclose = () => {
      this.isOpen = false;
      log('⚠️ WebSocket fermé — tentative reconnexion');
      setTimeout(() => this.connect(), this.reconnectDelay);
    };
  }

  sendCommand(command) {
    const payload = {
      type: 'control',
      command,
      timestamp: Date.now()
    };

    if (!this.isOpen) {
      this.queue.push(payload);
      return;
    }

    this.socket.send(JSON.stringify(payload));
  }

  flushQueue() {
    while (this.queue.length > 0) {
      this.socket.send(JSON.stringify(this.queue.shift()));
    }
  }

  async validateMessage(data) {
    try {
      const [message, hexSignature] = data.split('|');
      if (!message || !hexSignature) return false;

      const key = await CoreSystem.getInstance().auth.getKey();
      const signatureBytes = new Uint8Array(hexSignature.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

      return await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        new TextEncoder().encode(message)
      );
    } catch {
      return false;
    }
  }
}
