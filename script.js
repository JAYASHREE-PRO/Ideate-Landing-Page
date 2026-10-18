(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }));
  }

  // Reveal sections only when they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Gentle pointer parallax; disabled for touch and reduced-motion users.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchDevice = window.matchMedia('(pointer: coarse)').matches;
  const glow = document.querySelector('.cursor-glow');
  if (!reduceMotion && !touchDevice) {
    window.addEventListener('pointermove', event => {
      if (glow) {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      }
      const stage = document.querySelector('.core-stage');
      if (stage) {
        const x = (event.clientX / window.innerWidth - 0.5) * 7;
        const y = (event.clientY / window.innerHeight - 0.5) * -7;
        stage.style.setProperty('--pointer-x', `${x}deg`);
        stage.style.setProperty('--pointer-y', `${y}deg`);
      }
    }, { passive: true });

    const parallaxItems = document.querySelectorAll('[data-depth]');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxItems.forEach(item => {
          const depth = Number(item.dataset.depth) || 0;
          item.style.translate = `0 ${scrollY * depth * -0.25}px`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  // Keep in-page navigation smooth without overriding reduced-motion preferences.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
