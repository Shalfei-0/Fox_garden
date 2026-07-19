document.addEventListener('DOMContentLoaded', () => {
// ========== ВИЗУАЛИЗАЦИЯ CATMULL-ROM ==========
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let W, H, cx, cy;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
}
window.addEventListener('resize', resize);
resize();

// Параметры визуализации
const vizParams = {
  points: 4,
  radius: 0.23,
  speed: 3.0,
  amp: 1.7,
  ghosts: 0,
  dt: 1.0,
  color: '#ff8c32',
  glow: 80,
  parallax: 0
};

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', e => {
  mouse.tx = (e.clientX / W - 0.5) * 2;
  mouse.ty = (e.clientY / H - 0.5) * 2;
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
    pulses.push({
      freq: 0.8 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      amp: 0.04 + Math.random() * 0.08
    });
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
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const steps = 16;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const t2 = t * t, t3 = t2 * t;
      const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      const px = centerX + x + offsetX;
      const py = centerY + y + offsetY;
      if (i === 0 && s === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
  }
  context.closePath();
}

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return {
    r: parseInt(m.substring(0, 2), 16),
    g: parseInt(m.substring(2, 4), 16),
    b: parseInt(m.substring(4, 6), 16)
  };
}

function drawScene(t) {
  // Плавное затухание фона
  ctx.fillStyle = 'rgba(5, 5, 7, 0.15)';
  ctx.fillRect(0, 0, W, H);
  
  const rgb = hexToRgb(vizParams.color);
  const colorStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const parX = mouse.x * vizParams.parallax;
  const parY = mouse.y * vizParams.parallax;
  
  // Призрачные следы
  for (let g = 0; g < vizParams.ghosts; g++) {
    const ratio = (g + 1) / (vizParams.ghosts + 1);
    const dt = vizParams.dt * (vizParams.ghosts - g);
    const alpha = 0.04 + ratio * 0.15;
    const width = 0.8 + ratio * 1.2;
    const pts = computePoints(t - dt, Math.min(W, H) * vizParams.radius);
    drawCatmullRom(ctx, pts, parX * 0.5, parY * 0.5, cx, cy);
    ctx.strokeStyle = `rgba(${colorStr}, ${alpha})`;
    ctx.lineWidth = width;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${colorStr}, ${alpha})`;
    ctx.stroke();
  }
  
  // Основная фигура
  const mainPts = computePoints(t, Math.min(W, H) * vizParams.radius);
  drawCatmullRom(ctx, mainPts, parX, parY, cx, cy);
  ctx.shadowBlur = vizParams.glow;
  ctx.shadowColor = `rgba(${colorStr}, 0.8)`;
  ctx.strokeStyle = `rgba(${colorStr}, 0.95)`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Внутренний контур
  ctx.shadowBlur = 0;
  ctx.strokeStyle = `rgba(${Math.min(255, rgb.r + 60)}, ${Math.min(255, rgb.g + 60)}, ${Math.min(255, rgb.b + 70)}, 0.9)`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Заливка
  ctx.fillStyle = `rgba(${colorStr}, 0.03)`;
  ctx.fill();
}

let startTime = performance.now();
function animate() {
  const t = (performance.now() - startTime) / 1000;
  mouse.x += (mouse.tx - mouse.x) * 0.03;
  mouse.y += (mouse.ty - mouse.y) * 0.03;
  drawScene(t);
  requestAnimationFrame(animate);
}
animate();

// ========== НАВИГАЦИЯ ==========
window.switchTab = (id) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  const navBtn = document.querySelector(`.nav-link[data-tab="${id}"]`);
  if (navBtn) navBtn.classList.add('active');
};

document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ========== ТЕМА ==========
const themeBtn = document.getElementById('theme-toggle');
let isLight = false;
themeBtn.onclick = () => {
  isLight = !isLight;
  document.body.classList.toggle('light-theme', isLight);
  themeBtn.textContent = isLight ? '🌙' : '🌓';
};

// ========== ПСИХОЛОГИЯ С АСЕЙ ==========
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

// Состояние
let userFIO = '', userEmail = '', pendingTestId = null;
let currentTest = null, qIdx = 0, score = 0, answered = false;
let psychIndex = 0, psychAnswers = [], michelsonScores = {};

// Модальное окно
const fioModal = document.getElementById('fio-modal');
window.openFioModal = (id) => {
  pendingTestId = id;
  fioModal.classList.add('active');
  document.getElementById('fio-input').value = '';
  document.getElementById('email-input').value = '';
  document.getElementById('fio-input').focus();
};

document.getElementById('cancel-test-btn').onclick = () => {
  fioModal.classList.remove('active');
  pendingTestId = null;
};

document.getElementById('start-test-btn').onclick = () => {
  const fio = document.getElementById('fio-input').value.trim();
  if (!fio) return alert('Введите ФИО!');
  userFIO = fio;
  userEmail = document.getElementById('email-input').value.trim();
  fioModal.classList.remove('active');
  startPsychTest(pendingTestId);
};

function startPsychTest(id) {
  currentTest = id === 'kos' ? { questions: kosQuestions, type: 'kos' } : { questions: michelsonQuestions, type: 'michelson' };
  psychIndex = 0; psychAnswers = []; michelsonScores = {};
  
  document.getElementById('psych-quiz').classList.remove('hidden');
  document.getElementById('psych-results').classList.add('hidden');
  document.getElementById('psych-back-btn').classList.add('hidden');
  document.querySelector('.test-cards').classList.add('hidden');
  
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
  
  // Сообщения Аси
  const progress = (psychIndex + 1) / currentTest.questions.length;
  if (progress >= 0.32 && progress < 0.35) {
    document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">🌸 Треть пройдена! Ты отлично справляешься!</div>`);
  } else if (progress >= 0.64 && progress < 0.67) {
    document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">✨ Две трети позади! Ещё немного!</div>`);
  }
}

