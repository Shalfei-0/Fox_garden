document.addEventListener('DOMContentLoaded', () => {
    // === ДАННЫЕ ТЕСТА (6 класс: Древняя Русь) ===
    const tests = [{
        id: 'knyazya',
        title: 'Древняя Русь: первые князья',
        desc: 'Рюрик, Олег, Игорь, Ольга. Проверь знания.',
        questions: [
            { q: 'В каком году произошло призвание варягов на Русь?', options: ['862','882','911','988'], correct: 0 },
            { q: 'Кто захватил Киев в 882 году?', options: ['Рюрик','Олег Вещий','Игорь','Святослав'], correct: 1 },
            { q: 'Какое племя убило князя Игоря при сборе дани?', options: ['Поляне','Древляне','Вятичи','Кривичи'], correct: 1 },
            { q: 'Что ввела княгиня Ольга вместо полюдья?', options: ['Налоги серебром','Уроки и погосты','Свободную торговлю','Воинскую повинность'], correct: 1 },
            { q: 'Кто стал первым киевским князем династии Рюриковичей?', options: ['Рюрик','Олег','Игорь','Владимир'], correct: 1 }
        ]
    }];

    // === СОСТОЯНИЕ ===
    let currentTest = null, qIdx = 0, score = 0, answered = false;
    let userFIO = '', userEmail = '';
    const completed = JSON.parse(localStorage.getItem('fox_completed') || '[]');

    // === ТЕМА ===
    const themeBtn = document.getElementById('theme-toggle');
    const isLight = localStorage.getItem('fox_theme') === 'light';
    document.body.classList.toggle('light-theme', isLight);
    themeBtn.textContent = isLight ? '🌙' : '🌓';
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const light = document.body.classList.contains('light-theme');
        themeBtn.textContent = light ? '🌙' : '🌓';
        localStorage.setItem('fox_theme', light ? 'light' : 'dark');
    });

    // === НАВИГАЦИЯ ===
    window.switchTab = (id) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === id));
        document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    };
    document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

    // === РЕНДЕР ТЕСТОВ ===
    function renderTests() {
        const grid = document.getElementById('tests-grid');
        grid.innerHTML = '';
        tests.forEach(t => {
            const done = completed.includes(t.id);
            grid.innerHTML += `
                <div class="test-card ${done?'completed':''}" onclick="openFio('${t.id}')">
                    ${done?'<span class="done-badge">✅ Пройден</span>':''}
                    <h3>${t.title}</h3>
                    <p>${t.desc}</p>
                    <span class="badge">${t.questions.length} вопросов</span>
                </div>`;
        });
    }
    renderTests();

    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm('Сбросить прогресс?')) {
            localStorage.removeItem('fox_completed');
            completed.length = 0;
            renderTests();
        }
    });

    // === МОДАЛКА ФИО ===
    const modal = document.getElementById('fio-modal');
    let pendingId = null;

    window.openFio = (id) => {
        pendingId = id;
        modal.style.display = 'flex';
        document.getElementById('fio-input').value = '';
        document.getElementById('email-input').value = '';
        document.getElementById('fio-input').focus();
    };

    document.getElementById('start-test-btn').addEventListener('click', () => {
        const fio = document.getElementById('fio-input').value.trim();
        if(!fio) return alert('Шалфей ждёт твоего имени... Введи ФИО!');
        userFIO = fio;
        userEmail = document.getElementById('email-input').value.trim();
        modal.style.display = 'none';
        startTest(pendingId);
    });

    document.getElementById('cancel-test-btn').addEventListener('click', () => { modal.style.display = 'none'; pendingId = null; });

    // === ЛОГИКА ТЕСТА ===
    function startTest(id) {
        currentTest = tests.find(t => t.id === id);
        qIdx = 0; score = 0; answered = false;
        document.getElementById('test-list-view').classList.add('hidden');
        document.getElementById('test-active-view').classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const q = currentTest.questions[qIdx];
        const box = document.getElementById('quiz-box');
        answered = false;
        box.innerHTML = `
            <h3 style="margin-bottom:15px;color:var(--accent)">${q.q}</h3>
            <div id="opts"></div>`;
        const opts = document.getElementById('opts');
        q.options.forEach((opt, i) => {
            opts.innerHTML += `<button class="quiz-opt" onclick="check(${i})">${opt}</button>`;
        });
    }

    window.check = (idx) => {
        if(answered) return;
        answered = true;
        const correct = currentTest.questions[qIdx].correct;
        document.querySelectorAll('.quiz-opt').forEach((btn, i) => {
            btn.classList.add('disabled');
            if(i===correct) btn.classList.add('correct');
            if(i===idx && i!==correct) btn.classList.add('wrong');
        });
        if(idx===correct) score++;
        setTimeout(() => {
            qIdx++;
            qIdx < currentTest.questions.length ? showQuestion() : finishTest();
        }, 1200);
    };

    function finishTest() {
        const pct = Math.round((score/currentTest.questions.length)*100);
        const box = document.getElementById('quiz-box');
        
        if(!completed.includes(currentTest.id)) {
            completed.push(currentTest.id);
            localStorage.setItem('fox_completed', JSON.stringify(completed));
            renderTests();
        }

        // АВТООТПРАВКА
        sendResults(pct);

        box.innerHTML = `
            <h2 style="text-align:center;margin-bottom:10px">Результат: ${pct}%</h2>
            <p style="text-align:center;margin-bottom:20px">${score} из ${currentTest.questions.length}</p>
            <div id="mail-status" style="text-align:center;padding:12px;background:rgba(255,255,255,0.1);border-radius:10px">📤 Отправка результатов Шалфею...</div>
            <button class="btn-primary" style="width:100%;margin-top:15px" onclick="startTest('${currentTest.id}')">🔄 Пройти снова</button>
            <button class="btn-secondary" style="width:100%;margin-top:10px" onclick="exitTest()">📋 К списку</button>
        `;
    }

    window.exitTest = () => {
        document.getElementById('test-active-view').classList.add('hidden');
        document.getElementById('test-list-view').classList.remove('hidden');
    };

    // === ОТПРАВКА НА ПОЧТУ (FormSubmit AJAX) ===
    async function sendResults(pct) {
        const st = document.getElementById('mail-status');
        const data = {
            _subject: `🦊 Тест "${currentTest.title}" — ${userFIO}`,
            ФИО: userFIO,
            Email: userEmail || 'Не указан',
            Результат: `${pct}% (${score}/${currentTest.questions.length})`,
            Тест: currentTest.title,
            Дата: new Date().toLocaleString('ru-RU'),
            _captcha: 'false'
        };

        try {
            const res = await fetch('https://formsubmit.co/ajax/aniruf14.02@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            if(res.ok) {
                st.innerHTML = '✅ Результаты успешно отправлены!';
                st.style.background = 'rgba(76,175,80,0.2)';
            } else throw new Error('Ошибка сети');
        } catch(e) {
            st.innerHTML = '⚠️ Ошибка отправки. Проверь интернет или активируй FormSubmit в почте.';
            st.style.background = 'rgba(244,67,54,0.2)';
            console.error(e);
        }
    }

    // === ЛЕПЕСТКИ ===
    const pc = document.getElementById('petals-container');
    const count = window.innerWidth < 768 ? 6 : 12;
    for(let i=0; i<count; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random()*100 + '%';
        p.style.animationDuration = (Math.random()*4 + 4) + 's';
        p.style.animationDelay = Math.random()*5 + 's';
        pc.appendChild(p);
    }
});

