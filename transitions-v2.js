(() => {
  const transition = document.querySelector('.stage-transition');
  const steps = [...document.querySelectorAll('.step')];
  const dots = [...document.querySelectorAll('.dot')];
  const currentNumber = document.querySelector('#current-number');
  if (!transition || !steps.length) return;

  let busy = false;
  const getCurrent = () => Math.max(0, steps.findIndex(step => step.classList.contains('is-active')));

  function applyStep(index) {
    steps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-hidden', String(!active));
      if (active) step.scrollTop = 0;
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    if (currentNumber) currentNumber.textContent = String(index + 1).padStart(2, '0');
  }

  function transitionName(from, to) {
    if (to === from + 1) {
      if (from === 0) return 'heart-bloom';
      if (from === 1) return 'cinema-iris';
      if (from === 2) return 'soft-wave';
      if (from === 3) return 'final-constellation';
    }
    return 'soft-dissolve';
  }

  function timings(name) {
    switch (name) {
      case 'heart-bloom': return [900, 1730];
      case 'cinema-iris': return [850, 1640];
      case 'soft-wave': return [980, 1840];
      case 'final-constellation': return [1080, 2030];
      default: return [680, 1350];
    }
  }

  function transitionTo(index) {
    const current = getCurrent();
    if (busy || index < 0 || index >= steps.length || index === current) return;

    busy = true;
    const name = transitionName(current, index);
    const [swapAt, finishAt] = timings(name);

    transition.dataset.transition = name;
    transition.classList.remove('is-revealing');
    transition.classList.add('is-active', 'is-covering');

    window.setTimeout(() => {
      applyStep(index);
      transition.classList.remove('is-covering');
      transition.classList.add('is-revealing');
    }, swapAt);

    window.setTimeout(() => {
      transition.classList.remove('is-active', 'is-revealing');
      delete transition.dataset.transition;
      busy = false;
    }, finishAt);
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const next = target?.closest('.next-button');
    const restart = target?.closest('.restart-button');
    const dot = target?.closest('.dot');
    if (!next && !restart && !dot) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const current = getCurrent();
    if (next) transitionTo(Math.min(current + 1, steps.length - 1));
    else if (restart) transitionTo(0);
    else transitionTo(Number(dot.dataset.go));
  }, true);

  document.addEventListener('keydown', event => {
    if (document.activeElement?.tagName === 'IFRAME') return;
    if (!['ArrowRight', 'ArrowLeft', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const current = getCurrent();
    if (event.key === 'ArrowLeft') transitionTo(Math.max(current - 1, 0));
    else transitionTo(Math.min(current + 1, steps.length - 1));
  }, true);
})();