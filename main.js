/**
 * Navegación, scroll y animaciones de entrada
 */
(function () {
  var header = document.querySelector('.header');
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  var sections = document.querySelectorAll('.section');
  var statNumbers = document.querySelectorAll('.stat-number');

  // Header con scroll
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Activar animaciones al entrar en viewport
    var windowH = window.innerHeight;
    var trigger = windowH * 0.75;

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top < trigger) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Contador animado para estadísticas
  function animateValue(el, end, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var section = el.closest('.section');
      if (!section) return;

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateValue(el, target, 1200);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(section);
    });
  }

  if (statNumbers.length) initCounters();

  // Animaciones que siguen al cursor
  var cursorElements = document.querySelectorAll('.cursor-follow');
  var mouseX = 0;
  var mouseY = 0;
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2;
  var currentX = [];
  var currentY = [];

  cursorElements.forEach(function (_, i) {
    currentX[i] = 0;
    currentY[i] = 0;
  });

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animateCursor() {
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    var dx = mouseX - centerX;
    var dy = mouseY - centerY;

    cursorElements.forEach(function (el, i) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
      currentX[i] = lerp(currentX[i], dx * speed, 0.08);
      currentY[i] = lerp(currentY[i], dy * speed, 0.08);
      el.style.transform = 'translate(' + currentX[i] + 'px, ' + currentY[i] + 'px)';
    });

    requestAnimationFrame(animateCursor);
  }

  if (cursorElements.length && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    animateCursor();
  }
})();
