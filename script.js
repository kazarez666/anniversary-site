const steps = [...document.querySelectorAll('.step')];
const nextButtons = [...document.querySelectorAll('.next-button')];
const dots = [...document.querySelectorAll('.dot')];
const restartButton = document.querySelector('.restart-button');
const cards = [...document.querySelectorAll('.card')];

let currentStep = 0;
let locked = false;

function updateBodyStep(index) {
  document.body.dataset.step = String(index);
}

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
  updateBodyStep(index);

  window.setTimeout(() => {
    locked = false;
  }, 780);
}

nextButtons.forEach((button) => {
  button.addEventListener('click', () => showStep(currentStep + 1));
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => showStep(Number(dot.dataset.go)));
});

restartButton?.addEventListener('click', () => showStep(0));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'Enter') {
    if (document.activeElement?.tagName === 'IFRAME') return;
    showStep(Math.min(currentStep + 1, steps.length - 1));
  }

  if (event.key === 'ArrowLeft') {
    showStep(Math.max(currentStep - 1, 0));
  }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (deltaX < 0) showStep(Math.min(currentStep + 1, steps.length - 1));
  if (deltaX > 0) showStep(Math.max(currentStep - 1, 0));
}, { passive: true });

window.addEventListener('mousemove', (event) => {
  const x = `${(event.clientX / window.innerWidth) * 100}%`;
  const y = `${(event.clientY / window.innerHeight) * 100}%`;
  document.documentElement.style.setProperty('--mx', x);
  document.documentElement.style.setProperty('--my', y);
});

cards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 6;
    const rotateX = (0.5 - py) * 5;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });
});

updateBodyStep(0);
