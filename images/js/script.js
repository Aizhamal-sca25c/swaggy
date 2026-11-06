/* ===== ФУНКЦИЯ 1: переключение светлой / тёмной темы ===== */
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'light' ? '☾' : '☀';
  localStorage.setItem('theme', theme);       // запоминаем выбор
}

// При загрузке берём сохранённую тему (по умолчанию тёмная, как в макете)
setTheme(localStorage.getItem('theme') || 'dark');

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});


/* ===== ФУНКЦИЯ 2: мобильное меню ===== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

// Закрываем меню после выбора пункта
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));


/* ===== ФУНКЦИЯ 3: проверка формы с сообщениями об ошибках ===== */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

// Показать или убрать ошибку у конкретного поля
function showError(input, message) {
  const group = input.parentElement;
  document.getElementById(input.id + '-error').textContent = message;
  group.classList.toggle('has-error', message !== '');
}

// Проверка одного поля, возвращает true если всё хорошо
function validateField(input) {
  const value = input.value.trim();
  let message = '';

  if (input.id === 'name') {
    if (value.length < 2) message = 'Please enter your name (at least 2 letters).';
  }
  if (input.id === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) message = 'Please enter a valid email, like name@mail.com.';
  }
  if (input.id === 'message') {
    if (value.length < 10) message = 'Message must be at least 10 characters.';
  }

  showError(input, message);
  return message === '';
}

const fields = [...form.querySelectorAll('input, textarea')];

// Проверяем поле, когда пользователь из него вышел
fields.forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.parentElement.classList.contains('has-error')) validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();                                   // не перезагружаем страницу
  const results = fields.map(validateField);                // проверяем все поля
  const allValid = results.every(Boolean);

  if (allValid) {
    successMsg.textContent = 'Thank you! Your message has been sent.';
    form.reset();
  } else {
    successMsg.textContent = '';
    fields.find(f => f.parentElement.classList.contains('has-error')).focus();
  }
});
