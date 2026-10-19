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

const terminal = document.querySelector('.terminal-line');
if (terminal && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  terminal.classList.add('is-typing');
  terminal.addEventListener('animationend', () => terminal.classList.remove('is-typing'), { once: true });
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
