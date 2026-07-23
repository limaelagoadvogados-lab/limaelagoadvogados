const testimonials = [
  { name: 'Thiago Silva', role: 'Cliente - Direito da Família', text: 'Dr.Marcos e sua equipe estão de parabéns,através da indicação de um parente ,consegui resolver minha situação com roubo de automóvel sem precisar de entrar na justiça, muita dedicação, segurança e calma, obrigado pela confiança e sem dúvidas vou recomendar para mais pessoas, estão de parabéns !!!!' },
  { name: 'Joubert Alves', role: 'Cliente - Direito do Consumidor', text: 'Dr. Marco Lago, excelente profissional, trabalha com seriedade e comprometimento, nos auxilia e instrui durante todo o processo, e dá todo o suporte necessário, além de esclarecer todas as dúvidas com muita clareza e objetividade. Estou muito satisfeito, e indico de olhos fechados!' },
  { name: 'Edmilson Souza', role: 'Cliente - Direito da Família',text: 'Contratei neste ano de 2025 o Dr. Marco Lago do Escritório Lima e Lago Advogados para resolver uma partilha de bens e fiquei muito satisfeito pela a prestação dos serviços advocatícios.  Um profissional pontual, atencioso e que domina o assunto, além é claro de um preço justo. Faria tudo novamente,  super recomendo.' },
  { name: 'Fernando Rodrigues', role: 'Cliente - Direito do Consumidor',text: 'Quero agradecer ao Doutor Marco Lago por ter me ajudado a resolver um problema que estava enfrentando há quase um ano, foi bastante atencioso e também tirou todas as minhas dúvidas e com certeza eu o indico a todos que  conheço. Excelente Profissional .' },
  { name: 'Rodrigo Eduardo Silva', role: 'Cliente - Direito da Família',text: 'Dr. Marco Lago é um advogado que se destaca pela competência, dedicação, transparência, facilidade de acesso, comunicação e pelo compromisso com a defesa dos interesses de seus clientes. Certamente foi uma excelente escolha! Recomendo para quem busca serviços jurídicos de confiança e com alto padrão de qualidade.' },
  { name: 'Roger Rodrigues', role: 'Cliente - Contratos',text: 'Excelente advogado, obrigado pelo excelente trabalho.' },
];

const icon = (name) => `<svg><use href="#${name}"></use></svg>`;
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const track = document.querySelector('#testimonial-track');
const prevButton = document.querySelector('#prev-testimonial');
const nextButton = document.querySelector('#next-testimonial');
let currentIndex = 0;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('ll-theme', theme);
  const label = theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
  const symbol = theme === 'dark' ? 'icon-sun' : 'icon-moon';
  themeToggle?.setAttribute('aria-label', label);
  if (themeToggle) themeToggle.innerHTML = icon(symbol);
}

function initializeTheme() {
  const stored = localStorage.getItem('ll-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  setTheme(stored || preferred);
}

function toggleMenu() {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuToggle.innerHTML = icon(open ? 'icon-x' : 'icon-menu');
}

function buildCarousel() {
  track.innerHTML = testimonials.map((testimonial) => `
    <article class="carousel-slide">
      <div class="testimonial-card">
        <svg class="quote-icon">
          <use href="#icon-quote"></use>
        </svg>
        <blockquote>“${testimonial.text}”</blockquote>
        <div class="stars" aria-label="5 estrelas">${Array.from({ length: 5 }, () => icon('icon-star')).join('')}</div>
        <div class="testimonial-author">
          <strong>${testimonial.name}</strong>
          <span>${testimonial.role}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function visibleSlides() {
  if (window.matchMedia('(max-width: 720px)').matches) return 1;
  if (window.matchMedia('(max-width: 1024px)').matches) return 2;
  return 3;
}

function updateCarousel() {
  const maxIndex = Math.max(0, testimonials.length - visibleSlides());
  currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
  track.style.transform = `translateX(-${(100 / visibleSlides()) * currentIndex}%)`;
}

function moveCarousel(direction) {
  const maxIndex = Math.max(0, testimonials.length - visibleSlides());
  currentIndex = direction === 'next' ? (currentIndex >= maxIndex ? 0 : currentIndex + 1) : (currentIndex <= 0 ? maxIndex : currentIndex - 1);
  updateCarousel();
}

function initializeCarouselTouch() {
  const viewport = document.querySelector('.carousel-viewport');
  if (!viewport || !track) return;

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let tracking = false;
  let axis = null;
  const threshold = 48;

  const onStart = (clientX, clientY) => {
    startX = clientX;
    startY = clientY;
    deltaX = 0;
    tracking = true;
    axis = null;
    track.style.transition = 'none';
  };

  const onMove = (clientX, clientY) => {
    if (!tracking) return;
    const dx = clientX - startX;
    const dy = clientY - startY;

    if (axis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'y') {
        tracking = false;
        track.style.transition = '';
        updateCarousel();
        return;
      }
    }

    if (axis !== 'x') return;

    deltaX = dx;
    const base = -((100 / visibleSlides()) * currentIndex);
    const offsetPercent = (dx / viewport.offsetWidth) * 100;
    track.style.transform = `translateX(calc(${base}% + ${offsetPercent}%))`;
  };

  const onEnd = () => {
    if (!tracking) return;
    tracking = false;
    track.style.transition = '';

    if (axis === 'x' && Math.abs(deltaX) >= threshold) {
      moveCarousel(deltaX < 0 ? 'next' : 'prev');
    } else {
      updateCarousel();
    }

    axis = null;
    deltaX = 0;
  };

  viewport.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    onStart(touch.clientX, touch.clientY);
  }, { passive: true });

  viewport.addEventListener('touchmove', (event) => {
    const touch = event.changedTouches[0];
    onMove(touch.clientX, touch.clientY);
  }, { passive: true });

  viewport.addEventListener('touchend', onEnd, { passive: true });
  viewport.addEventListener('touchcancel', onEnd, { passive: true });
}

function initializeReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  elements.forEach((element) => observer.observe(element));
}

function setCurrentYear() {
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function initializeWhatsappFloat() {
  const button = document.querySelector('#whatsapp-float');
  const slot = document.querySelector('.whatsapp-float-slot');
  if (!button || !slot) return;

  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  const remToPx = (value) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return parseFloat(value) * rem;
  };

  const update = () => {
    if (!isMobile()) {
      button.classList.add('is-fixed');
      return;
    }

    const styles = getComputedStyle(button);
    const dockBottom = remToPx(styles.getPropertyValue('--whatsapp-dock-bottom'));
    const size = remToPx(styles.getPropertyValue('--whatsapp-size')) || button.offsetHeight;
    const dockTop = window.innerHeight - dockBottom - size;
    const slotRect = slot.getBoundingClientRect();
    const shouldFix = slotRect.top <= dockTop;

    button.classList.toggle('is-fixed', shouldFix);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

initializeTheme();
buildCarousel();
updateCarousel();
initializeCarouselTouch();
initializeReveal();
setCurrentYear();
initializeWhatsappFloat();

themeToggle?.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
menuToggle?.addEventListener('click', toggleMenu);
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.innerHTML = icon('icon-menu');
}));
prevButton?.addEventListener('click', () => moveCarousel('prev'));
nextButton?.addEventListener('click', () => moveCarousel('next'));
window.addEventListener('resize', updateCarousel);
