document.addEventListener('DOMContentLoaded', () => {
// ========== ВИЗУАЛИЗАЦИЯ CATMULL-ROM (левый верхний угол) ==========
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let W = 280, H = 280, cx = W/2, cy = H/2;

function resizeViz() {
  const isMobile = window.innerWidth < 480;
  const isTablet = window.innerWidth < 768;
  W = canvas.width = isMobile ? 180 : isTablet ? 220 : 280;
  H = canvas.height = W;
  cx = W/2; cy = H/2;
}
window.addEventListener('resize', resizeViz);
resizeViz();

const vizParams = {
  points: 4,
  radius: 0.23,
  speed: 0.9,  // ✅ По умолчанию 0.9
  amp: 1.7,
  ghosts: 0,
  dt: 1.0,
  color: '#ff8c32',
  glow: 80,
  parallax: 0
};

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', e => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

const waves = [
  { freq: 1.0, amp: 0.35, phase: 0 },
  { freq: 2.3, amp: 0.22, phase: Math.PI / 3 },
  { freq: 3.7, amp: 0.15, phase: Math.PI / 1.7 }
];

let pulses = [];
function regenPulses(n) {
  pulses = [];
  for (let i = 0; i < n; i++) {
    pulses.push({ freq: 0.8 + Math.random() * 1.8, phase: Math.random() * Math.PI * 2, amp: 0.04 + Math.random() * 0.08 });
  }
}
regenPulses(vizParams.points);

function computePoints(t, baseR) {
  const n = vizParams.points;
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    let r = baseR;
    for (const w of waves) {
      r += baseR * w.amp * vizParams.amp * Math.sin(angle * w.freq + t * 0.8 * vizParams.speed + w.phase);
      r += baseR * w.amp * 0.5 * vizParams.amp * Math.cos(angle * (w.freq + 1) - t * 0.6 * vizParams.speed + w.phase);
    }
    const p = pulses[i] || { freq: 1, phase: 0, amp: 0 };
    r *= 1 + p.amp * Math.sin(t * p.freq + p.phase);
    points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return points;
}

function drawCatmullRom(context, points, offsetX, offsetY, centerX, centerY) {
  const n = points.length;
  context.beginPath();
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
    const steps = 16;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      const px = centerX + x + offsetX, py = centerY + y + offsetY;
      if (i === 0 && s === 0) context.moveTo(px, py); else context.lineTo(px, py);
    }
  }
  context.closePath();
}

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return { r: parseInt(m.substring(0,2),16), g: parseInt(m.substring(2,4),16), b: parseInt(m.substring(4,6),16) };
}

function drawScene(t) {
  ctx.fillStyle = 'rgba(5,5,7,0.12)';
  ctx.fillRect(0, 0, W, H);
  const rgb = hexToRgb(vizParams.color), colorStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const parX = mouse.x * vizParams.parallax * 0.3, parY = mouse.y * vizParams.parallax * 0.3;
  
  for (let g = 0; g < vizParams.ghosts; g++) {
    const ratio = (g+1)/(vizParams.ghosts+1), dt = vizParams.dt * (vizParams.ghosts - g);
    const alpha = 0.03 + ratio * 0.12, width = 0.6 + ratio * 1;
    const pts = computePoints(t - dt, Math.min(W,H) * vizParams.radius);
    drawCatmullRom(ctx, pts, parX*0.5, parY*0.5, cx, cy);
    ctx.strokeStyle = `rgba(${colorStr}, ${alpha})`;
    ctx.lineWidth = width;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${colorStr}, ${alpha})`;
    ctx.stroke();
  }
  
  const mainPts = computePoints(t, Math.min(W,H) * vizParams.radius);
  drawCatmullRom(ctx, mainPts, parX, parY, cx, cy);
  ctx.shadowBlur = vizParams.glow * 0.4;
  ctx.shadowColor = `rgba(${colorStr}, 0.8)`;
  ctx.strokeStyle = `rgba(${colorStr}, 0.95)`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(${Math.min(255,rgb.r+60)}, ${Math.min(255,rgb.g+60)}, ${Math.min(255,rgb.b+70)}, 0.9)`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.fillStyle = `rgba(${colorStr}, 0.02)`;
  ctx.fill();
}

let startTime = performance.now();
function animateViz() {
  const t = (performance.now() - startTime) / 1000;
  mouse.x += (mouse.tx - mouse.x) * 0.03;
  mouse.y += (mouse.ty - mouse.y) * 0.03;
  drawScene(t);
  requestAnimationFrame(animateViz);
}
animateViz();

// Панель настроек визуализации
const vizToggle = document.getElementById('vizToggle');
const vizPanel = document.getElementById('vizPanel');
const vizClose = document.getElementById('vizClose');
vizToggle.onclick = () => { vizPanel.classList.toggle('hidden'); };
vizClose.onclick = () => { vizPanel.classList.add('hidden'); };

function bindViz(id, key, displayId, format) {
  const input = document.getElementById(id);
  const display = document.getElementById(displayId);
  input.addEventListener('input', () => {
    const v = input.type === 'range' ? parseFloat(input.value) : input.value;
    vizParams[key] = v;
    if (display) display.textContent = format ? format(v) : v;
    if (key === 'points') regenPulses(v);
  });
}
bindViz('vizSpeed', 'speed', 'vizSpeedVal', v => v.toFixed(1));
bindViz('vizAmp', 'amp', 'vizAmpVal', v => v.toFixed(1));
bindViz('vizGlow', 'glow', 'vizGlowVal');
document.getElementById('vizColor').addEventListener('input', e => { vizParams.color = e.target.value; });

