/* =========================================================
   NAVEGACIÓN MÓVIL
========================================================= */
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
const navScrim  = document.getElementById('navScrim');

function openNav(){
  siteNav.classList.add('is-open');
  document.body.classList.add('nav-open');
  navToggle.setAttribute('aria-expanded', 'true');
}
function closeNav(){
  siteNav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  siteNav.classList.contains('is-open') ? closeNav() : openNav();
});
navScrim.addEventListener('click', closeNav);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

/* =========================================================
   RESALTAR SECCIÓN ACTIVA EN EL ÍNDICE AL HACER SCROLL
========================================================= */
const sections = document.querySelectorAll('main .page');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.dataset.nav === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* =========================================================
   LÍNEA DE TIEMPO INTERACTIVA (Módulo 3)
========================================================= */
const timelineItems  = document.querySelectorAll('.timeline__item');
const timelinePanels = document.querySelectorAll('.timeline-detail__panel');
const timelineHint   = document.querySelector('.timeline-detail__hint');

function showTimelineDetail(key){
  timelineItems.forEach(item => {
    item.classList.toggle('is-active', item.dataset.detail === key);
  });
  timelinePanels.forEach(panel => {
    panel.classList.toggle('is-visible', panel.dataset.panel === key);
  });
  if (timelineHint) timelineHint.style.display = 'none';
}

timelineItems.forEach(item => {
  item.addEventListener('click', () => showTimelineDetail(item.dataset.detail));
});

/* Mostrar por defecto el hito de Comte */
showTimelineDetail('comte');

/* =========================================================
   TARJETAS DE PENSADORES (Módulo 4)
========================================================= */
const thinkerCards = document.querySelectorAll('.thinker-card');

