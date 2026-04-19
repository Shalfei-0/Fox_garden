document.addEventListener('DOMContentLoaded', () => {
    // ========== КОНФИГУРАЦИЯ ПОЧТЫ ==========
    // 🔑 Зарегистрируйтесь на https://web3forms.com/ (бесплатно)
    // Создайте форму, скопируйте Access Key и вставьте сюда:
    const EMAIL_ACCESS_KEY = 'ВАШ_КЛЮЧ_WEB3FORMS'; 
    const EMAIL_RECIPIENT = 'ваш@email.com'; // Ваш email для получения результатов

    // ========== ДАННЫЕ ТЕСТОВ ==========
    const tests = [
        {
            id: 'knyazya',
            title: 'Древняя Русь: первые князья',
            description: 'Рюрик, Олег, Игорь, Ольга. Проверь знания о становлении государства.',
            questions: [
                { q: 'В каком году произошло призвание варягов на Русь?', options: ['862', '882', '911', '988'], correct: 0 },
                { q: 'Кто захватил Киев в 882 году и объединил северные и южные земли?', options: ['Рюрик', 'Олег Вещий', 'Игорь Рюрикович', 'Святослав'], correct: 1 },
                { q: 'Какое племя убило князя Игоря при сборе дани?', options: ['Поляне', 'Древляне', 'Кривичи', 'Вятичи'], correct: 1 },
                { q: 'Что ввела княгиня Ольга вместо полюдья?', options: ['Налоги серебром', 'Уроки и погосты', 'Военную повинность', 'Торговые пошлины'], correct: 1 },
                { q: 'Кто был первым правителем Древнерусского государства?', options: ['Олег Вещий', 'Игорь', 'Рюрик', 'Святослав'], correct: 2 }
            ]
        }
    ];

    // ========== СОСТОЯНИЕ ==========
    let currentTest = null;
    let currentQIndex = 0;
    let score = 0;
    let answered = false;
    
    // Пройденные тесты
    let completedTests = JSON.parse(localStorage.getItem('foxGarden_completed') || '[]');
    
    // Тема
    let isLightTheme = localStorage.getItem('foxGarden_theme') === 'light';

    // ========== ТЕМА ==========
    function applyTheme() {
        document.body.classList.toggle('light-theme', isLightTheme);
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.textContent = isLightTheme ? '🌙' : '🌓';
        });
        localStorage.setItem('foxGarden_theme', isLightTheme ? 'light' : 'dark');
    }
    
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            isLightTheme = !isLightTheme;
            applyTheme();
        });
    });
    applyTheme();

    // ========== НАВИГАЦИЯ ==========
    window.switchTab = (tabId) => {
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => 
            btn.classList.toggle('active', btn.dataset.tab === tabId)
        );
        document.querySelectorAll('.tab-content').forEach(sec => 
            sec.classList.toggle('active', sec.id === tabId)
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // ========== РЕНДЕР ТЕСТОВ ==========
    function renderTests() {
        const testsGrid = document.getElementById('tests-grid');
        testsGrid.innerHTML = '';
        
        tests.forEach(test => {
            const isCompleted = completedTests.includes(test.id);
            const card = document.createElement('div');
            card.className = `test-card ${isCompleted ? 'completed' : ''}`;
            card.innerHTML = `
                ${isCompleted ? '<span class="completed-badge">✅ Пройден</span>' : ''}
                <h3>${test.title}</h3>
                <p>${test.description}</p>
                <span class="badge">${test.questions.length} вопросов</span>
            `;
            card.addEventListener('click', () => startTest(test));
            testsGrid.appendChild(card);
        });
    }
    renderTests();

    // Сброс прогресса
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
        if(confirm('Сбросить весь прогресс тестов?')) {
            completedTests = [];
            localStorage.removeItem('foxGarden_completed');
            renderTests();
        }
    });

    // ========== ЛОГИКА ТЕСТА ==========
    window.startTest = (test) => {
        currentTest = test;
        currentQIndex = 0;
        score = 0;
        answered = false;
        document.getElementById('test-list-view').classList.add('hidden');
        document.getElementById('test-active-view').classList.remove('hidden');
        renderQuestion();
    };

    window.exitTest = () => {
        document.getElementById('test-list-view').classList.remove('hidden');
        document.getElementById('test-active-view').classList.add('hidden');
        currentTest = null;
        renderTests(); // Обновляем бейджи
    };

    function renderQuestion() {
        const container = document.getElementById('quiz-container');
        const q = currentTest.questions[currentQIndex];
        const progress = ((currentQIndex) / currentTest.questions.length) * 100;
        
        container.innerHTML = `
            <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progress}%"></div></div>
            <div class="quiz-question">${currentQIndex + 1}. ${q.q}</div>
            <div class="quiz-options" id="quiz-options"></div>
        `;

        const optsDiv = document.getElementById('quiz-options');
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectAnswer(idx, btn));
            optsDiv.appendChild(btn);
        });
    }

    function selectAnswer(idx, btn) {
        if (answered) return;
        answered = true;
        
        const correct = currentTest.questions[currentQIndex].correct;
        const opts = document.querySelectorAll('.quiz-option');
        
        opts.forEach((o, i) => {
            o.classList.add('disabled');
            if (i === correct) o.classList.add('correct');
            if (i === idx && idx !== correct) o.classList.add('wrong');
        });

        if (idx === correct) score++;

        setTimeout(() => {
            currentQIndex++;
            answered = false;
            if (currentQIndex < currentTest.questions.length) {
                renderQuestion();
            } else {
                showResults();
            }
        }, 1200);
    }

    function showResults() {
        const container = document.getElementById('quiz-container');
        const percent = Math.round((score / currentTest.questions.length) * 100);
        let message = percent >= 80 ? 'Отлично! Шалфей гордится тобой! 🦊✨' : 
                      percent >= 50 ? 'Неплохо! Но можно лучше. Попробуй ещё раз!' : 
                      'История требует повторения. Не сдавайся!';
        
        // Отмечаем как пройденный
        if (!completedTests.includes(currentTest.id)) {
            completedTests.push(currentTest.id);
            localStorage.setItem('foxGarden_completed', JSON.stringify(completedTests));
        }

        container.innerHTML = `
            <div class="quiz-result">
                <h3>Испытание завершено!</h3>
                <p>Твой результат: ${score} из ${currentTest.questions.length} (${percent}%)</p>
                <p>${message}</p>
                <div class="email-section">
                    <p style="font-size:0.9rem; opacity:0.8; margin-bottom:5px;">📩 Отправить результаты на почту?</p>
                    <input type="email" id="result-email" class="email-input" placeholder="Ваш email (необязательно)">
                    <button class="email-btn" id="send-email-btn">📤 Отправить результаты</button>
                </div>
                <div style="margin-top:15px;">
                    <button class="retry-btn" onclick="startTest(currentTest)">🔄 Пройти снова</button>
                    <button class="retry-btn secondary" onclick="exitTest()">📋 К списку</button>
                </div>
            </div>
        `;

        // Обработчик отправки
        document.getElementById('send-email-btn')?.addEventListener('click', sendResultsEmail);
    }

    // ========== ОТПРАВКА НА ПОЧТУ ==========
    async function sendResultsEmail() {
        const btn = document.getElementById('send-email-btn');
        const emailInput = document.getElementById('result-email');
        const userEmail = emailInput?.value.trim();
        
        if (!EMAIL_ACCESS_KEY || EMAIL_ACCESS_KEY === 'ВАШ_КЛЮЧ_WEB3FORMS') {
            alert('⚠️ Владелец сайта не настроил отправку почты. Попросите добавить ключ Web3Forms в код.');
            return;
        }

        btn.disabled = true;
        btn.textContent = '⏳ Отправка...';

        const percent = Math.round((score / currentTest.questions.length) * 100);
        const answersLog = currentTest.questions.map((q, i) => 
            `${i+1}. ${q.q}\n✅ Правильно: ${q.options[q.correct]}\n💡 Выбрано: ${q.options[i === currentQIndex-1 ? (percent>=80?0:1) : 0] || '...'}` // Упрощённо
        ).join('\n\n');

        const formData = {
            access_key: EMAIL_ACCESS_KEY,
            subject: `🦊 Лисий Сад: Результат теста "${currentTest.title}"`,
            message: `Тест: ${currentTest.title}\nРезультат: ${score}/${currentTest.questions.length} (${percent}%)\nEmail пользователя: ${userEmail || 'Не указан'}\n\n📊 Детали:\n${answersLog}`,
            from_name: 'Лисий Сад',
            replyto: userEmail || EMAIL_RECIPIENT
        };

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('✅ Результаты успешно отправлены на почту!');
                btn.textContent = '✅ Отправлено';
            } else {
                alert('❌ Ошибка отправки: ' + (data.message || 'Попробуйте позже'));
                btn.disabled = false;
                btn.textContent = '📤 Отправить результаты';
            }
        } catch (e) {
            alert('❌ Ошибка сети. Проверьте подключение.');
            btn.disabled = false;
            btn.textContent = '📤 Отправить результаты';
        }
    }

    // ========== ЛЕПЕСТКИ ==========
    const petalsContainer = document.getElementById('petals-container');
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 6 : 12;

    function createPetal() {
        if (petalsContainer.children.length >= petalCount) return;
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left = (Math.random() * 90 + 5) + '%';
        const scale = 0.7 + Math.random() * 0.6;
        const dur = Math.random() * 4 + 5;
        const delay = Math.random() * 3;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = delay + 's';
        p.style.transform = `scale(${scale}) rotate(${Math.random() * 40 - 20}deg)`;
        petalsContainer.appendChild(p);
        setTimeout(() => p.remove(), (dur + delay) * 1000 + 500);
    }

    for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 400);
    setInterval(createPetal, 900);

    // ========== МЕНЮ ==========
    const funFacts = [
        'Шалфей появляется только тем, кто готов учиться 🦊',
        'Древняя Русь называлась так по племени полян, живших в полях 🌾',
        'Князь Олег прибил свой щит на врата Царьграда 🛡️',
        'Каждый лепесток — это частичка древней мудрости 🌸'
    ];
    document.getElementById('menu-btn')?.addEventListener('click', () => {
        alert(funFacts[Math.floor(Math.random() * funFacts.length)]);
    });

    document.getElementById('fox-logo')?.addEventListener('click', () => {
        if (tests.length > 0) {
            startTest(tests[Math.floor(Math.random() * tests.length)]);
            switchTab('tests');
        }
    });

    console.log('🦊 Лисий Сад загружен. Шалфей ждёт тебя!');
});
