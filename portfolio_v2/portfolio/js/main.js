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
