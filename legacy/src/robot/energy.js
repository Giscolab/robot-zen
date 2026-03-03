// scripts/modules/energy.js

class EnergyMonitorUI {
  constructor() {
    this.consumption = {
      cpu: 0,
      motors: 0,
      leds: 0
    };
  }

  update(component, value) {
    this.consumption[component] = value;
    this.render();
  }

  render() {
    const total = Object.values(this.consumption).reduce((a, b) => a + b, 0);
    const bar = document.querySelector('#energyConsumption div');
    if (!bar) return;

    bar.style.width = `${Math.min(total * 10, 100)}%`;
    bar.style.background = total > 8 ? '#f00' : '#0f0';
  }
}

const energyMonitor = new EnergyMonitorUI();

function updateEnergyConsumption(sensors) {
  const servoXInput = document.getElementById('servoX');
  if (!servoXInput) return;

  const servoX = parseInt(servoXInput.value);
  const ledColor = document.documentElement.style.getPropertyValue('--led-color');

  energyMonitor.update('cpu', sensors.temp / 10);
  energyMonitor.update('motors', Math.abs(90 - servoX) / 10);
  energyMonitor.update('leds',
    ledColor === '#f00' ? 1 :
    ledColor === '#0f0' ? 0.3 :
    0.1
  );
}

export { energyMonitor, updateEnergyConsumption };
