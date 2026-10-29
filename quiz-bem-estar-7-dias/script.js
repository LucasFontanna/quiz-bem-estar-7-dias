'use strict';

/* ==========================================================================
   CONFIGURAÇÃO — edite apenas esta seção para ajustar o destino do botão
   ========================================================================== */

// Endereço para onde o botão "QUERO CONHECER O PROGRAMA" leva o visitante.
// Pode ser um checkout direto ou, no futuro, uma página de vendas
// (ex.: "https://seusite.com/programa" ou um caminho relativo como "vendas.html").
// Se ficar vazio, nenhum redirecionamento acontece e o visitante vê um aviso discreto.
const CHECKOUT_URL = "vendas.html";

// true = abre o destino em uma nova aba; false = abre na mesma aba.
const OPEN_IN_NEW_TAB = false;

// Itens exibidos em "Conheça o Programa de Bem-Estar de 7 Dias".
// Mantenha apenas o que o produto realmente entrega. Se o programa tiver
// vídeos, materiais em PDF etc., descreva-os aqui somente depois de prontos.
const PROGRAM_FEATURES = [
  'Rotina organizada em etapas',
  'Orientações práticas para realizar em casa, quando fizer sentido para o seu objetivo',
  'Acompanhamento simples dos hábitos',
  'Conteúdo e materiais do programa, detalhados na apresentação da oferta'
];

/* ==========================================================================
   CONSTANTES INTERNAS
   ========================================================================== */

const STORAGE_KEY = 'quizBemEstar7Dias:v1';
const ADVANCE_DELAY_MS = 350;     // tempo para o visitante ver a resposta marcada antes de avançar
const INTERACTION_GUARD_MS = 250; // ignora toques logo após trocar de tela (evita clique duplo)

/* ==========================================================================
   PERGUNTAS
   ========================================================================== */

const QUESTIONS = [
  {
    id: 'objective',
    title: 'O que você mais gostaria de melhorar neste momento?',
    hint: 'Escolha a opção que mais se aproxima do que você sente agora.',
    options: [
      'Sentir-me menos inchada e mais confortável',
      'Ter mais disposição no dia a dia',
      'Criar uma rotina de movimento em casa',
      'Cuidar melhor dos meus hábitos de bem-estar'
    ]
  },
  {
    id: 'difficulty',
    title: 'O que mais dificulta alcançar esse objetivo?',
    hint: 'Não existe resposta certa. Escolha a que mais combina com você.',
    options: [
      'Falta de tempo',
      'Dificuldade para manter a constância',
      'Não sei por onde começar',
      'Tenho dificuldade para encontrar uma rotina adequada'
    ]
  },
  {
    id: 'time',
    title: 'Quanto tempo você consegue reservar para cuidar de si?',
    hint: 'Pense em um tempo realista para os seus dias.',
    options: [
      'De 5 a 10 minutos por dia',
      'De 10 a 20 minutos por dia',
      'De 20 a 30 minutos por dia',
      'Minha rotina varia bastante'
    ]
  },
  {
    id: 'experience',
    title: 'Como está sua rotina de atividades atualmente?',
    hint: 'Isso ajuda a pensar em um ponto de partida adequado.',
    options: [
      'Ainda não tenho uma rotina',
      'Faço algumas atividades de vez em quando',
      'Tenho uma rotina, mas quero organizá-la melhor',
      'Já tenho hábitos consistentes e quero mantê-los'
    ]
  },
  {
    id: 'format',
    title: 'Como você prefere cuidar do seu bem-estar?',
    hint: 'Escolha o formato em que você se sentiria mais à vontade.',
    options: [
      'Com orientações simples para fazer em casa',
      'Com um plano organizado por etapas',
      'Com vídeos e demonstrações práticas',
      'Com pequenas tarefas para acompanhar meu progresso'
    ]
  },
  {
    id: 'motivation',
    title: 'O que faria você se sentir mais confiante para começar?',
    hint: 'Pense no que deixaria o primeiro passo mais leve.',
    options: [
      'Ter um passo a passo claro',
      'Conseguir encaixar as atividades na minha rotina',
      'Saber exatamente o que fazer a cada dia',
      'Acompanhar minha evolução de forma simples'
    ]
  },
  {
    id: 'start',
    title: 'Quando gostaria de começar a cuidar melhor da sua rotina?',
    hint: 'Sem pressão: é só para entender o seu momento.',
    options: [
      'Quero começar assim que possível',
      'Quero começar nos próximos dias',
      'Estou pesquisando opções antes de decidir',
      'Ainda estou entendendo o que funciona para mim'
    ]
  }
];

