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

const demoImage = document.querySelector('#edupilot-demo');
const demoToggle = document.querySelector('.demo-toggle');
if (demoImage && demoToggle) {
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
