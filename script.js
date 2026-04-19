// ========== ЭЛЕМЕНТЫ ==========
const messageDiv = document.getElementById('message');
const speakerDiv = document.getElementById('speaker');
const characterImg = document.getElementById('character');
const commandInput = document.getElementById('command-input');
const sendButton = document.getElementById('send-btn');
const emotionSpan = document.getElementById('emotion');
const closeBtn = document.getElementById('close-btn');
const pinBtn = document.getElementById('pin-btn');
const dragArea = document.getElementById('drag-area');
const randomPhraseBtn = document.getElementById('random-phrase-btn');
const characterGlow = document.getElementById('characterGlow');
const sunRays = document.getElementById('sunRays');
const moonLight = document.getElementById('moonLight');
const dustParticles = document.getElementById('dustParticles');
const app = document.getElementById('app');
const historyModeBtn = document.getElementById('history-mode-btn');
const exitHistoryBtn = document.getElementById('exit-history-mode-btn');

// ========== СОСТОЯНИЕ ==========
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let currentCharacterImage = 'character.png';
let isInHistoryMode = false;
let isShowingMemory = false;
let tasks = [], tasksTimeSpent = {}, currentTaskId = null, taskStartTime = null;
let notes = [];
let historyMessages = [], currentHistoryIndex = 0, bookmarks = [], searchQuery = '';
const shownMemories = new Set();
const darkEmojis = ['🌑', '🖤', '🦊', '', '🌙', '😶', '👁️', '🕯️', '🗝️', '📜', '🌫️', '🕸️'];

// ========== ВКЛАДКИ ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(`${btn.dataset.tab}-tab`);
        if (target) target.classList.add('active');
    });
});