thinkerCards.forEach(card => {
  const key    = card.dataset.thinker;
  const detail = document.querySelector(`[data-thinker-detail="${key}"]`);

  card.setAttribute('aria-expanded', 'false');

  card.addEventListener('click', () => {
    const isOpen = card.getAttribute('aria-expanded') === 'true';

    /* Cierra cualquier otra tarjeta abierta */
    thinkerCards.forEach(otherCard => {
      if (otherCard !== card){
        otherCard.setAttribute('aria-expanded', 'false');
        otherCard.querySelector('.thinker-card__more').textContent = 'Ver aporte +';
        const otherDetail = document.querySelector(`[data-thinker-detail="${otherCard.dataset.thinker}"]`);
        if (otherDetail) otherDetail.hidden = true;
      }
    });

    card.setAttribute('aria-expanded', String(!isOpen));
    card.querySelector('.thinker-card__more').textContent = isOpen ? 'Ver aporte +' : 'Ocultar –';
    if (detail) detail.hidden = isOpen;

    if (!isOpen && detail){
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

/* =========================================================
   ACORDEÓN DE CORRIENTES SOCIOLÓGICAS (Módulo 5)
========================================================= */
document.querySelectorAll('.accordion__item').forEach(item => {
  const trigger = item.querySelector('.accordion__trigger');
  const panel   = item.querySelector('.accordion__panel');

  /* envuelve el contenido para animar con grid-template-rows */
  const inner = document.createElement('div');
  inner.className = 'accordion__panel-inner';
  while (panel.firstChild) inner.appendChild(panel.firstChild);
  panel.appendChild(inner);

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* =========================================================
   QUIZ INTERACTIVO
========================================================= */
const quizData = [
  {
    question: '¿Qué distingue principalmente al conocimiento científico del sentido común?',
    options: [
      'Que el conocimiento científico sigue un método y puede verificarse',
      'Que el sentido común es siempre falso',
      'Que la ciencia no admite errores',
      'Que el sentido común solo existe en sociedades antiguas'
    ],
    correct: 0
  },
  {
    question: '¿Qué procesos históricos favorecieron el surgimiento de las Ciencias Sociales?',
    options: [
      'La caída del Imperio Romano',
      'La Ilustración, la Revolución Francesa y la Revolución Industrial',
      'La invención de la imprenta',
      'La firma de la Carta Magna'
    ],
    correct: 1
  },
  {
    question: '¿Quién acuñó el término "sociología"?',
    options: ['Émile Durkheim', 'Max Weber', 'Auguste Comte', 'Herbert Spencer'],
    correct: 2
  },
  {
    question: '¿En qué consiste la sociología comprensiva de Max Weber?',
    options: [
      'En estudiar la sociedad como un organismo biológico',
      'En comprender el sentido subjetivo que las personas dan a su acción',
      'En clasificar a la sociedad en tres estados históricos',
      'En estudiar exclusivamente la economía'
    ],
    correct: 1
  },
  {
    question: '¿Qué corriente sociológica pone el énfasis en la lucha entre grupos con intereses opuestos?',
    options: [
      'El estructural funcionalismo',
      'La teoría clásica del conflicto',
      'El positivismo de Comte',
      'El evolucionismo de Spencer'
    ],
    correct: 1
  }
];

let quizIndex = 0;
let quizScore = 0;

const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl  = document.getElementById('quizOptions');
const quizFeedbackEl = document.getElementById('quizFeedback');
const quizNextBtn    = document.getElementById('quizNext');
const quizProgressEl = document.getElementById('quizProgress');
const quizResultEl   = document.getElementById('quizResult');
const quizScoreEl    = document.getElementById('quizScore');
const quizRestartBtn = document.getElementById('quizRestart');
const quizAppEl      = document.getElementById('quizApp');

function renderQuizQuestion(){
  const current = quizData[quizIndex];
  quizProgressEl.textContent = `Pregunta ${quizIndex + 1} de ${quizData.length}`;
  quizQuestionEl.textContent = current.question;
  quizFeedbackEl.textContent = '';
  quizFeedbackEl.className = 'quiz__feedback';
  quizNextBtn.disabled = true;
  quizOptionsEl.innerHTML = '';

  current.options.forEach((optionText, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz__option';
    btn.textContent = optionText;
    btn.addEventListener('click', () => handleQuizAnswer(i, btn));
    quizOptionsEl.appendChild(btn);
  });
}

function handleQuizAnswer(selectedIndex, selectedBtn){
  const current = quizData[quizIndex];
  const optionButtons = quizOptionsEl.querySelectorAll('.quiz__option');
  optionButtons.forEach(b => b.disabled = true);

  if (selectedIndex === current.correct){
    selectedBtn.classList.add('is-correct');
    quizFeedbackEl.textContent = 'Correcto.';
    quizFeedbackEl.classList.remove('is-wrong');
    quizScore++;
  } else {
    selectedBtn.classList.add('is-wrong');
    optionButtons[current.correct].classList.add('is-correct');
    quizFeedbackEl.textContent = 'No es correcto. Se resalta la respuesta correcta.';
    quizFeedbackEl.classList.add('is-wrong');
  }
  quizNextBtn.disabled = false;
}

quizNextBtn.addEventListener('click', () => {
  quizIndex++;
  if (quizIndex < quizData.length){
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz(){
  quizAppEl.querySelectorAll('.quiz__progress, .quiz__question, .quiz__options, .quiz__feedback, .quiz__nav')
    .forEach(el => el.style.display = 'none');
  quizResultEl.hidden = false;
  quizScoreEl.textContent = `Obtuviste ${quizScore} de ${quizData.length} respuestas correctas.`;
}

quizRestartBtn.addEventListener('click', () => {
  quizIndex = 0;
  quizScore = 0;
  quizAppEl.querySelectorAll('.quiz__progress, .quiz__question, .quiz__options, .quiz__feedback, .quiz__nav')
    .forEach(el => el.style.display = '');
  quizResultEl.hidden = true;
  renderQuizQuestion();
});

renderQuizQuestion();