// ========== ПСИХОЛОГИЧЕСКИЙ ТЕСТ КОС ==========
const psychTestTab = document.getElementById('psych-test-tab');
const psychTestStart = document.getElementById('psych-test-start');
const psychTestQuestions = document.getElementById('psych-test-questions');
const psychTestResults = document.getElementById('psych-test-results');
const psychQuestionText = document.getElementById('psych-question-text');
const psychProgress = document.getElementById('psych-progress');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const asyaMessageDiv = document.getElementById('asya-message');

// Вопросы теста КОС (40 вопросов из документа)
const kosQuestions = [
    "Много ли у Вас друзей, с которыми Вы постоянно общаетесь?",
    "Часто ли Вам удается склонить большинство своих товарищей к принятию ими Вашего мнения?",
    "Долго ли Вас беспокоит чувство обиды, причиненное Вам кем-то из Ваших товарищей?",
    "Всегда ли Вам трудно ориентироваться в создавшейся критической ситуации?",
    "Есть ли у Вас стремление к установлению новых знакомств с разными людьми?",
    "Нравится ли Вам заниматься общественной работой?",
    "Верно ли, что Вам приятнее и проще проводить время с книгами или за каким-либо другим занятием, чем с людьми?",
    "Если возникли какие-либо помехи в осуществлении Ваших намерений, то легко ли Вы отступаете от них?",
    "Легко ли Вы устанавливаете контакты с людьми, которые значительно старше Вас по возрасту?",
    "Любите ли Вы придумывать и организовывать со своими товарищами различные игры и развлечения?",
    "Трудно ли Вы включаетесь в новую для Вас компанию?",
    "Часто ли Вы откладываете на другие дни те дела, которые нужно было бы выполнить сегодня?",
    "Легко ли Вам удается устанавливать контакты с незнакомыми людьми?",
    "Стремитесь ли Вы добиваться, чтобы Ваши товарищи действовали в соответствии с Вашим мнением?",
    "Трудно ли Вы осваиваетесь в новом коллективе?",
    "Верно ли, что у Вас не бывает конфликтов с товарищами из-за невыполнения ими своих обязанностей, обязательств?",
    "Стремитесь ли Вы при удобном случае познакомиться и побеседовать с новым человеком?",
    "Часто ли Вы в решении важных дел принимаете инициативу на себя?",
    "Раздражают ли Вас окружающие люди и хочется ли Вам побыть одному?",
    "Правда ли, что Вы обычно плохо ориентируетесь в незнакомой для Вас обстановке?",
    "Нравится ли Вам постоянно находиться среди людей?",
    "Возникает ли у Вас раздражение, если Вам не удается закончить начатое дело?",
    "Испытываете ли Вы чувство затруднения, неудобства или стеснения, если приходится проявить инициативу, чтобы познакомиться с новым человеком?",
    "Правда ли, что Вы утомляетесь от частого общения с товарищами?",
    "Любите ли Вы участвовать в коллективных играх?",
    "Часто ли Вы проявляете инициативу при решении вопросов, затрагивающих интересы Ваших товарищей?",
    "Правда ли, что Вы чувствуете себя неуверенно среди малознакомых Вам людей?",
    "Верно ли, что Вы редко стремитесь к доказательству своей правоты?",
    "Полагаете ли Вы, что Вам не доставляет особого труда внести оживление в малознакомую Вам компанию?",
    "Принимаете ли Вы участие в общественной работе в школе?",
    "Стремитесь ли Вы ограничить круг своих знакомых небольшим количеством людей?",
    "Верно ли, что Вы не стремитесь отстаивать свое мнение или решение, если оно не было сразу принято Вашими товарищами?",
    "Чувствуете ли Вы себя непринужденно, попав в незнакомую Вам компанию?",
    "Охотно ли Вы приступаете к организации различных мероприятий для своих товарищей?",
    "Правда ли, что Вы не чувствуете себя достаточно уверенным и спокойным, когда приходится говорить что-либо большой группе людей?",
    "Часто ли Вы опаздываете на деловые встречи, свидания?",
    "Верно ли, что у Вас много друзей?",
    "Часто ли Вы смущаетесь, чувствуете неловкость при общении с малознакомыми людьми?",
    "Правда ли, что Вас пугает перспектива оказаться в новом коллективе?",
    "Правда ли, что Вы не очень уверенно чувствуете себя в окружении большой группы своих товарищей?"
];

