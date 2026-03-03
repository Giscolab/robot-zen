// ✅ Générateur de réponse interne temporaire
function generateResponse(input) {
  return "Réponse simulée : " + input;
}

export function processCommand() {
  const inputField = document.getElementById('userInput');
  const chatLog = document.getElementById('chatLog');

  if (!inputField || !chatLog) return;

  const input = inputField.value;
  if (!input) return;

  const response = generateResponse(input);

  chatLog.innerHTML += `
    <div class="message user-message">User: ${input}</div>
    <div class="message bot-message">Robot: ${response}</div>
  `;

  // Animation yeux
  document.querySelectorAll('.eye').forEach(eye => {
    eye.style.transform = 'scale(1.2)';
    setTimeout(() => eye.style.transform = 'scale(1)', 200);
  });

  inputField.value = '';
  chatLog.scrollTop = chatLog.scrollHeight;
}
// ✅ Composant UI Chat
export function ChatComponent() {

  const container = document.createElement('div');
  container.className = 'chat-container';

  container.innerHTML = `
    <div id="chatLog" class="chat-log"></div>
    <div class="chat-input-row">
      <input id="userInput" type="text" placeholder="Tape une commande..." />
      <button id="sendButton">Envoyer</button>
    </div>
  `;

  return container;
}
