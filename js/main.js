/* =============================================
   SUSANIN BIKE — main.js
   ============================================= */

/* --- Футер: текущий год --- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* --- Минимальная дата в форме --- */
const dateInput = document.getElementById('fieldDate');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

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
   Модалка записи
   ============================================= */
const bookingOverlay = document.getElementById('bookingOverlay');

function openBookingModal() {
  bookingOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  navMobileEl.classList.remove('open');
}
function closeBookingModal() {
  bookingOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-booking]').forEach(btn => {
  btn.addEventListener('click', openBookingModal);
});
document.getElementById('bookingClose').addEventListener('click', closeBookingModal);
bookingOverlay.addEventListener('click', e => {
  if (e.target === bookingOverlay) closeBookingModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && bookingOverlay.classList.contains('open')) closeBookingModal();
});

/* =============================================
   Форма бронирования
   ============================================= */

// --- Тариф ---
let selectedTariff = '';
document.querySelectorAll('.tariff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tariff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTariff = btn.dataset.tariff;
    document.getElementById('fieldTariff').value = selectedTariff;
    document.getElementById('err-tariff').textContent = '';
  });
});

const TARIFF_NAMES = {
  rental: 'Аренда + гид',
  tour1000: 'Мототур',
  date: 'Мотосвидание',
};

// --- Счётчик людей ---
let people = 1;
document.getElementById('peopleMinus').addEventListener('click', () => {
  if (people > 1) { people--; updatePeople(); }
});
document.getElementById('peoplePlus').addEventListener('click', () => {
  if (people < 20) { people++; updatePeople(); }
});
function updatePeople() {
  document.getElementById('peopleVal').textContent = people;
  document.getElementById('fieldPeople').value = people;
}

// --- Валидация ---
function getVal(id) { return document.getElementById(id).value.trim(); }
function setErr(id, msg) {
  const el = document.getElementById('err-' + id);
  if (el) el.textContent = msg ? '— ' + msg : '';
}
function clearInputErr(inputId) {
  const input = document.getElementById(inputId);
  if (input) input.classList.remove('error');
}
function markInputErr(inputId) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add('error');
}

function validate() {
  let ok = true;

  // Тариф
  if (!selectedTariff) {
    setErr('tariff', 'Выбери тариф'); ok = false;
  } else { setErr('tariff', ''); }

  // Дата
  if (!getVal('fieldDate')) {
    setErr('date', 'Когда едем?'); markInputErr('fieldDate'); ok = false;
  } else { setErr('date', ''); clearInputErr('fieldDate'); }

  // Имя
  const name = getVal('fieldName');
  if (!name || name.length < 2) {
    setErr('name', 'Как тебя зовут?'); markInputErr('fieldName'); ok = false;
  } else { setErr('name', ''); clearInputErr('fieldName'); }

  // Телефон
  const phone = getVal('fieldPhone');
  if (!/^[\+\d\s\-\(\)]{10,}$/.test(phone)) {
    setErr('phone', '+7 или 8 — без фантазий'); markInputErr('fieldPhone'); ok = false;
  } else { setErr('phone', ''); clearInputErr('fieldPhone'); }

  // Email (необязательный)
  const email = getVal('fieldEmail');
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    setErr('email', 'Проверь email'); markInputErr('fieldEmail'); ok = false;
  } else { setErr('email', ''); clearInputErr('fieldEmail'); }

  return ok;
}

// --- Отправка ---
const form = document.getElementById('bookingForm');
const successBlock = document.getElementById('bookingSuccess');
const submitBtn = document.getElementById('submitBtn');
const SUBMIT_LABEL_DEFAULT = 'Оставить заявку';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Собираем данные
  const data = {
    tariff:  TARIFF_NAMES[selectedTariff] || selectedTariff,
    date:    getVal('fieldDate'),
    people:  people,
    name:    getVal('fieldName'),
    phone:   getVal('fieldPhone'),
    email:   getVal('fieldEmail'),
    comment: getVal('fieldComment'),
  };

  // Текст письма
  const body = [
    'Новая заявка SUSANIN BIKE',
    '',
    'Тариф: '   + data.tariff,
    'Дата: '    + data.date,
    'Человек: ' + data.people,
    '',
    'Имя: '    + data.name,
    'Телефон: '+ data.phone,
    'Email: '  + (data.email || '—'),
    '',
    'Комментарий: ' + (data.comment || '—'),
  ].join('\n');

  submitBtn.textContent = 'Отправляю...';
  submitBtn.disabled = true;

  // ===== Отправка через Formspree =====
  // ИНСТРУКЦИЯ: Зарегистрируйтесь на https://formspree.io/
  // Создайте форму для martov1407@rambler.ru, получите endpoint вида:
  // https://formspree.io/f/XXXXXXXX
  // и замените строку ниже.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

  let sent = false;

  if (!FORMSPREE_ENDPOINT.includes('REPLACE_ME')) {
    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...data, _subject: 'Новая заявка SUSANIN BIKE — ' + data.name }),
      });
      sent = resp.ok;
    } catch (err) {
      console.error('Formspree error:', err);
    }
  }

  if (!sent) {
    // Запасной вариант: mailto
    const subject = encodeURIComponent('Новая заявка SUSANIN BIKE — ' + data.name);
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:martov1407@rambler.ru?subject=${subject}&body=${bodyEncoded}`;
    // Подождём чуть-чуть и всё равно покажем "успех"
    await new Promise(r => setTimeout(r, 600));
  }

  // Показываем успех
  form.hidden = true;
  successBlock.hidden = false;
});

// Закрытие модалки после успеха / сброс формы
document.getElementById('resetBtn').addEventListener('click', () => {
  closeBookingModal();
  form.reset();
  form.hidden = false;
  successBlock.hidden = true;
  submitBtn.textContent = SUBMIT_LABEL_DEFAULT;
  submitBtn.disabled = false;
  selectedTariff = '';
  people = 1;
  updatePeople();
  document.querySelectorAll('.tariff-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('fieldTariff').value = '';
});