function answerPsych(ans) {
  if (answered) return;
  answered = true;
  psychAnswers.push(ans);
  psychIndex++;
  
  if (psychIndex < currentTest.questions.length) {
    setTimeout(() => { answered = false; showPsychQuestion(); }, 300);
  } else {
    calculatePsychResults();
  }
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
    html = `
      <div class="result-item"><h4>🗣️ Коммуникативные склонности</h4><p>Баллы: <strong>${c}/20</strong> | Коэффициент: ${(c/20).toFixed(2)}</p></div>
      <div class="result-item"><h4>📋 Организаторские склонности</h4><p>Баллы: <strong>${o}/20</strong> | Коэффициент: ${(o/20).toFixed(2)}</p></div>
    `;
    text = `КОС:\nКоммуникативные: ${c}/20\nОрганизаторские: ${o}/20`;
  } else {
    let total = 0;
    Object.keys(michelsonBlocks).forEach(blockName => {
      let s = 0;
      michelsonBlocks[blockName].forEach(qNum => {
        if (psychAnswers[qNum - 1] === michelsonKey[qNum - 1]) s++;
      });
      michelsonScores[blockName] = s;
      total += s;
      html += `<div class="result-item"><h4>${blockName}</h4><p>${s} из ${michelsonBlocks[blockName].length} компетентных ответов</p></div>`;
    });
    text = `Тест Михельсона:\nВсего: ${total}/27\n${Object.entries(michelsonScores).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  }
  
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.remove('hidden');
  document.getElementById('psych-back-btn').classList.remove('hidden');
  
  document.getElementById('psych-results').innerHTML = `
    <div class="results-card">
      <h3>✅ Тест завершён!</h3>
      <p style="margin-bottom:20px;color:var(--text-muted)">Спасибо, ${userFIO}! Вот твои результаты:</p>
      ${html}
      <div id="p-mail-status" style="padding:12px;margin-top:20px;background:rgba(255,255,255,0.05);border-radius:10px">📤 Отправка результатов...</div>
    </div>`;
  
  // Отправка на почту
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
  .then(r => {
    document.getElementById('p-mail-status').textContent = r.ok ? '✅ Отправлено Асе!' : '⚠️ Ошибка сети';
  })
  .catch(() => {
    document.getElementById('p-mail-status').textContent = '⚠️ Ошибка сети';
  });
}

window.backToPsychMenu = () => {
  psychIndex = 0; psychAnswers = []; michelsonScores = {}; currentTest = null;
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.add('hidden');
  document.getElementById('psych-back-btn').classList.add('hidden');
  document.querySelector('.test-cards').classList.remove('hidden');
};
});
