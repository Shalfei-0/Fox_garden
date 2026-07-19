// --- ДАННЫЕ ТЕСТОВ ---
const historyData = { 5: [ {q:"Как называлось первое орудие труда древнейших людей?", type:"choice", options:["рубило","гарпун","лук","мотыга"], correct:0}, {q:"Около какого времени появились первые государства в долине Нила?", type:"choice", options:["около 5 тыс. лет назад","около 3 тыс. лет до н.э.","около 1 тыс. лет до н.э.","в I в. н.э."], correct:1}, {q:"Что обозначает термин «неолит»?", type:"choice", options:["новый каменный век","древний каменный век","средний каменный век","бронзовый век"], correct:0}, {q:"Письменность древних египтян называлась:", type:"choice", options:["клинопись","иероглифы","буквенное письмо","узелковое письмо"], correct:1}, {q:"Кто в Древнем Египте считался «живым богом»?", type:"choice", options:["жрец","фараон","верховный судья","военачальник"], correct:1}, {q:"Где была изобретена первая в мире письменность – клинопись?", type:"choice", options:["в Египте","в Индии","в Междуречье (Двуречье)","в Китае"], correct:2}, {q:"Какая форма правления сложилась в Афинах в V в. до н.э.?", type:"choice", options:["тирания","олигархия","демократия","монархия"], correct:2}, {q:"В каком году, согласно легенде, был основан Рим?", type:"choice", options:["753 г. до н.э.","509 г. до н.э.","395 г. до н.э.","27 г. до н.э."], correct:0}, {q:"Кто создал огромную державу от Греции до Индии?", type:"choice", options:["Ганнибал","Юлий Цезарь","Александр Македонский","Кир Великий"], correct:2}, {q:"Что такое «республика» в Древнем Риме?", type:"choice", options:["власть одного правителя","власть знатного рода","власть народа, выбиравшего должностных лиц","власть жрецов"], correct:2} ], 6: [ {q:"В каком году произошло Крещение Руси?", type:"choice", options:["862 г.","882 г.","988 г.","1054 г."], correct:2}, {q:"Как назывался объезд князем земель для сбора дани?", type:"choice", options:["выход","полюдье","кормление","тягло"], correct:1}, {q:"Кто был автором «Повести временных лет»?", type:"choice", options:["митрополит Иларион","Нестор","Владимир Мономах","Никон"], correct:1}, {q:"Какое событие произошло в 1223 году?", type:"choice", options:["Невская битва","битва на Калке","Ледовое побоище","Куликовская битва"], correct:1}, {q:"Термин «вече» означал:", type:"choice", options:["совет знати","народное собрание","княжеский суд","церковный собор"], correct:1}, {q:"Кто разгромил монголов на Куликовом поле в 1380 году?", type:"choice", options:["Иван Калита","Дмитрий Донской","Василий Тёмный","Иван III"], correct:1}, {q:"Система содержания должностных лиц за счёт населения в XV–XVI вв.:", type:"choice", options:["кормление","поместье","вотчина","опричнина"], correct:0}, {q:"«Стояние на реке Угре», свергнувшее ордынское иго, состоялось в:", type:"choice", options:["1380 г.","1462 г.","1480 г.","1505 г."], correct:2}, {q:"Что такое «поместье» в Московском государстве?", type:"choice", options:["наследственное владение","земля за службу без права наследования","монастырская земля","купленная у татар земля"], correct:1}, {q:"Кто первым принял титул «государь всея Руси»?", type:"choice", options:["Василий II","Иван III","Василий III","Иван IV"], correct:1} ], 7: [ {q:"В каком году на престол избран Михаил Романов?", type:"choice", options:["1598 г.","1605 г.","1613 г.","1645 г."], correct:2}, {q:"Что такое «Смутное время»?", type:"choice", options:["период дворцовых переворотов","кризис государственности в начале XVII в.","восстание крестьян","война с Речью Посполитой"], correct:1}, {q:"Соборное уложение, закрепившее крепостное право, принято в:", type:"choice", options:["1607 г.","1649 г.","1667 г.","1682 г."], correct:1}, {q:"Кто возглавил церковный раскол в середине XVII века?", type:"choice", options:["патриарх Никон и протопоп Аввакум","митрополит Филипп","Сергий Радонежский","Геннадий Новгородский"], correct:0}, {q:"Старообрядцы — это:", type:"choice", options:["сторонники старых обрядов после реформы Никона","участники восстания Разина","купцы","служилые люди"], correct:0}, {q:"Восстание Степана Разина произошло в:", type:"choice", options:["1648 г.","1662 г.","1670–1671 гг.","1682 г."], correct:2}, {q:"«Ясачный сбор» в Сибири — это:", type:"choice", options:["налог с земель","пошлина с торговли","дань мехами с коренных народов","военный налог"], correct:2}, {q:"Фактическим правителем при малолетних Иване и Петре была:", type:"choice", options:["Борис Годунов","Василий Голицын","Софья Алексеевна","Фёдор Алексеевич"], correct:2}, {q:"Местничество отменено в:", type:"choice", options:["1649 г.","1676 г.","1682 г.","1689 г."], correct:2}, {q:"Регулярные пехотные полки XVII в. по западному образцу назывались:", type:"choice", options:["стрелецкие","полки нового строя","городовые казаки","опричники"], correct:1} ], 8: [ {q:"Северная война началась в:", type:"choice", options:["1696 г.","1700 г.","1709 г.","1721 г."], correct:1}, {q:"Какой орган создал Пётр I вместо Боярской думы?", type:"choice", options:["Сенат","Верховный тайный совет","Государственный совет","Кабинет министров"], correct:0}, {q:"«Ревизия» при Петре I — это:", type:"choice", options:["проверка войск","перепись податного населения","судебное следствие","таможенный досмотр"], correct:1}, {q:"Россия провозглашена империей в:", type:"choice", options:["1709 г.","1721 г.","1725 г.","1762 г."], correct:1}, {q:"Эпоха дворцовых переворотов длилась:", type:"choice", options:["1700–1725 гг.","1725–1762 гг.","1730–1740 гг.","1762–1796 гг."], correct:1}, {q:"«Просвещённый абсолютизм» — это политика:", type:"choice", options:["полного освобождения крестьян","Екатерины II с опорой на идеи Просвещения","зависимости монарха от дворянства","парламентской монархии"], correct:1}, {q:"Восстание Пугачёва было в:", type:"choice", options:["1762–1764 гг.","1773–1775 гг.","1785–1787 гг.","1790–1792 гг."], correct:1}, {q:"Освобождение дворян от обязательной службы даровал(а):", type:"choice", options:["Указ о единонаследии","Жалованная грамота дворянству (1785)","Табель о рангах","Манифест о вольности дворянской (1762)"], correct:3}, {q:"Указ о вольности дворянской принят в:", type:"choice", options:["1736 г.","1762 г.","1775 г.","1785 г."], correct:1}, {q:"Установите соответствие между датой и событием:", type:"match", pairs:[ {left:"1703 г.", right:"основание Санкт-Петербурга"}, {left:"1709 г.", right:"Полтавская битва"}, {left:"1721 г.", right:"провозглашение России империей"}, {left:"1762 г.", right:"начало царствования Екатерины II"} ]} ], 9: [ {q:"Павел I убит, Александр I вступил на престол в:", type:"choice", options:["1796 г.","1801 г.","1812 г.","1825 г."], correct:1}, {q:"14 декабря 1825 года произошло:", type:"choice", options:["восстание декабристов","начало Крымской войны","отмена крепостного права","убийство Александра II"], correct:0}, {q:"«Западники» — это:", type:"choice", options:["сторонники самобытного пути России","сторонники развития по западноевропейскому образцу","члены тайных обществ","чиновники западных губерний"], correct:1}, {q:"Крепостное право отменено в:", type:"choice", options:["1855 г.","1861 г.","1864 г.","1874 г."], correct:1}, {q:"«Отрезки» после реформы 1861 г. — это:", type:"choice", options:["земля, переданная крестьянам","часть наделов, отрезанная в пользу помещика","участки для общественных нужд","арендованные земли"], correct:1}, {q:"Манифест 17 октября (Конституция) принят в:", type:"choice", options:["1881 г.","1905 г.","1906 г.","1914 г."], correct:1}, {q:"Теорию «официальной народности» создал:", type:"choice", options:["Н.М. Карамзин","С.С. Уваров","М.Н. Погодин","К.П. Победоносцев"], correct:1}, {q:"В 1904–1905 гг. шла война:", type:"choice", options:["Крымская","Русско-турецкая","Русско-японская","Первая мировая"], correct:2}, {q:"Первая мировая война началась в:", type:"choice", options:["1912 г.","1914 г.","1915 г.","1917 г."], correct:1}, {q:"Заполните пропуски в таблице:", type:"fill", fields:[ {label:"1803 г. • Указ о «вольных хлебопашцах» • Правитель:", correct:"Александр I"}, {label:"1864 г. • ______________ (судебная реформа) • Правитель: Александр II", correct:"Судебная реформа"}, {label:"1897 г. • Денежная реформа • Министр:", correct:"Витте"}, {label:"1906 г. • Манифест 17 октября • Император:", correct:"Николай II"} ]} ] };
const kosQuestions = [ "Много ли у Вас друзей?","Часто ли удается склонить товарищей?","Долго ли беспокоит обида?","Трудно ли ориентироваться в критической ситуации?","Стремитесь ли к новым знакомствам?","Нравится ли общественная работа?","Приятнее ли проводить время с книгами?","Легко ли отступаете от намерений?","Легко ли устанавливаете контакты со старшими?","Любите ли организовывать игры?","Трудно ли включаться в новую компанию?","Откладываете ли дела?","Легко ли контактировать с незнакомыми?","Стремитесь ли, чтобы товарищи действовали по Вашему мнению?","Трудно ли осваиваться в новом коллективе?","Нет ли конфликтов из-за невыполнения обязанностей?","Стремитесь ли знакомиться?","Принимаете ли инициативу?","Раздражают ли окружающие?","Плохо ли ориентируетесь в незнакомой обстановке?","Нравится ли быть среди людей?","Раздражение из-за незавершенного дела?","Стеснение при знакомстве?","Утомление от общения?","Любите ли коллективные игры?","Проявляете ли инициативу в интересах товарищей?","Неуверенность среди малознакомых?","Редко отстаиваете правоту?","Вносите ли оживление в компанию?","Участие в общественной работе?","Ограничиваете ли круг знакомых?","Не отстаиваете ли мнение?","Непринужденность в незнакомой компании?","Охотно организуете мероприятия?","Неуверенность перед группой?","Опаздываете ли?","Много ли друзей?","Смущение при общении?","Пугает ли новый коллектив?","Неуверенность в большой группе?" ];
const mikhelsonQuestions = [ {q:'Кто-либо говорит Вам: "Мне кажется, что Вы замечательный человек". Вы обычно:', options:['"Нет, что Вы! Я таким не являюсь"','"Спасибо, я действительно человек выдающийся"','"Спасибо"','Ничего не говорите и краснеете','"Да, я отличаюсь от других в лучшую сторону"'], correct:2}, {q:'Кто-либо совершает замечательный поступок. Вы обычно:', options:['"Нормально!"','"Отлично, но я видел получше"','Ничего не говорите','"Я могу сделать гораздо лучше"','"Это действительно замечательно!"'], correct:4}, {q:'Вы делаете дело хорошо, кто-то говорит: "Мне это не нравится!". Вы:', options:['"Вы - болван!"','"Я думаю, это заслуживает хорошей оценки"','"Вы правы" (не согласны)','"Это выдающийся уровень. Что Вы понимаете?"','Обижаетесь и молчите'], correct:1}, {q:'Вы забыли предмет, кто-то говорит: "Вы такой растяпа!". Вы:', options:['"Я толковее Вас!"','"Да, иногда я веду себя как растяпа"','"Если кто растяпа, то Вы"','"У всех есть недостатки. Я не заслуживаю такой оценки"','Игнорируете'], correct:3}, {q:'Кто-то опоздал на 30 минут без объяснений. Вы:', options:['"Я расстроен, что заставили ждать"','"Я думал, когда Вы придёте"','"Это последний раз, когда я ждал Вас"','Ничего не говорите','"Как Вы смели так опаздывать!"'], correct:0}, {q:'Вам нужно, чтобы кто-то сделал для Вас вещь. Вы:', options:['Никого ни о чём не просите','"Вы должны сделать это для меня"','"Не могли бы Вы сделать одну вещь?" + объясняете','Слегка намекаете','"Я очень хочу, чтобы Вы сделали это"'], correct:2}, {q:'Вы знаете, что кто-то расстроен. Вы:', options:['"Вы выглядите расстроенным. Могу помочь?"','Не заводите разговор о состоянии','"У Вас неприятность?"','Ничего не говорите и оставляете одного','"Вы как большой ребенок!" (смеясь)'], correct:0}, {q:'Вы расстроены, кто-то говорит: "Вы выглядите расстроенным". Вы:', options:['Отрицательно качаете головой/не реагируете','"Это не Ваше дело!"','"Да, немного расстроен. Спасибо за участие"','"Пустяки"','"Оставьте меня одного"'], correct:2}, {q:'Вас порицают за ошибку, совершённую другими. Вы:', options:['"Вы с ума сошли!"','"Это не моя вина, ошибка другого"','"Я не думаю, что это моя вина"','"Оставьте меня, Вы не знаете, что говорите"','Принимаете вину или молчите'], correct:2}, {q:'Кто-то просит сделать что-то, но Вы не знаете зачем. Вы:', options:['"Это не имеет смысла, не хочу"','Выполняете и молчите','"Это глупость, не буду"','"Объясните, почему это должно быть сделано"','"Если Вы хотите..." + выполняете'], correct:3}, {q:'Кто-то говорит, что Вы сделали великолепно. Вы:', options:['"Да, я делаю лучше большинства"','"Нет, это не было столь здорово"','"Правильно, я делаю лучше всех"','"Спасибо"','Игнорируете'], correct:3}, {q:'Кто-то был очень любезен с Вами. Вы:', options:['"Вы действительно были очень любезны"','"Да, спасибо" (как будто не был любезен),'Вы вели себя нормально, но я заслуживаю большего"','Игнорируете','"Вы вели себя недостаточно хорошо"'], correct:0}, {q:'Вы громко разговариваете, кто-то просит говорить тише. Вы:', options:['Немедленно прекращаете беседу','"Если не нравится — проваливайте"','"Извините, буду говорить тише" + продолжаете приглушённо','"Извините" + прекращаете','"Всё в порядке" + продолжаете громко'], correct:2}, {q:'В очереди кто-то становится впереди Вас. Вы:', options:['Негромко комментируете, ни к кому не обращаясь','"Становитесь в хвост очереди!"','Ничего не говорите','"Выйди из очереди, нахал!" (громко)','"Я занял очередь раньше. Пожалуйста, станьте в конец"'], correct:4}, {q:'Кто-то делает то, что Вам не нравится и раздражает. Вы:', options:['"Вы болван, я ненавижу Вас!" (выкрик)','"Я сердит на Вас. Мне не нравится, что Вы делаете"','Повреждаете делу, но молчите','"Я рассержен. Вы мне не нравитесь"','Игнорируете'], correct:1}, {q:'У кого-то есть вещь, которой Вы хотели бы пользоваться. Вы:', options:['Требуете дать вещь','Воздерживаетесь от просьб','Отбираете вещь','Говорите, что хотели бы пользоваться, и просите','Рассуждаете, но не просите'], correct:3}, {q:'Кто-то просит одолжить новый предмет, но Вы не хотите. Вы:', options:['"Нет, только достал, не хочу расставаться; может потом"','"Не хотел бы давать, но можете попользоваться"','"Нет, приобретайте свой!"','Одалживаете вопреки нежеланию','"Вы с ума сошли!"'], correct:0}, {q:'Люди беседуют о хобби, которое нравится Вам, Вы хотите присоединиться. Вы:', options:['Ничего не говорите','Прерываете и рассказываете о своих успехах','Подходите и при удобном случае вступаете в разговор','Подходите и ждёте, когда обратят внимание','Прерываете и говорите, как сильно нравится хобби'], correct:2}, {q:'Вы занимаетесь хобби, кто-то спрашивает: "Что Вы делаете?". Вы:', options:['"О, это пустяк" / "Ничего особенного"','"Не мешайте, разве не видите, что занят?"','Продолжаете молча работать','"Это Вас не касается"','Прекращаете и объясняете, что делаете'], correct:4}, {q:'Вы видите споткнувшегося человека. Вы:', options:['"Почему не смотрите под ноги?" (смеясь)','"У Вас всё в порядке? Могу помочь?"','"Что случилось?"','"Это всё колдобины в тротуаре"','Никак не реагируете'], correct:1}, {q:'Вы ушиблись, кто-то спрашивает: "С Вами всё в порядке?". Вы:', options:['"Я прекрасно себя чувствую. Оставьте меня!"','Ничего не говорите, игнорируете','"Почему не занимаетесь своим делом?"','"Нет, ушиб голову, спасибо за внимание"','"Пустяки, всё будет о\'кей"'], correct:3}, {q:'Вы допустили ошибку, но вина возложена на другого. Вы:', options:['Ничего не говорите','"Это их ошибка!"','"Эту ошибку допустил Я"','"Я не думаю, что это сделал этот человек"','"Это их горькая доля"'], correct:2}, {q:'Вы оскорблены словами в Ваш адрес. Вы:', options:['Уходите, не сказав, что расстроены','Заявляйте, чтобы не смел больше','Ничего не говорите, хотя обижены','Оскорбляете в ответ','Заявляйте, что не нравится, и что не должен делать снова'], correct:4}, {q:'Кто-то часто перебивает, когда Вы говорите. Вы:', options:['"Извините, но я хотел бы закончить"','"Так не делают. Могу продолжить?"','Прерываете этого человека, возобновляя рассказ','Ничего не говорите, позволяя продолжать','"Замолчите! Вы меня перебили!"'], correct:0}, {q:'Кто-то просит сделать что-то, что помешает Вашим планам. Вы:', options:['"Имел другие планы, но сделаю, что хотите"','"Ни в коем случае! Поищите кого-то ещё"','"Хорошо, сделаю, что хотите"','"Отойдите, оставьте меня"','"Уже приступил к другим планам. Может, потом"'], correct:4}, {q:'Вы видите кого-то, с кем хотели бы познакомиться. Вы:', options:['Радостно окликаете и идёте навстречу','Подходите, представляетесь и начинаете разговор','Подходите и ждёте, когда заговорят с Вами','Подходите и рассказываете о крупных делах','Ничего не говорите'], correct:1}, {q:'Незнакомец окликает Вас: "Привет!". Вы:', options:['"Что Вам угодно?"','Ничего не говорите','"Оставьте меня в покое"','"Привет!", представляетесь и просите представиться','Киваете, "Привет!" и проходите мимо'], correct:3} ];

