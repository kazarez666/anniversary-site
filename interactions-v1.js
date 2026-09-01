(() => {
  const root = document.documentElement;
  const body = document.body;
  const heroArt = document.querySelector('.hero-art');
  const heroHeart = document.querySelector('.hero-heart');
  const videoShell = document.querySelector('.video-shell');
  const transition = document.querySelector('.stage-transition');
  const steps = [...document.querySelectorAll('.step')];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Subtle pointer / device parallax */
  function setDepth(nx, ny) {
    if (reduceMotion) return;
    root.style.setProperty('--px', `${(nx * 3.2).toFixed(2)}px`);
    root.style.setProperty('--py', `${(ny * 3.2).toFixed(2)}px`);
    root.style.setProperty('--px2', `${(nx * 5.3).toFixed(2)}px`);
    root.style.setProperty('--py2', `${(ny * 5.3).toFixed(2)}px`);
    root.style.setProperty('--px3', `${(nx * 7.2).toFixed(2)}px`);
    root.style.setProperty('--py3', `${(ny * 7.2).toFixed(2)}px`);
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const nx = (event.clientX / window.innerWidth - .5) * 2;
    const ny = (event.clientY / window.innerHeight - .5) * 2;
    setDepth(nx, ny);
  }, { passive: true });

  window.addEventListener('deviceorientation', event => {
    if (event.gamma == null || event.beta == null) return;
    const nx = Math.max(-1, Math.min(1, event.gamma / 30));
    const ny = Math.max(-1, Math.min(1, (event.beta - 45) / 35));
    setDepth(nx, ny);
  }, { passive: true });

  /* Video focus */
  const focusVideo = on => body.classList.toggle('is-video-focus', on);
  if (videoShell) {
    videoShell.addEventListener('pointerenter', () => focusVideo(true));
    videoShell.addEventListener('pointerleave', () => focusVideo(false));
    videoShell.addEventListener('focusin', () => focusVideo(true));
    videoShell.addEventListener('focusout', () => focusVideo(false));
    videoShell.addEventListener('touchstart', () => {
      focusVideo(true);
      window.setTimeout(() => focusVideo(false), 2600);
    }, { passive: true });
  }

  /* Interactive hero heart */
  if (heroArt && heroHeart) {
    heroHeart.setAttribute('role', 'button');
    heroHeart.setAttribute('tabindex', '0');
    heroHeart.setAttribute('aria-label', 'Оживить наше сердечко');

    const memories = ['наш первый год', '365 дней', 'ты + я', 'и дальше вместе'];
    memories.forEach((text, index) => {
      const item = document.createElement('span');
      item.className = `heart-memory heart-memory--${index + 1}`;
      item.textContent = text;
      heroArt.appendChild(item);
    });

    let sleepTimer;
    const wake = () => {
      heroArt.classList.add('is-awake');
      clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => heroArt.classList.remove('is-awake'), 5200);
    };
    const sleep = () => {
      clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => heroArt.classList.remove('is-awake'), 900);
    };

    heroHeart.addEventListener('pointerenter', wake);
    heroArt.addEventListener('pointerleave', sleep);
    heroHeart.addEventListener('click', wake);
    heroHeart.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        wake();
      }
    });
  }

  /* Personal phrases inside transitions */
  if (transition) {
    const whisper = document.createElement('p');
    whisper.className = 'transition-whisper';
    transition.appendChild(whisper);

    const phrases = {
      'heart-bloom': 'тот самый день ♥',
      'cinema-iris': 'некоторые чувства лучше показать',
      'soft-wave': 'дом — это ты',
      'final-constellation': 'я бы выбрал тебя снова',
      'soft-dissolve': 'только мы'
    };

    const observer = new MutationObserver(() => {
      const name = transition.dataset.transition || '';
      whisper.textContent = phrases[name] || '';
    });
    observer.observe(transition, { attributes: true, attributeFilter: ['data-transition', 'class'] });
  }

  /* One rare heart every so often on final slide */
  let rareTimer = null;
  function currentStep() {
    return Math.max(0, steps.findIndex(step => step.classList.contains('is-active')));
  }
  function clearRareTimer() {
    if (rareTimer) window.clearTimeout(rareTimer);
    rareTimer = null;
  }
  function scheduleRareHeart() {
    clearRareTimer();
    if (currentStep() !== 4 || reduceMotion) return;
    rareTimer = window.setTimeout(() => {
      if (currentStep() !== 4) return;
      const heart = document.createElement('span');
      heart.className = 'final-rare-heart';
      heart.textContent = Math.random() > .38 ? '♡' : '♥';
      heart.style.left = `${12 + Math.random() * 76}%`;
      heart.style.fontSize = `${12 + Math.random() * 15}px`;
      heart.style.setProperty('--rare-drift', `${-45 + Math.random() * 90}px`);
      body.appendChild(heart);
      window.setTimeout(() => heart.remove(), 9400);
      scheduleRareHeart();
    }, 6500 + Math.random() * 6500);
  }

  const stepObserver = new MutationObserver(() => {
    if (currentStep() === 4) scheduleRareHeart();
    else clearRareTimer();
  });
  steps.forEach(step => stepObserver.observe(step, { attributes: true, attributeFilter: ['class'] }));
  if (currentStep() === 4) scheduleRareHeart();
})();
