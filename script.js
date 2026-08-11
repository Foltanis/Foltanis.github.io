// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.topbar__nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal for project sheets
const revealTargets = document.querySelectorAll('.sheet, .other-card, .section-intro');
revealTargets.forEach(el => el.classList.add('reveal'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// Lightbox for filled project images
(function () {
  const containers = document.querySelectorAll('.img-slot--filled');
  if (!containers.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Zavrieť">×</button>
    <img src="" alt="">
    <p class="lightbox__caption"></p>
  `;
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('img');
  const overlayCaption = overlay.querySelector('.lightbox__caption');
  const closeBtn = overlay.querySelector('.lightbox__close');
  let lastFocused = null;

  function openLightbox(img) {
    lastFocused = document.activeElement;
    overlayImg.src = img.src;
    overlayImg.alt = img.alt || '';
    overlayCaption.textContent = img.alt || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    overlayImg.src = '';
    if (lastFocused) lastFocused.focus();
  }

  // Listener on the whole container (not just the <img>), so clicking the
  // zoom-icon overlay in the corner also opens the lightbox — important for
  // small thumbnails where the icon covers a big chunk of the image.
  containers.forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      if (img) openLightbox(img);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
  });
})();