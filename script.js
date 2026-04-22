document.addEventListener('DOMContentLoaded', () => {
// ========== ДАННЫЕ ==========
const historyTests = [
  {
    id: 'knyazya', // ✅ Добавлен ID для старой логики (почта)
    title: 'Древняя Русь: первые князья',
    questions: [
      { q: 'В каком году произошло призвание варягов?', options: ['862','882','911','988'], correct: 0 },
      { q: 'Кто захватил Киев в 882 году?', options: ['Рюрик','Олег','Игорь','Святослав'], correct: 1 },
      { q: 'Какое племя убило Игоря?', options: ['Поляне','Древляне','Вятичи','Кривичи'], correct: 1 },
      { q: 'Что ввела Ольга вместо полюдья?', options: ['Серебро','Уроки и погосты','Торговлю','Дань'], correct: 1 },
      { q: 'Кто стал первым киевским князем Рюриковичей?', options: ['Рюрик','Олег','Игорь','Владимир'], correct: 2 }
    ]
  },
  {
    id: 'test_new_webhook', // ✅ ID нового теста (будет отправляться на Сайт 2)
    title: 'Новый тест (отправка на сайт)',
    questions: [
      { q: 'В каком году крестили Русь?', options: ['862','988','1015','1054'], correct: 1 },
      { q: 'Кто написал "Слово о полку Игореве"?', options: ['Летописец Нестор','Неизвестный автор','Владимир Мономах','Ярослав Мудрый'], correct: 1 },
      { q: 'Как назывался сборник законов Киевской Руси?', options: ['Судебник','Русская Правда','Стоглав','Соборное уложение'], correct: 1 }
    ]
  }
];

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
{q:'Вы оскорблены словами в Ваш адрес. Вы:', opts:['Уходите, не сказав, что расстроены','Заявляете, чтобы не смел больше','Ничего не говорите, хотя обижены','Оскорбляете в ответ','Заявляете, что не нравится, и что не должен делать снова']},
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

// ========== СОСТОЯНИЕ ==========
let userFIO = '', userEmail = '', pendingTestId = null;
let currentTest = null, qIdx = 0, score = 0, answered = false, historyUserInfo = null;
let historyDetailedAnswers = []; // ✅ Массив для детальной записи ответов нового теста
let psychIndex = 0, psychAnswers = [], michelsonScores = {};

// ========== ✅ ТЕМА (3 режима) ==========
const themeBtn = document.getElementById('theme-toggle');
const themeClasses = ['', 'light-theme', 'olive-theme'];
const themeIcons = ['🌓', '☀️', '🌿'];
let themeIdx = 0;
function applyTheme() {
  document.body.className = themeClasses[themeIdx];
  themeBtn.textContent = themeIcons[themeIdx];
}
themeBtn.onclick = () => { themeIdx = (themeIdx + 1) % themeClasses.length; applyTheme(); };
applyTheme();

// ========== ✅ ВСПЫШКИ ВМЕСТО ЛЕПЕСТКОВ ==========
const petalsContainer = document.getElementById('petals-container');
let flashesInitialized = false;
function initFlashes() {
  if(flashesInitialized) return;
  petalsContainer.innerHTML = '';
  for(let i=0; i<12; i++) {
    const f = document.createElement('div'); f.className = 'flash';
    f.style.left = (Math.random() * 95) + '%';
    f.style.top = (Math.random() * 95) + '%';
    f.style.animationDuration = (Math.random() * 3 + 4) + 's';
    f.style.animationDelay = (Math.random() * 5) + 's';
    petalsContainer.appendChild(f);
  }
  flashesInitialized = true;
}

// ========== НАВИГАЦИЯ ==========
window.switchTab = (id) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(id);
  if(target) target.classList.add('active');
  const navBtn = document.querySelector(`.nav-btn[data-tab="${id}"]`);
  if(navBtn) navBtn.classList.add('active');
  const psych = document.getElementById('psychology');
  if(id === 'psychology') {
    psych.classList.add('active');
    createGeoFlowers();
    petalsContainer.classList.remove('active');
  } else {
    psych.classList.remove('active');
    petalsContainer.classList.add('active');
    if(!flashesInitialized) initFlashes();
  }
};
document.querySelectorAll('.nav-btn').forEach(b => b.onclick = () => switchTab(b.dataset.tab));

// ========== ЭФФЕКТЫ ФОНА ==========
const hour = new Date().getHours();
if(hour >= 6 && hour < 18) document.getElementById('sunRays').classList.add('active');
const dp = document.getElementById('dustParticles');
setInterval(() => {
  if(dp.children.length < 15) {
    const p = document.createElement('div'); p.className='particle';
    p.style.left = Math.random()*100+'%'; p.style.top=Math.random()*100+'%';
    p.style.animationDuration = (Math.random()*4+4)+'s';
    dp.appendChild(p); setTimeout(()=>p.remove(), 8000);
  }
}, 1500);

// ========== ИСТОРИЯ ==========
const hList = document.getElementById('history-test-list');
historyTests.forEach(t => {
  const card = document.createElement('div'); card.className='test-card';
  card.innerHTML=`<h3>${t.title}</h3><span style="font-size:0.8rem;opacity:0.7">${t.questions.length} вопросов</span>`;
  card.onclick = () => openHistoryFioModal(t); hList.appendChild(card);
});
function openHistoryFioModal(test) {
  pendingTestId = 'history'; historyUserInfo = { test };
  document.getElementById('fio-modal').style.display = 'flex';
  document.getElementById('fio-input').value = '';
  document.getElementById('email-input').value = '';
  document.getElementById('fio-input').focus();
}
function startHistoryTest() {
  if(!historyUserInfo) return;
  currentTest = historyUserInfo.test; qIdx=0; score=0; answered=false;
  historyDetailedAnswers = []; // ✅ Очищаем историю ответов
  document.getElementById('fio-modal').style.display='none';
  document.getElementById('history-test-list').classList.add('hidden');
  document.getElementById('history-quiz').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.remove('hidden');
  showHistoryQuestion();
}
function showHistoryQuestion() {
  const q = currentTest.questions[qIdx];
  document.getElementById('history-quiz').innerHTML = `
  <div class="question-frame" style="max-width:100%; overflow-wrap:break-word;">
    <h4>Вопрос ${qIdx+1} из ${currentTest.questions.length}</h4>
    <p style="margin-bottom:18px; overflow-wrap:break-word; word-break:break-word;">${q.q}</p>
    <div id="h-opts" style="display:flex; flex-direction:column; gap:10px;"></div>
  </div>`;
  const opts = document.getElementById('h-opts');
  q.options.forEach((opt,i) => {
    const btn = document.createElement('button'); btn.className='answer-option'; btn.textContent=opt;
    btn.onclick = () => checkHistoryAnswer(i); opts.appendChild(btn);
  });
}
function checkHistoryAnswer(idx) {
  if(answered) return;
  answered=true;
  const q = currentTest.questions[qIdx];
  
  // ✅ Сохраняем детальный ответ для нового теста
  historyDetailedAnswers.push({
    num: qIdx + 1,
    question: q.q,
    user_answer: q.options[idx],
    correct_answer: q.options[q.correct],
    is_correct: idx === q.correct
  });

  document.querySelectorAll('#h-opts .answer-option').forEach((el,i) => {
    el.style.pointerEvents='none';
    if(i===q.correct) el.classList.add('correct');
    else if(i===idx) el.classList.add('wrong');
  });
  if(idx===q.correct) score++;
  setTimeout(() => {
    qIdx++;
    if(qIdx<currentTest.questions.length) { answered=false; showHistoryQuestion(); }
    else finishHistoryTest();
  }, 1200);
}
async function finishHistoryTest() {
  const pct = Math.round((score/currentTest.questions.length)*100);
  const fio = historyUserInfo?.fio || 'Аноним';

  // ✅ ЕСЛИ ЭТО НОВЫЙ ТЕСТ -> ОТРАВЛЯЕМ НА САЙТ 2
  if (currentTest.id === 'test_new_webhook') {
    const detailsHTML = historyDetailedAnswers.map(a => `
      <div style="background:${a.is_correct ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)'};
                  padding:12px; border-radius:10px; margin:8px 0; text-align:left;
                  border-left:3px solid ${a.is_correct ? '#2ecc71' : '#e74c3c'}">
        <b>Вопрос ${a.num}:</b> ${a.question}<br>
        Ваш ответ: <span style="color:${a.is_correct ? '#2ecc71' : '#e74c3c'}">${a.user_answer}</span>
        ${!a.is_correct ? `<br>✅ Правильно: <b>${a.correct_answer}</b>` : ''}
      </div>
    `).join('');

    document.getElementById('history-quiz').innerHTML = `
      <div class="question-frame">
        <h2 style="color:var(--accent)">Результат: ${pct}%</h2>
        <p style="margin:10px 0">${fio} | ${score} из ${currentTest.questions.length}</p>
        <div style="max-height:450px; overflow-y:auto; margin-top:15px; padding-right:5px; text-align:left;">
          ${detailsHTML}
        </div>
        <div id="h-mail-status" style="padding:12px; margin-top:15px; background:rgba(255,255,255,0.1); border-radius:10px; text-align:center;">📤 Отправка на Сайт 2...</div>
      </div>`;

    try {
      // ⚠️ ЗАМЕНИТЕ ЭТОТ URL НА АДРЕС ВАШЕГО receive.php (см. инструкцию ниже)
      await fetch('https://ваш-домен.site2.com/receive.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: currentTest.id,
          test_title: currentTest.title,
          fio: fio,
          email: historyUserInfo?.email || '',
          score, total: currentTest.questions.length, pct,
          answers: historyDetailedAnswers,
          submitted_at: new Date().toISOString()
        })
      });
      document.getElementById('h-mail-status').textContent = '✅ Результат успешно отправлен!';
    } catch(e) {
      console.error(e);
      document.getElementById('h-mail-status').textContent = '⚠️ Ошибка сети (данные показаны выше)';
    }
    return; // Выход, чтобы не дублировать отправку на почту
  }

  // === СТАРАЯ ЛОГИКА (FORMSUBMIT) ДЛЯ ОСТАЛЬНЫХ ТЕСТОВ ===
  document.getElementById('history-quiz').innerHTML = `
    <div class="question-frame" style="text-align:center"><h2 style="color:var(--accent)">Результат: ${pct}%</h2><p>${score} из ${currentTest.questions.length}</p><div id="h-mail-status" style="padding:12px;margin-top:15px;background:rgba(255,255,255,0.1);border-radius:10px">📤 Отправка...</div></div>`;
  try {
    await fetch('https://formsubmit.co/ajax/aniruf14.02@gmail.com', { method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ _subject:`📜 Тест "${currentTest.title}"`, ФИО:fio, Email:historyUserInfo?.email||'Не указан', Тест:currentTest.title, Результат:`${score}/${currentTest.questions.length} (${pct}%)`, Дата:new Date().toLocaleString('ru-RU'), _captcha:'false' })
    });
    document.getElementById('h-mail-status').textContent='✅ Отправлено!';
  } catch(e) { document.getElementById('h-mail-status').textContent='⚠️ Ошибка сети'; }
}
window.exitHistoryTest = () => {
  document.getElementById('history-quiz').classList.add('hidden');
  document.getElementById('history-test-list').classList.remove('hidden');
  document.getElementById('history-back-btn').classList.add('hidden');
};