// Ключи для подсчёта (из документа)
// Коммуникативные: ДА на 1,5,9,13,17,21,25,29,33,37 и НЕТ на 3,7,11,15,19,23,27,31,35,39
// Организаторские: ДА на 2,6,10,14,18,22,26,30,34,38 и НЕТ на 4,8,12,16,20,24,28,32,36,40

const communicativeYes = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37];
const communicativeNo = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39];
const organizerYes = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38];
const organizerNo = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

let currentPsychQuestion = 0;
let psychAnswers = [];
let psychResults = {};

// Мотивационные сообщения от Аси
const asyaMessages = {
    13: "🌸 Молодец! Треть уже пройдена, осталось чуть-чуть!",
    26: "✨ Отлично! Уже две трети позади! Ты справляешься!",
    35: "🎉 Почти финиш! Ещё несколько вопросов!"
};

function startPsychTest() {
    currentPsychQuestion = 0;
    psychAnswers = [];
    psychTestStart.classList.add('hidden');
    psychTestResults.classList.add('hidden');
    psychTestQuestions.classList.remove('hidden');
    totalQSpan.textContent = kosQuestions.length;
    showPsychQuestion();
}

function showPsychQuestion() {
    currentQSpan.textContent = currentPsychQuestion + 1;
    psychQuestionText.textContent = `${currentPsychQuestion + 1}. ${kosQuestions[currentPsychQuestion]}`;
    
    // Обновляем прогресс
    const progress = ((currentPsychQuestion) / kosQuestions.length) * 100;
    psychProgress.style.width = progress + '%';
    
    // Проверяем мотивационные сообщения
    if (asyaMessages[currentPsychQuestion]) {
        asyaMessageDiv.textContent = asyaMessages[currentPsychQuestion];
        asyaMessageDiv.style.display = 'block';
    } else {
        asyaMessageDiv.style.display = 'none';
    }
}

