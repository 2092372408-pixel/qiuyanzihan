const navigation = [...document.querySelectorAll('.section-nav a')];
const sections = navigation.map(link => document.querySelector(link.hash));

function updateNavigation() {
  let current = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section;
  }
  for (const link of navigation) {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let framePending = false;
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => { updateNavigation(); framePending = false; });
}, { passive: true });
updateNavigation();

const directionLines = [...document.querySelectorAll('.direction-line')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let introSeen = true;
try {
  introSeen = localStorage.getItem('portfolio-direction-seen') === '1';
  localStorage.setItem('portfolio-direction-seen', '1');
} catch { introSeen = true; /* Keep the heading complete if storage is unavailable. */ }
if (directionLines.length && !introSeen && !reducedMotion) {
  const text = directionLines.map(line => [...line.textContent]);
  directionLines.forEach(line => { line.textContent = ''; });
  let lineIndex = 0;
  let characterIndex = 0;
  directionLines[0].classList.add('is-typing');
  const timer = setInterval(() => {
    directionLines[lineIndex].textContent += text[lineIndex][characterIndex++];
    if (characterIndex < text[lineIndex].length) return;
    directionLines[lineIndex].classList.remove('is-typing');
    lineIndex++;
    characterIndex = 0;
    if (lineIndex === directionLines.length) clearInterval(timer);
    else directionLines[lineIndex].classList.add('is-typing');
  }, 90);
}

for (const demoImage of document.querySelectorAll('.demo-image')) {
  const demoToggle = demoImage.closest('figure').querySelector('.demo-toggle');
  const poster = demoImage.getAttribute('src');
  let playing = false;
  function setDemoPlayback(next) {
    playing = next;
    demoImage.src = playing ? demoImage.dataset.animation : poster;
    demoToggle.textContent = playing ? '暂停演示' : '播放演示';
    demoToggle.setAttribute('aria-pressed', String(playing));
  }
  demoToggle.hidden = false;
  setDemoPlayback(!reducedMotion);
  demoToggle.addEventListener('click', () => setDemoPlayback(!playing));
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

const lightbox = document.querySelector('.lightbox');
const image = lightbox.querySelector('.lightbox-image');
const caption = document.querySelector('#lightbox-caption');
const count = document.querySelector('#lightbox-count');
const previous = lightbox.querySelector('.lightbox-prev');
const next = lightbox.querySelector('.lightbox-next');
const triggers = [...document.querySelectorAll('.image-trigger')];
let gallery = [];
let index = 0;

function showImage() {
  const item = gallery[index];
  image.src = item.dataset.image;
  image.alt = item.querySelector('img').alt;
  caption.textContent = item.dataset.caption;
  count.textContent = `${index + 1} / ${gallery.length}`;
  previous.disabled = index === 0;
  next.disabled = index === gallery.length - 1;
}
for (const trigger of triggers) {
  trigger.addEventListener('click', () => {
    gallery = triggers.filter(item => item.dataset.gallery === trigger.dataset.gallery);
    index = gallery.indexOf(trigger);
    showImage();
    lightbox.showModal();
  });
}
previous.addEventListener('click', () => { if (index > 0) { index--; showImage(); } });
next.addEventListener('click', () => { if (index < gallery.length - 1) { index++; showImage(); } });
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && index > 0) { index--; showImage(); event.preventDefault(); }
  if (event.key === 'ArrowRight' && index < gallery.length - 1) { index++; showImage(); event.preventDefault(); }
});
lightbox.addEventListener('click', event => {
  if (event.target !== lightbox) return;
  const bounds = lightbox.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
});
