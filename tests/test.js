/**
 * @jest-environment jsdom
 */

// Подтягиваем функции из основного файла
const { addToDo } = require('../src/JS/main.js');

describe('ToDo App Tests', () => {
    beforeEach(() => {
        // Создаем виртуальный HTML перед каждым тестом
        document.body.innerHTML = `
            <input class="todo-input" value="Купить молоко" />
            <button class="todo-btn"></button>
            <div class="todo-list"></div>
        `;
        localStorage.clear();
    });

    test('Добавление новой задачи в список', () => {
        const input = document.querySelector('.todo-input');
        const list = document.querySelector('.todo-list');
        
        // Эмулируем клик (через вызов функции)
        const event = { preventDefault: jest.fn() };
        addToDo(event);

        // Проверяем, что в списке появился элемент li
        const todoItem = list.querySelector('.todo-item');
        expect(todoItem.innerText).toBe('Купить молоко');
        
        // Проверяем, что инпут очистился
        expect(input.value).toBe('');
    });

    test('Сохранение задачи в LocalStorage', () => {
        const event = { preventDefault: jest.fn() };
        addToDo(event);

        const savedTodos = JSON.parse(localStorage.getItem('todos'));
        expect(savedTodos.length).toBe(1);
        expect(savedTodos[0].text).toBe('Купить молоко');
    });
});