function answerPsychQuestion(answer) {
    psychAnswers.push(answer);
    currentPsychQuestion++;
    
    if (currentPsychQuestion < kosQuestions.length) {
        showPsychQuestion();
    } else {
        calculatePsychResults();
    }
}

function calculatePsychResults() {
    let communicativeScore = 0;
    let organizerScore = 0;
    
    // Подсчёт коммуникативных
    psychAnswers.forEach((answer, index) => {
        const qNum = index + 1;
        
        // ДА на коммуникативные
        if (communicativeYes.includes(qNum) && answer === 'yes') communicativeScore++;
        // НЕТ на коммуникативные
        if (communicativeNo.includes(qNum) && answer === 'no') communicativeScore++;
        
        // ДА на организаторские
        if (organizerYes.includes(qNum) && answer === 'yes') organizerScore++;
        // НЕТ на организаторские
        if (organizerNo.includes(qNum) && answer === 'no') organizerScore++;
    });
    
    // Вычисляем коэффициенты (0-1)
    const kCoefficient = (communicativeScore / 20).toFixed(2);
    const oCoefficient = (organizerScore / 20).toFixed(2);
    
    // Определяем уровень (1-5)
    const kLevel = getLevelFromCoefficient(kCoefficient);
    const oLevel = getLevelFromCoefficient(oCoefficient);
    
    psychResults = {
        communicative: {
            score: communicativeScore,
            coefficient: kCoefficient,
            level: kLevel,
            description: getLevelDescription(kLevel, 'коммуникативных')
        },
        organizer: {
            score: organizerScore,
            coefficient: oCoefficient,
            level: oLevel,
            description: getLevelDescription(oLevel, 'организаторских')
        }
    };
    
    showPsychResults();
}

function getLevelFromCoefficient(coef) {
    const c = parseFloat(coef);
    if (c < 0.2) return 1;
    if (c < 0.4) return 2;
    if (c < 0.6) return 3;
    if (c < 0.8) return 4;
    return 5;
}