// ========== НАВИГАЦИЯ ==========
window.switchTab = (id) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  const navBtn = document.querySelector(`.nav-link[data-tab="${id}"]`);
  if (navBtn) navBtn.classList.add('active');
  if (id === 'psychology') {
    document.getElementById('psychology').classList.add('active');
    createGeoFlowers();
  } else {
    document.getElementById('psychology').classList.remove('active');
  }
};
document.querySelectorAll('.nav-link').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// ========== ТЕМА ==========
const themeBtn = document.getElementById('theme-toggle');
let isLight = false;
themeBtn.onclick = () => {
  isLight = !isLight;
  document.body.classList.toggle('light-theme', isLight);
  themeBtn.textContent = isLight ? '🌙' : '🌓';
};

// ========== ТЕСТЫ ПО ИСТОРИИ ==========
const historyTests = {
  '5': {
    title: 'Древний мир',
    questions: [
      { q: 'Как называлось первое орудие труда, которое стали использовать древнейшие люди?', options: ['а) рубило','б) гарпун','в) лук','г) мотыга'], correct: 0 },
      { q: 'Около какого времени появились первые государства в долине Нила?', options: ['а) около 5 тыс. лет назад','б) около 3 тыс. лет до н.э.','в) около 1 тыс. лет до н.э.','г) в I в. н.э.'], correct: 1 },
      { q: 'Что обозначает термин «неолит»?', options: ['а) новый каменный век','б) древний каменный век','в) средний каменный век','г) бронзовый век'], correct: 0 },
      { q: 'Письменность древних египтян называлась:', options: ['а) клинопись','б) иероглифы','в) буквенное письмо','г) узелковое письмо'], correct: 1 },
      { q: 'Кто в Древнем Египте считался «живым богом»?', options: ['а) жрец','б) фараон','в) верховный судья','г) военачальник'], correct: 1 },
      { q: 'Где была изобретена первая в мире письменность – клинопись?', options: ['а) в Египте','б) в Индии','в) в Междуречье (Двуречье)','г) в Китае'], correct: 2 },
      { q: 'Какая форма правления сложилась в Афинах в V в. до н.э.?', options: ['а) тирания','б) олигархия','в) демократия','г) монархия'], correct: 2 },
      { q: 'В каком году, согласно легенде, был основан Рим?', options: ['а) 753 г. до н.э.','б) 509 г. до н.э.','в) 395 г. до н.э.','г) 27 г. до н.э.'], correct: 0 },
      { q: 'Кто из перечисленных был великим завоевателем, создавшим огромную державу от Греции до Индии?', options: ['а) Ганнибал','б) Юлий Цезарь','в) Александр Македонский','г) Кир Великий'], correct: 2 },
      { q: 'Что такое «республика» в Древнем Риме?', options: ['а) власть одного правителя','б) власть знатного рода','в) власть народа, выбиравшего должностных лиц','г) власть жрецов'], correct: 2 }
    ]
  },
  '6': {
    title: 'История России (IX–XVI вв.)',
    questions: [
      { q: 'В каком году произошло Крещение Руси (по летописной дате)?', options: ['а) 862 г.','б) 882 г.','в) 988 г.','г) 1054 г.'], correct: 2 },
      { q: 'Как назывался объезд князем подвластных земель для сбора дани в Древней Руси?', options: ['а) выход','б) полюдье','в) кормление','г) тягло'], correct: 1 },
      { q: 'Кто был автором «Повести временных лет»?', options: ['а) митрополит Иларион','б) Нестор','в) Владимир Мономах','г) Никон'], correct: 1 },
      { q: 'Какое событие произошло в 1223 году?', options: ['а) Невская битва','б) битва на Калке','в) Ледовое побоище','г) Куликовская битва'], correct: 1 },
      { q: 'Термин «вече» в Древней Руси означал:', options: ['а) совет знати','б) народное собрание','в) княжеский суд','г) церковный собор'], correct: 1 },
      { q: 'Кто из русских князей разгромил монголов на Куликовом поле в 1380 году?', options: ['а) Иван Калита','б) Дмитрий Донской','в) Василий Тёмный','г) Иван III'], correct: 1 },
      { q: 'Как называлась система содержания должностных лиц за счёт местного населения в XV–XVI вв.?', options: ['а) кормление','б) поместье','в) вотчина','г) опричнина'], correct: 0 },
      { q: 'В каком году состоялось «стояние на реке Угре», окончательно свергнувшее ордынское иго?', options: ['а) 1380 г.','б) 1462 г.','в) 1480 г.','г) 1505 г.'], correct: 2 },
      { q: 'Что такое «поместье» в Московском государстве?', options: ['а) земельное владение, передаваемое по наследству','б) земля, даваемая за службу и не передаваемая по наследству','в) монастырская земля','г) земля, купленная у татар'], correct: 1 },
      { q: 'Кто первым принял титул «государь всея Руси»?', options: ['а) Василий II','б) Иван III','в) Василий III','г) Иван IV'], correct: 1 }
    ]
  },
  '7': {
    title: 'История России (XVII век)',
    questions: [
      { q: 'В каком году на русский престол был избран Михаил Романов?', options: ['а) 1598 г.','б) 1605 г.','в) 1613 г.','г) 1645 г.'], correct: 2 },
      { q: 'Что такое «Смутное время»?', options: ['а) период дворцовых переворотов','б) кризис государственности в начале XVII в.','в) восстание крестьян','г) война с Речью Посполитой'], correct: 1 },
      { q: 'В каком году было принято Соборное уложение, окончательно закрепившее крепостное право?', options: ['а) 1607 г.','б) 1649 г.','в) 1667 г.','г) 1682 г.'], correct: 1 },
      { q: 'Кто возглавил церковный раскол в середине XVII века?', options: ['а) патриарх Никон и протопоп Аввакум','б) митрополит Филипп','в) Сергий Радонежский','г) Геннадий Новгородский'], correct: 0 },
      { q: 'Что обозначает термин «старообрядцы»?', options: ['а) сторонники старых церковных обрядов после реформы Никона','б) участники восстания Степана Разина','в) купцы, торговавшие с Востоком','г) служилые люди по прибору'], correct: 0 },
      { q: 'В каком году произошло восстание под предводительством Степана Разина?', options: ['а) 1648 г.','б) 1662 г.','в) 1670–1671 гг.','г) 1682 г.'], correct: 2 },
      { q: 'Что такое «ясачный сбор» в Сибири XVII в.?', options: ['а) налог с земель','б) пошлина с торговли','в) дань мехами с коренных народов','г) военный налог'], correct: 2 },
      { q: 'Кто был воспитателем и фактическим правителем России при малолетних Иване и Петре в 1680-х гг.?', options: ['а) Борис Годунов','б) Василий Голицын','в) Софья Алексеевна','г) Фёдор Алексеевич'], correct: 2 },
      { q: 'В каком году была отменена система местничества?', options: ['а) 1649 г.','б) 1676 г.','в) 1682 г.','г) 1689 г.'], correct: 2 },
      { q: 'Как назывались регулярные пехотные полки, созданные в XVII в. по западноевропейскому образцу?', options: ['а) стрелецкие полки','б) полки нового строя','в) городовые казаки','г) опричники'], correct: 1 }
    ]
  },
  '8': {
    title: 'История России (XVIII век)',
    questions: [
      { q: 'В каком году началась Северная война?', options: ['а) 1696 г.','б) 1700 г.','в) 1709 г.','г) 1721 г.'], correct: 1 },
      { q: 'Какой орган власти был создан Петром I вместо Боярской думы?', options: ['а) Сенат','б) Верховный тайный совет','в) Государственный совет','г) Кабинет министров'], correct: 0 },
      { q: 'Что такое «ревизия» при Петре I?', options: ['а) проверка войск','б) перепись податного населения','в) судебное следствие','г) таможенный досмотр'], correct: 1 },
      { q: 'В каком году Россия была провозглашена империей?', options: ['а) 1709 г.','б) 1721 г.','в) 1725 г.','г) 1762 г.'], correct: 1 },
      { q: 'Эпоха дворцовых переворотов в России длилась:', options: ['а) 1700–1725 гг.','б) 1725–1762 гг.','в) 1730–1740 гг.','г) 1762–1796 гг.'], correct: 1 },
      { q: 'Что такое «просвещённый абсолютизм»?', options: ['а) политика, направленная на полное освобождение крестьян','б) политика Екатерины II, сочетавшая самодержавие и заботу о благе подданных с опорой на идеи Просвещения','в) система правления, где монарх зависит от дворянства','г) форма парламентской монархии'], correct: 1 },
      { q: 'В каком году произошло восстание Пугачёва?', options: ['а) 1762–1764 гг.','б) 1773–1775 гг.','в) 1785–1787 гг.','г) 1790–1792 гг.'], correct: 1 },
      { q: 'Какой документ даровал дворянству освобождение от обязательной службы при Екатерине II?', options: ['а) Указ о единонаследии','б) Жалованная грамота дворянству (1785 г.)','в) Табель о рангах','г) Манифест о вольности дворянской (1762 г.)'], correct: 3 },
      { q: 'В каком году был принят Указ о вольности дворянской (отмена обязательной службы для дворян)?', options: ['а) 1736 г.','б) 1762 г.','в) 1775 г.','г) 1785 г.'], correct: 1 },
      { type: 'match', q: 'Установите соответствие между датой и событием:', pairs: [
        { left: '1703 г.', right: 'Полтавская битва', correct: false },
        { left: '1709 г.', right: 'основание Санкт-Петербурга', correct: false },
        { left: '1721 г.', right: 'начало царствования Екатерины II', correct: false },
        { left: '1762 г.', right: 'провозглашение России империей', correct: false }
      ], correctPairs: { '1703 г.': 'основание Санкт-Петербурга', '1709 г.': 'Полтавская битва', '1721 г.': 'провозглашение России империей', '1762 г.': 'начало царствования Екатерины II' } }
    ]
  },
  '9': {
    title: 'История России (XIX – начало XX в.)',
    questions: [
      { q: 'В каком году был убит император Павел I и на престол вступил Александр I?', options: ['а) 1796 г.','б) 1801 г.','в) 1812 г.','г) 1825 г.'], correct: 1 },
      { q: 'Какое событие произошло 14 декабря 1825 года?', options: ['а) восстание декабристов на Сенатской площади','б) начало Крымской войны','в) отмена крепостного права','г) убийство Александра II'], correct: 0 },
      { q: 'Термин «западники» в общественной мысли XIX в. означал:', options: ['а) сторонников самобытного пути России','б) сторонников развития России по западноевропейскому образцу','в) членов тайных обществ','г) чиновников, работавших в западных губерниях'], correct: 1 },
      { q: 'В каком году была проведена крестьянская реформа, отменившая крепостное право?', options: ['а) 1855 г.','б) 1861 г.','в) 1864 г.','г) 1874 г.'], correct: 1 },
      { q: 'Что такое «отрезки» после реформы 1861 года?', options: ['а) земельные участки, переданные крестьянам бесплатно','б) часть крестьянских наделов, отрезанная в пользу помещика из-за нехватки земли','в) участки, выделенные для общественных нужд','г) земли, переданные в аренду'], correct: 1 },
      { q: 'В каком году была принята Конституция Российской империи (по сути – Манифест 17 октября)?', options: ['а) 1881 г.','б) 1905 г.','в) 1906 г.','г) 1914 г.'], correct: 1 },
      { q: 'Кто был автором теории «официальной народности» (православие, самодержавие, народность)?', options: ['а) Н.М. Карамзин','б) С.С. Уваров','в) М.Н. Погодин','г) К.П. Победоносцев'], correct: 1 },
      { q: 'Какая война шла с 1904 по 1905 год?', options: ['а) Крымская','б) Русско-турецкая (1877–1878)','в) Русско-японская','г) Первая мировая'], correct: 2 },
      { q: 'В каком году началась Первая мировая война?', options: ['а) 1912 г.','б) 1914 г.','в) 1915 г.','г) 1917 г.'], correct: 1 },
      { type: 'fill', q: 'Заполните пропуски в таблице:', blanks: [
        { label: '1803 г. • Указ о «вольных хлебопашцах» • Правитель:', answer: 'Александр I' },
        { label: '1864 г. • ______________ (судебная реформа) • Правитель: Александр II', answer: 'Судебная реформа' },
        { label: '1897 г. • Денежная реформа • Министр:', answer: 'Витте' },
        { label: '1906 г. • Манифест 17 октября • Император:', answer: 'Николай II' }
      ] }
    ]
  }
};

