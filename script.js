document.addEventListener('DOMContentLoaded', () => {
    // ========== ДАННЫЕ ТЕСТОВ ==========
    const historyTests = [{
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

    const kosTest = {
        id: 'kos',
        title: 'Тест КОС',
        questions: [
            {q:"Много ли у Вас друзей, с которыми Вы постоянно общаетесь?"},
            {q:"Часто ли Вам удается склонить большинство своих товарищей к принятию ими Вашего мнения?"},
            {q:"Долго ли Вас беспокоит чувство обиды, причиненное Вам кем-то из Ваших товарищей?"},
            {q:"Всегда ли Вам трудно ориентироваться в создавшейся критической ситуации?"},
            {q:"Есть ли у Вас стремление к установлению новых знакомств с разными людьми?"},
            {q:"Нравится ли Вам заниматься общественной работой?"},
            {q:"Верно ли, что Вам приятнее и проще проводить время с книгами или за каким-либо другим занятием, чем с людьми?"},
            {q:"Если возникли какие-либо помехи в осуществлении Ваших намерений, то легко ли Вы отступаете от них?"},
            {q:"Легко ли Вы устанавливаете контакты с людьми, которые значительно старше Вас по возрасту?"},
            {q:"Любите ли Вы придумывать и организовывать со своими товарищами различные игры и развлечения?"},
            {q:"Трудно ли Вы включаетесь в новую для Вас компанию?"},
            {q:"Часто ли Вы откладываете на другие дни те дела, которые нужно было бы выполнить сегодня?"},
            {q:"Легко ли Вам удается устанавливать контакты с незнакомыми людьми?"},
            {q:"Стремитесь ли Вы добиваться, чтобы Ваши товарищи действовали в соответствии с Вашим мнением?"},
            {q:"Трудно ли Вы осваиваетесь в новом коллективе?"},
            {q:"Верно ли, что у Вас не бывает конфликтов с товарищами из-за невыполнения ими своих обязанностей, обязательств?"},
            {q:"Стремитесь ли Вы при удобном случае познакомиться и побеседовать с новым человеком?"},
            {q:"Часто ли Вы в решении важных дел принимаете инициативу на себя?"},
            {q:"Раздражают ли Вас окружающие люди и хочется ли Вам побыть одному?"},
            {q:"Правда ли, что Вы обычно плохо ориентируетесь в незнакомой для Вас обстановке?"},
            {q:"Нравится ли Вам постоянно находиться среди людей?"},
            {q:"Возникает ли у Вас раздражение, если Вам не удается закончить начатое дело?"},
            {q:"Испытываете ли Вы чувство затруднения, неудобства или стеснения, если приходится проявить инициативу, чтобы познакомиться с новым человеком?"},
            {q:"Правда ли, что Вы утомляетесь от частого общения с товарищами?"},
            {q:"Любите ли Вы участвовать в коллективных играх?"},
            {q:"Часто ли Вы проявляете инициативу при решении вопросов, затрагивающих интересы Ваших товарищей?"},
            {q:"Правда ли, что Вы чувствуете себя неуверенно среди малознакомых Вам людей?"},
            {q:"Верно ли, что Вы редко стремитесь к доказательству своей правоты?"},
            {q:"Полагаете ли Вы, что Вам не доставляет особого труда внести оживление в малознакомую Вам компанию?"},
            {q:"Принимаете ли Вы участие в общественной работе в школе?"},
            {q:"Стремитесь ли Вы ограничить круг своих знакомых небольшим количеством людей?"},
            {q:"Верно ли, что Вы не стремитесь отстаивать свое мнение или решение, если оно не было сразу принято Вашими товарищами?"},
            {q:"Чувствуете ли Вы себя непринужденно, попав в незнакомую Вам компанию?"},
            {q:"Охотно ли Вы приступаете к организации различных мероприятий для своих товарищей?"},
            {q:"Правда ли, что Вы не чувствуете себя достаточно уверенным и спокойным, когда приходится говорить что-либо большой группе людей?"},
            {q:"Часто ли Вы опаздываете на деловые встречи, свидания?"},
            {q:"Верно ли, что у Вас много друзей?"},
            {q:"Часто ли Вы смущаетесь, чувствуете неловкость при общении с малознакомыми людьми?"},
            {q:"Правда ли, что Вас пугает перспектива оказаться в новом коллективе?"},
            {q:"Правда ли, что Вы не очень уверенно чувствуете себя в окружении большой группы своих товарищей?"}
        ]
    };

    const ryakhovskyTest = {
        id: 'ryakhovsky',
        title: 'Тест Ряховского',
        questions: [
            {q:"Вам предстоит ординарная или деловая встреча. Выбивает ли Вас ее ожидание из колеи?"},
            {q:"Вызывает ли у Вас смятение и неудовольствие поручение выступить с докладом, сообщением, информацией на каком-либо совещании, собрании или тому подобном мероприятии?"},
            {q:"Не откладываете ли Вы визит к врачу до последнего момента?"},
            {q:"Вам предлагают выехать в командировку в город, где Вы никогда не бывали. Приложите ли Вы максимум усилий, чтобы избежать этой командировки?"},
            {q:"Любите ли Вы делиться своими переживаниями с кем бы то ни было?"},
            {q:"Раздражаетесь ли Вы, если незнакомый человек на улице обратится к Вам с просьбой (показать дорогу, назвать время, ответить на какой-то вопрос)?"},
            {q:"Верите ли Вы, что существует проблема 'отцов и детей' и что людям разных поколений трудно понимать друг друга?"},
            {q:"Постесняетесь ли Вы напомнить знакомому, что он забыл Вам вернуть деньги, которые занял несколько месяцев назад?"},
            {q:"В ресторане либо в столовой Вам подали явно недоброкачественное блюдо. Промолчите ли Вы, лишь рассерженно отодвинув тарелку?"},
            {q:"Оказавшись один на один с незнакомым человеком, Вы не вступите с ним в беседу и будете тяготиться, если первым заговорит он. Так ли это?"},
            {q:"Вас приводит в ужас любая длинная очередь, где бы она ни была. Предпочитаете ли Вы отказаться от своего намерения или встанете в хвост и будете томиться в ожидании?"},
            {q:"Боитесь ли Вы участвовать в какой-либо комиссии по рассмотрению конфликтных ситуаций?"},
            {q:"У Вас есть собственные сугубо индивидуальные критерии оценки произведений литературы, искусства, культуры и никаких чужих мнений на этот счет Вы не приемлете. Это так?"},
            {q:"Услышав где-либо в кулуарах высказывание явно ошибочной точки зрения по хорошо известному Вам вопросу, предпочитаете ли Вы промолчать и не вступать в разговор?"},
            {q:"Вызывает ли у Вас досаду просьба помочь разобраться в том или ином служебном вопросе или учебной теме?"},
            {q:"Охотнее ли Вы излагаете свою точку зрения (мнение, оценку) в письменной форме, чем в устной?"}
        ]
    };

    // ========== СОСТОЯНИЕ ==========
    let userFIO = '', userEmail = '';
    let pendingTestId = null;
    let currentPsychTest = null;
    let psychIndex = 0;
    let psychAnswers = [];

    // ========== НАВИГАЦИЯ ==========
    window.switchTab = (id) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === id));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
        const psychOverlay = document.getElementById('psychology');
        if (id === 'psychology') {
            psychOverlay.classList.remove('hidden');
            createGeoFlowers();
        } else {
            psychOverlay.classList.add('hidden');
        }
    };
    document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

    // ========== ИСТОРИЯ ==========
    const histGrid = document.getElementById('history-tests-grid');
    historyTests.forEach(t => {
        const card = document.createElement('div');
        card.className = 'test-card';
        card.innerHTML = `<h3>${t.title}</h3><p>${t.desc}</p><span class="badge">${t.questions.length} вопросов</span>`;
        card.onclick = () => startHistoryTest(t);
        histGrid.appendChild(card);
    });

    function startHistoryTest(test) {
        alert(`Тест "${test.title}" будет добавлен в ближайшее время. Сейчас доступен раздел Психология.`);
    }

    // ========== ПСИХОЛОГИЯ: МОДАЛКА ФИО ==========
    const fioModal = document.getElementById('fio-modal');
    window.openFioModal = (testId) => {
        pendingTestId = testId;
        fioModal.style.display = 'flex';
        document.getElementById('fio-input').value = '';
        document.getElementById('email-input').value = '';
        document.getElementById('fio-input').focus();
    };

    document.getElementById('start-psych-btn').onclick = () => {
        const fio = document.getElementById('fio-input').value.trim();
        if (!fio) return alert('Ася ждёт твоего имени... Введи ФИО!');
        userFIO = fio;
        userEmail = document.getElementById('email-input').value.trim();
        fioModal.style.display = 'none';
        runPsychTest(pendingTestId);
    };
    document.getElementById('cancel-psych-btn').onclick = () => fioModal.style.display = 'none';

    // ========== ЛОГИКА ПСИХО-ТЕСТОВ ==========
    function runPsychTest(id) {
        currentPsychTest = id === 'kos' ? kosTest : ryakhovskyTest;
        psychIndex = 0;
        psychAnswers = [];
        document.getElementById('psych-menu').classList.add('hidden');
        document.getElementById('psych-quiz').classList.remove('hidden');
        document.getElementById('psych-total').textContent = currentPsychTest.questions.length;
        showQuestion();
    }

    function showQuestion() {
        const q = currentPsychTest.questions[psychIndex];
        document.getElementById('psych-current').textContent = psychIndex + 1;
        document.getElementById('psych-question-text').textContent = q.q;
        document.getElementById('psych-progress').style.width = `${(psychIndex / currentPsychTest.questions.length) * 100}%`;
        
        const optsDiv = document.getElementById('psych-options');
        optsDiv.innerHTML = '';
        
        if (currentPsychTest.id === 'kos') {
            ['Да', 'Нет'].forEach(ans => {
                const btn = document.createElement('button');
                btn.className = 'btn-answer';
                btn.textContent = ans;
                btn.onclick = () => answerPsych(ans === 'Да' ? 'yes' : 'no');
                optsDiv.appendChild(btn);
            });
        } else {
            ['Да', 'Иногда', 'Нет'].forEach(ans => {
                const btn = document.createElement('button');
                btn.className = 'btn-answer';
                btn.textContent = ans;
                btn.onclick = () => answerPsych(ans);
                optsDiv.appendChild(btn);
            });
        }

        // Сообщения Аси
        const msgDiv = document.getElementById('asya-message');
        const progress = (psychIndex + 1) / currentPsychTest.questions.length;
        if (progress >= 0.33 && progress < 0.35) {
            msgDiv.textContent = "🌸 Молодец! Треть уже пройдена, осталось чуть-чуть!";
            msgDiv.classList.remove('hidden');
        } else if (progress >= 0.66 && progress < 0.68) {
            msgDiv.textContent = "✨ Отлично! Уже две трети позади! Ты справляешься!";
            msgDiv.classList.remove('hidden');
        } else {
            msgDiv.classList.add('hidden');
        }
    }

    function answerPsych(ans) {
        psychAnswers.push(ans);
        psychIndex++;
        if (psychIndex < currentPsychTest.questions.length) {
            showQuestion();
        } else {
            calculatePsychResults();
        }
    }

    function calculatePsychResults() {
        let resultHTML = '';
        let resultText = '';

        if (currentPsychTest.id === 'kos') {
            // Ключи КОС
            const commYes = [1,5,9,13,17,21,25,29,33,37];
            const commNo = [3,7,11,15,19,23,27,31,35,39];
            const orgYes = [2,6,10,14,18,22,26,30,34,38];
            const orgNo = [4,8,12,16,20,24,28,32,36,40];

            let commScore = 0, orgScore = 0;
            psychAnswers.forEach((ans, i) => {
                const qNum = i + 1;
                if (commYes.includes(qNum) && ans === 'yes') commScore++;
                if (commNo.includes(qNum) && ans === 'no') commScore++;
                if (orgYes.includes(qNum) && ans === 'yes') orgScore++;
                if (orgNo.includes(qNum) && ans === 'no') orgScore++;
            });

            const kCoef = (commScore / 20).toFixed(2);
            const oCoef = (orgScore / 20).toFixed(2);
            const kLevel = Math.min(5, Math.ceil(kCoef * 5));
            const oLevel = Math.min(5, Math.ceil(oCoef * 5));

            resultHTML = `
                <div class="result-item"><h4>🗣️ Коммуникативные</h4><p>Баллы: ${commScore}/20 • Коэф: ${kCoef} • Уровень: ${kLevel}/5</p></div>
                <div class="result-item"><h4>📋 Организаторские</h4><p>Баллы: ${orgScore}/20 • Коэф: ${oCoef} • Уровень: ${oLevel}/5</p></div>
            `;
            resultText = `КОС:\nКоммуникативные: ${commScore}/20 (Ур.${kLevel})\nОрганизаторские: ${orgScore}/20 (Ур.${oLevel})`;
        } else {
            // Ряховский
            let points = 0;
            psychAnswers.forEach(ans => {
                if (ans === 'Да') points += 2;
                else if (ans === 'Иногда') points += 1;
            });

            let interp = '';
            if (points >= 30) interp = 'Вы явно некоммуникабельны. Старайтесь быть общительнее.';
            else if (points >= 25) interp = 'Вы замкнуты, предпочитаете одиночество. Стоит встряхнуться.';
            else if (points >= 19) interp = 'Вы в известной степени общительны, но с оглядкой.';
            else if (points >= 14) interp = 'У вас нормальная коммуникабельность.';
            else if (points >= 9) interp = 'Вы весьма общительны, порой сверх меры.';
            else if (points >= 4) interp = 'Вы "рубаха-парень". Общительность бьет ключом.';
            else interp = 'Ваша коммуникабельность носит болезненный характер. Поработайте над собой.';

            resultHTML = `<div class="result-item"><h4>🗣️ Уровень общительности</h4><p>Баллы: ${points}/32<br>${interp}</p></div>`;
            resultText = `Ряховский: ${points}/32\n${interp}`;
        }

        document.getElementById('psych-quiz').classList.add('hidden');
        document.getElementById('psych-results').classList.remove('hidden');
        document.getElementById('psych-results-content').innerHTML = resultHTML;

        sendEmail(resultText);
    }

    // ========== ОТПРАВКА НА ПОЧТУ ==========
    async function sendEmail(resultText) {
        const statusEl = document.getElementById('email-status');
        const data = {
            _subject: `🧠 Психологический тест — ${userFIO}`,
            ФИО: userFIO,
            Email_пользователя: userEmail || 'Не указан',
            Результаты: resultText,
            Дата: new Date().toLocaleString('ru-RU'),
            _captcha: 'false'
        };

        try {
            const res = await fetch('https://formsubmit.co/ajax/9266031377@bk.ru', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                statusEl.textContent = '✅ Результаты успешно отправлены Асе!';
                statusEl.style.background = 'rgba(76,175,80,0.2)';
            } else throw new Error();
        } catch (e) {
            statusEl.textContent = '⚠️ Ошибка отправки. Проверь интернет.';
            statusEl.style.background = 'rgba(244,67,54,0.2)';
        }
    }

    window.backToPsychMenu = () => {
        document.getElementById('psych-results').classList.add('hidden');
        document.getElementById('psych-menu').classList.remove('hidden');
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

    // ========== ЛЕПЕСТКИ ДЛЯ ГЛАВНОГО САЙТА ==========
    const pc = document.getElementById('petals-container');
    for(let i=0; i<8; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random()*100 + '%';
        p.style.animationDuration = (Math.random()*4+6)+'s';
        p.style.animationDelay = Math.random()*5 + 's';
        pc.appendChild(p);
    }
});