// ========== TO-DO ==========
async function saveTasks() { await window.electronAPI.saveTasks(tasks); }
async function loadTasks() {
    const t = await window.electronAPI.loadTasks();
    if (t?.length) tasks = t;
    renderTasks();
}
function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }
function renderTasks() {
    const list = document.getElementById('tasksList');
    if (!list) return;
    document.getElementById('completedCount').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('totalCount').textContent = tasks.length;
    list.innerHTML = '';
    tasks.forEach(task => {
        const el = document.createElement('div');
        el.className = `task-item ${task.completed ? 'completed' : ''}`;
        const ts = tasksTimeSpent[task.id] || 0;
        const h = Math.floor(ts / 3600), m = Math.floor((ts % 3600) / 60), s = ts % 60;
        el.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
            <span style="font-size:10px;opacity:0.6">${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}</span>
            <button class="task-edit" data-id="${task.id}">✏️</button>
            <button class="task-delete" data-id="${task.id}">🗑️</button>`;
        
        el.querySelector('.task-checkbox').addEventListener('change', async (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            const t = tasks.find(x => x.id === id);
            if (t) {
                t.completed = e.target.checked;
                if (t.completed && currentTaskId === id) { currentTaskId = null; }
                await saveTasks(); renderTasks();
            }
        });
        el.querySelector('.task-edit').addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            const t = tasks.find(x => x.id === id);
            if (t) {
                const nt = prompt('Редактировать задачу:', t.text);
                if (nt?.trim()) { t.text = nt.trim(); await saveTasks(); renderTasks(); }
            }
        });
        el.querySelector('.task-delete').addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            if (confirm('Удалить задачу?')) {
                tasks = tasks.filter(x => x.id !== id);
                delete tasksTimeSpent[id];
                if (currentTaskId === id) currentTaskId = null;
                await saveTasks(); renderTasks();
            }
        });
        el.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !task.completed) {
                currentTaskId = task.id;
                taskStartTime = Date.now();
            }
        });
        list.appendChild(el);
    });
}
async function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ id: Date.now(), text: text.trim(), completed: false });
    await saveTasks(); renderTasks();
}
function updateTaskTime(id, s) { tasksTimeSpent[id] = (tasksTimeSpent[id] || 0) + s; }

// ========== ЗАМЕТКИ ==========
async function saveNotes() { try { await window.electronAPI.saveNotes(notes); } catch (e) { console.error(e); } }
async function loadNotes() {
    try {
        const n = await window.electronAPI.loadNotes();
        if (Array.isArray(n)) notes = n.map(x => ({ id: x.id || Date.now(), content: x.content || '', date: x.date || new Date().toISOString() })).filter(x => x.content?.trim());
        renderNotes();
    } catch (e) { console.error(e); notes = []; renderNotes(); }
}
function renderNotes() {
    const list = document.getElementById('notesList');
    if (!list) return;
    list.innerHTML = '';
    notes.forEach(note => {
        const el = document.createElement('div');
        el.className = 'note-item';
        el.innerHTML = `<div class="note-content">${escapeHtml(note.content)}</div>
            <button class="note-edit" data-id="${note.id}">✏️</button>
            <button class="note-delete" data-id="${note.id}">🗑️</button>`;
        
        el.querySelector('.note-edit').addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            const n = notes.find(x => x.id === id);
            if (n) {
                const nc = prompt('Редактировать заметку:', n.content);
                if (nc?.trim()) { n.content = nc.trim(); await saveNotes(); renderNotes(); }
            }
        });
        el.querySelector('.note-delete').addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            if (confirm('Удалить заметку?')) {
                notes = notes.filter(x => x.id !== id);
                await saveNotes(); renderNotes();
            }
        });
        list.appendChild(el);
    });
}
async function addNote(c) {
    if (!c.trim()) return;
    notes.unshift({ id: Date.now(), content: c.trim(), date: new Date().toISOString() });
    await saveNotes(); renderNotes();
}

// ========== ИСТОРИЯ ==========
async function loadHistory() {
    try {
        const loaded = await window.electronAPI.loadHistory();
        if (loaded?.length) historyMessages = loaded;
        else {
            historyMessages = [
                { id: 1, text: 'Вижу ты нашел новый раздел, поздравляю пользователь.\nЗдесь можно прочесть одну историю.', date: new Date().toISOString() }
            ];
            await saveHistory();
        }
        currentHistoryIndex = 0;
        renderHistory();
    } catch (e) {
        console.error(e);
        historyMessages = [{ id: 1, text: 'Ошибка загрузки истории.', date: new Date().toISOString() }];
        renderHistory();
    }
}
async function saveHistory() { try { await window.electronAPI.saveHistory(historyMessages); } catch (e) { console.error(e); } }
async function loadBookmarks() { try { bookmarks = (await window.electronAPI.loadBookmarks()) || []; } catch (e) { bookmarks = []; } }
async function saveBookmarks() { try { await window.electronAPI.saveBookmarks(bookmarks); } catch (e) { console.error(e); } }

function renderHistory() {
    const msgEl = document.getElementById('history-message');
    const cntEl = document.getElementById('history-counter');
    const prevBtn = document.getElementById('history-prev-btn');
    const nextBtn = document.getElementById('history-next-btn');
    const bmBtn = document.getElementById('history-bookmark-btn');
    if (!msgEl) return;

    let filtered = historyMessages;
    if (searchQuery.trim()) filtered = historyMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!filtered.length) {
        msgEl.textContent = 'Ничего не найдено...';
        cntEl.textContent = '0 / 0';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (bmBtn) bmBtn.disabled = true;
        return;
    }

    if (currentHistoryIndex >= filtered.length) currentHistoryIndex = filtered.length - 1;
    const cur = filtered[currentHistoryIndex];
    msgEl.textContent = cur.text;
    msgEl.classList.remove('appearing', 'memory-active');
    void msgEl.offsetWidth;
    msgEl.classList.add('appearing');
    if (searchQuery.trim()) msgEl.classList.add('highlight'); else msgEl.classList.remove('highlight');
    cntEl.textContent = `${currentHistoryIndex + 1} / ${filtered.length}`;
    if (prevBtn) prevBtn.disabled = currentHistoryIndex === 0;
    if (nextBtn) nextBtn.disabled = currentHistoryIndex === filtered.length - 1;
    if (bmBtn) {
        const isBm = bookmarks.some(b => b.index === currentHistoryIndex);
        bmBtn.classList.toggle('active', isBm);
        bmBtn.textContent = isBm ? '⭐' : '☆';
        bmBtn.disabled = false;
    }
}

function showHistoryPrev() { if (currentHistoryIndex > 0 && !isShowingMemory) { currentHistoryIndex--; renderHistory(); } }
function showHistoryNext() {
    if (isShowingMemory) return;
    let filtered = historyMessages;
    if (searchQuery.trim()) filtered = historyMessages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    if (currentHistoryIndex < filtered.length - 1) { currentHistoryIndex++; renderHistory(); }
}
async function toggleBookmark() {
    const msg = historyMessages[currentHistoryIndex]; if (!msg) return;
    const idx = bookmarks.findIndex(b => b.index === currentHistoryIndex);
    if (idx >= 0) bookmarks.splice(idx, 1);
    else bookmarks.push({ index: currentHistoryIndex, text: msg.text.substring(0, 100), date: new Date().toISOString() });
    await saveBookmarks(); renderHistory();
}
function showBookmarksModal() {
    const modal = document.getElementById('bookmarks-modal');
    const list = document.getElementById('bookmarks-list');
    const empty = document.getElementById('bookmarks-empty');
    if (!modal || !list) return;
    list.innerHTML = '';
    if (!bookmarks.length) { empty.style.display = 'block'; list.style.display = 'none'; }
    else {
        empty.style.display = 'none'; list.style.display = 'flex';
        bookmarks.forEach(bm => {
            const item = document.createElement('div');
            item.className = 'bookmark-item';
            item.innerHTML = `<div class="bookmark-item-text">${escapeHtml(bm.text)}...</div><div class="bookmark-item-index">Страница ${bm.index + 1}</div>`;
            item.addEventListener('click', () => {
                currentHistoryIndex = bm.index; searchQuery = '';
                const si = document.getElementById('history-search-input');
                const cb = document.getElementById('history-search-clear');
                if (si) si.value = ''; if (cb) cb.classList.remove('visible');
                modal.classList.remove('active'); renderHistory();
            });
            list.appendChild(item);
        });
    }
    modal.classList.add('active');
}
function closeBookmarksModal() { document.getElementById('bookmarks-modal')?.classList.remove('active'); }
function setupHistorySearch() {
    const si = document.getElementById('history-search-input');
    const cb = document.getElementById('history-search-clear');
    if (!si) return;
    si.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        cb?.classList.toggle('visible', searchQuery.trim().length > 0);
        currentHistoryIndex = 0; renderHistory();
    });
    cb?.addEventListener('click', () => {
        searchQuery = ''; si.value = ''; cb.classList.remove('visible'); currentHistoryIndex = 0; renderHistory();
    });
}

// ========== РЕЖИМ ИСТОРИИ ==========
function enterHistoryMode() {
    isInHistoryMode = true;
    app.classList.add('diamond-mode');
    window.electronAPI.setHistoryMode(true);
    characterImg.src = 'character_black.png';
    currentCharacterImage = 'character_black.png';
    emotionSpan.textContent = darkEmojis[Math.floor(Math.random() * darkEmojis.length)];
    characterGlow.style.display = 'block';
    createStormEffect();
    startSparks();
    showEmberRomb();
    loadHistory(); loadBookmarks();
}
function exitHistoryMode() {
    isInHistoryMode = false;
    isShowingMemory = false;
    app.classList.remove('diamond-mode', 'memory-mode');
    window.electronAPI.setHistoryMode(false);
    characterImg.src = 'character.png';
    currentCharacterImage = 'character.png';
    emotionSpan.textContent = '😊';
    removeStormEffect();
    stopSparks();
    hideEmberRomb();
    shownMemories.clear(); currentHistoryIndex = 0; searchQuery = '';
    const si = document.getElementById('history-search-input'); if (si) si.value = '';
    const cb = document.getElementById('history-search-clear'); if (cb) cb.classList.remove('visible');
}

// Гроза
let stormInterval = null;
function createStormEffect() {
    if (!document.getElementById('storm-glow')) {
        const g = document.createElement('div'); g.id = 'storm-glow'; g.className = 'storm-glow';
        document.getElementById('app').appendChild(g);
    }
    if (stormInterval) clearInterval(stormInterval);
    stormInterval = setInterval(() => { if (isInHistoryMode && Math.random() > 0.5) triggerLightning(); }, 2500);
    setTimeout(() => { if (isInHistoryMode) triggerLightning(); }, Math.random() * 3000 + 1000);
}
function triggerLightning() {
    if (!isInHistoryMode) return;
    const l = document.createElement('div'); l.className = 'lightning-flash';
    document.getElementById('app').appendChild(l);
    setTimeout(() => l.remove(), 800);
}
function removeStormEffect() {
    if (stormInterval) { clearInterval(stormInterval); stormInterval = null; }
    document.getElementById('storm-glow')?.remove();
    document.querySelectorAll('.lightning-flash').forEach(e => e.remove());
}

// Искры
let sparkInterval = null;
function createSpark() {
    const sparkContainer = document.getElementById('spark-container');
    if (!sparkContainer || !isInHistoryMode) return;
    const spark = document.createElement('div');
    spark.className = 'spark';
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
        case 0: x = Math.random() * 100; y = 5 + Math.random() * 15; break;
        case 1: x = 85 + Math.random() * 15; y = Math.random() * 100; break;
        case 2: x = Math.random() * 100; y = 85 + Math.random() * 15; break;
        case 3: x = 5 + Math.random() * 15; y = Math.random() * 100; break;
    }
    spark.style.left = `${x}%`; spark.style.top = `${y}%`;
    spark.style.setProperty('--tx', `${(Math.random() - 0.5) * 40}px`);
    spark.style.setProperty('--ty', `${(Math.random() - 0.5) * 40}px`);
    const size = Math.random() * 3 + 3;
    spark.style.width = `${size}px`; spark.style.height = `${size}px`;
    spark.style.animationDelay = `${Math.random() * 0.3}s`;
    sparkContainer.appendChild(spark);
    setTimeout(() => spark.remove(), 1400);
}
function startSparks() {
    if (sparkInterval) clearInterval(sparkInterval);
    sparkInterval = setInterval(() => {
        const sparkContainer = document.getElementById('spark-container');
        if (sparkContainer && isInHistoryMode && !isShowingMemory) {
            for (let i = 0; i < Math.floor(Math.random() * 3) + 4; i++) setTimeout(createSpark, i * 80);
        }
    }, 100);
}
function stopSparks() {
    if (sparkInterval) { clearInterval(sparkInterval); sparkInterval = null; }
    const sparkContainer = document.getElementById('spark-container');
    if (sparkContainer) sparkContainer.querySelectorAll('.spark').forEach(s => s.remove());
}
function showEmberRomb() { const r = document.getElementById('ember-romb'); if (r) r.style.display = 'block'; }
function hideEmberRomb() { const r = document.getElementById('ember-romb'); if (r) r.style.display = 'none'; }

// ========== ОБРАБОТЧИКИ ==========
historyModeBtn?.addEventListener('click', enterHistoryMode);
exitHistoryBtn?.addEventListener('click', exitHistoryMode);
document.getElementById('history-prev-btn')?.addEventListener('click', showHistoryPrev);
document.getElementById('history-next-btn')?.addEventListener('click', showHistoryNext);
document.getElementById('history-message')?.addEventListener('click', () => { if (!isShowingMemory) showHistoryNext(); });
document.getElementById('history-bookmark-btn')?.addEventListener('click', toggleBookmark);
document.getElementById('history-bookmarks-list-btn')?.addEventListener('click', showBookmarksModal);
document.getElementById('bookmarks-close-btn')?.addEventListener('click', closeBookmarksModal);
document.getElementById('bookmarks-modal')?.addEventListener('click', e => { if (e.target.id === 'bookmarks-modal') closeBookmarksModal(); });
setupHistorySearch();

// ========== АНИМАЦИИ И ФОН ==========
setInterval(() => { if (!isInHistoryMode && !isShowingMemory) { characterGlow.classList.add('active'); setTimeout(() => characterGlow.classList.remove('active'), 2000); } }, 4000);
function createDustParticle() {
    const p = document.createElement('div'); p.className = 'particle';
    const s = Math.random() * 4 + 2;
    p.style.width = p.style.height = `${s}px`;
    p.style.left = `${Math.random() * 100}%`; p.style.top = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 5 + 5}s`; p.style.animationDelay = `${Math.random() * 5}s`;
    dustParticles.appendChild(p);
    setTimeout(() => p.remove(), 10000);
}
setInterval(() => { if (dustParticles.children.length < 20 && !isInHistoryMode && !isShowingMemory) createDustParticle(); }, 2000);

window.electronAPI.onTimeOfDay(({ timeOfDay }) => {
    if (!isInHistoryMode && !isShowingMemory) {
        if (timeOfDay === 'day') { sunRays.classList.add('active'); moonLight.classList.remove('active'); }
        else { sunRays.classList.remove('active'); moonLight.classList.add('active'); }
    }
});

// ========== ЧАТ ==========
function animateShuffleLetters() { const el = messageDiv; el.classList.add('shuffle-animation'); setTimeout(() => el.classList.remove('shuffle-animation'), 300); }
function checkAndApplyShake(text) {
    const words = text.split(' ');
    if (words.some(w => w.length >= 3 && w === w.toUpperCase() && /[А-ЯA-Z]/.test(w))) {
        messageDiv.classList.add('shake-letters'); setTimeout(() => messageDiv.classList.remove('shake-letters'), 300);
    }
}
async function showMessage(text, speaker = 'Шалфей', emotion = '😊') {
    speakerDiv.textContent = speaker; emotionSpan.textContent = emotion;
    messageDiv.style.opacity = '1'; messageDiv.textContent = '';
    for (let i = 0; i < text.length; i++) { messageDiv.textContent += text[i]; await new Promise(r => setTimeout(r, 30)); }
    checkAndApplyShake(text);
    characterImg.style.transform = 'scale(1.05)'; setTimeout(() => characterImg.style.transform = 'scale(1)', 200);
}
async function showRandomPhrase() {
    try {
        randomPhraseBtn.style.transform = 'scale(0.95)'; setTimeout(() => randomPhraseBtn.style.transform = 'scale(1)', 150);
        animateShuffleLetters();
        const r = await window.electronAPI.showRandomPhrase();
        if (r?.quote) await window.electronAPI.showQuoteNotification(r.quote);
        return r;
    } catch (e) { console.error(e); await showMessage('Ой, что-то пошло не так...', 'Шалфей', '😵'); }
}
function getEmotionForCommand(cmd) {
    const c = cmd.toLowerCase();
    if (c.includes('бутерброд')) return '🧀';
    if (c.includes('калькулятор')) return '🧮';
    if (c.includes('яндекс')) return '🎵';
    if (c.includes('браузер')) return '🌐';
    if (c.includes('ворд')) return '📄';
    if (c.includes('эксель')) return '📊';
    if (c.includes('выключить')) return '😴';
    if (c.includes('время')) return '⏰';
    if (c.includes('запусти')) return '🚀';
    if (c.includes('открой')) return '📂';
    if (c.includes('привет')) return '👋';
    if (c.includes('как дела')) return '😌';
    if (c.includes('еда')) return '🍚';
    if (c.includes('спасибо')) return '🙏';
    if (c.includes('шарф')) return '🧣';
    if (c.includes('зима')) return '❄️';
    return '😊';
}
async function sendCommand() {
    const cmd = commandInput.value.trim();
    if (!cmd) return;
    commandInput.value = '';
    await showMessage(cmd, 'Вы', '📝');
    setTimeout(async () => {
        try {
            const r = await window.electronAPI.executeCommand(cmd);
            if (r?.success && r?.reply) {
                await showMessage(r.reply, 'Шалфей', getEmotionForCommand(cmd));
            } else if (!r?.success && r?.reply) {
                await showMessage(r.reply, 'Шалфей', '🤔');
            } else {
                await showMessage('...', 'Шалфей', '🤔');
            }
        } catch (e) {
            console.error(e);
            await showMessage('Ошибка обработки команды', 'Шалфей', '😵');
        }
    }, 500);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
sendButton.addEventListener('click', sendCommand);
commandInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendCommand(); });
randomPhraseBtn.addEventListener('click', showRandomPhrase);
pinBtn.addEventListener('click', async () => await window.electronAPI.togglePin());

dragArea.addEventListener('mousedown', e => {
    if (e.button === 0) {
        isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY;
        dragArea.style.cursor = 'grabbing'; e.preventDefault();
    }
});
document.addEventListener('mousemove', e => {
    if (isDragging) {
        const dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
        window.electronAPI.dragWindow({ deltaX: dx, deltaY: dy });
        dragStartX = e.clientX; dragStartY = e.clientY;
    }
});
document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; dragArea.style.cursor = 'move'; } });
closeBtn.addEventListener('click', () => { showMessage('Пока-пока! До новых встреч! 👋', 'Шалфей', '😊'); setTimeout(() => window.electronAPI.closeWindow(), 500); });

