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
