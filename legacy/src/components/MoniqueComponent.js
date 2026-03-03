export function MoniqueComponent() {
  const monique = document.createElement('div');
  monique.className = 'robot-wrapper';
  monique.innerHTML = `
    <div class="robot robot-monique" id="robotMonique">
      <div class="head">
        <div class="eye" id="moniqueLeftEye">
          <div class="pupil" id="moniqueLeftPupil"></div>
        </div>
        <div class="eye" id="moniqueRightEye">
          <div class="pupil" id="moniqueRightPupil"></div>
        </div>
      </div>
      <div class="emotion-label" id="moniqueEmotionLabel">Émotion : neutre</div>
      <div class="emotion-log" id="moniqueEmotionLog"></div>
      <div class="body"></div>
      <div class="base"></div>
    </div>
    <h3 class="robot-title">👩‍🔬 Monique</h3>
  `;
  return monique;
}

export function initMonique() {
  const robot = document.getElementById('robotMonique');
  const eyes = document.querySelectorAll('#robotMonique .eye');
  const pupils = document.querySelectorAll('#robotMonique .pupil');
  const label = document.getElementById('moniqueEmotionLabel');
  const log = document.getElementById('moniqueEmotionLog');
  const buttons = document.querySelectorAll('.controls button');

  if (!robot || !eyes.length || !label || !log) return;

  const emotions = {
    neutral:  { color: '#00aaff', blinkRate: 4000, text: 'Neutre', emoji: '😐' },
    happy:    { color: '#0f0',    blinkRate: 2500, text: 'Heureuse', emoji: '😊' },
    angry:    { color: '#f00',    blinkRate: 1000, text: 'Colère', emoji: '😠' },
    sleepy:   { color: '#008',    blinkRate: 6000, text: 'Endormie', emoji: '😴' },
    curious:  { color: '#ff0',    blinkRate: 2000, text: 'Curieuse', emoji: '🤔' },
  };

  let currentEmotion = 'neutral';
  let blinkTimer;

  function setEmotion(emotion) {
    if (!emotions[emotion] || emotion === currentEmotion) return;

    const config = emotions[emotion];
    currentEmotion = emotion;

    eyes.forEach(eye => eye.style.setProperty('--iris-color', config.color));
    label.innerHTML = `Émotion : ${config.text} ${config.emoji}`;

    const now = new Date();
    const logEntry = document.createElement('span');
    logEntry.textContent = `[${now.toLocaleTimeString()}] ${config.text} ${config.emoji}`;
    log.prepend(logEntry);
    if (log.children.length > 3) log.removeChild(log.lastChild);

    buttons.forEach(btn =>
      btn.classList.toggle('active', btn.dataset.emotion === emotion)
    );

    clearInterval(blinkTimer);
    blinkTimer = setInterval(() => blink(), config.blinkRate);

    robot.style.transform = 'rotate(5deg)';
    setTimeout(() => {
      robot.style.transform = 'rotate(-5deg)';
      setTimeout(() => robot.style.transform = 'rotate(0)', 100);
    }, 100);
  }

  function blink() {
    eyes.forEach(eye => eye.classList.add('closed'));
    pupils.forEach(p => p.classList.add('closed'));
    setTimeout(() => {
      eyes.forEach(eye => eye.classList.remove('closed'));
      pupils.forEach(p => p.classList.remove('closed'));
    }, 200);
  }

  setEmotion('neutral');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setEmotion(btn.dataset.emotion));
  });

  document.addEventListener('keydown', e => {
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < buttons.length) {
      setEmotion(buttons[idx].dataset.emotion);
    }
  });

  const emotionKeys = Object.keys(emotions);
  let emoIndex = 0;
  const autoCycle = setInterval(() => {
    emoIndex = (emoIndex + 1) % emotionKeys.length;
    setEmotion(emotionKeys[emoIndex]);
  }, 8000);

  const stopAuto = () => {
    clearInterval(autoCycle);
    document.removeEventListener('click', stopAuto);
    document.removeEventListener('keydown', stopAuto);
  };
  document.addEventListener('click', stopAuto);
  document.addEventListener('keydown', stopAuto);
}
