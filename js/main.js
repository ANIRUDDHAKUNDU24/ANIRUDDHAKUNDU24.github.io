// Custom Cursor
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// TextPressure: variable-font typography that responds to cursor proximity.
// It is applied to the bold hero name via [data-text-pressure].
function initTextPressure(element) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', element.textContent.replace(/\s+/g, ' ').trim());
  }

  const lines = Array.from(element.querySelectorAll('.name-line'));
  const characters = [];
  let pointer = null;
  let frameId = null;

  // The hero supplies animated .name-line elements; section headings can be
  // processed directly. Splitting text nodes preserves <br> and <em> markup.
  const roots = lines.length ? lines : [element];
  roots.forEach((root) => {
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.nodeValue.trim() || node.nodeValue.includes(' ')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
    });

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const isAccent = textNode.parentElement?.closest('em');

      Array.from(textNode.nodeValue).forEach((character) => {
        const span = document.createElement('span');
        span.className = [
          'pressure-char',
          character === ' ' ? 'pressure-char--space' : '',
          isAccent ? 'pressure-char--accent' : '',
        ].filter(Boolean).join(' ');
        span.textContent = character === ' ' ? '\u00a0' : character;
        span.setAttribute('aria-hidden', 'true');
        fragment.appendChild(span);
        characters.push(span);
      });

      textNode.replaceWith(fragment);
    });
  });

  const distanceToRect = (x, y, rect) => {
    const nearestX = Math.max(rect.left, Math.min(x, rect.right));
    const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));
    return Math.hypot(x - nearestX, y - nearestY);
  };

  const update = () => {
    frameId = null;
    characters.forEach((character) => {
      const influence = pointer
        ? Math.max(0, 1 - distanceToRect(pointer.x, pointer.y, character.getBoundingClientRect()) / 180)
        : 0;
      const eased = influence * influence * (3 - 2 * influence);
      character.style.setProperty('--pressure-weight', Math.round(100 + eased * 800));
      character.style.setProperty('--pressure-width', Math.round(50 + eased * 50));
      character.style.setProperty('--pressure-italic', (eased * 1).toFixed(3));
    });
  };

  const requestUpdate = () => {
    if (frameId === null) frameId = requestAnimationFrame(update);
  };

  element.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    requestUpdate();
  });
  element.addEventListener('pointerleave', () => {
    pointer = null;
    requestUpdate();
  });
  element.addEventListener('pointerenter', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    requestUpdate();
  });
}

document.querySelectorAll('[data-text-pressure]').forEach(initTextPressure);

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = Array.from(reveals).indexOf(el) % 4 * 90;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObs.unobserve(el);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

// Typed tagline
const roles = ['Full-Stack Developer', 'AI Enthusiast', 'CRM Specialist', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const taglineEl = document.querySelector('.hero-tagline-typed');
if (taglineEl) {
  function type() {
    const current = roles[ri];
    taglineEl.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
    if (!deleting && ci > current.length) { deleting = true; setTimeout(type, 1400); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1200);
}

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.style.color = 'var(--text)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObs.observe(s));
