const steps = [...document.querySelectorAll('.step')];
const nextButtons = [...document.querySelectorAll('.next-button')];
const dots = [...document.querySelectorAll('.dot')];
const restartButton = document.querySelector('.restart-button');
const holidayPlayer = document.querySelector('#holiday-player');

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

  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  currentStep = index;

  if (currentStep !== 2 && holidayPlayer && !holidayPlayer.paused) {
    holidayPlayer.pause();
  }

  window.setTimeout(() => {
    locked = false;
  }, 680);
}

nextButtons.forEach((button) => {
  button.addEventListener('click', () => showStep(currentStep + 1));
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => showStep(Number(dot.dataset.go)));
});

restartButton.addEventListener('click', () => showStep(0));

if (holidayPlayer) {
  const startTime = Number(holidayPlayer.dataset.start || 0);

  holidayPlayer.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(startTime) && startTime > 0 && holidayPlayer.duration > startTime) {
      holidayPlayer.currentTime = startTime;
    }
  });

  holidayPlayer.addEventListener('play', () => {
    if (holidayPlayer.currentTime < startTime - 5 && holidayPlayer.duration > startTime) {
      holidayPlayer.currentTime = startTime;
    }
  }, { once: true });
}

document.addEventListener('keydown', (event) => {
  if (document.activeElement?.tagName === 'VIDEO') return;

  if (event.key === 'ArrowRight' || event.key === 'Enter') {
    if (document.activeElement?.tagName === 'A') return;
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
  if (event.target.closest('video')) return;

  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  if (deltaX < 0) showStep(Math.min(currentStep + 1, steps.length - 1));
  if (deltaX > 0) showStep(Math.max(currentStep - 1, 0));
}, { passive: true });
