/* ============================================================
   MосБлаго — concept prototype
   Vanilla JS, no dependencies.
   ============================================================ */

(function () {
  'use strict';

  const body = document.body;
  const header = document.getElementById('header');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');

  /* ----------------------------------------------------------
     Demo mode: internal pages open in a new tab.
     Set DEMO_NEW_TABS to false for production.
     ---------------------------------------------------------- */
  const DEMO_NEW_TABS = true;

  if (DEMO_NEW_TABS) {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (!/\.html?$/.test(url.pathname) && !url.pathname.endsWith('/')) return;

      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  /* Placeholder links should not jump to the top */
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href="#"]')) event.preventDefault();
  });

  /* ----------------------------------------------------------
     Header shadow
     ---------------------------------------------------------- */
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     Mobile menu
     ---------------------------------------------------------- */
  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    body.classList.add('menu-open');
    burger?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    body.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', openMenu);
  mobileMenuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     Preselect topic from URL
     ---------------------------------------------------------- */
  const topicSelect = document.getElementById('topic');
  const params = new URLSearchParams(window.location.search);
  const urlTopic = params.get('topic');
  if (topicSelect && urlTopic) topicSelect.value = urlTopic;

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-topic]');
    if (!trigger || !topicSelect) return;
    const value = trigger.getAttribute('data-topic');
    if (value) topicSelect.value = value;
  });

  /* ----------------------------------------------------------
     Privacy link (demo)
     ---------------------------------------------------------- */
  document.querySelectorAll('.privacy-link').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  /* ----------------------------------------------------------
     Lead form (demo)
     ---------------------------------------------------------- */
  const form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const fields = form.querySelector('.form-fields');
      const success = form.querySelector('.form-success');
      if (fields && success) {
        fields.hidden = true;
        success.hidden = false;
      }
    });
  }

  /* ----------------------------------------------------------
     Portfolio filters
     ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        const filter = button.getAttribute('data-filter');
        projectCards.forEach((card) => {
          const categories = card.getAttribute('data-category') || '';
          card.hidden = filter !== 'all' && !categories.includes(filter);
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Lawn quiz
     ---------------------------------------------------------- */
  const quizContent = document.getElementById('quiz-content');
  const quizResult = document.getElementById('quiz-result');
  const quizLabel = document.getElementById('quiz-progress-label');
  const quizDots = document.querySelectorAll('.quiz__dot');

  if (quizContent && quizResult) {
    const quizData = [
      {
        question: 'Где будет газон?',
        options: [
          { label: 'Частный дом или дача', value: 'private' },
          { label: 'Городской объект', value: 'city' },
          { label: 'Спортивная площадка', value: 'sport' }
        ]
      },
      {
        question: 'Какая будет нагрузка?',
        options: [
          { label: 'Декоративный, почти без ходьбы', value: 'low' },
          { label: 'Дети, игры, гости', value: 'medium' },
          { label: 'Активные тренировки', value: 'high' }
        ]
      },
      {
        question: 'Что важнее?',
        options: [
          { label: 'Премиальный внешний вид', value: 'premium' },
          { label: 'Неприхотливость в уходе', value: 'easy' },
          { label: 'Минимальная цена', value: 'budget' }
        ]
      }
    ];

    const results = {
      elitny: {
        name: 'Элитный',
        text: 'Самый декоративный вариант: плотная дернина, глубокий изумрудный цвет и мягкая текстура. Подойдёт для парадной зоны перед домом.',
        price: 'от 200 ₽/м²'
      },
      universalny: {
        name: 'Универсальный',
        text: 'Баланс декоративности и неприхотливости. Хорошо переносит тень, нагрузки и перепады погоды — универсальный выбор для участка.',
        price: 'от 180 ₽/м²'
      },
      sportivny: {
        name: 'Спортивный',
        text: 'Для активных нагрузок: футбол, детские игры, площадки. Быстро восстанавливается и держит плотный травостой.',
        price: 'от 230 ₽/м²'
      },
      gorodskoy: {
        name: 'Городской',
        text: 'Бюджетный вариант для больших территорий. Даёт быстрый зелёный результат без лишних затрат.',
        price: 'от 150 ₽/м²'
      }
    };

    let step = 0;
    const answers = [];

    function getResult() {
      const [place, load, priority] = answers;
      if (place === 'sport' || load === 'high') return results.sportivny;
      if (place === 'city' && priority === 'budget') return results.gorodskoy;
      if (priority === 'premium') return results.elitny;
      return results.universalny;
    }

    function renderDots() {
      quizDots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index <= step);
      });
    }

    function renderQuestion() {
      const item = quizData[step];
      quizLabel.textContent = `Шаг ${step + 1} из ${quizData.length}`;
      renderDots();

      quizContent.innerHTML = `
        <h3>${item.question}</h3>
        <div class="quiz__options">
          ${item.options
            .map(
              (option) =>
                `<button class="quiz__option" type="button" data-value="${option.value}">${option.label}</button>`
            )
            .join('')}
        </div>
        ${step > 0
          ? '<button class="quiz__back" type="button" data-quiz-back>Назад</button>'
          : '<button class="quiz__back" type="button" disabled aria-hidden="true" style="visibility:hidden">Назад</button>'}
      `;

      quizContent.querySelectorAll('.quiz__option').forEach((button) => {
        button.addEventListener('click', () => {
          answers[step] = button.getAttribute('data-value');
          if (step < quizData.length - 1) {
            step += 1;
            renderQuestion();
          } else {
            showResult();
          }
        });
      });

      quizContent.querySelector('[data-quiz-back]')?.addEventListener('click', () => {
        step -= 1;
        renderQuestion();
      });
    }

    function showResult() {
      const result = getResult();
      quizContent.hidden = true;
      quizResult.hidden = false;
      quizLabel.textContent = 'Готово';
      quizDots.forEach((dot) => dot.classList.add('is-active'));

      quizResult.innerHTML = `
        <span class="tag">Рекомендация</span>
        <h3>${result.name}</h3>
        <p>${result.text}</p>
        <p><strong>${result.price}</strong> — ориентир. Точную стоимость посчитаем по площади и адресу.</p>
        <div class="quiz__result-actions">
          <a class="btn btn--primary" href="#contact" data-topic="lawns">Получить расчёт</a>
          <a class="btn btn--ghost" href="lawns.html">Смотреть все газоны</a>
        </div>
        <button class="quiz__back" type="button" data-quiz-reset>Пройти заново</button>
      `;

      quizResult.querySelector('[data-quiz-reset]')?.addEventListener('click', () => {
        step = 0;
        answers.length = 0;
        quizResult.hidden = true;
        quizContent.hidden = false;
        renderQuestion();
      });
    }

    renderQuestion();
  }

  /* ----------------------------------------------------------
     FAQ tabs
     ---------------------------------------------------------- */
  const faqQuestions = document.querySelectorAll('[data-faq-question]');
  const faqAnswers = document.querySelectorAll('[data-faq-answer]');

  if (faqQuestions.length && faqAnswers.length) {
    faqQuestions.forEach((question) => {
      question.addEventListener('click', () => {
        const index = question.getAttribute('data-faq-question');

        faqQuestions.forEach((item) => {
          const isActive = item === question;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        faqAnswers.forEach((answer) => {
          const isActive = answer.getAttribute('data-faq-answer') === index;
          answer.classList.toggle('is-active', isActive);
          answer.hidden = !isActive;
        });
      });
    });
  }
})();
