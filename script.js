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

    // ========== РЕЗУЛЬТАТЫ ТЕСТА + ОТПРАВКА НА ПОЧТУ ==========
function showResults(){
    const container = document.getElementById('quiz-container');
    const percent = Math.round((score / currentTest.questions.length) * 100);
    
    // Формируем текст с ответами
    const answersText = currentTest.questions.map((q, i) => 
        `Вопрос ${i+1}: ${q.q}\n✓ Правильный ответ: ${q.options[q.correct]}`
    ).join('\n\n');
    
    // Отмечаем тест как пройденный
    if (!completedTests.includes(currentTest.id)) {
        completedTests.push(currentTest.id);
        localStorage.setItem('foxGarden_completed', JSON.stringify(completedTests));
    }
    
    let message = percent >= 80 ? 'Отлично! Шалфей гордится тобой! 🦊✨' : 
                  percent >= 50 ? 'Неплохо! Но можно лучше. Попробуй ещё раз!' : 
                  'История требует повторения. Не сдавайся!';
    
    container.innerHTML = `
        <div class="quiz-result">
            <h3>🎉 Испытание завершено!</h3>
            <p><strong>Результат:</strong> ${score} из ${currentTest.questions.length} (${percent}%)</p>
            <p>${message}</p>
            
            <div class="email-section">
                <p style="font-size:0.9rem; opacity:0.8; margin-bottom:8px;">📩 Отправить результаты Шалфею?</p>
                <input type="email" id="result-email" class="email-input" placeholder="Ваш email (необязательно)">
                <button class="email-btn" id="send-email-btn">📤 Отправить на aniruf14.02@gmail.com</button>
            </div>
            
            <div style="margin-top:20px;">
                <button class="retry-btn" onclick="startTest(currentTest)">🔄 Пройти снова</button>
                <button class="retry-btn secondary" onclick="exitTest()">📋 К списку тестов</button>
            </div>
        </div>
    `;
    
    // Обработчик отправки
    document.getElementById('send-email-btn')?.addEventListener('click', sendResultsEmail);
}

// ========== ОТПРАВКА ЧЕРЕЗ MAILTO: ==========
function sendResultsEmail(){
    const RECIPIENT = 'aniruf14.02@gmail.com'; // ← Ваша почта
    const emailInput = document.getElementById('result-email');
    const userEmail = emailInput?.value.trim() || 'Не указан';
    const btn = document.getElementById('send-email-btn');
    
    // Формируем тему и тело письма
    const subject = `🦊 Лисий Сад: Тест "${currentTest.title}"`;
    
    const body = `
Результаты теста по истории России (6 класс)
═══════════════════════════════════════

📚 Тест: ${currentTest.title}
👤 Пользователь: ${userEmail}
📊 Результат: ${score} из ${currentTest.questions.length} вопросов (${Math.round((score/currentTest.questions.length)*100)}%)

───────────────────────────────────
📋 Детали вопросов:

${currentTest.questions.map((q, i) => 
    `#${i+1}. ${q.q}\n   ✓ Правильно: ${q.options[q.correct]}`
).join('\n\n')}

───────────────────────────────────
🦊 Отправлено из «Лисий Сад» — хранилище знаний Шалфея
Дата: ${new Date().toLocaleString('ru-RU')}
    `.trim();
    
    // Кодируем для mailto:
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Визуальная обратная связь
    btn.disabled = true;
    btn.textContent = '✅ Открываю почту...';
    
    // Открываем почтовый клиент
    setTimeout(() => {
        window.location.href = `mailto:${RECIPIENT}?subject=${encodedSubject}&body=${encodedBody}`;
        
        // Возвращаем кнопку через 3 секунды
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = '📤 Отправить ещё раз';
        }, 3000);
    }, 500);
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