// --- ЛОГИКА И СОСТОЯНИЯ ---
let currentTheme = 'dark';
let selectedGrades = [];
let currentTestData = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let currentPsyTest = null;
let psyQuestionIndex = 0;
let psyAnswers = [];

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${viewName}-view`).classList.add('active');
  
  // Обновление активной кнопки навигации
  document.querySelectorAll('.nav-link-btn').forEach(link => link.classList.remove('active-nav'));
  const activeLink = document.querySelector(`.nav-link-btn[data-view="${viewName}"]`);
  if (activeLink) activeLink.classList.add('active-nav');
  
  if (viewName === 'psychology') {
    document.body.classList.add('psychology-mode');
    setVisColor('#64b5f6');
  } else {
    document.body.classList.remove('psychology-mode');
    if (currentTheme === 'light') setVisColor('#d9441e');
    else setVisColor('#ff8c32');
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (!document.body.classList.contains('psychology-mode')) {
    setVisColor(currentTheme === 'light' ? '#d9441e' : '#ff8c32');
  }
}

// --- ЛОГИКА ПСИХОЛОГИИ ---
function startPsyTest(type) {
  currentPsyTest = type;
  psyQuestionIndex = 0;
  psyAnswers = [];
  document.getElementById('modal-title').innerText = "Данные для психологического теста";
  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('modal-overlay').classList.add('active');
}

function renderPsyQuestion() {
  const container = document.getElementById('psych-question-container');
  const total = currentPsyTest === 'kos' ? kosQuestions.length : mikhelsonQuestions.length;
  document.getElementById('psych-progress-fill').style.width = `${(psyQuestionIndex / total) * 100}%`;

  let html = '';
  if (currentPsyTest === 'kos') {
    html = `<h3 style="margin-bottom: 15px; font-family: var(--font-heading); font-weight: 500; font-size: 1.3rem;">${kosQuestions[psyQuestionIndex]}</h3>`;
    html += `<button class="option-btn" onclick="recordPsyAnswer('Да')">Да</button>`;
    html += `<button class="option-btn" onclick="recordPsyAnswer('Нет')">Нет</button>`;
  } else {
    const q = mikhelsonQuestions[psyQuestionIndex];
    html = `<h3 style="margin-bottom: 15px; font-family: var(--font-heading); font-weight: 500; font-size: 1.3rem;">${q.q}</h3>`;
    q.options.forEach((opt, i) => {
      html += `<button class="option-btn" onclick="recordPsyAnswer(${i})">${opt}</button>`;
    });
  }
  container.innerHTML = html;
}

function recordPsyAnswer(ans) {
  psyAnswers.push(ans);
  psyQuestionIndex++;
  const total = currentPsyTest === 'kos' ? kosQuestions.length : mikhelsonQuestions.length;
  if (psyQuestionIndex < total) {
    renderPsyQuestion();
  } else {
    finishPsyTest();
  }
}

function finishPsyTest() {
  document.getElementById('psych-test').style.display = 'none';
  document.getElementById('psych-intro').style.display = 'block';
  alert("Тест завершён! Ваш результат отправлен.");
  
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  
  fetch("https://formsubmit.co/ajax/9266031377@bk.ru", {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ test: currentPsyTest, name, email, answers: psyAnswers })
  }).catch(err => console.error('Error:', err));
}

function resetPsyTest() {
  document.getElementById('psych-test').style.display = 'none';
  document.getElementById('psych-intro').style.display = 'block';
}

// --- ЛОГИКА ИСТОРИИ ---
function showGradeSelection() {
  document.getElementById('hist-intro').style.display = 'none';
  document.getElementById('hist-grades').style.display = 'block';
}

function toggleGrade(grade, btn) {
  if (selectedGrades.includes(grade)) {
    selectedGrades = selectedGrades.filter(g => g !== grade);
    btn.classList.remove('active');
  } else {
    selectedGrades.push(grade);
    btn.classList.add('active');
  }
  document.getElementById('start-test-btn').disabled = selectedGrades.length === 0;
}

function startHistoryTest() {
  currentPsyTest = null;
  document.getElementById('modal-title').innerText = "Данные для теста по истории";
  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('modal-overlay').classList.add('active');
}

function submitUserInfo() {
  const name = document.getElementById('user-name').value;
  if (!name) { alert("Пожалуйста, введите ФИО"); return; }
  document.getElementById('modal-overlay').classList.remove('active');

  if (currentPsyTest) {
    document.getElementById('psych-intro').style.display = 'none';
    document.getElementById('psych-test').style.display = 'block';
    renderPsyQuestion();
  } else {
    currentTestData = [];
    selectedGrades.sort().forEach(g => { currentTestData = currentTestData.concat(historyData[g]); });
    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById('hist-grades').style.display = 'none';
    document.getElementById('hist-test').style.display = 'block';
    renderHistoryQuestion();
  }
}

const salviaMsgs = ["💬 Хмм, интересный ответ…", "💬 Любопытно, как ты мыслишь!", "💬 Продолжай в том же духе, это увлекательно!", "💬 Так-так, что тут у нас…", "💬 Интересный выбор!"];

function renderHistoryQuestion() {
  const container = document.getElementById('question-container');
  document.getElementById('progress-fill').style.width = `${(currentQuestionIndex / currentTestData.length) * 100}%`;

  const salviaContainer = document.getElementById('salvia-container');
  if (currentQuestionIndex > 0 && currentQuestionIndex % 4 === 0) {
    const msg = salviaMsgs[Math.floor(Math.random() * salviaMsgs.length)];
    salviaContainer.innerHTML = `<div class="salvia-msg">${msg}</div>`;
  } else {
    salviaContainer.innerHTML = '';
  }

  const q = currentTestData[currentQuestionIndex];
  let html = `<h3 style="margin-bottom: 15px; font-family: var(--font-heading); font-weight: 500; font-size: 1.3rem;">${q.q}</h3>`;

  if (q.type === 'choice') {
    q.options.forEach((opt, i) => { html += `<button class="option-btn" onclick="selectChoice(${i})">${opt}</button>`; });
  } else if (q.type === 'match') {
    html += '<p style="margin-bottom:15px; color: var(--text-secondary);">Перетащите элементы из правой колонки в левую:</p><div style="display:flex; gap:20px; flex-wrap:wrap;"><div style="flex:1; min-width:200px;">';
    q.pairs.forEach((p, i) => { html += `<div class="match-slot" data-id="${i}" ondrop="dropMatch(event)" ondragover="allowDropMatch(event)">${p.left}</div>`; });
    html += '</div><div style="flex:1; min-width:200px;">';
    q.pairs.forEach((p, i) => { html += `<div class="match-item" draggable="true" ondragstart="dragMatch(event)" data-id="${i}">${p.right}</div>`; });
    html += '</div></div><button class="btn primary" style="margin-top:15px;" onclick="submitMatch()">Подтвердить соответствие</button>';
  } else if (q.type === 'fill') {
    q.fields.forEach((f, i) => { html += `<div style="margin-bottom:15px;"><label style="color: var(--text-secondary); font-size: 1rem;">${f.label}</label><input type="text" class="fill-input" data-id="${i}"></div>`; });
    html += `<button class="btn primary" style="margin-top:15px;" onclick="submitFill()">Подтвердить ответы</button>`;
  }
  container.innerHTML = html;
}

function selectChoice(index) { userAnswers.push({ qIndex: currentQuestionIndex, answer: index }); nextQuestion(); }
function allowDropMatch(ev) { ev.preventDefault(); }
function dragMatch(ev) { ev.dataTransfer.setData("text", ev.target.dataset.id); }
function dropMatch(ev) {
  ev.preventDefault();
  const draggedId = ev.dataTransfer.getData("text");
  const draggedElement = document.querySelector(`.match-item[data-id="${draggedId}"]`);
  const slot = ev.target.closest('.match-slot');
  if (draggedElement && slot) { slot.appendChild(draggedElement); }
}
function submitMatch() {
  const slots = document.querySelectorAll('.match-slot');
  let ans = [];
  slots.forEach(s => { const slotId = s.dataset.id; const item = s.querySelector('.match-item'); ans.push({ slot: slotId, item: item ? item.dataset.id : null }); });
  userAnswers.push({ qIndex: currentQuestionIndex, answer: ans });
  nextQuestion();
}
function submitFill() {
  const inputs = document.querySelectorAll('.fill-input');
  let ans = [];
  inputs.forEach(inp => { ans.push({ field: inp.dataset.id, value: inp.value }); });
  userAnswers.push({ qIndex: currentQuestionIndex, answer: ans });
  nextQuestion();
}
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentTestData.length) { renderHistoryQuestion(); } else { finishHistoryTest(); }
}

function finishHistoryTest() {
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('question-container').innerHTML = '<h2 style="text-align:center;">Тест завершён! Ваш результат отправлен.</h2>';
  document.getElementById('salvia-container').innerHTML = '';

  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  const payload = { name, email, grades: selectedGrades, results: userAnswers.map(a => { const q = currentTestData[a.qIndex]; return { question: q.q, userAnswer: a.answer, correctAnswer: q.correct || q.pairs || q.fields }; }) };

  fetch("https://formsubmit.co/ajax/aniruf14.02@gmail.com", { method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) }).catch(err => console.error('FormSubmit Error:', err));
  fetch("https://script.google.com/macros/s/AKfycbwmbw_-MYraqUsSp452jWfdf1tPOX7TNrGR_Gm8JcBO_DGzODjv35ybwq9nIGDqK4TWDw/exec?key=fox_secret_2026", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(err => console.error('Sheets Error:', err));
}

function resetHistoryTest() {
  selectedGrades = []; currentTestData = null; currentQuestionIndex = 0; userAnswers = [];
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('hist-test').style.display = 'none';
  document.getElementById('hist-grades').style.display = 'none';
  document.getElementById('hist-intro').style.display = 'block';
  document.getElementById('start-test-btn').disabled = true;
}

// --- ВИЗУАЛИЗАТОР И ЧАСТИЦЫ ---
document.addEventListener('DOMContentLoaded', () => {
  // Частицы фона
  const pCanvas = document.getElementById('particles-bg');
  const pCtx = pCanvas.getContext('2d');
  let pW, pH, particles = [];
  function resizeP() { pW = pCanvas.width = window.innerWidth; pH = pCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeP); resizeP();
  for (let i=0; i<50; i++) particles.push({x:Math.random()*pW,y:Math.random()*pH,r:Math.random()*1.5+0.3,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,alpha:Math.random()*0.5+0.2,pulse:Math.random()*Math.PI*2});
  function animateP() {
    pCtx.clearRect(0,0,pW,pH);
    const bColor = currentTheme === 'light' ? '100,100,140' : '180,180,210';
    particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<-10)p.x=pW+10;if(p.x>pW+10)p.x=-10;if(p.y<-10)p.y=pH+10;if(p.y>pH+10)p.y=-10;p.pulse+=0.02;const alpha=p.alpha+Math.sin(p.pulse)*0.15;pCtx.beginPath();pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);pCtx.fillStyle=`rgba(${bColor},${Math.max(0.05,alpha)})`;pCtx.fill();});
    for (let i=0;i<particles.length;i++) for (let j=i+1;j<particles.length;j++) { const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,dist=Math.sqrt(dx*dx+dy*dy); if(dist<120){pCtx.beginPath();pCtx.moveTo(particles[i].x,particles[i].y);pCtx.lineTo(particles[j].x,particles[j].y);pCtx.strokeStyle=`rgba(${bColor},${0.04*(1-dist/120)})`;pCtx.lineWidth=0.5;pCtx.stroke();}}
    requestAnimationFrame(animateP);
  }
  animateP();

  // Амплитудный визуализатор (полный экран)
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy;
  function resizeViz() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2; cy = H / 2;
  }
  window.addEventListener('resize', resizeViz); resizeViz();

  const vizParams = { points: 4, radius: 0.23, speed: 0.9, amp: 1.7, ghosts: 0, dt: 1.0, color: '#ff8c32', glow: 80, parallax: 0 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', e => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; });
  
  const waves = [{freq:1.0,amp:0.35,phase:0},{freq:2.3,amp:0.22,phase:Math.PI/3},{freq:3.7,amp:0.15,phase:Math.PI/1.7}];
  let pulses = [];
  function regenPulses(n) { pulses = []; for (let i=0; i<n; i++) pulses.push({freq:0.8+Math.random()*1.8, phase:Math.random()*Math.PI*2, amp:0.04+Math.random()*0.08}); }
  regenPulses(vizParams.points);

  function computePoints(t, baseR) {
    const n = vizParams.points; const points = [];
    for (let i=0; i<n; i++) {
      const angle = (i/n)*Math.PI*2; let r = baseR;
      for (const w of waves) {
        r += baseR * w.amp * vizParams.amp * Math.sin(angle * w.freq + t * 0.8 * vizParams.speed + w.phase);
        r += baseR * w.amp * 0.5 * vizParams.amp * Math.cos(angle * (w.freq+1) - t * 0.6 * vizParams.speed + w.phase);
      }
      const p = pulses[i] || {freq:1, phase:0, amp:0};
      r *= 1 + p.amp * Math.sin(t * p.freq + p.phase);
      points.push({x: Math.cos(angle)*r, y: Math.sin(angle)*r});
    }
    return points;
  }

  function drawCatmullRom(context, points, offX, offY, cX, cY) {
    const n = points.length; context.beginPath();
    for (let i=0; i<n; i++) {
      const p0 = points[(i-1+n)%n], p1 = points[i], p2 = points[(i+1)%n], p3 = points[(i+2)%n];
      const steps = 18;
      for (let s=0; s<=steps; s++) {
        const t = s/steps, t2 = t*t, t3 = t2*t;
        const x = 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3);
        const y = 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3);
        const px = cX + x + offX, py = cY + y + offY;
        if (i===0 && s===0) context.moveTo(px, py); else context.lineTo(px, py);
      }
    }
    context.closePath();
  }

  function hexToRgb(hex) { const m = hex.replace('#',''); return {r:parseInt(m.substring(0,2),16), g:parseInt(m.substring(2,4),16), b:parseInt(m.substring(4,6),16)}; }

  function drawScene(t) {
    ctx.clearRect(0,0,W,H);
    const rgb = hexToRgb(vizParams.color); const colorStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    const parX = mouse.x * vizParams.parallax * 0.3, parY = mouse.y * vizParams.parallax * 0.3;
    
    for (let g=0; g<vizParams.ghosts; g++) {
      const ratio = (g+1)/(vizParams.ghosts+1), dt = vizParams.dt * (vizParams.ghosts-g);
      const alpha = 0.03 + ratio * 0.1, width = 0.5 + ratio * 0.9;
      const pts = computePoints(t - dt, Math.min(W,H) * vizParams.radius);
      drawCatmullRom(ctx, pts, parX*0.5, parY*0.5, cx, cy);
      ctx.strokeStyle = `rgba(${colorStr},${alpha})`; ctx.lineWidth = width;
      ctx.shadowBlur = 6; ctx.shadowColor = `rgba(${colorStr},${alpha})`; ctx.stroke();
    }
    
    const mainPts = computePoints(t, Math.min(W,H) * vizParams.radius);
    drawCatmullRom(ctx, mainPts, parX, parY, cx, cy);
    ctx.shadowBlur = vizParams.glow * 0.35; ctx.shadowColor = `rgba(${colorStr},0.85)`;
    ctx.strokeStyle = `rgba(${colorStr},0.95)`; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(${Math.min(255,rgb.r+50)},${Math.min(255,rgb.g+50)},${Math.min(255,rgb.b+60)},0.85)`;
    ctx.lineWidth = 0.7; ctx.stroke();
  }

  let startTime = performance.now();
  function animateViz() {
    const t = (performance.now() - startTime) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.03; mouse.y += (mouse.ty - mouse.y) * 0.03;
    drawScene(t);
    requestAnimationFrame(animateViz);
  }
  animateViz();

  // UI Привязки
  const vizToggle = document.getElementById('vizToggle'), vizPanel = document.getElementById('vizPanel'), vizClose = document.getElementById('closeViz');
  vizToggle.onclick = () => vizPanel.classList.toggle('open');
  vizClose.onclick = () => vizPanel.classList.remove('open');

  window.setVisColor = (color) => {
    vizParams.color = color;
    document.getElementById('color').value = color;
  };

  function bindViz(id, key, displayId, format) {
    const input = document.getElementById(id), display = displayId ? document.getElementById(displayId) : null;
    input.addEventListener('input', () => {
      const v = input.type === 'range' ? parseFloat(input.value) : input.value;
      vizParams[key] = v;
      if (display) display.textContent = format ? format(v) : v;
      if (key === 'points') regenPulses(v);
    });
  }
  bindViz('points', 'points', 'v-points', v => v.toFixed(0));
  bindViz('radius', 'radius', 'v-radius', v => v.toFixed(2));
  bindViz('speed', 'speed', 'v-speed', v => v.toFixed(2));
  bindViz('amp', 'amp', 'v-amp', v => v.toFixed(2));
  bindViz('ghosts', 'ghosts', 'v-ghosts', v => v.toFixed(0));
  bindViz('glow', 'glow', 'v-glow', v => v.toFixed(0));
  bindViz('parallax', 'parallax', 'v-parallax', v => v.toFixed(0));
  bindViz('color', 'color');

  document.getElementById('randomBtn').onclick = () => {
    const rnd = (min, max) => Math.random() * (max - min) + min;
    document.getElementById('points').value = Math.floor(rnd(4, 12)); vizParams.points = parseInt(document.getElementById('points').value); regenPulses(vizParams.points); document.getElementById('v-points').textContent = vizParams.points;
    document.getElementById('amp').value = rnd(0.5, 2).toFixed(2); vizParams.amp = parseFloat(document.getElementById('amp').value); document.getElementById('v-amp').textContent = vizParams.amp.toFixed(2);
    document.getElementById('speed').value = rnd(0.5, 2).toFixed(2); vizParams.speed = parseFloat(document.getElementById('speed').value); document.getElementById('v-speed').textContent = vizParams.speed.toFixed(2);
  };
  document.getElementById('resetBtn').onclick = () => {
    const defaults = {points:4, radius:0.23, speed:0.9, amp:1.7, ghosts:0, glow:80, parallax:0};
    Object.keys(defaults).forEach(k => {
      vizParams[k] = defaults[k];
      const el = document.getElementById(k);
      if (el) { el.value = defaults[k]; const dsp = document.getElementById('v-'+k); if (dsp) dsp.textContent = defaults[k]; }
    });
    regenPulses(4);
  };
});