// ========== ПСИХОЛОГИЯ ==========
const psychMenuView = document.getElementById('psych-menu-view');
const psychBackBtn = document.getElementById('psych-back-btn');
window.closePsychOverlay = () => switchTab('home');
window.openFioModal = (id) => {
  pendingTestId = id;
  document.getElementById('fio-modal').style.display = 'flex';
  document.getElementById('fio-input').value = '';
  document.getElementById('email-input').value = '';
  document.getElementById('fio-input').focus();
};
document.getElementById('cancel-test-btn').onclick = () => {
  document.getElementById('fio-modal').style.display='none';
  pendingTestId=null; historyUserInfo=null;
};
document.getElementById('start-test-btn').onclick = () => {
  const fio = document.getElementById('fio-input').value.trim();
  if(!fio) return alert('Введи ФИО!');
  if(pendingTestId==='history') {
    historyUserInfo.fio=fio; historyUserInfo.email=document.getElementById('email-input').value.trim();
    startHistoryTest();
  } else {
    userFIO=fio; userEmail=document.getElementById('email-input').value.trim();
    document.getElementById('fio-modal').style.display='none';
    startPsychTest(pendingTestId);
  }
};
function startPsychTest(id) {
  currentTest = id==='kos' ? {questions:kosQuestions, type:'kos'} : {questions:michelsonQuestions, type:'michelson'};
  psychIndex=0; psychAnswers=[]; michelsonScores={};
  if(psychMenuView) psychMenuView.classList.add('hidden');
  psychBackBtn.classList.add('hidden');
  document.getElementById('psych-quiz').classList.remove('hidden'); document.getElementById('psych-quiz').innerHTML='';
  document.getElementById('psych-results').classList.add('hidden'); document.getElementById('psych-results').innerHTML='';
  showPsychQuestion();
}
function showPsychQuestion() {
  const q = currentTest.questions[psychIndex];
  document.getElementById('psych-quiz').innerHTML = `
  <div class="progress-bar" style="max-width:100%; margin: 0 auto 20px;"><div class="progress-fill" style="width:${(psychIndex/currentTest.questions.length)*100}%"></div></div>
  <div class="question-box" style="max-width: 95vw; padding: 20px 15px; margin: 0 auto 20px; overflow-wrap: break-word;">
    <p style="margin-bottom:20px; line-height:1.5; word-break: break-word; overflow-wrap: break-word;">${q.q}</p>
    <div id="p-opts" style="display:flex; flex-direction:column; gap:10px; width:100%;"></div>
  </div>`;
  const opts = document.getElementById('p-opts');
  if(currentTest.type==='kos') {
    ['Да','Нет'].forEach(a => { const btn=document.createElement('button'); btn.className='btn-answer'; btn.textContent=a; btn.onclick=()=>answerPsych(a==='Да'?'yes':'no'); opts.appendChild(btn); });
  } else {
    q.opts.forEach((opt,i) => { const btn=document.createElement('button'); btn.className='btn-answer'; btn.textContent=`${String.fromCharCode(1072+i)}) ${opt}`; btn.onclick=()=>answerPsych(i); opts.appendChild(btn); });
  }
  const progress = (psychIndex+1)/currentTest.questions.length;
  if(progress>=0.32&&progress<0.35) document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">🌸 Треть пройдена!</div>`);
  else if(progress>=0.64&&progress<0.67) document.getElementById('psych-quiz').insertAdjacentHTML('beforeend', `<div class="asya-message">✨ Две трети позади!</div>`);
}
function answerPsych(ans) {
  psychAnswers.push(ans); psychIndex++;
  if(psychIndex<currentTest.questions.length) showPsychQuestion();
  else calculatePsychResults();
}
function calculatePsychResults() {
  let html='', text='';
  if(currentTest.type==='kos') {
    let c=0,o=0; psychAnswers.forEach((a,i)=>{const n=i+1; if(commYes.includes(n)&&a==='yes')c++; if(commNo.includes(n)&&a==='no')c++; if(orgYes.includes(n)&&a==='yes')o++; if(orgNo.includes(n)&&a==='no')o++;});
    html=`<div class="result-item"><h4>🗣️ Коммуникативные</h4><p>Баллы: ${c}/20 | Коэф: ${(c/20).toFixed(2)}</p></div><div class="result-item"><h4>📋 Организаторские</h4><p>Баллы: ${o}/20 | Коэф: ${(o/20).toFixed(2)}</p></div>`;
    text=`КОС:
Коммуникативные: ${c}/20
Организаторские: ${o}/20`;
  } else {
    let total=0;
    Object.keys(michelsonBlocks).forEach(blockName => {
      let s=0; michelsonBlocks[blockName].forEach(qNum => { if(psychAnswers[qNum-1]===michelsonKey[qNum-1]) s++; });
      michelsonScores[blockName]=s; total+=s;
      html+=`<div class="result-item"><h4>${blockName}</h4><p>${s} из ${michelsonBlocks[blockName].length} компетентных ответов</p></div>`;
    });
    text=`Тест Михельсона:
Всего: ${total}/27
${Object.entries(michelsonScores).map(([k,v])=>`${k}: ${v}`).join('
')}`;
  }
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.remove('hidden');
  document.getElementById('psych-results').innerHTML = `<div class="results-card"><h3 style="text-align:center;margin-bottom:20px">✅ Тест завершён!</h3>${html}<div id="p-mail-status" style="padding:12px;background:rgba(255,255,255,0.1);border-radius:10px;margin:15px 0;text-align:center">📤 Отправка...</div></div>`;
  fetch('https://formsubmit.co/ajax/9266031377@bk.ru', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({_subject:`🧠 Психотест — ${userFIO}`, ФИО:userFIO, Email:userEmail||'Не указан', Результаты:text, Дата:new Date().toLocaleString('ru-RU'), _captcha:'false'}) })
  .then(r => document.getElementById('p-mail-status').textContent = r.ok ? '✅ Отправлено Асе!' : '⚠️ Ошибка сети')
  .catch(() => document.getElementById('p-mail-status').textContent='⚠️ Ошибка сети');
}
window.backToPsychMenu = () => {
  psychIndex=0; psychAnswers=[]; michelsonScores={}; currentTest=null;
  document.getElementById('psych-quiz').innerHTML=''; document.getElementById('psych-results').innerHTML='';
  document.getElementById('psych-quiz').classList.add('hidden');
  document.getElementById('psych-results').classList.add('hidden');
  psychBackBtn.classList.add('hidden');
  if(psychMenuView) psychMenuView.classList.remove('hidden');
};
function createGeoFlowers() {
  const c = document.getElementById('geo-flowers'); if(c.children.length>0) return;
  for(let i=0; i<12; i++) {
    const f = document.createElement('div'); f.className='geo-flower';
    f.style.left=Math.random()*100+'%'; f.style.top=Math.random()*100+'%'; f.style.animationDelay=Math.random()*15+'s';
    f.style.width=(Math.random()*60+40)+'px'; f.style.height=f.style.width; c.appendChild(f);
  }
}
initFlashes();
petalsContainer.classList.add('active');
});
