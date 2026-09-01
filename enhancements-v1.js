(() => {
  const body = document.body;
  const scene = document.querySelector('.scene');
  const steps = [...document.querySelectorAll('.step')];
  const intro = document.querySelector('.intro-screen');
  const soundButton = document.querySelector('.sound-toggle');
  const easter = document.querySelector('.easter-button');
  const easterMessage = document.querySelector('.easter-message');

  body.dataset.step = String(Math.max(0, steps.findIndex(step => step.classList.contains('is-active'))));

  const observer = new MutationObserver(() => {
    const index = Math.max(0, steps.findIndex(step => step.classList.contains('is-active')));
    body.dataset.step = String(index);
  });
  steps.forEach(step => observer.observe(step, { attributes: true, attributeFilter: ['class'] }));

  if (intro) {
    const closeIntro = () => intro.classList.add('is-gone');
    window.setTimeout(closeIntro, 2850);
    intro.addEventListener('click', closeIntro, { once: true });
  }

  if (scene) {
    const extras = [
      ['рядом', '13%', '36%', '1.45rem', 'orbit', '-2s'],
      ['наш год', '72%', '9%', '1.1rem', 'fade', '-5s'],
      ['ещё 365?', '67%', '68%', '1.35rem', 'breathe', '-3s'],
      ['только мы', '23%', '76%', '1.15rem', 'drift', '-8s'],
      ['you are home', '77%', '46%', '.9rem', 'orbit', '-9s'],
      ['always', '38%', '24%', '1rem', 'fade', '-4s'],
      ['♥', '57%', '82%', '2.2rem', 'breathe', '-1s'],
      ['one year', '8%', '57%', '.85rem', 'drift', '-7s']
    ];
    extras.forEach(([text, left, top, size, motion, delay]) => {
      const el = document.createElement('span');
      el.className = 'ambient-extra';
      el.textContent = text;
      el.dataset.motion = motion;
      el.style.left = left;
      el.style.top = top;
      el.style.fontSize = size;
      el.style.animationDelay = delay;
      scene.appendChild(el);
    });
  }

  if (easter && easterMessage) {
    let hideTimer;
    easter.addEventListener('click', () => {
      easterMessage.classList.add('is-visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => easterMessage.classList.remove('is-visible'), 2400);
      const rect = easter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 13; i++) {
        const h = document.createElement('span');
        h.className = 'secret-heart';
        h.textContent = i % 3 ? '♥' : '♡';
        h.style.left = `${cx}px`;
        h.style.top = `${cy}px`;
        const angle = (Math.PI * 2 * i) / 13 + Math.random() * .3;
        const distance = 70 + Math.random() * 130;
        h.style.setProperty('--sx', `${Math.cos(angle) * distance}px`);
        h.style.setProperty('--sy', `${Math.sin(angle) * distance}px`);
        h.style.setProperty('--sr', `${-35 + Math.random() * 70}deg`);
        h.style.fontSize = `${12 + Math.random() * 18}px`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1700);
      }
    });
  }

  let ctx = null;
  let master = null;
  let nodes = [];
  let soundOn = false;

  function startAmbient() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 1.8);
    master.connect(ctx.destination);

    const freqs = [110, 164.81, 220];
    nodes = freqs.map((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = index === 1 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = index === 1 ? 0.012 : 0.007;
      filter.type = 'lowpass';
      filter.frequency.value = 520 + index * 180;
      osc.connect(filter); filter.connect(gain); gain.connect(master);
      osc.start();
      return osc;
    });
  }

  function stopAmbient() {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
    master.gain.exponentialRampToValueAtTime(0.0001, t + .8);
    setTimeout(() => {
      nodes.forEach(node => { try { node.stop(); } catch {} });
      nodes = [];
      try { master.disconnect(); } catch {}
      master = null;
    }, 900);
  }

  soundButton?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.classList.toggle('is-on', soundOn);
    soundButton.setAttribute('aria-pressed', String(soundOn));
    const icon = soundButton.querySelector('span');
    const label = soundButton.querySelector('small');
    if (soundOn) {
      if (icon) icon.textContent = '♪';
      if (label) label.textContent = 'Звук включён';
      startAmbient();
    } else {
      if (icon) icon.textContent = '♩';
      if (label) label.textContent = 'Тихий звук';
      stopAmbient();
    }
  });
})();
