const isEnglish = document.documentElement.lang === 'en';
const navigation = [...document.querySelectorAll('.section-nav a')];
const sections = navigation.map(link => document.querySelector(link.hash)).filter(Boolean);
const progressBar = document.querySelector('.scroll-progress');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollState() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;

  let current = null;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
  if (atBottom && sections.length) {
    current = sections[sections.length - 1];
  } else {
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section;
    }
  }
  for (const link of navigation) {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }

  const activeId = current ? current.id : 'about';
  document.documentElement.dataset.activeSection = activeId;
  window.dispatchEvent(new CustomEvent('portfolio:section', { detail: activeId }));
}

let framePending = false;
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => { updateScrollState(); framePending = false; });
}, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();

// Gentle scroll-reveal choreography
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('main > section:not(#about), .project, .honor');
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  for (const el of revealTargets) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) continue;
    el.classList.add('reveal-ready');
    revealObserver.observe(el);
  }
}

window.spotlightPortfolioTarget = function spotlightPortfolioTarget(selector) {
  const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!target) return;
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  target.classList.remove('is-spotlight');
  void target.offsetWidth;
  target.classList.add('is-spotlight');
  setTimeout(() => target.classList.remove('is-spotlight'), 1800);
};

const accuracyChart = document.querySelector('.accuracy-chart');
if (accuracyChart && !reducedMotion) {
  const chartObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    accuracyChart.classList.add('is-animated');
    chartObserver.disconnect();
  }, { threshold: 0.35 });
  chartObserver.observe(accuracyChart);
}

for (const demoImage of document.querySelectorAll('.demo-image')) {
  const demoToggle = demoImage.closest('figure').querySelector('.demo-toggle');
  const poster = demoImage.getAttribute('src');
  let playing = false;
  let playbackEnabled = !reducedMotion;
  let inView = false;
  function updatePlayback() {
    const next = playbackEnabled && inView;
    if (next !== playing) {
      playing = next;
      demoImage.src = playing ? demoImage.dataset.animation : poster;
    }
    demoToggle.textContent = playbackEnabled ? (isEnglish ? 'Pause demo' : '暂停演示') : (isEnglish ? 'Play demo' : '播放演示');
    demoToggle.setAttribute('aria-pressed', String(playbackEnabled));
  }
  demoToggle.hidden = false;
  updatePlayback();
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0.2 }).observe(demoImage);
  demoToggle.addEventListener('click', () => {
    playbackEnabled = !playbackEnabled;
    updatePlayback();
  });
}

const demoTrack = document.querySelector('.feature-demos');
if (demoTrack) {
  const cards = [...demoTrack.children];
  const controls = document.querySelector('.gallery-navigation');
  const previousDemo = controls.querySelector('.demo-previous');
  const nextDemo = controls.querySelector('.demo-next');
  const position = controls.querySelector('.demo-position');
  function currentDemo() {
    let closest = 0;
    for (let i = 1; i < cards.length; i++) {
      if (Math.abs(cards[i].offsetLeft - cards[0].offsetLeft - demoTrack.scrollLeft) <
          Math.abs(cards[closest].offsetLeft - cards[0].offsetLeft - demoTrack.scrollLeft)) closest = i;
    }
    return closest;
  }
  function updateDemos() {
    previousDemo.disabled = demoTrack.scrollLeft <= 1;
    nextDemo.disabled = demoTrack.scrollLeft >= demoTrack.scrollWidth - demoTrack.clientWidth - 1;
    position.textContent = `${currentDemo() + 1} / ${cards.length}`;
  }
  function moveDemo(step) {
    const target = cards[Math.max(0, Math.min(cards.length - 1, currentDemo() + step))];
    demoTrack.scrollTo({ left: target.offsetLeft - cards[0].offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
  previousDemo.addEventListener('click', () => moveDemo(-1));
  nextDemo.addEventListener('click', () => moveDemo(1));
  demoTrack.addEventListener('scroll', updateDemos, { passive: true });
  window.addEventListener('resize', updateDemos);
  controls.hidden = false;
  updateDemos();
}

const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-active');
  toast.setAttribute('aria-hidden', 'false');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-active');
    toast.setAttribute('aria-hidden', 'true');
  }, 2400);
}
window.showPortfolioToast = showToast;

document.querySelectorAll('.copy-trigger').forEach(trigger => {
  trigger.addEventListener('click', async (event) => {
    const text = trigger.dataset.copy;
    const tip = trigger.dataset.tip || (isEnglish ? 'content' : '内容');
    if (!text) return;
    event.preventDefault();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      showToast(isEnglish ? `Copied: ${text}` : `已复制${tip}到剪贴板：${text}`);
    } catch {
      showToast(isEnglish ? `Selected: ${text}` : `已选择：${text}`);
    }
  });
});

// Native <dialog> preview for honors certificates
const certDialog = document.getElementById('cert-dialog');
if (certDialog) {
  const certImg = document.getElementById('cert-dialog-img');
  const certCaption = document.getElementById('cert-dialog-caption');
  const certRaw = document.getElementById('cert-dialog-raw');
  const certClose = certDialog.querySelector('.cert-dialog-close');
  let lastTrigger = null;

  document.querySelectorAll('.certificate-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const fullSrc = trigger.dataset.full;
      const caption = trigger.dataset.caption || '';
      const thumbImg = trigger.querySelector('img');
      if (!fullSrc) return;
      lastTrigger = trigger;
      certImg.src = fullSrc;
      certImg.alt = thumbImg ? thumbImg.alt : caption;
      certCaption.textContent = caption;
      if (certRaw) certRaw.href = fullSrc;
      certDialog.showModal();
    });
  });

  certClose?.addEventListener('click', () => certDialog.close());
  certDialog.addEventListener('click', (event) => {
    if (event.target === certDialog) certDialog.close();
  });
  certDialog.addEventListener('close', () => {
    certImg.removeAttribute('src');
    lastTrigger?.focus({ preventScroll: true });
  });
}