function getLevelDescription(level, type) {
    const descriptions = {
        1: `Низкий уровень проявления ${type}. Вы не стремитесь к общению, чувствуете себя скованно в новой компании.`,
        2: `Уровень ниже среднего. Вы предпочитаете проводить время наедине с собой, ограничиваете свои знакомства.`,
        3: `Средний уровень. Вы стремитесь к контактам с людьми, но потенциал нуждается в развитии.`,
        4: `Высокий уровень! Вы не теряетесь в новой обстановке, быстро находите друзей, проявляете инициативу.`,
        5: `Очень высокий уровень! Вы испытываете потребность в ${type} и активно стремитесь к ним!`
    };
    return descriptions[level];
}

function showPsychResults() {
    psychTestQuestions.classList.add('hidden');
    psychTestResults.classList.remove('hidden');
    
    const content = document.getElementById('psych-results-content');
    content.innerHTML = `
        <div class="result-item">
            <h4>🗣️ Коммуникативные способности</h4>
            <p><strong>Баллы:</strong> ${psychResults.communicative.score} из 20</p>
            <p><strong>Коэффициент:</strong> ${psychResults.communicative.coefficient}</p>
            <p><strong>Уровень:</strong> ${psychResults.communicative.level} из 5</p>
            <p>${psychResults.communicative.description}</p>
        </div>
        <div class="result-item">
            <h4>📋 Организаторские способности</h4>
            <p><strong>Баллы:</strong> ${psychResults.organizer.score} из 20</p>
            <p><strong>Коэффициент:</strong> ${psychResults.organizer.coefficient}</p>
            <p><strong>Уровень:</strong> ${psychResults.organizer.level} из 5</p>
            <p>${psychResults.organizer.description}</p>
        </div>
    `;
}

async function sendPsychResults() {
    const email = document.getElementById('psych-email').value;
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status-message';
    
    const resultsText = `
Тест КОС - Результаты
═══════════════════════

️ КОММУНИКАТИВНЫЕ СПОСОБНОСТИ:
Баллы: ${psychResults.communicative.score} из 20
Коэффициент: ${psychResults.communicative.coefficient}
Уровень: ${psychResults.communicative.level} из 5
${psychResults.communicative.description}

📋 ОРГАНИЗАТОРСКИЕ СПОСОБНОСТИ:
Баллы: ${psychResults.organizer.score} из 20
Коэффициент: ${psychResults.organizer.coefficient}
Уровень: ${psychResults.organizer.level} из 5
${psychResults.organizer.description}

Email пользователя: ${email || 'Не указан'}
Дата: ${new Date().toLocaleString('ru-RU')}
    `.trim();
    
    const formData = {
        _subject: `🧠 Тест КОС - Результаты`,
        'Тест': 'Коммуникативные и организаторские склонности (КОС)',
        'Email_пользователя': email || 'Не указан',
        'Коммуникативные_баллы': psychResults.communicative.score,
        'Коммуникативные_коэффициент': psychResults.communicative.coefficient,
        'Коммуникативные_уровень': psychResults.communicative.level,
        'Организаторские_баллы': psychResults.organizer.score,
        'Организаторские_коэффициент': psychResults.organizer.coefficient,
        'Организаторские_уровень': psychResults.organizer.level,
        'Дата': new Date().toLocaleString('ru-RU'),
        'Подробные_результаты': resultsText,
        _captcha: 'false'
    };
    
    try {
        const response = await fetch('https://formsubmit.co/ajax/9266031377@bk.ru', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('✅ Результаты успешно отправлены на почту 9266031377@bk.ru!');
        } else {
            throw new Error('Ошибка сети');
        }
    } catch (e) {
        // Fallback: mailto
        const subject = encodeURIComponent('🧠 Тест КОС - Результаты');
        const body = encodeURIComponent(resultsText);
        window.location.href = `mailto:9266031377@bk.ru?subject=${subject}&body=${body}`;
    }
}

function backToPsychStart() {
    psychTestResults.classList.add('hidden');
    psychTestStart.classList.remove('hidden');
}

// Добавляем кнопку для перехода к психологическому тесту в главном меню
// (добавьте это в существующую секцию тестов)
function openPsychTest() {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Показываем психологический тест
    psychTestTab.classList.add('active');
}