// Состояние теста
let selectedGrade = null, userFIO = '', userEmail = '';
let currentTest = null, qIdx = 0, score = 0, userAnswers = [], answered = false;

// Фразы Шалфея для поддержки
const sagePhrases = [
  '💬 Ты молодец! Продолжай в том же духе!',
  '💬 Отлично справляешься! Ещё немного!',
  '💬 Я горжусь твоими успехами! Вперёд!'
];

// Выбор класса
document.querySelectorAll('.grade-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedGrade = btn.dataset.grade;
    
    // Показать модальное окно ФИО
    document.getElementById('fio-modal').classList.remove('hidden');
    document.getElementById('fio-input').focus();
  });
});

// Модальное окно
const fioModal = document.getElementById('fio-modal');
document.getElementById('cancel-test-btn').onclick = () => {
  fioModal.classList.add('hidden');
  selectedGrade = null;
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
};

document.getElementById('start-test-btn').onclick = () => {
  const fio = document.getElementById('fio-input').value.trim();
  if (!fio) return alert('Введите ФИО!');
  userFIO = fio;
  userEmail = document.getElementById('email-input').value.trim();
  fioModal.classList.add('hidden');
  startHistoryTest();
};

function startHistoryTest() {
  currentTest = historyTests[selectedGrade];
  qIdx = 0; score = 0; userAnswers = []; answered = false;
  
  document.getElementById('grade-select-view').classList.add('hidden');
  document.getElementById('history-quiz').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.remove('hidden');
  document.getElementById('quiz-grade').textContent = `${selectedGrade} класс • ${currentTest.title}`;
  
  showHistoryQuestion();
}

