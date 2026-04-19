document.addEventListener('DOMContentLoaded', () => {
    // === НАСТРОЙКИ ===
    const EMAIL_RECIPIENT = 'aniruf14.02@gmail.com';
    let userFIO = '';
    let userEmail = '';
    let pendingTest = null;
    let currentTest = null;
    let currentQIndex = 0;
    let score = 0;
    let answered = false;

    // === ДАННЫЕ ТЕСТОВ ===
    const tests = [
        {
            id: 'knyazya',
            title: 'Древняя Русь: первые князья',
            desc: 'Рюрик, Олег, Игорь, Ольга.',
            questions: [
                { q: 'В каком году произошло призвание варягов на Русь?', options: ['862', '882', '911', '988'], correct: 0 },
                { q: 'Кто захватил Киев в 882 году?', options: ['Рюрик', 'Олег', 'Игорь', 'Святослав'], correct: 1 },
                { q: 'Какое племя убило князя Игоря?', options: ['Поляне', 'Древляне', 'Вятичи', 'Кривичи'], correct: 1 },
                { q: 'Что ввела княгиня Ольга вместо полюдья?', options: ['Налоги серебром', 'Уроки и погосты', 'Свободную торговлю', 'Воинскую повинность'], correct: 1 },
                { q: 'Кто стал первым киевским князем династии Рюриковичей?', options: ['Рюрик', 'Олег', 'Игорь', 'Владимир'], correct: 1 }
            ]
        }
    ];

    // === ИНИЦИАЛИЗАЦИЯ ===
    renderTests();
    applyTheme(localStorage.getItem('theme') === 'light');
    createPetals();

    // === НАВИГАЦИЯ ===
    window.switchTab = (tabId) => {
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
        document.querySelectorAll('.tab-content').forEach(s => s.classList.toggle('active', s.id === tabId));
    };

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // === ТЕМА ===
    function applyTheme(isLight) {
        document.body.classList.toggle('light-theme', isLight);
        document.querySelectorAll('.theme-toggle-btn').forEach(b => b.textContent = isLight ? '🌙' : '🌓');
    }
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isLight = !document.body.classList.contains('light-theme');
            applyTheme(isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    });

    // === РЕНДЕР ТЕСТОВ ===
    function renderTests() {
        const grid = document.getElementById('tests-grid');
        const completed = JSON.parse(localStorage.getItem('completed_tests') || '[]');
        grid.innerHTML = '';
        
        tests.forEach(t => {
            const isDone = completed.includes(t.id);
            grid.innerHTML += `
                <div class="test-card card" onclick="showFioModal('${t.id}')">
                    ${isDone ? '<span class="completed-badge">✅ Пройден</span>' : ''}
                    <h3>${t.title}</h3>
                    <p>${t.desc}</p>
                </div>`;
        });
    }

    // === МОДАЛЬНОЕ ОКНО ФИО ===
    window.showFioModal = (testId) => {
        pendingTest = tests.find(t => t.id === testId);
        document.getElementById('fio-modal').style.display = 'flex';
        document.getElementById('fio-input').value = '';
        document.getElementById('email-input').value = '';
        document.getElementById('fio-input').focus();
    };

    document.getElementById('fio-start-btn').addEventListener('click', () => {
        const fio = document.getElementById('fio-input').value.trim();
        if (!fio) return alert('Шалфей не знает твоего имени... Введи ФИО!');
        
        userFIO = fio;
        userEmail = document.getElementById('email-input').value.trim();
        document.getElementById('fio-modal').style.display = 'none';
        startTest(pendingTest);
    });

    document.getElementById('fio-cancel-btn').addEventListener('click', () => {
        document.getElementById('fio-modal').style.display = 'none';
        pendingTest = null;
    });

    // === ЛОГИКА ТЕСТА ===
    function startTest(test) {
        currentTest = test;
        currentQIndex = 0;
        score = 0;
        document.getElementById('test-list-view').classList.add('hidden');
        document.getElementById('test-active-view').classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const q = currentTest.questions[currentQIndex];
        const container = document.getElementById('quiz-container');
        answered = false;
        
        container.innerHTML = `
            <h3 style="margin-bottom:15px; color:var(--accent)">${q.q}</h3>
            <div id="options-box"></div>
        `;
        
        const box = document.getElementById('options-box');
        q.options.forEach((opt, i) => {
            box.innerHTML += `<button class="quiz-option" onclick="checkAnswer(${i})">${opt}</button>`;
        });
    }

    window.checkAnswer = (idx) => {
        if (answered) return;
        answered = true;
        const opts = document.querySelectorAll('.quiz-option');
        const correct = currentTest.questions[currentQIndex].correct;
        
        opts.forEach((btn, i) => {
            if (i === correct) btn.classList.add('correct');
            if (i === idx && i !== correct) btn.classList.add('wrong');
        });

        if (idx === correct) score++;
        
        setTimeout(() => {
            currentQIndex++;
            if (currentQIndex < currentTest.questions.length) showQuestion();
            else showResults();
        }, 1500);
    };

    function showResults() {
        const percent = Math.round((score / currentTest.questions.length) * 100);
        const container = document.getElementById('quiz-container');
        
        // Отметка о прохождении
        let completed = JSON.parse(localStorage.getItem('completed_tests') || '[]');
        if (!completed.includes(currentTest.id)) {
            completed.push(currentTest.id);
            localStorage.setItem('completed_tests', JSON.stringify(completed));
            renderTests();
        }

        // Авто-отправка на почту
        sendEmail(percent);

        container.innerHTML = `
            <h2 style="text-align:center; margin-bottom:10px">Результат: ${percent}%</h2>
            <p style="text-align:center; margin-bottom:20px">${score} из ${currentTest.questions.length} правильных ответов.</p>
            <div id="email-status" style="text-align:center; padding:10px; background:rgba(255,255,255,0.1); border-radius:10px; font-size:0.9rem">
                📤 Отправка результатов Шалфею...
            </div>
            <button class="retry-btn" style="width:100%; margin-top:15px" onclick="startTest(currentTest)">🔄 Пройти снова</button>
            <button class="retry-btn secondary" style="width:100%; margin-top:10px; background:transparent; border:1px solid var(--border)" onclick="exitTest()">📋 К списку</button>
        `;
    }

    // === ОТПРАВКА НА ПОЧТУ (FormSubmit AJAX) ===
    async function sendEmail(percent) {
        const statusEl = document.getElementById('email-status');
        
        const formData = {
            access_key: 'YOUR_ACCESS_KEY', // Не нужен для direct ajax, но FormSubmit требует заголовок
            _subject: `🦊 Тест "${currentTest.title}" — ${userFIO}`,
            'ФИО': userFIO,
            'Email': userEmail || 'Не указан',
            'Результат': `${percent}% (${score}/${currentTest.questions.length})`,
            'Тест': currentTest.title,
            'Дата': new Date().toLocaleString('ru-RU'),
            _captcha: 'false'
        };

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${EMAIL_RECIPIENT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if(response.ok) {
                statusEl.innerHTML = '✅ Результаты успешно отправлены!';
                statusEl.style.background = 'rgba(76, 175, 80, 0.2)';
            } else {
                throw new Error('Ошибка сети');
            }
        } catch (e) {
            console.error(e);
            statusEl.innerHTML = '⚠️ Ошибка отправки. Попробуйте позже.';
            statusEl.style.background = 'rgba(244, 67, 54, 0.2)';
        }
    }

    window.exitTest = () => {
        document.getElementById('test-active-view').classList.add('hidden');
        document.getElementById('test-list-view').classList.remove('hidden');
    };

    // === ЛЕПЕСТКИ ===
    function createPetals() {
        const container = document.getElementById('petals-container');
        const count = window.innerWidth < 768 ? 8 : 15;
        
        for(let i=0; i<count; i++) {
            const p = document.createElement('div');
            p.className = 'petal';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 4 + 4) + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(p);
        }
    }

    // === СБРОС ===
    document.getElementById('reset-progress-btn').addEventListener('click', () => {
        if(confirm('Сбросить весь прогресс тестов?')) {
            localStorage.removeItem('completed_tests');
            renderTests();
        }
    });
});
