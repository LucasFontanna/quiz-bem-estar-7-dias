'use strict';

/* ==========================================================================
   CONFIGURAÇÃO — preencha somente com informações reais e confirmadas
   ========================================================================== */

// Link real do checkout da Pingu Pag. Vazio = os botões não redirecionam.
const CHECKOUT_URL = "https://ambienteprotegido.org.ua/c/98cb4d6dfa";

// ID do Meta Pixel. Vazio = nenhum script de rastreamento é carregado.
// Atenção: carregue o Pixel somente de acordo com sua política de privacidade/consentimento (LGPD).
const PIXEL_ID = "";

// PROVAS SOCIAIS: 4 espaços no formato de post do Instagram (1080 × 1350 px, proporção 4:5).
// Coloque as imagens na pasta do projeto e preencha "src" (ex.: "./prova-1.webp").
// Use SOMENTE prints/fotos REAIS de clientes do seu produto e com autorização. Nada de imagens de
// terceiros, de banco de imagens ou ilustrativas. Espaços sem "src" nunca aparecem para os visitantes:
// eles só ficam visíveis no seu computador (abrindo o arquivo ou localhost) ou com "?editar" no endereço.
const TESTIMONIALS = [
  { src: "./resultado-1.jpg", alt: "./resultado-1.jpg", caption: "Excelente material!" },
  { src: "./resultado-2.jpg", alt: "./resultado-2.jpg", caption: "Muito útil para minha rotina." },
  { src: "./resultado-3.jpg", alt: "./resultado-3.jpg", caption: "Receitas deliciosas e práticas." },
  { src: "./resultado-4.jpg", alt: "./resultado-4.jpg", caption: "Ajudou muito a organizar minhas refeições." }
];

// Informações comerciais. Preencha apenas o que estiver confirmado; o que ficar vazio não aparece.
const INFO = {
  guarantee: "Garantia de 7 dias a partir da data da compra.",   // mantenha igual ao configurado na Pingu Pag
  payment: "",     // métodos de pagamento e parcelamento
  delivery: "",    // prazo de liberação e como o acesso é entregue
  security: ""     // segurança/certificações específicas da plataforma
};

// Promoção. A oferta e o cronômetro SÓ aparecem se houver uma data final REAL (fixa, igual para todos).
// Preencha endsAt (ex.: "2026-11-02T23:59:00-03:00") apenas se o preço realmente voltará ao valor
// "regularPrice" depois dessa data, tanto aqui quanto no checkout. Vazio = nada de promoção na página.
const PROMO = { regularPrice: "R$ 89,90", endsAt: "" };

// Exemplos REAIS do material (páginas do planejamento, das receitas e da lista de compras).
// Coloque os arquivos na pasta do projeto e preencha "src" (ex.: "./previa-planejamento.webp").
// Sem "src", a seção não aparece. Não use imagens ilustrativas nem de terceiros.
const PREVIEWS = [
  { src: "", alt: "Página do planejamento alimentar", caption: "Planejamento alimentar" },
  { src: "", alt: "Página de sugestões de receitas", caption: "Sugestões de receitas" },
  { src: "", alt: "Página da lista de compras", caption: "Lista de compras" }
];

// Order bumps do checkout, apresentados como ofertas adicionais e opcionais.
// Só aparecem com "price" preenchido (ex.: "R$ 9,90"), para nunca mostrar valores inventados.
const BUMPS = [
  { name: "Receitas Detox", desc: "", price: "" },
  { name: "Planner de Hábitos & Autocuidado — 30 Dias", desc: "", price: "" },
  { name: "Kit Completo (receitas + planner)", desc: "", price: "" }
];

// Respostas do FAQ que dependem de informações confirmadas. Vazio = a pergunta não aparece.
const FAQ = {
  access: "",    // como o produto é entregue (conforme o processo real da Pingu Pag)
  devices: "",   // em quais dispositivos o arquivo pode ser aberto
  refund: "Garantia de 7 dias a partir da data da compra."   // confirme os passos do reembolso na plataforma
};

// Dados do responsável e documentos legais (use URLs ou arquivos reais).
const SELLER = { name: "", support: "", privacy: "", terms: "", refund: "" };