function showHistoryQuestion() {
  const q = currentTest.questions[qIdx];
  const content = document.getElementById('quiz-content');
  const actions = document.getElementById('quiz-actions');
  
  // Обновить прогресс
  document.getElementById('q-num').textContent = qIdx + 1;
  document.getElementById('q-total').textContent = currentTest.questions.length;
  document.getElementById('progress-fill').style.width = `${(qIdx/currentTest.questions.length)*100}%`;
  
  // Показать фразу Шалфея случайным образом (~3 раза за тест)
  if (qIdx > 0 && qIdx % 3 === 0 && qIdx < currentTest.questions.length - 1) {
    const phrase = sagePhrases[Math.floor(Math.random() * sagePhrases.length)];
    document.getElementById('sage-text').textContent = phrase;
    document.getElementById('sage-tip').style.animation = 'none';
    setTimeout(() => { document.getElementById('sage-tip').style.animation = ''; }, 10);
  }
  
  if (q.type === 'match') {
    // Интерактивная таблица: перетаскивание/выбор пар
    content.innerHTML = `
      <p class="question-text">${q.q}</p>
      <div class="match-table">
        <div class="match-col" id="match-left"></div>
        <div class="match-col" id="match-right"></div>
      </div>
      <p style="text-align:center;margin-top:16px;font-size:0.9rem;color:var(--text-muted)">Нажмите на элемент слева, затем на соответствующий справа</p>
    `;
    
    const leftCol = document.getElementById('match-left');
    const rightCol = document.getElementById('match-right');
    let selectedLeft = null;
    
    q.pairs.forEach((pair, i) => {
      const left = document.createElement('div');
      left.className = 'match-item';
      left.textContent = pair.left;
      left.dataset.key = pair.left;
      left.onclick = () => {
        if (selectedLeft) selectedLeft.classList.remove('selected');
        selectedLeft = left;
        left.classList.add('selected');
      };
      leftCol.appendChild(left);
      
      const right = document.createElement('div');
      right.className = 'match-item';
      right.textContent = pair.right;
      right.dataset.value = pair.right;
      right.onclick = () => {
        if (selectedLeft) {
          // Сохранить ответ
          userAnswers.push({ type: 'match', left: selectedLeft.dataset.key, right: right.dataset.value });
          // Визуально отметить
          selectedLeft.classList.remove('selected');
          selectedLeft.classList.add('matched');
          right.classList.add('matched');
          selectedLeft = null;
          // Блокировать клики
          left.onclick = null; right.onclick = null;
        }
      };
      rightCol.appendChild(right);
    });
    
    actions.innerHTML = `<button class="btn-next" id="next-btn">Далее</button>`;
    document.getElementById('next-btn').onclick = () => {
      // Проверка ответов для match
      const allMatched = q.pairs.every(p => {
        const ans = userAnswers.find(a => a.left === p.left);
        return ans && ans.right === q.correctPairs[p.left];
      });
      if (allMatched) score++;
      nextQuestion();
    };
    
  } else if (q.type === 'fill') {
    // Заполнение пропусков
    content.innerHTML = `
      <p class="question-text">${q.q}</p>
      <div class="fill-blanks" id="fill-container"></div>
    `;
    const container = document.getElementById('fill-container');
    q.blanks.forEach((blank, i) => {
      const row = document.createElement('div');
      row.className = 'fill-row';
      row.innerHTML = `<label>${blank.label}</label><input type="text" data-idx="${i}" placeholder="Ваш ответ">`;
      container.appendChild(row);
    });
    
    actions.innerHTML = `<button class="btn-next" id="next-btn">Проверить</button>`;
    document.getElementById('next-btn').onclick = () => {
      let correct = 0;
      q.blanks.forEach((blank, i) => {
        const input = container.querySelector(`input[data-idx="${i}"]`);
        const val = input.value.trim().toLowerCase();
        const expected = blank.answer.toLowerCase();
        if (val === expected) correct++;
        userAnswers.push({ type: 'fill', label: blank.label, user: val, correct: blank.answer, isCorrect: val === expected });
      });
      if (correct === q.blanks.length) score++;
      nextQuestion();
    };
    
  } else {
    // Обычный вопрос с вариантами
    content.innerHTML = `<p class="question-text">${q.q}</p><div id="opts"></div>`;
    const opts = document.getElementById('opts');
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-option';
      btn.textContent = opt;
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        userAnswers.push({ q: q.q, user: opt, correct: q.options[q.correct], isCorrect: i === q.correct });
        // Подсветка
        document.querySelectorAll('.answer-option').forEach((el, idx) => {
          el.style.pointerEvents = 'none';
          if (idx === q.correct) el.classList.add('correct');
          else if (idx === i) el.classList.add('wrong');
        });
        if (i === q.correct) score++;
        setTimeout(nextQuestion, 1000);
      };
      opts.appendChild(btn);
    });
  }
}

