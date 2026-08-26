/* =============================================
   SUSANIN BIKE — main.js
   ============================================= */

/* --- Футер: текущий год --- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* =============================================
   Навигация
   ============================================= */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Плавный скролл по якорям
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Закрыть мобильное меню
    navMobileEl.classList.remove('open');
  });
});

// Бургер-меню
const navBurger  = document.getElementById('navBurger');
const navMobileEl = document.getElementById('navMobile');
navBurger.addEventListener('click', () => {
  navMobileEl.classList.toggle('open');
});

/* =============================================
   Анимации появления
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   FAQ аккордеон
   ============================================= */
document.querySelectorAll('.faq__item').forEach(item => {
  const btn = item.querySelector('.faq__q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Закрыть все
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    // Открыть текущий (если был закрыт)
    if (!isOpen) item.classList.add('open');
  });
});

/* =============================================
   Записаться — сразу в сообщения группы ВКонтакте
   ============================================= */
// Числовой ID группы ВК (SUSANIN BIKE — vk.com/susanin_bike)
const VK_GROUP_ID = '228039638';
const VK_WRITE_URL = `https://vk.com/write-${VK_GROUP_ID}`;

document.querySelectorAll('[data-open-booking]').forEach(btn => {
  btn.addEventListener('click', () => {
    navMobileEl.classList.remove('open');
    window.open(VK_WRITE_URL, '_blank', 'noopener');
  });
});
