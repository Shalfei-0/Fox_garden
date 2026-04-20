document.addEventListener('DOMContentLoaded', () => {
// ========== ДАННЫЕ ==========
const historyTests = [{
id: 'knyazya', title: 'Древняя Русь: первые князья',
questions: [
{ q: 'В каком году произошло призвание варягов?', options: ['862','882','911','988'], correct: 0 },
{ q: 'Кто захватил Киев в 882 году?', options: ['Рюрик','Олег','Игорь','Святослав'], correct: 1 },
{ q: 'Какое племя убило Игоря?', options: ['Поляне','Древляне','Вятичи','Кривичи'], correct: 1 },
{ q: 'Что ввела Ольга вместо полюдья?', options: ['Серебро','Уроки и погосты','Торговлю','Дань'], correct: 1 },
{ q: 'Кто стал первым киевским князем Рюриковичей?', options: ['Рюрик','Олег','Игорь','Владимир'], correct: 2 }
]
}];
const kosQuestions = [
{q:"Много ли у Вас друзей?"},{q:"Часто ли Вам удается склонить товарищей?"},{q:"Долго ли беспокоит обида?"},{q:"Трудно ли ориентироваться в критической ситуации?"},{q:"Стремитесь ли к новым знакомствам?"},
{q:"Нравится ли общественная работа?"},{q:"Приятнее ли проводить время с книгами?"},{q:"Легко ли отступаете от намерений?"},{q:"Легко ли устанавливаете контакты со старшими?"},{q:"Любите ли организовывать игры?"},
{q:"Трудно ли включать в новую компанию?"},{q:"Откладываете ли дела?"},{q:"Легко ли контактировать с незнакомыми?"},{q:"Стремитесь ли, чтобы товарищи действовали по Вашему мнению?"},{q:"Трудно ли осваиваться в новом коллективе?"},
{q:"Нет ли конфликтов из-за невыполнения обязанностей?"},{q:"Стремитесь ли знакомиться?"},{q:"Принимаете ли инициативу?"},{q:"Раздражают ли окружающие?"},{q:"Плохо ли ориентируетесь в незнакомой обстановке?"},
{q:"Нравится ли быть среди людей?"},{q:"Раздражение из-за незавершенного дела?"},{q:"Стеснение при знакомстве?"},{q:"Утомление от общения?"},{q:"Любите ли коллективные игры?"},
{q:"Проявляете ли инициативу в интересах товарищей?"},{q:"Неуверенность среди малознакомых?"},{q:"Редко отстаиваете правоту?"},{q:"Вносите ли оживление в компанию?"},{q:"Участие в общественной работе?"},
{q:"Ограничиваете ли круг знакомых?"},{q:"Не отстаиваете ли мнение?"},{q:"Непринужденность в незнакомой компании?"},{q:"Охотно организуете мероприятия?"},{q:"Неуверенность перед группой?"},
{q:"Опаздываете ли?"},{q:"Много ли друзей?"},{q:"Смущение при общении?"},{q:"Пугает ли новый коллектив?"},{q:"Неуверенность в большой группе?"}
];
const commYes = [1,5,9,13,17,21,25,29,33,37], commNo = [3,7,11,15,19,23,27,31,35,39];
const orgYes = [2,6,10,14,18,22,26,30,34,38], orgNo = [4,8,12,16,20,24,28,32,36,40];
const ryakhovskyQuestions = [
{q:"Выбивает ли ожидание встречи из колеи?"},{q:"Смятение при выступлении с докладом?"},{q:"Откладываете визит к врачу?"},{q:"Избегаете командировок?"},{q:"Делитесь переживаниями?"},{q:"Раздражение при просьбе незнакомца?"},{q:"Верите в проблему отцов и детей?"},{q:"Постесняетесь напомнить о долге?"},{q:"Промолчите при плохом блюде?"},{q:"Не вступите в беседу с незнакомцем?"},{q:"Избегаете очередей?"},{q:"Боитесь комиссий?"},{q:"Не приемлете чужие мнения об искусстве?"},{q:"Промолчите при ошибочной точке зрения?"},{q:"Досада при просьбе помочь?"},{q:"Предпочитаете письменную форму устной?"}
];

// ========== СОСТОЯНИЕ ==========
let userFIO = '', userEmail = '', pendingTestId = null;
let currentTest = null, qIdx = 0, score = 0, answered = false;
let psychIndex = 0, psychAnswers = [];
const completed = JSON.parse(localStorage.getItem('fox_completed') || '[]');

// ========== ТЕМА ==========
const themeBtn = document.getElementById('theme-toggle');
const isLight = localStorage.getItem('fox_theme') === 'light';
document.body.classList.toggle('light-theme', isLight);
themeBtn.textContent = isLight ? '🌙' : '🌓';
themeBtn.onclick = () => {
  document.body.classList.toggle('light-theme');
  const l = document.body.classList.contains('light-theme');
  themeBtn.textContent = l ? '🌙' : '🌓';
  localStorage.setItem('fox_theme', l ? 'light' : 'dark');
};

// ========== НАВИГАЦИЯ ==========
window.switchTab = (id) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  // FIX: Corrected selector to use the ID directly instead of appending '-tab'
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  
  document.querySelector(`.nav-btn[data-tab="${id}"]`).classList.add('active');
  
  const psych = document.getElementById('psychology');
  const petalsContainer = document.getElementById('petals-container');
  
  if(id === 'psychology') { 
    psych.classList.add('active'); 
    createGeoFlowers(); 
    petalsContainer.classList.remove('active'); // Hide petals
  } else {
    psych.classList.remove('active');
    if(id === 'home') {
       petalsContainer.classList.add('active'); // Show petals on home
       initPetals();
    } else {
       petalsContainer.classList.remove('active');
    }
  }
};
document.querySelectorAll('.nav-btn').forEach(b => b.onclick = () => switchTab(b.dataset.tab));

// ========== ЛЕПЕСТКИ ==========
const petalsContainer = document.getElementById('petals-container');
let petalsInitialized = false;

function initPetals() {
  if(petalsInitialized) return;
  petalsContainer.innerHTML = '';
  for(let i=0; i<15; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 5 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    petalsContainer.appendChild(p);
  }
  petalsInitialized = true;
}

// ========== ЧАТ / ПРИВЕТСТВИЕ ==========
async function showMessage(text, speaker = 'Шалфей', emotion = '😊') {
  console.log(`${speaker}: ${text}`);
}
setTimeout(() => showMessage('Привет! Я Шалфей. Выбирай раздел вверху 👆', 'Шалфей', '✨'), 1000);

// ========== ЭФФЕКТЫ (ЛУЧИ/ПЫЛЬ) ==========
const hour = new Date().getHours();
if(hour >= 6 && hour < 18) document.getElementById('sunRays').classList.add('active');
else document.getElementById('moonLight').classList.add('active');
const dp = document.getElementById('dustParticles');
setInterval(() => {
  if(dp.children.length < 15) {
    const p = document.createElement('div'); p.className = 'particle';
    p.style.left = Math.random()*100 + '%'; p.style.top = Math.random()*100 + '%';
    p.style.animationDuration = (Math.random()*4+4)+'s';
    dp.appendChild(p); setTimeout(() => p.remove(), 8000);
  }
}, 1500);

// Initialize petals if starting on home
if(document.getElementById('home').classList.contains('active')) {
  initPetals();
  petalsContainer.classList.add('active');
}

// ========== ИСТОРИЧЕСКИЕ ТЕСТЫ ==========
const hList = document.getElementById('history-test-list');
historyTests.forEach(t => {
  const card = document.createElement('div');
  card.className = 'test-card';
  card.innerHTML = `<h3>${t.title}</h3><span style="font-size:0.8rem;opacity:0.7">${t.questions.length} вопросов</span>`;
  card.onclick = () => startHistoryTest(t);
  hList.appendChild(card);
});
function startHistoryTest(test) {
  currentTest = test; qIdx = 0; score = 0; answered = false;
  document.getElementById('history-test-list').classList.add('hidden');
  document.getElementById('history-quiz').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.remove('hidden');
  showHistoryQuestion();
}
function showHistoryQuestion() {
  const q = currentTest.questions[qIdx];
  document.getElementById('history-quiz').innerHTML = `
    <h3 style="margin-bottom:15px;color:var(--accent)">${q.q}</h3>
    <div id="h-opts"></div>`;
  const opts = document.getElementById('h-opts');
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'test-card'; btn.style.margin = '8px 0'; btn.textContent = opt;
    btn.onclick = () => checkHistoryAnswer(i);
    opts.appendChild(btn);
  });
}
function checkHistoryAnswer(idx) {
  if(answered) return; answered = true;
  const correct = currentTest.questions[qIdx].correct;
  document.querySelectorAll('#h-opts .test-card').forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    if(i === correct) btn.style.background = 'rgba(76,175,80,0.3)';
    else if(i === idx) btn.style.background = 'rgba(244,67,54,0.3)';
  });
  if(idx === correct) score++;
  setTimeout(() => {
    qIdx++;
    if(qIdx < currentTest.questions.length) showHistoryQuestion();
    else finishHistoryTest();
  }, 1000);
}
async function finishHistoryTest() {
  const pct = Math.round((score/currentTest.questions.length)*100);
  document.getElementById('history-quiz').innerHTML = `
    <h2 style="text-align:center">Результат: ${pct}%</h2>
    <p style="text-align:center">${score} из ${currentTest.questions.length}</p>
    <div id="h-mail-status" style="text-align:center;padding:12px;background:rgba(255,255,255,0.1);border-radius:10px;margin:15px 0">📤 Отправка на aniruf14.02@gmail.com...</div>`;
  try {
    await fetch('https://formsubmit.co/ajax/aniruf14.02@gmail.com', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        _subject: `📜 Тест "${currentTest.title}"`,
        Результат: `${score}/${currentTest.questions.length} (${pct}%)`,
        Дата: new Date().toLocaleString('ru-RU'), _captcha: 'false'
      })
    });
    document.getElementById('h-mail-status').textContent = '✅ Отправлено!';
  } catch(e) {
    document.getElementById('h-mail-status').textContent = '⚠️ Ошибка сети';
  }
}
window.exitHistoryTest = () => {
  document.getElementById('history-quiz').classList.add('hidden');
  document.getElementById('history-test-list').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.add('hidden');
};