/* ==========================================================================
   TEXTOS DE PERSONALIZAÇÃO
   Cada lista é indexada pela posição da alternativa escolhida (0 a 3).
   São sugestões de organização de rotina, não avaliação médica.
   ========================================================================== */

const GOAL_PHRASES = [
  'sentir-se menos inchada e mais confortável',
  'ter mais disposição no dia a dia',
  'criar uma rotina de movimento em casa',
  'cuidar melhor dos seus hábitos de bem-estar'
];

const DIFFICULTY_PHRASES = [
  'a falta de tempo é o que mais atrapalha',
  'manter a constância é o seu maior desafio',
  'ainda não sabe por onde começar',
  'tem sido difícil encontrar uma rotina adequada'
];

const DIFFICULTY_TAILS = [
  'Uma rotina flexível, com etapas curtas, pode ajudar você a encontrar espaço para cuidar de si.',
  'Um plano organizado em pequenas etapas pode facilitar a criação de uma rotina mais consistente.',
  'Um passo a passo claro pode tornar o início mais simples, sem precisar decidir tudo de uma vez.',
  'Uma proposta flexível, que se ajuste ao seu dia a dia, pode ajudar você a encontrar um ritmo que funcione.'
];

const TIME_TIPS = [
  'Comece com blocos de 5 a 10 minutos, em um horário em que o seu dia seja mais previsível.',
  'Separe de 10 a 20 minutos por dia, de preferência em um horário fixo, para criar um ponto de partida claro.',
  'Com 20 a 30 minutos por dia, você pode dividir o tempo em etapas: um começo leve, o foco principal e um encerramento tranquilo.',
  'Como a sua rotina varia, vale ter versões curtas e longas da mesma atividade, para ajustar ao dia sem abandonar o hábito.'
];

const EXPERIENCE_TIPS = [
  'Como você ainda está começando, o melhor é começar pequeno e aumentar aos poucos.',
  'Transformar o que você já faz de vez em quando em um compromisso com dia e horário pode ser o primeiro ajuste.',
  'Você já tem uma base: o foco pode ser organizar melhor o que já existe.',
  'Você já tem hábitos consistentes, então o objetivo é proteger o que funciona e ajustar só o necessário.'
];

const FORMAT_TIPS = [
  'Você pode começar conhecendo atividades e orientações que se adaptem ao seu espaço e à sua disponibilidade.',
  'Dividir o caminho em etapas ajuda a saber qual é o próximo passo, sem precisar decidir tudo de uma vez.',
  'Ver como cada atividade é feita pode dar mais segurança. Procure demonstrações práticas e claras para seguir no seu ritmo.',
  'Pequenas tarefas diárias deixam o progresso mais visível e mais fácil de manter.'
];

const TRACKING_TIPS = [
  'Anote ao fim de cada dia qual passo você concluiu. Um registro curto já mostra o caminho percorrido.',
  'Reserve no calendário ou no celular o momento do dia dedicado a você e marque quando conseguir cumprir.',
  'Defina na véspera o que será feito no dia seguinte e marque quando concluir. Assim, você sempre sabe o que fazer.',
  'Um registro simples, como marcar os dias em que você cumpriu o combinado, ajuda a enxergar a sua evolução.'
];

const START_NOTES = [
  'Você quer começar assim que possível. Veja os detalhes do programa e decida no seu ritmo.',
  'Você quer começar nos próximos dias. Conheça o programa e veja se ele faz sentido para você.',
  'Você está pesquisando opções. Sem pressa: conheça o programa e compare com calma.',
  'Você ainda está entendendo o que funciona para você. Conhecer a proposta pode ajudar nessa decisão.'
];

// Linhas do resumo exibido na tela de resultado.
const SUMMARY_ROWS = [
  { id: 'objective', label: 'O que você quer melhorar' },
  { id: 'difficulty', label: 'O que mais dificulta' },
  { id: 'time', label: 'Tempo disponível' },
  { id: 'format', label: 'Formato preferido' },
  { id: 'motivation', label: 'O que daria confiança' }
];

/* ==========================================================================
   ESTADO
   ========================================================================== */

const state = {
  screen: 'intro',   // 'intro' | 'question' | 'result'
  index: 0,          // índice da pergunta atual
  answers: {}        // { idDaPergunta: indiceDaAlternativa }
};

let els = {};
let advanceTimer = null;
let lastRenderAt = 0;
let usingKeyboard = false;

/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */

const SVG_NS = 'http://www.w3.org/2000/svg';

