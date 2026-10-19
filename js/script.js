(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  var header = document.getElementById('siteHeader');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.slice.call(el.parentElement.querySelectorAll('.reveal'));
      var idx = Math.min(siblings.indexOf(el), 5);
      el.style.transitionDelay = idx * 70 + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  var sections = document.querySelectorAll('main section[id]');
  var linkFor = {};

  document.querySelectorAll('.nav__links a').forEach(function (a) {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });

  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      Object.keys(linkFor).forEach(function (id) {
        linkFor[id].classList.remove('active');
      });
      if (linkFor[entry.target.id]) linkFor[entry.target.id].classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) {
    so.observe(s);
  });

  var codeEl = document.getElementById('typedCode');

  var codeLines = [
    'const genaweb = {',
    '  nombre: "GenaWeb",',
    '  rol: "desarrollador full-stack",',
    '  ubicacion: "Argentina",',
    '  especialidad: "React & Node.js",',
    '  disponible: true,',
    '};',
    '',
    'function construirSolucion(problema) {',
    '  return problema',
    '    .analizar()',
    '    .desarrollar()',
    '    .implementar();',
    '}',
    '',
    'construirSolucion("negocio en crecimiento");'
  ];

  var codeText = codeLines.join('\n');

  var highlighted = [
    '<span class="tk-k">const</span> <span class="tk-v">genaweb</span> <span class="tk-p">=</span> <span class="tk-p">{</span>',
    '  <span class="tk-p">nombre:</span> <span class="tk-s">"GenaWeb"</span><span class="tk-p">,</span>',
    '  <span class="tk-p">rol:</span> <span class="tk-s">"desarrollador full-stack"</span><span class="tk-p">,</span>',
    '  <span class="tk-p">ubicacion:</span> <span class="tk-s">"Argentina"</span><span class="tk-p">,</span>',
    '  <span class="tk-p">especialidad:</span> <span class="tk-s">"React &amp; Node.js"</span><span class="tk-p">,</span>',
    '  <span class="tk-p">disponible:</span> <span class="tk-b">true</span><span class="tk-p">,</span>',
    '<span class="tk-p">};</span>',
    '',
    '<span class="tk-k">function</span> <span class="tk-f">construirSolucion</span><span class="tk-p">(</span><span class="tk-v">problema</span><span class="tk-p">)</span> <span class="tk-p">{</span>',
    '  <span class="tk-k">return</span> <span class="tk-v">problema</span>',
    '    <span class="tk-p">.</span><span class="tk-f">analizar</span><span class="tk-p">()</span>',
    '    <span class="tk-p">.</span><span class="tk-f">desarrollar</span><span class="tk-p">()</span>',
    '    <span class="tk-p">.</span><span class="tk-f">implementar</span><span class="tk-p">();</span>',
    '<span class="tk-p">}</span>',
    '',
    '<span class="tk-f">construirSolucion</span><span class="tk-p">(</span><span class="tk-s">"negocio en crecimiento"</span><span class="tk-p">);</span>'
  ].join('\n');

  if (codeEl) {
    if (prefersReduced) {
      codeEl.innerHTML = highlighted + '<span class="code-cursor"></span>';
    } else {
      var i = 0;
      var cursor = document.createElement('span');
      cursor.className = 'code-cursor';

      function type() {
        if (i <= codeText.length) {
          codeEl.textContent = codeText.slice(0, i);
          codeEl.appendChild(cursor);
          i++;
          var ch = codeText[i - 1];
          var delay = ch === '\n' ? 60 : 18 + Math.random() * 40;
          setTimeout(type, delay);
        } else {
          codeEl.innerHTML = highlighted + '<span class="code-cursor"></span>';
        }
      }

      setTimeout(type, 500);
    }
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