const placeholders = ['запусти калькулятор', 'открой блокнот', 'как дела?', 'время', 'привет', 'помоги'];
let pIdx = 0;
setInterval(() => { commandInput.placeholder = `Напиши: ${placeholders[pIdx]}`; pIdx = (pIdx + 1) % placeholders.length; }, 4000);

document.getElementById('addTaskBtn')?.addEventListener('click', () => { const i = document.getElementById('newTaskInput'); addTask(i.value); i.value = ''; });
document.getElementById('newTaskInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') { const i = document.getElementById('newTaskInput'); addTask(i.value); i.value = ''; } });
document.getElementById('addNoteBtn')?.addEventListener('click', () => { const i = document.getElementById('newNoteInput'); addNote(i.value); i.value = ''; });

// Загрузка данных
loadTasks(); loadNotes();
setTimeout(() => showMessage('Привет! Я Шалфей, твой компаньон. Напиши "помоги" чтобы узнать что умею', 'Шалфей', '✨'), 1000);

window.electronAPI.onUserAction(a => { if (a.type === 'time' && !isInHistoryMode && !isShowingMemory) showMessage(a.message, 'Шалфей', '🌞'); });
window.electronAPI.onRandomEvent(ev => {
    if (isInHistoryMode || isShowingMemory) return;
    animateShuffleLetters(); showMessage(ev.message, 'Шалфей', ev.emotion);
    if (ev.imageChange) {
        characterImg.src = ev.imageChange; currentCharacterImage = ev.imageChange;
        characterImg.classList.remove('character-winter-effect');
        if (ev.imageChange === 'character_winter.png') characterImg.classList.add('character-winter-effect');
        if (ev.imageDuration) setTimeout(() => { if (currentCharacterImage !== 'character.png') { characterImg.src = 'character.png'; currentCharacterImage = 'character.png'; characterImg.classList.remove('character-winter-effect'); } }, ev.imageDuration);
    }
});
window.electronAPI.onPinStatus(p => { if (p) { pinBtn.classList.add('pinned'); pinBtn.title = 'Открепить'; } else { pinBtn.classList.remove('pinned'); pinBtn.title = 'Закрепить поверх всех окон'; } });
window.electronAPI.onChangeCharacterImage(img => { if (!isInHistoryMode && !isShowingMemory) { characterImg.src = img; currentCharacterImage = img; characterImg.classList.remove('character-winter-effect'); if (img === 'character_winter.png') characterImg.classList.add('character-winter-effect'); } });

window.electronAPI.onHistoryModeChanged(({ isHistory }) => {
    if (!isHistory) { app.style.transition = 'opacity 0.2s ease'; app.style.opacity = '0.7'; setTimeout(() => { app.style.opacity = '1'; app.style.transition = ''; }, 200); }
});
