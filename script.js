document.addEventListener('DOMContentLoaded', () => {
    // ========== ДАННЫЕ ТЕСТОВ ==========
    // 1. Тест по истории (6 класс)
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

    // 2. Вопросы теста КОС (40 вопросов)
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
    
    // Ключи для КОС
    const communicativeYes = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37];
    const communicativeNo = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39];
    const organizerYes = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38];
    const organizerNo = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

    // ========== СОСТОЯНИЕ ==========
    let currentTest = null, qIdx = 0, score = 0, answered = false;
    let userFIO = '', userEmail = '';
    const completed = JSON.parse(localStorage.getItem('fox_completed') || '[]');

    // Переменные для теста КОС
    let currentKosQ = 0, kosAnswers = [], kosResults = {};
    
    // ========== ТЕМА ==========
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

    // ========== НАВИГАЦИЯ ==========
    window.switchTab = (id) => {
        // Скрываем псих-тест, если он открыт
        document.getElementById('psych-test-tab').classList.remove('active');
        
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === id));
        document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    };
    document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

    // ========== РЕНДЕР ТЕСТОВ ==========
    function renderTests() {
        const grid = document.getElementById('tests-grid');
        grid.innerHTML = '';
        
        // 1. Тест по истории
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
        
        // 2. Кнопка психологического теста
        grid.innerHTML += `
            <div class="test-card" onclick="startPsychTest()">
                <h3>🧠 Тест КОС</h3>
                <p>Коммуникативные и организаторские склонности</p>
                <span class="badge">40 вопросов</span>
            </div>`;
    }
    renderTests();

    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm('Сбросить прогресс?')) {
            localStorage.removeItem('fox_completed');
            completed.length = 0;
            renderTests();
        }
    });

    // ========== МОДАЛКА ФИО (ДЛЯ ИСТОРИИ) ==========
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

    // ========== ЛОГИКА ТЕСТА ПО ИСТОРИИ ==========
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
            st.innerHTML = '⚠️ Ошибка отправки. Проверь интернет.';
            st.style.background = 'rgba(244,67,54,0.2)';
        }
    }

    // ========== ПСИХОЛОГИЧЕСКИЙ ТЕСТ КОС ==========
    const psychTab = document.getElementById('psych-test-tab');
    const psychStart = document.getElementById('psych-test-start');
    const psychQuestions = document.getElementById('psych-test-questions');
    const psychResultsDiv = document.getElementById('psych-test-results');
    
    // Создаем цветочки на фоне
    function createFlowers() {
        const container = document.getElementById('flowers-container');
        const flowers = ['🌸', '🌼', '🌺', '', '💐'];
        for(let i=0; i<20; i++) {
            const f = document.createElement('div');
            f.className = 'flower';
            f.textContent = flowers[Math.floor(Math.random()*flowers.length)];
            f.style.left = Math.random()*100 + '%';
            f.style.top = Math.random()*100 + '%';
            f.style.animationDelay = Math.random()*10 + 's';
            f.style.fontSize = (Math.random()*20 + 30) + 'px';
            container.appendChild(f);
        }
    }
    createFlowers();

    window.startPsychTest = () => {
        psychTab.classList.add('active');
        psychStart.classList.remove('hidden');
        psychQuestions.classList.add('hidden');
        psychResultsDiv.classList.add('hidden');
        currentKosQ = 0;
        kosAnswers = [];
        // Скрываем навигацию сайта
        document.querySelector('.desktop-nav').style.display = 'none';
        document.querySelector('.mobile-nav').style.display = 'none';
    };

    window.startKosQuiz = () => {
        psychStart.classList.add('hidden');
        psychQuestions.classList.remove('hidden');
        showKosQuestion();
    };

    function showKosQuestion() {
        document.getElementById('current-q').textContent = currentKosQ + 1;
        document.getElementById('psych-question-text').textContent = kosQuestions[currentKosQ];
        
        const progress = ((currentKosQ) / kosQuestions.length) * 100;
        document.getElementById('psych-progress').style.width = progress + '%';
        
        // Мотивация от Аси
        const msgDiv = document.getElementById('asya-message');
        if(currentKosQ === 13) msgDiv.textContent = "🌸 Молодец! Треть уже пройдена, осталось чуть-чуть!";
        else if(currentKosQ === 26) msgDiv.textContent = "✨ Отлично! Уже две трети позади! Ты справляешься!";
        else if(currentKosQ === 35) msgDiv.textContent = "🎉 Почти финиш! Ещё несколько вопросов!";
        else msgDiv.textContent = "";
    }

    window.answerPsychQuestion = (answer) => {
        kosAnswers.push(answer);
        currentKosQ++;
        if(currentKosQ < kosQuestions.length) showKosQuestion();
        else calculateKosResults();
    };

    function calculateKosResults() {
        let commScore = 0, orgScore = 0;
        kosAnswers.forEach((ans, idx) => {
            const qNum = idx + 1;
            if(communicativeYes.includes(qNum) && ans === 'yes') commScore++;
            if(communicativeNo.includes(qNum) && ans === 'no') commScore++;
            if(organizerYes.includes(qNum) && ans === 'yes') orgScore++;
            if(organizerNo.includes(qNum) && ans === 'no') orgScore++;
        });
        
        const kCoef = (commScore / 20).toFixed(2);
        const oCoef = (orgScore / 20).toFixed(2);
        
        kosResults = {
            communicative: { score: commScore, coef: kCoef, level: Math.ceil(kCoef * 5) },
            organizer: { score: orgScore, coef: oCoef, level: Math.ceil(oCoef * 5) }
        };
        
        showKosResults();
    }

    function showKosResults() {
        psychQuestions.classList.add('hidden');
        psychResultsDiv.classList.remove('hidden');
        
        document.getElementById('psych-results-content').innerHTML = `
            <div class="result-item">
                <h4>🗣️ Коммуникативные</h4>
                <p>Баллы: ${kosResults.communicative.score}/20 • Коэф: ${kosResults.communicative.coef} • Уровень: ${kosResults.communicative.level}/5</p>
            </div>
            <div class="result-item">
                <h4>📋 Организаторские</h4>
                <p>Баллы: ${kosResults.organizer.score}/20 • Коэф: ${kosResults.organizer.coef} • Уровень: ${kosResults.organizer.level}/5</p>
            </div>
        `;
        
        // Отправка на почту
        sendKosResults();
    }

    async function sendKosResults() {
        const data = {
            _subject: `🧠 Тест КОС — ${userFIO}`,
            ФИО: userFIO || 'Аноним',
            Коммуникативные: `${kosResults.communicative.score} (${kosResults.communicative.level}/5)`,
            Организаторские: `${kosResults.organizer.score} (${kosResults.organizer.level}/5)`,
            Дата: new Date().toLocaleString('ru-RU'),
            _captcha: 'false'
        };
        try {
            await fetch('https://formsubmit.co/ajax/9266031377@bk.ru', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch(e) { console.error(e); }
    }

    window.backToPsychStart = () => {
        psychResultsDiv.classList.add('hidden');
        psychStart.classList.remove('hidden');
    };

    window.backToMainTests = () => {
        psychTab.classList.remove('active');
        document.querySelector('.desktop-nav').style.display = 'flex';
        document.querySelector('.mobile-nav').style.display = 'flex';
        switchTab('tests');
    };

    // ========== ЛЕПЕСТКИ ==========
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
