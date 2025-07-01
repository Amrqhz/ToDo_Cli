#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const TODO_FILE = path.join(os.homedir(), '.todos.json');

// Helper functions
function loadTodos() {
    try {
        if (fs.existsSync(TODO_FILE)) {
            const data = fs.readFileSync(TODO_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading todos:', error.message);
    }
    return [];
}

function saveTodos(todos) {
    try {
        fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
    } catch (error) {
        console.error('Error saving todos:', error.message);
    }
}

function displayTodos(todos) {
    if (todos.length === 0) {
        console.log('No todos found. Add one with: todo add "Your task"');
        return;
    }

    console.log('\n📝 Your Todos:\n');
    todos.forEach((todo, index) => {
        const status = todo.completed ? '✅' : '⭕';
        const text = todo.completed ? `\x1b[90m${todo.text}\x1b[0m` : todo.text;
        console.log(`${index + 1}. ${status} ${text}`);
    });
    console.log('');
}

function addTodo(text) {
    const todos = loadTodos();
    todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    saveTodos(todos);
    console.log(`✅ Added: "${text}"`);
}

function toggleTodo(index) {
    const todos = loadTodos();
    const todoIndex = parseInt(index) - 1;
    
    if (todoIndex < 0 || todoIndex >= todos.length) {
        console.log('❌ Invalid todo number');
        return;
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    saveTodos(todos);
    
    const status = todos[todoIndex].completed ? 'completed' : 'unchecked';
    console.log(`✅ Todo ${index} ${status}: "${todos[todoIndex].text}"`);
}

function removeTodo(index) {
    const todos = loadTodos();
    const todoIndex = parseInt(index) - 1;
    
    if (todoIndex < 0 || todoIndex >= todos.length) {
        console.log('❌ Invalid todo number');
        return;
    }

    const removed = todos.splice(todoIndex, 1)[0];
    saveTodos(todos);
    console.log(`🗑️  Removed: "${removed.text}"`);
}

function clearCompleted() {
    const todos = loadTodos();
    const remaining = todos.filter(todo => !todo.completed);
    const removed = todos.length - remaining.length;
    
    saveTodos(remaining);
    console.log(`🧹 Cleared ${removed} completed todo(s)`);
}

function showHelp() {
    console.log(`
📝 Todo CLI - Usage:

  todo                    Show all todos
  todo add "task"         Add a new todo
  todo check <number>     Check/uncheck a todo
  todo remove <number>    Remove a todo
  todo clear              Clear all completed todos
  todo help               Show this help

Examples:
  todo add "Buy groceries"
  todo check 1
  todo remove 2
`);
}

// Main CLI logic
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            if (args.length < 2) {
                console.log('❌ Please provide a todo text: todo add "Your task"');
                return;
            }
            const todoText = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
            addTodo(todoText);
            break;

        case 'check':
        case 'toggle':
            if (args.length < 2) {
                console.log('❌ Please provide a todo number: todo check <number>');
                return;
            }
            toggleTodo(args[1]);
            break;

        case 'remove':
        case 'delete':
        case 'rm':
            if (args.length < 2) {
                console.log('❌ Please provide a todo number: todo remove <number>');
                return;
            }
            removeTodo(args[1]);
            break;

        case 'clear':
            clearCompleted();
            break;

        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;

        case undefined:
            // Show all todos when no command is provided
            const todos = loadTodos();
            displayTodos(todos);
            break;

        default:
            console.log(`❌ Unknown command: ${command}`);
            console.log('Run "todo help" for usage information');
    }
}

// Run the CLI
main();