// ========== ПСИХОЛОГИЯ ==========
window.openFioModal = (id) => {
  pendingTestId = id;
  document.getElementById('fio-modal').style.display = 'flex';
  document.getElementById('fio-input').focus();
};
document.getElementById('cancel-psych-btn').onclick = () => document.getElementById('fio-modal').style.display = 'none';
document.getElementById('start-psych-btn').onclick = () => {
  const fio = document.getElementById('fio-input').value.trim();
  if(!fio) return alert('Введи ФИО!');
  userFIO = fio;
  userEmail = document.getElementById('email-input').value.trim();
  document.getElementById('fio-modal').style.display = 'none';
  startPsychTest(pendingTestId);
};
function startPsychTest(id) {
  currentTest = id === 'kos' ? {questions: kosQuestions, type: 'kos'} : {questions: ryakhovskyQuestions, type: 'ryakhovsky'};
  psychIndex = 0; psychAnswers = [];
  document.getElementById('psych-menu').classList.add('hidden');
  document.getElementById('psych-quiz').classList.remove('hidden');
  document.getElementById('psych-back-btn').classList.remove('hidden');
  showPsychQuestion();
}
function showPsychQuestion() {
  const q = currentTest.questions[psychIndex];
  document.getElementById('psych-quiz').innerHTML = `
    <div class="question-box">
      <p>${q.q}</p>
      <div id="p-opts"></div>
    </div>`;
  const opts = document.getElementById('p-opts');
  if(currentTest.type === 'kos') {
    ['Да', 'Нет'].forEach(a => {
      const btn = document.createElement('button'); btn.className='btn-answer'; btn.textContent=a;
      btn.onclick = () => answerPsych(a === 'Да' ? 'yes' : 'no');
      opts.appendChild(btn);
    });
  } else {
    ['Да', 'Иногда', 'Нет'].forEach(a => {
      const btn = document.createElement('button'); btn.className='btn-answer'; btn.textContent=a;
      btn.onclick = () => answerPsych(a);
      opts.appendChild(btn);
    });
  }
  // Прогресс
  document.getElementById('psych-quiz').insertAdjacentHTML('afterbegin',
    `<div class="progress-bar"><div class="progress-fill" style="width:${(psychIndex/currentTest.questions.length)*100}%"></div></div>`);
  // Мотивация Аси
  const msgDiv = document.createElement('div'); msgDiv.className='asya-message';
  const progress = (psychIndex + 1) / currentTest.questions.length;
  if(progress >= 0.32 && progress < 0.35) msgDiv.textContent = "🌸 Молодец! Треть уже пройдена, осталось чуть-чуть!";
  else if(progress >= 0.64 && progress < 0.67) msgDiv.textContent = "✨ Отлично! Уже две трети позади! Ты справляешься!";
  else msgDiv.style.display = 'none';
  document.getElementById('psych-quiz').appendChild(msgDiv);
}
function answerPsych(ans) {
  psychAnswers.push(ans); psychIndex++;
  if(psychIndex < currentTest.questions.length) showPsychQuestion();
  else calculatePsychResults();
}
function calculatePsychResults() {
  let html = '', text = '';
  if(currentTest.type === 'kos') {
    let c=0, o=0;
    psychAnswers.forEach((a,i) => {
      const n=i+1;
      if(commYes.includes(n)&&a==='yes')c++; if(commNo.includes(n)&&a==='no')c++;
      if(orgYes.includes(n)&&a==='yes')o++; if(orgNo.includes(n)&&a==='no')o++;
    });
    const kc=(c/20).toFixed(2), oc=(o/20).toFixed(2);
    html = `<div class="result-item"><h4>🗣️ Коммуникативные</h4><p>Баллы: ${c}/20 | Коэф: ${kc}</p></div>
            <div class="result-item"><h4>📋 Организаторские</h4><p>Баллы: ${o}/20 | Коэф: ${oc}</p></div>`;
    text = `КОС:\nКоммуникативные: ${c}/20\nОрганизаторские: ${o}/20`;
  } else {
    let pts = psychAnswers.reduce((s,a) => s + (a==='Да'?2 : a==='Иногда'?1 : 0), 0);
    let interp = pts>=30?'Некоммуникабельны':pts>=25?'Замкнуты':pts>=19?'Общительны с оглядкой':pts>=14?'Норма':pts>=9?'Весьма общительны':'Рубаха-парень';
    html = `<div class="result-item"><h4>🗣️ Общительность</h4><p>${pts}/32 — ${interp}</p></div>`;
    text = `Ряховский: ${pts}/32 (${interp})`;
  }
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.remove('hidden');
  document.getElementById('psych-results').innerHTML = `<div class="results-card"><h3 style="text-align:center;margin-bottom:20px">✅ Тест завершён!</h3>${html}<div id="p-mail-status" style="padding:12px;background:rgba(255,255,255,0.1);border-radius:10px;margin:15px 0;text-align:center">📤 Отправка...</div></div>`;
  fetch('https://formsubmit.co/ajax/9266031377@bk.ru', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({_subject:`🧠 Психотест — ${userFIO}`, ФИО:userFIO, Email:userEmail||'Не указан', Результаты:text, Дата:new Date().toLocaleString('ru-RU'), _captcha:'false'})
  }).then(r => {
    document.getElementById('p-mail-status').textContent = r.ok ? '✅ Отправлено Асе!' : '⚠️ Ошибка сети';
  });
}
window.backToPsychMenu = () => {
  document.getElementById('psych-results').classList.add('hidden');
  document.getElementById('psych-menu').classList.remove('hidden');
  document.getElementById('psych-back-btn').classList.add('hidden');
};

// ========== ГЕОМЕТРИЧЕСКИЕ ЦВЕТЫ ==========
function createGeoFlowers() {
  const container = document.getElementById('geo-flowers');
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const f = document.createElement('div');
    f.className = 'geo-flower';
    f.style.left = Math.random() * 100 + '%';
    f.style.top = Math.random() * 100 + '%';
    f.style.animationDelay = Math.random() * 15 + 's';
    f.style.width = (Math.random() * 60 + 40) + 'px';
    f.style.height = f.style.width;
    container.appendChild(f);
  }
}
});
