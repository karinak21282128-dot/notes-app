// 1. Инициализация: загружаем заметки из localStorage или создаем пустой массив
let notes = JSON.parse(localStorage.getItem('notes')) || [];

const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const statsDiv = document.getElementById('stats');

// 2. Функция сохранения в localStorage (Оптимизация + Функция 1)
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes(); // Перерисовываем интерфейс после сохранения
}

// 3. Рендеринг списка (Оптимизация: используем DocumentFragment и делегирование)
function renderNotes() {
    notesList.innerHTML = ''; // Очищаем список
    const fragment = document.createDocumentFragment();

    notes.forEach((note, index) => {
        const li = document.createElement('li');
        if (note.completed) li.classList.add('completed');

        // Текст заметки (Функция 2: Клик для отметки "Выполнено")
        const span = document.createElement('span');
        span.className = 'note-text';
        span.textContent = note.text;
        span.addEventListener('click', () => toggleComplete(index));

        // Кнопки действий
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        // Функция 3: Редактирование
        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.title = 'Редактировать';
        editBtn.addEventListener('click', () => editNote(index));

        // Удаление (как в оригинале, но с сохранением)
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Удалить';
        deleteBtn.addEventListener('click', () => deleteNote(index));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actionsDiv);
        fragment.appendChild(li);
    });

    notesList.appendChild(fragment);
    updateStats(); // Функция 4: Обновление счетчика
}

// 4. Добавление заметки
addNoteBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (text) {
        notes.push({ text: text, completed: false });
        noteInput.value = '';
        saveNotes(); // Сохраняем и перерисовываем
    } else {
        alert('Пожалуйста, введите заметку.');
    }
});

// Разрешаем добавление по Enter
noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNoteBtn.click();
});

// --- Вспомогательные функции для новых возможностей ---

// Функция 2: Переключение статуса
function toggleComplete(index) {
    notes[index].completed = !notes[index].completed;
    saveNotes();
}

// Функция 3: Редактирование
function editNote(index) {
    const newText = prompt('Редактировать заметку:', notes[index].text);
    if (newText !== null && newText.trim() !== '') {
        notes[index].text = newText.trim();
        saveNotes();
    }
}

// Удаление
function deleteNote(index) {
    if (confirm('Удалить эту заметку?')) {
        notes.splice(index, 1);
        saveNotes();
    }
}

// Функция 4: Счётчик
function updateStats() {
    const total = notes.length;
    const completed = notes.filter(n => n.completed).length;
    statsDiv.textContent = `Всего: ${total} | Выполнено: ${completed}`;
}

// Первоначальный рендеринг при загрузке страницы
renderNotes();