function nextQuestion() {
  qIdx++;
  answered = false;
  if (qIdx < currentTest.questions.length) {
    showHistoryQuestion();
  } else {
    finishHistoryTest();
  }
}

async function finishHistoryTest() {
  const pct = Math.round((score / currentTest.questions.length) * 100);
  
  // Детальный разбор
  let details = '';
  currentTest.questions.forEach((q, i) => {
    const ans = userAnswers[i];
    if (q.type === 'match') {
      const allCorrect = q.pairs.every(p => ans.find(a => a.left === p.left)?.right === q.correctPairs[p.left]);
      details += `<div class="result-item ${allCorrect?'correct':'wrong'}"><h4>📋 Задание на соответствие</h4><p>${allCorrect?'✅ Все пары верны':'❌ Есть ошибки'}</p></div>`;
    } else if (q.type === 'fill') {
      const correctCount = ans.filter(a => a.isCorrect).length;
      details += `<div class="result-item ${correctCount===q.blanks.length?'correct':'wrong'}"><h4>📝 Заполнение пропусков</h4><p>Правильно: ${correctCount} из ${q.blanks.length}</p></div>`;
    } else {
      details += `<div class="result-item ${ans.isCorrect?'correct':'wrong'}"><h4>В${i+1}. ${q.q}</h4><p>Ваш ответ: <strong>${ans.user}</strong><br>${!ans.isCorrect?`✅ Правильно: <strong>${ans.correct}</strong>`:''}</p></div>`;
    }
  });
  
  document.getElementById('history-quiz').classList.add('hidden');
  document.getElementById('history-results').classList.remove('hidden');
  document.getElementById('result-summary').textContent = `${userFIO}, ваш результат: ${score} из ${currentTest.questions.length} (${pct}%)`;
  document.getElementById('result-details').innerHTML = details;
  
  // Отправка на почту И на Сайт 2
  const statusEl = document.getElementById('h-mail-status');
  statusEl.textContent = '📤 Отправка на почту и Сайт 2...';
  
  try {
    // 1. На почту
    await fetch('https://formsubmit.co/ajax/aniruf14.02@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `📜 Тест "${currentTest.title}" — ${userFIO}`,
        ФИО: userFIO,
        Email: userEmail || 'Не указан',
        Класс: `${selectedGrade}`,
        Тест: currentTest.title,
        Результат: `${score}/${currentTest.questions.length} (${pct}%)`,
        Дата: new Date().toLocaleString('ru-RU'),
        _captcha: 'false'
      })
    });
    
    // 2. На Сайт 2 (Google Sheets webhook)
    await fetch('https://script.google.com/macros/s/AKfycbwmbw_-MYraqUsSp452jWfdf1tPOX7TNrGR_Gm8JcBO_DGzODjv35ybwq9nIGDqK4TWDw/exec?key=fox_secret_2026', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        key: 'fox_secret_2026',
        test_id: `history_grade_${selectedGrade}`,
        test_title: currentTest.title,
        fio: userFIO,
        email: userEmail || '',
        score,
        total: currentTest.questions.length,
        pct,
        answers: userAnswers,
        submitted_at: new Date().toISOString()
      })
    });
    
    statusEl.textContent = '✅ Отправлено на почту и Сайт 2!';
  } catch (e) {
    console.error(e);
    statusEl.textContent = '⚠️ Ошибка сети (результат показан выше)';
  }
}

window.exitHistoryTest = () => {
  document.getElementById('history-quiz').classList.add('hidden');
  document.getElementById('history-results').classList.add('hidden');
  document.getElementById('grade-select-view').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.add('hidden');
  selectedGrade = null;
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
};

