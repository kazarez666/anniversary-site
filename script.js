const steps = [...document.querySelectorAll('.step')];
const nextButtons = [...document.querySelectorAll('.next-button')];
const dots = [...document.querySelectorAll('.dot')];
const restartButton = document.querySelector('.restart-button');
const currentNumber = document.querySelector('#current-number');
const heartField = document.querySelector('#heart-field');
const magneticButtons = [...document.querySelectorAll('.magnetic')];

let currentStep = 0;
let locked = false;

function showStep(index) {
  if (locked || index === currentStep || index < 0 || index >= steps.length) return;
  locked = true;

  steps.forEach((step, i) => {
    const active = i === index;
    step.classList.toggle('is-active', active);
    step.setAttribute('aria-hidden', String(!active));
    if (active) step.scrollTop = 0;
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === index);
    dot.setAttribute('aria-current', i === index ? 'step' : 'false');
  });

  currentStep = index;
  currentNumber.textContent = String(index + 1).padStart(2, '0');
  document.body.dataset.step = String(index);

  window.setTimeout(() => {
    locked = false;
  }, 850);
}

nextButtons.forEach((button) => {
  button.addEventListener('click', () => showStep(Math.min(currentStep + 1, steps.length - 1)));
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => showStep(Number(dot.dataset.go)));
});

restartButton?.addEventListener('click', () => showStep(0));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showStep(Math.min(currentStep + 1, steps.length - 1));
  if (event.key === 'ArrowLeft') showStep(Math.max(currentStep - 1, 0));
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (event.target.closest('button, iframe, .video-shell')) return;

  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (deltaX < 0) showStep(Math.min(currentStep + 1, steps.length - 1));
  if (deltaX > 0) showStep(Math.max(currentStep - 1, 0));
}, { passive: true });

window.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
  document.documentElement.style.setProperty('--my', `${event.clientY}px`);
});

function createHearts() {
  if (!heartField) return;
  const amount = window.innerWidth < 700 ? 12 : 22;
  heartField.innerHTML = '';

  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = i % 4 === 0 ? '♥' : '♡';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${95 + Math.random() * 30}%`;
    heart.style.fontSize = `${12 + Math.random() * 34}px`;
    heart.style.animationDuration = `${12 + Math.random() * 18}s`;
    heart.style.animationDelay = `${-Math.random() * 28}s`;
    heart.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
    heartField.appendChild(heart);
  }
}

createHearts();
window.addEventListener('resize', createHearts);

magneticButtons.forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12 - 3}px)`;
  });

  button.addEventListener('pointerleave', () => {
    button.style.transform = '';
  });
});

document.body.dataset.step = '0';