/* ==========================================================================
   CÓDIGO
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

/* ---- Meta Pixel (só carrega com PIXEL_ID; Purchase NÃO é disparado aqui) ---- */
function loadPixel(id) {
  if (!id || window.fbq) return;
  (function (f, b, e, v, n, t, s) {
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}
const track = (name) => { if (window.fbq) window.fbq('track', name); };

/* ---- Checkout: repassa só parâmetros de campanha, nunca respostas do quiz ---- */
const CAMPAIGN_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'src', 'sck'];

function buildCheckoutUrl() {
  const raw = String(CHECKOUT_URL || '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw, window.location.href);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const current = new URLSearchParams(window.location.search);
    CAMPAIGN_PARAMS.forEach((key) => {
      const value = current.get(key);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    return url.href;
  } catch (error) {
    return null;
  }
}

function setMessages(text) {
  $$('.cta-msg').forEach((node) => { node.textContent = text; });
}

function onCtaClick() {
  const url = buildCheckoutUrl();
  if (!url) {
    console.warn('[Vendas] CHECKOUT_URL vazio ou inválido. Configure no início do vendas.js.');
    setMessages('O link de compra ainda precisa ser configurado.');
    return;
  }
  setMessages('');
  track('InitiateCheckout');
  window.setTimeout(() => window.location.assign(url), window.fbq ? 150 : 0);
}

/* ---- Continuidade do quiz: usa só o que o quiz guardou nesta sessão ---- */
const QUIZ_NOTES = [
  'Você contou que a falta de tempo é o que mais atrapalha. Ter as refeições e a lista de compras já organizadas pode poupar decisões no dia a dia.',
  'Você contou que manter a constância é o seu maior desafio. Ter as refeições da semana planejadas pode facilitar manter o ritmo.',
  'Você contou que ainda não sabe por onde começar. Um planejamento de 7 dias oferece um ponto de partida claro.',
  'Você contou que tem sido difícil encontrar uma rotina adequada. Você pode adaptar as sugestões às suas preferências.'
];

function renderQuizNote() {
  const node = $('#quiz-note');
  try {
    const data = JSON.parse(sessionStorage.getItem('quizBemEstar7Dias:v1') || 'null');
    const value = data && data.answers && data.answers.difficulty;
    node.textContent = Number.isInteger(value) && QUIZ_NOTES[value] ? QUIZ_NOTES[value] : '';
  } catch (error) {
    node.textContent = '';
  }
}

/* ---- Seções que dependem de dados confirmados ---- */
// Modo de edição: mostra os espaços vazios só para quem está montando a página.
function isEditMode() {
  const host = window.location.hostname;
  return window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' ||
    new URLSearchParams(window.location.search).has('editar');
}

function renderProofs() {
  const edit = isEditMode();
  const slots = TESTIMONIALS.slice(0, 4);
  const filled = slots.filter((t) => t && t.src);
  if (!filled.length && !edit) return;

  const list = $('#provas-lista');
  slots.forEach((t, index) => {
    const figure = el('figure', 'proof');
    const frame = el('div', 'proof__frame');
    if (t && t.src) {
      const img = el('img');
      img.src = t.src; img.alt = t.alt || 'Relato de cliente'; img.loading = 'lazy';
      frame.appendChild(img);
    } else if (edit) {
      frame.classList.add('proof__frame--empty');
      frame.appendChild(el('span', '', 'Imagem ' + (index + 1) + '\n1080 × 1350 px (4:5)'));
    } else {
      return;
    }
    figure.appendChild(frame);
    if (t && t.caption && t.src) figure.appendChild(el('figcaption', '', t.caption));
    list.appendChild(figure);
  });

  if (edit && filled.length < slots.length) {
    const note = el('p', 'edit-note', 'Modo de edição: os espaços vazios não aparecem para os visitantes.');
    list.parentNode.insertBefore(note, list);
  }
  $('#provas').hidden = false;
}

function renderInfo() {
  const labels = { guarantee: 'Garantia', payment: 'Pagamento', delivery: 'Acesso e liberação', security: 'Segurança' };
  const rows = Object.keys(labels).filter((key) => INFO[key]);
  if (!rows.length) return;
  const list = $('#pagamento-lista');
  rows.forEach((key) => {
    const row = el('div');
    row.appendChild(el('dt', '', labels[key]));
    row.appendChild(el('dd', '', INFO[key]));
    list.appendChild(row);
  });
  $('#pagamento').hidden = false;
  if (INFO.delivery) $('#info-acesso').textContent = INFO.delivery;
  if (INFO.guarantee) $('#info-garantia').textContent = INFO.guarantee;
}

function renderPromo() {
  const end = Date.parse(PROMO.endsAt);
  if (!PROMO.regularPrice || !Number.isFinite(end) || end <= Date.now()) return;
  const boxes = $$('.promo');
  boxes.forEach((box) => {
    $('[data-regular]', box).textContent = PROMO.regularPrice;
    $('[data-end]', box).textContent = new Date(end).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    box.hidden = false;
  });
  let timerId = null;
  const tick = () => {
    const left = end - Date.now();
    if (left <= 0) { boxes.forEach((box) => { box.hidden = true; }); window.clearInterval(timerId); return; }
    const s = Math.floor(left / 1000);
    const days = Math.floor(s / 86400);
    const clock = [Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join(':');
    $$('[data-timer]').forEach((node) => { node.textContent = (days ? days + 'd ' : '') + clock; });
  };
  timerId = window.setInterval(tick, 1000);
  tick();
}

function renderPreviews() {
  const items = PREVIEWS.filter((p) => p && p.src);
  if (!items.length) return;
  const list = $('#previa-lista');
  items.forEach((p) => {
    const figure = el('figure');
    const img = el('img');
    img.src = p.src; img.alt = p.alt || 'Página do material'; img.loading = 'lazy';
    figure.appendChild(img);
    if (p.caption) figure.appendChild(el('figcaption', '', p.caption));
    list.appendChild(figure);
  });
  $('#previa').hidden = false;
}

function renderBumps() {
  const items = BUMPS.filter((b) => b && b.name && b.price);
  if (!items.length) return;
  const list = $('#bumps-lista');
  items.forEach((b) => {
    const item = el('li');
    item.appendChild(el('b', '', b.name));
    if (b.desc) { item.appendChild(el('br')); item.appendChild(el('span', '', b.desc)); }
    item.appendChild(el('strong', '', b.price));
    list.appendChild(item);
  });
  $('#bumps').hidden = false;
}

function renderFaq() {
  $$('[data-faq]').forEach((node) => {
    const answer = FAQ[node.dataset.faq];
    if (answer) $('p', node).textContent = answer; else node.remove();
  });
}

function renderFooter() {
  if (SELLER.name) $('#rodape-id').textContent = SELLER.name + (SELLER.support ? ' · ' + SELLER.support : '');
  const links = [['Política de privacidade', SELLER.privacy], ['Termos de uso', SELLER.terms], ['Política de reembolso', SELLER.refund]];
  links.forEach(([label, href]) => {
    if (!href) return;
    const a = el('a', '', label);
    a.href = href;
    $('#rodape-links').appendChild(a);
  });
}

/* ---- CTA fixo no celular e evento ViewContent ---- */
function watchSections() {
  if (!('IntersectionObserver' in window)) return;
  const sticky = $('#sticky');
  let heroVisible = true, offerVisible = false, viewed = false;
  const update = () => { sticky.hidden = heroVisible || offerVisible; };

  new IntersectionObserver((entries) => { heroVisible = entries[0].isIntersecting; update(); }).observe($('#hero-cta'));

  new IntersectionObserver((entries, observer) => {
    offerVisible = entries[0].isIntersecting;
    if (offerVisible && !viewed) { viewed = true; track('ViewContent'); }
    update();
  }, { threshold: 0.3 }).observe($('#oferta'));
}

function init() {
  loadPixel(PIXEL_ID);
  $$('[data-cta]').forEach((button) => button.addEventListener('click', onCtaClick));
  renderQuizNote();
  renderProofs();
  renderInfo();
  renderPromo();
  renderPreviews();
  renderBumps();
  renderFaq();
  renderFooter();
  watchSections();
}

try { init(); } catch (error) { console.error('[Vendas] Falha ao iniciar:', error); }