// ========== ПСИХОЛОГИЯ С АСЕЙ (без изменений) ==========
const kosQuestions = [
{q:"Много ли у Вас друзей?"},{q:"Часто ли удается склонить товарищей?"},{q:"Долго ли беспокоит обида?"},{q:"Трудно ли ориентироваться в критической ситуации?"},{q:"Стремитесь ли к новым знакомствам?"},
{q:"Нравится ли общественная работа?"},{q:"Приятнее ли проводить время с книгами?"},{q:"Легко ли отступаете от намерений?"},{q:"Легко ли устанавливаете контакты со старшими?"},{q:"Любите ли организовывать игры?"},
{q:"Трудно ли включать в новую компанию?"},{q:"Откладываете ли дела?"},{q:"Легко ли контактировать с незнакомыми?"},{q:"Стремитесь ли, чтобы товарищи действовали по Вашему мнению?"},{q:"Трудно ли осваиваться в новом коллективе?"},
{q:"Нет ли конфликтов из-за невыполнения обязанностей?"},{q:"Стремитесь ли знакомиться?"},{q:"Принимаете ли инициативу?"},{q:"Раздражают ли окружающие?"},{q:"Плохо ли ориентируетесь в незнакомой обстановке?"},
{q:"Нравится ли быть среди людей?"},{q:"Раздражение из-за незавершенного дела?"},{q:"Стеснение при знакомстве?"},{q:"Утомление от общения?"},{q:"Любите ли коллективные игры?"},
{q:"Проявляете ли инициативу в интересах товарищей?"},{q:"Неуверенность среди малознакомых?"},{q:"Редко отстаиваете правоту?"},{q:"Вносите ли оживление в компанию?"},{q:"Участие в общественной работе?"},
{q:"Ограничиваете ли круг знакомых?"},{q:"Не отстаиваете ли мнение?"},{q:"Непринужденность в незнакомой компании?"},{q:"Охотно организуете мероприятия?"},{q:"Неуверенность перед группой?"},
{q:"Опаздываете ли?"},{q:"Много ли друзей?"},{q:"Смущение при общении?"},{q:"Пугает ли новый коллектив?"},{q:"Неуверенность в большой группе?"}
];
const commYes=[1,5,9,13,17,21,25,29,33,37], commNo=[3,7,11,15,19,23,27,31,35,39];
const orgYes=[2,6,10,14,18,22,26,30,34,38], orgNo=[4,8,12,16,20,24,28,32,36,40];
const michelsonQuestions = [
{q:'Кто-либо говорит Вам: "Мне кажется, что Вы замечательный человек". Вы обычно:', opts:['"Нет, что Вы! Я таким не являюсь"','"Спасибо, я действительно человек выдающийся"','"Спасибо"','Ничего не говорите и краснеете','"Да, я отличаюсь от других в лучшую сторону"']},
{q:'Кто-либо совершает замечательный поступок. Вы обычно:', opts:['"Нормально!"','"Отлично, но я видел получше"','Ничего не говорите','"Я могу сделать гораздо лучше"','"Это действительно замечательно!"']},
{q:'Вы делаете дело хорошо, кто-то говорит: "Мне это не нравится!". Вы:', opts:['"Вы - болван!"','"Я думаю, это заслуживает хорошей оценки"','"Вы правы" (не согласны)','"Это выдающийся уровень. Что Вы понимаете?"','Обижаетесь и молчите']},
{q:'Вы забыли предмет, кто-то говорит: "Вы такой растяпа!". Вы:', opts:['"Я толковее Вас!"','"Да, иногда я веду себя как растяпа"','"Если кто растяпа, то Вы"','"У всех есть недостатки. Я не заслуживаю такой оценки"','Игнорируете']},
{q:'Кто-то опоздал на 30 минут без объяснений. Вы:', opts:['"Я расстроен, что заставили ждать"','"Я думал, когда Вы придёте"','"Это последний раз, когда я ждал Вас"','Ничего не говорите','"Как Вы смели так опаздывать!"']},
{q:'Вам нужно, чтобы кто-то сделал для Вас вещь. Вы:', opts:['Никого ни о чём не просите','"Вы должны сделать это для меня"','"Не могли бы Вы сделать одну вещь?" + объясняете','Слегка намекаете','"Я очень хочу, чтобы Вы сделали это"']},
{q:'Вы знаете, что кто-то расстроен. Вы:', opts:['"Вы выглядите расстроенным. Могу помочь?"','Не заводите разговор о состоянии','"У Вас неприятность?"','Ничего не говорите и оставляете одного','"Вы как большой ребенок!" (смеясь)']},
{q:'Вы расстроены, кто-то говорит: "Вы выглядите расстроенным". Вы:', opts:['Отрицательно качаете головой/не реагируете','"Это не Ваше дело!"','"Да, немного расстроен. Спасибо за участие"','"Пустяки"','"Оставьте меня одного"']},
{q:'Вас порицают за ошибку, совершённую другими. Вы:', opts:['"Вы с ума сошли!"','"Это не моя вина, ошибка другого"','"Я не думаю, что это моя вина"','"Оставьте меня, Вы не знаете, что говорите"','Принимаете вину или молчите']},
{q:'Кто-то просит сделать что-то, но Вы не знаете зачем. Вы:', opts:['"Это не имеет смысла, не хочу"','Выполняете и молчите','"Это глупость, не буду"','"Объясните, почему это должно быть сделано"','"Если Вы хотите..." + выполняете']},
{q:'Кто-то говорит, что Вы сделали великолепно. Вы:', opts:['"Да, я делаю лучше большинства"','"Нет, это не было столь здорово"','"Правильно, я делаю лучше всех"','"Спасибо"','Игнорируете']},
{q:'Кто-то был очень любезен с Вами. Вы:', opts:['"Вы действительно были очень любезны"','"Да, спасибо" (как будто не был любезен)','"Вы вели себя нормально, но я заслуживаю большего"','Игнорируете','"Вы вели себя недостаточно хорошо"']},
{q:'Вы громко разговариваете, кто-то просит говорить тише. Вы:', opts:['Немедленно прекращаете беседу','"Если не нравится — проваливайте"','"Извините, буду говорить тише" + продолжаете приглушённо','"Извините" + прекращаете','"Всё в порядке" + продолжаете громко']},
{q:'В очереди кто-то становится впереди Вас. Вы:', opts:['Негромко комментируете, ни к кому не обращаясь','"Становитесь в хвост очереди!"','Ничего не говорите','"Выйди из очереди, нахал!" (громко)','"Я занял очередь раньше. Пожалуйста, станьте в конец"']},
{q:'Кто-то делает то, что Вам не нравится и раздражает. Вы:', opts:['"Вы болван, я ненавижу Вас!" (выкрик)','"Я сердит на Вас. Мне не нравится, что Вы делаете"','Повреждаете делу, но молчите','"Я рассержен. Вы мне не нравитесь"','Игнорируете']},
{q:'У кого-то есть вещь, которой Вы хотели бы пользоваться. Вы:', opts:['Требуете дать вещь','Воздерживаетесь от просьб','Отбираете вещь','Говорите, что хотели бы пользоваться, и просите','Рассуждаете, но не просите']},
{q:'Кто-то просит одолжить новый предмет, но Вы не хотите. Вы:', opts:['"Нет, только достал, не хочу расставаться; может потом"','"Не хотел бы давать, но можете попользоваться"','"Нет, приобретайте свой!"','Одалживаете вопреки нежеланию','"Вы с ума сошли!"']},
{q:'Люди беседуют о хобби, которое нравится Вам, Вы хотите присоединиться. Вы:', opts:['Ничего не говорите','Прерываете и рассказываете о своих успехах','Подходите и при удобном случае вступаете в разговор','Подходите и ждёте, когда обратят внимание','Прерываете и говорите, как сильно нравится хобби']},
{q:'Вы занимаетесь хобби, кто-то спрашивает: "Что Вы делаете?". Вы:', opts:['"О, это пустяк" / "Ничего особенного"','"Не мешайте, разве не видите, что занят?"','Продолжаете молча работать','"Это Вас не касается"','Прекращаете и объясняете, что делаете']},
{q:'Вы видите споткнувшегося человека. Вы:', opts:['"Почему не смотрите под ноги?" (смеясь)','"У Вас всё в порядке? Могу помочь?"','"Что случилось?"','"Это всё колдобины в тротуаре"','Никак не реагируете']},
{q:'Вы ушиблись, кто-то спрашивает: "С Вами всё в порядке?". Вы:', opts:['"Я прекрасно себя чувствую. Оставьте меня!"','Ничего не говорите, игнорируете','"Почему не занимаетесь своим делом?"','"Нет, ушиб голову, спасибо за внимание"','"Пустяки, всё будет о\'кей"']},
{q:'Вы допустили ошибку, но вина возложена на другого. Вы:', opts:['Ничего не говорите','"Это их ошибка!"','"Эту ошибку допустил Я"','"Я не думаю, что это сделал этот человек"','"Это их горькая доля"']},
{q:'Вы оскорблены словами в Ваш адрес. Вы:', opts:['Уходите, не сказав, что расстроены','Заявляйте, чтобы не смел больше','Ничего не говорите, хотя обижены','Оскорбляете в ответ','Заявляйте, что не нравится, и что не должен делать снова']},
{q:'Кто-то часто перебивает, когда Вы говорите. Вы:', opts:['"Извините, но я хотел бы закончить"','"Так не делают. Могу продолжить?"','Прерываете этого человека, возобновляя рассказ','Ничего не говорите, позволяя продолжать','"Замолчите! Вы меня перебили!"']},
{q:'Кто-то просит сделать что-то, что помешает Вашим планам. Вы:', opts:['"Имел другие планы, но сделаю, что хотите"','"Ни в коем случае! Поищите кого-то ещё"','"Хорошо, сделаю, что хотите"','"Отойдите, оставьте меня"','"Уже приступил к другим планам. Может, потом"']},
{q:'Вы видите кого-то, с кем хотели бы познакомиться. Вы:', opts:['Радостно окликаете и идёте навстречу','Подходите, представляетесь и начинаете разговор','Подходите и ждёте, когда заговорят с Вами','Подходите и рассказываете о крупных делах','Ничего не говорите']},
{q:'Незнакомец окликает Вас: "Привет!". Вы:', opts:['"Что Вам угодно?"','Ничего не говорите','"Оставьте меня в покое"','"Привет!", представляетесь и просите представиться','Киваете, "Привет!" и проходите мимо']}
];
const michelsonKey = [2,4,1,3,0,2,0,2,2,3,3,0,2,4,1,3,0,2,4,1,3,2,4,0,4,1,3];
const michelsonBlocks = {
'🎁 Комплименты': [1,2,11,12], '🗣️ Справедливая критика': [4,13], '⚠️ Несправедливая критика': [3,9],
'🔥 Провокация': [5,14,15,23,24], '🙏 Просьба': [6,16], '❌ Отказ': [10,17,25],
'💙 Эмпатия (оказать)': [7,20], '🤲 Эмпатия (принять)': [8,21], '🤝 Инициатива': [18,26], '👋 Ответ на контакт': [19,27]
};