function $(selector) {
  return document.querySelector(selector);
}

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Cria um ícone SVG a partir do sprite inline definido no index.html.
function createIcon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '#icon-' + name);
  svg.appendChild(use);
  return svg;
}

function now() {
  return (window.performance && performance.now) ? performance.now() : Date.now();
}

function isAnswered(question) {
  return Number.isInteger(state.answers[question.id]);
}

function allAnswered() {
  return QUESTIONS.every(isAnswered);
}

function firstUnansweredIndex() {
  const index = QUESTIONS.findIndex((question) => !isAnswered(question));
  return index === -1 ? QUESTIONS.length - 1 : index;
}

function answerLabel(questionId) {
  const question = QUESTIONS.find((item) => item.id === questionId);
  return question.options[state.answers[questionId]];
}

/* ==========================================================================
   PERSISTÊNCIA (sessionStorage, apenas neste navegador e nesta sessão)
   ========================================================================== */

function saveState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      screen: state.screen,
      index: state.index,
      answers: state.answers
    }));
  } catch (error) {
    // Armazenamento indisponível (modo privado, bloqueado etc.): o quiz segue funcionando em memória.
  }
}

function clearSavedState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Nada a fazer.
  }
}

// Lê e valida o que foi salvo; qualquer dado inesperado é descartado.
function loadSavedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (!['question', 'result'].includes(data.screen)) return null;
    if (!Number.isInteger(data.index) || data.index < 0 || data.index >= QUESTIONS.length) return null;

    const answers = {};
    QUESTIONS.forEach((question) => {
      const value = data.answers && data.answers[question.id];
      if (Number.isInteger(value) && value >= 0 && value < question.options.length) {
        answers[question.id] = value;
      }
    });

    return { screen: data.screen, index: data.index, answers };
  } catch (error) {
    return null;
  }
}

/* ==========================================================================
   TELAS E TRANSIÇÕES
   ========================================================================== */

function animateIn(nodes, direction) {
  const className = direction === 'back' ? 'is-entering-back' : 'is-entering-forward';
  nodes.forEach((node) => {
    node.classList.remove('is-entering-forward', 'is-entering-back');
    void node.offsetWidth; // reinicia a animação
    node.classList.add(className);
  });
}

