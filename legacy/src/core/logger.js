export function log(message) {
  const logElement = document.getElementById('systemLog');
  if (!logElement) return;

  const timestamp = new Date().toLocaleTimeString();
  logElement.textContent += `[${timestamp}] ${message}\n`;
  logElement.scrollTop = logElement.scrollHeight;
}