let psychIndex = 0, psychAnswers = [], michelsonScores = {}, psychTestType = null;

window.openFioModal = (id) => {
  psychTestType = id;
  document.getElementById('fio-modal').classList.remove('hidden');
  document.getElementById('fio-input').value = '';
  document.getElementById('email-input').value = '';
  document.getElementById('fio-input').focus();
};

document.getElementById('start-test-btn').onclick = () => {
  const fio = document.getElementById('fio-input').value.trim();
  if (!fio) return alert('Введите ФИО!');
  if (selectedGrade) {
    userFIO = fio; userEmail = document.getElementById('email-input').value.trim();
    document.getElementById('fio-modal').classList.add('hidden');
    startHistoryTest();
  } else {
    userFIO = fio; userEmail = document.getElementById('email-input').value.trim();
    document.getElementById('fio-modal').classList.add('hidden');
    startPsychTest(psychTestType);
  }
};

function startPsychTest(id) {
  currentTest = id === 'kos' ? { questions: kosQuestions, type: 'kos' } : { questions: michelsonQuestions, type: 'michelson' };
  psychIndex = 0; psychAnswers = []; michelsonScores = {};
  
  document.getElementById('psych-menu-view').classList.add('hidden');
  document.getElementById('psych-back-btn').classList.add('hidden');
  document.getElementById('psych-quiz').classList.remove('hidden');
  document.getElementById('psych-quiz').innerHTML = '';
  document.getElementById('psych-results').classList.add('hidden');
  document.getElementById('psych-results').innerHTML = '';
  
  showPsychQuestion();
}