function showScreen(name, options = {}) {
  const direction = options.direction || 'forward';
  const moveFocus = options.focus !== false;

  state.screen = name;
  lastRenderAt = now();

  Object.keys(els.screens).forEach((key) => {
    els.screens[key].hidden = key !== name;
  });
  els.headerRestart.hidden = name !== 'question';

  const screen = els.screens[name];
  animateIn(Array.from(screen.querySelectorAll('[data-animate]')), direction);

  if (moveFocus) {
    // Leva o foco ao título para que leitores de tela anunciem a nova tela.
    const title = screen.querySelector('.screen-title');
    if (title) title.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

/* ==========================================================================
   PERGUNTAS
   ========================================================================== */

function createOption(text, index, checked, questionId) {
  const label = createElement('label', 'option');

  const input = createElement('input', 'option__input');
  input.type = 'radio';
  input.name = 'answer-' + questionId;
  input.id = questionId + '-' + index;
  input.value = String(index);
  input.checked = checked;
  label.htmlFor = input.id;

  const body = createElement('span', 'option__body');
  const marker = createElement('span', 'option__marker');
  marker.setAttribute('aria-hidden', 'true');
  marker.appendChild(createIcon('check'));
  body.appendChild(marker);
  body.appendChild(createElement('span', 'option__text', text));

  label.appendChild(input);
  label.appendChild(body);
  return label;
}

function updateNextButton() {
  const question = QUESTIONS[state.index];
  const isLast = state.index === QUESTIONS.length - 1;
  els.btnNext.disabled = !isAnswered(question);
  els.btnNext.textContent = isLast ? 'Ver meu resultado' : 'Continuar';
}

function renderQuestion(direction, options = {}) {
  const question = QUESTIONS[state.index];
  const total = QUESTIONS.length;
  const number = state.index + 1;
  const selected = state.answers[question.id];

  els.questionTitle.textContent = question.title;
  els.questionHint.textContent = question.hint || '';
  els.options.replaceChildren(
    ...question.options.map((text, index) => createOption(text, index, selected === index, question.id))
  );

  const progressText = 'Pergunta ' + number + ' de ' + total;
  els.progressText.textContent = progressText;
  els.progressFill.style.width = ((number / total) * 100) + '%';
  els.progressTrack.setAttribute('aria-valuenow', String(number));
  els.progressTrack.setAttribute('aria-valuetext', progressText);

  els.btnBack.hidden = state.index === 0;
  updateNextButton();

  showScreen('question', { direction, focus: options.focus });
  saveState();
}

// Evita que um toque duplo "vaze" para a tela seguinte.
function isInteractionGuarded() {
  return now() - lastRenderAt < INTERACTION_GUARD_MS;
}

function onOptionClick(event) {
  const input = event.target;
  if (!input || !input.classList || !input.classList.contains('option__input')) return;

  if (isInteractionGuarded()) {
    event.preventDefault(); // impede a marcação acidental
    return;
  }

  const question = QUESTIONS[state.index];
  state.answers[question.id] = Number(input.value);
  saveState();
  updateNextButton();

  // Quem usa teclado avança com Enter ou com o botão "Continuar",
  // para que as setas possam percorrer as alternativas sem trocar de tela.
  if (usingKeyboard) return;
  scheduleAdvance();
}

function scheduleAdvance() {
  window.clearTimeout(advanceTimer);
  advanceTimer = window.setTimeout(() => {
    advanceTimer = null;
    goNext();
  }, ADVANCE_DELAY_MS);
}

function cancelAdvance() {
  window.clearTimeout(advanceTimer);
  advanceTimer = null;
}

function goNext() {
  cancelAdvance();
  if (state.screen !== 'question' || isInteractionGuarded()) return;

  const question = QUESTIONS[state.index];
  if (!isAnswered(question)) return;

  if (state.index < QUESTIONS.length - 1) {
    state.index += 1;
    renderQuestion('forward');
  } else {
    showResult('forward');
  }
}

function goBack() {
  cancelAdvance();
  if (state.screen !== 'question' || state.index === 0 || isInteractionGuarded()) return;
  state.index -= 1;
  renderQuestion('back');
}

function startQuiz() {
  if (isInteractionGuarded()) return;
  state.index = 0;
  renderQuestion('forward');
}

function restartQuiz() {
  cancelAdvance();
  state.answers = {};
  state.index = 0;
  clearSavedState();
  setCtaMessage('');
  showScreen('intro', { direction: 'back' });
}

/* ==========================================================================
   RESULTADO
   ========================================================================== */

// Monta o conteúdo personalizado a partir das respostas (sem pontuação nem diagnóstico).
function buildResult(answers) {
  const summary =
    'Você contou que quer ' + GOAL_PHRASES[answers.objective] +
    ' e que ' + DIFFICULTY_PHRASES[answers.difficulty] + '. ' +
    DIFFICULTY_TAILS[answers.difficulty];

  const tips = [
    {
      icon: 'calendar',
      title: 'Organize sua rotina',
      text: TIME_TIPS[answers.time] + ' ' + EXPERIENCE_TIPS[answers.experience]
    },
    {
      icon: 'route',
      title: 'Escolha um formato que combine com você',
      text: FORMAT_TIPS[answers.format]
    },
    {
      icon: 'chart',
      title: 'Acompanhe seus hábitos de forma simples',
      text: TRACKING_TIPS[answers.motivation]
    }
  ];

  return { summary, tips, startNote: START_NOTES[answers.start] };
}

function renderResult() {
  const result = buildResult(state.answers);

  els.resultSummary.textContent = result.summary;

  els.resultAnswers.replaceChildren(
    ...SUMMARY_ROWS.map((row) => {
      const wrapper = createElement('div', 'answer-summary__row');
      wrapper.appendChild(createElement('dt', '', row.label));
      wrapper.appendChild(createElement('dd', '', answerLabel(row.id)));
      return wrapper;
    })
  );

  els.resultTips.replaceChildren(
    ...result.tips.map((tip) => {
      const item = createElement('li', 'tip');
      const icon = createElement('span', 'tip__icon');
      icon.appendChild(createIcon(tip.icon));
      const content = createElement('div', 'tip__content');
      content.appendChild(createElement('h4', 'tip__title', tip.title));
      content.appendChild(createElement('p', 'tip__text', tip.text));
      item.appendChild(icon);
      item.appendChild(content);
      return item;
    })
  );

  els.programFeatures.replaceChildren(
    ...PROGRAM_FEATURES.map((text) => {
      const item = createElement('li');
      const check = createElement('span', 'feature-list__check');
      check.appendChild(createIcon('check'));
      item.appendChild(check);
      item.appendChild(createElement('span', '', text));
      return item;
    })
  );

  els.startNote.textContent = result.startNote;
  setCtaMessage('');
}

function showResult(direction, options = {}) {
  if (!allAnswered()) {
    // Segurança: se faltar alguma resposta, volta para a primeira pergunta em aberto.
    state.index = firstUnansweredIndex();
    renderQuestion('back', options);
    return;
  }
  renderResult();
  showScreen('result', { direction, focus: options.focus });
  saveState();
}

/* ==========================================================================
   BOTÃO DE DESTINO (CTA)
   ========================================================================== */

function setCtaMessage(text) {
  els.ctaMessage.textContent = text;
}

// Valida o endereço configurado. Aceita http(s) e caminhos relativos.
function resolveDestination() {
  const raw = typeof CHECKOUT_URL === 'string' ? CHECKOUT_URL.trim() : '';
  if (!raw) return { status: 'empty', url: null };

  try {
    const parsed = new URL(raw, window.location.href);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return { status: 'ok', url: parsed.href };
    }
  } catch (error) {
    // Cai no retorno de "invalid" abaixo.
  }
  return { status: 'invalid', url: null };
}

function onCtaClick() {
  const destination = resolveDestination();

  if (destination.status !== 'ok') {
    const detail = destination.status === 'empty'
      ? 'CHECKOUT_URL está vazio.'
      : 'CHECKOUT_URL não é um endereço http(s) válido.';
    console.warn('[Quiz] ' + detail + ' Configure a constante no início do script.js.');
    setCtaMessage('O endereço de compra ainda precisa ser configurado.');
    return;
  }

  setCtaMessage('');
  if (OPEN_IN_NEW_TAB) {
    window.open(destination.url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.assign(destination.url);
  }
}

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

function collectElements() {
  els = {
    screens: {
      intro: $('#screen-intro'),
      question: $('#screen-question'),
      result: $('#screen-result')
    },
    headerRestart: $('#btn-header-restart'),
    btnStart: $('#btn-start'),
    btnBack: $('#btn-back'),
    btnNext: $('#btn-next'),
    btnRestart: $('#btn-restart'),
    btnCta: $('#btn-cta'),
    progressText: $('#progress-text'),
    progressTrack: $('#progress-track'),
    progressFill: $('#progress-fill'),
    questionTitle: $('#question-title'),
    questionHint: $('#question-hint'),
    options: $('#options'),
    resultSummary: $('#result-summary'),
    resultAnswers: $('#result-answers'),
    resultTips: $('#result-tips'),
    programFeatures: $('#program-features'),
    startNote: $('#start-note'),
    ctaMessage: $('#cta-message'),
    appError: $('#app-error')
  };

  const missing = []
    .concat(Object.values(els.screens))
    .concat(Object.keys(els).filter((key) => key !== 'screens').map((key) => els[key]))
    .some((node) => !node);
  if (missing) throw new Error('Elementos obrigatórios não encontrados no HTML.');
}

function bindEvents() {
  els.btnStart.addEventListener('click', startQuiz);
  els.btnBack.addEventListener('click', goBack);
  els.btnNext.addEventListener('click', goNext);
  els.btnRestart.addEventListener('click', restartQuiz);
  els.headerRestart.addEventListener('click', restartQuiz);
  els.btnCta.addEventListener('click', onCtaClick);

  els.options.addEventListener('click', onOptionClick);
  els.options.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      goNext();
    }
  });

  // Distingue interação por teclado de toque/mouse (define o avanço automático).
  document.addEventListener('keydown', () => { usingKeyboard = true; }, true);
  document.addEventListener('pointerdown', () => { usingKeyboard = false; }, true);

  // Remove a classe de animação ao terminar, deixando o DOM limpo.
  document.addEventListener('animationend', (event) => {
    const target = event.target;
    if (target && target.classList) {
      target.classList.remove('is-entering-forward', 'is-entering-back');
    }
  });
}

function restoreOrStart() {
  const saved = loadSavedState();

  if (!saved) {
    showScreen('intro', { focus: false });
    return;
  }

  state.answers = saved.answers;
  state.index = saved.index;

  if (saved.screen === 'result') {
    showResult('forward', { focus: false });
  } else {
    renderQuestion('forward', { focus: false });
  }
}

function showFatalError() {
  const error = $('#app-error');
  if (error) error.hidden = false;
  document.querySelectorAll('.screen').forEach((screen) => { screen.hidden = true; });
}

function init() {
  collectElements();
  bindEvents();
  restoreOrStart();
}

try {
  init();
} catch (error) {
  console.error('[Quiz] Falha ao iniciar:', error);
  showFatalError();
}
