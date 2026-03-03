export function RobertComponent() {
  const robert = document.createElement('div');
  robert.className = 'robot-wrapper';
  robert.innerHTML = `
    <div class="robot robot-robert" id="robotRobert">
      <div class="head">
        <div class="eye" id="robertLeftEye"></div>
        <div class="eye" id="robertRightEye"></div>
      </div>
      <div class="body"></div>
      <div class="base"></div>
    </div>
    <h3 class="robot-title">🤖 Robert</h3>
  `;
  return robert;
}

export function initRobert() {
  const robertEyes = document.querySelectorAll('#robotRobert .eye');
  const robot = document.getElementById('robotRobert');
  if (!robertEyes.length || !robot) return;

  function blink() {
    robertEyes.forEach(e => e.classList.add('closed'));
    setTimeout(() => robertEyes.forEach(e => e.classList.remove('closed')), 200);
  }

  // Clignement toutes les 3-6 secondes
  setInterval(() => {
    blink();
  }, 3000 + Math.random() * 3000);

  // Rotation gauche-droite
  let direction = 1;
  setInterval(() => {
    const angle = direction * (10 + Math.random() * 10);
    robot.style.transform = `rotate(${angle}deg)`;
    direction *= -1;
  }, 2500 + Math.random() * 3000);
}