function showPsychQuestion() {
  const q = currentTest.questions[psychIndex];
  document.getElementById('psych-quiz').innerHTML = `
    <div class="progress-bar"><div class="progress-fill" style="width:${(psychIndex/currentTest.questions.length)*100}%"></div></div>
    <div class="question-box">
      <p>${q.q}</p>
      <div id="p-opts"></div>
    </div>`;
  
  const opts = document.getElementById('p-opts');
  if (currentTest.type === 'kos') {
    ['Да', 'Нет'].forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'btn-answer';
      btn.textContent = a;
      btn.onclick = () => answerPsych(a === 'Да' ? 'yes' : 'no');
      opts.appendChild(btn);
    });
  } else {
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn-answer';
      btn.textContent = `${String.fromCharCode(1072 + i)}) ${opt}`;
      btn.onclick = () => answerPsych(i);
      opts.appendChild(btn);
    });
  }
  
  const progress = (psychIndex + 1) / currentTest.questions.length;
  if (progress >= 0.32 && progress < 0.35) {
    document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">🌸 Треть пройдена!</div>`);
  } else if (progress >= 0.64 && progress < 0.67) {
    document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">✨ Две трети позади!</div>`);
  }
}

function answerPsych(ans) {
  psychAnswers.push(ans);
  psychIndex++;
  if (psychIndex < currentTest.questions.length) showPsychQuestion();
  else calculatePsychResults();
}

function calculatePsychResults() {
  let html = '', text = '';
  if (currentTest.type === 'kos') {
    let c = 0, o = 0;
    psychAnswers.forEach((a, i) => {
      const n = i + 1;
      if (commYes.includes(n) && a === 'yes') c++;
      if (commNo.includes(n) && a === 'no') c++;
      if (orgYes.includes(n) && a === 'yes') o++;
      if (orgNo.includes(n) && a === 'no') o++;
    });
    html = `<div class="result-item"><h4>🗣️ Коммуникативные</h4><p>Баллы: ${c}/20 | Коэф: ${(c/20).toFixed(2)}</p></div><div class="result-item"><h4>📋 Организаторские</h4><p>Баллы: ${o}/20 | Коэф: ${(o/20).toFixed(2)}</p></div>`;
    text = `КОС:\nКоммуникативные: ${c}/20\nОрганизаторские: ${o}/20`;
  } else {
    let total = 0;
    Object.keys(michelsonBlocks).forEach(blockName => {
      let s = 0;
      michelsonBlocks[blockName].forEach(qNum => { if (psychAnswers[qNum-1] === michelsonKey[qNum-1]) s++; });
      michelsonScores[blockName] = s; total += s;
      html += `<div class="result-item"><h4>${blockName}</h4><p>${s} из ${michelsonBlocks[blockName].length} компетентных ответов</p></div>`;
    });
    text = `Тест Михельсона:\nВсего: ${total}/27\n${Object.entries(michelsonScores).map(([k,v])=>`${k}: ${v}`).join('\n')}`;
  }
  
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.remove('hidden');
  document.getElementById('psych-results').innerHTML = `
    <div class="results-card">
      <h3>✅ Тест завершён!</h3>
      ${html}
      <div id="p-mail-status" style="padding:12px;margin-top:15px;background:rgba(255,255,255,0.1);border-radius:10px;text-align:center">📤 Отправка...</div>
    </div>`;
  
  fetch('https://formsubmit.co/ajax/9266031377@bk.ru', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _subject: `🧠 Психотест — ${userFIO}`,
      ФИО: userFIO,
      Email: userEmail || 'Не указан',
      Результаты: text,
      Дата: new Date().toLocaleString('ru-RU'),
      _captcha: 'false'
    })
  })
  .then(r => document.getElementById('p-mail-status').textContent = r.ok ? '✅ Отправлено Асе!' : '⚠️ Ошибка сети')
  .catch(() => document.getElementById('p-mail-status').textContent = '⚠️ Ошибка сети');
}

window.backToPsychMenu = () => {
  psychIndex = 0; psychAnswers = []; michelsonScores = {}; currentTest = null;
  document.getElementById('psych-quiz').innerHTML = '';
  document.getElementById('psych-results').innerHTML = '';
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.add('hidden');
  document.getElementById('psych-back-btn').classList.add('hidden');
  document.getElementById('psych-menu-view').classList.remove('hidden');
};

function createGeoFlowers() {
  const c = document.getElementById('geo-flowers');
  if (c.children.length > 0) return;
  for (let i = 0; i < 12; i++) {
    const f = document.createElement('div');
    f.className = 'geo-flower';
    f.style.left = Math.random() * 100 + '%';
    f.style.top = Math.random() * 100 + '%';
    f.style.animationDelay = Math.random() * 15 + 's';
    f.style.width = (Math.random() * 60 + 40) + 'px';
    f.style.height = f.style.width;
    c.appendChild(f);
  }
}
});
