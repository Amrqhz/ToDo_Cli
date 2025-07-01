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

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins < 1 ? 'just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

function showBanner() {
    console.log('\x1b[36m');
    console.log('████████╗ ██████╗ ██████╗  ██████╗ ');
    console.log('╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗');
    console.log('   ██║   ██║   ██║██║  ██║██║   ██║');
    console.log('   ██║   ██║   ██║██║  ██║██║   ██║');
    console.log('   ██║   ╚██████╔╝██████╔╝╚██████╔╝');
    console.log('   ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ ');
    console.log('\x1b[0m');
    console.log('\x1b[2m           by AMRQHZ\x1b[0m');
    console.log('\x1b[2m           v1.1.0\x1b[0m');
    console.log('');
    
    // Social links
    console.log('\x1b[2m  🐙 GitHub: https://github.com/amrqhz\x1b[0m');
    console.log('\x1b[2m  🐦 Twitter: https://twitter.com/amrqhz\x1b[0m');
    console.log('\x1b[2m  📱 Telegram: https://t.me/amrqhz\x1b[0m');
    console.log('');
}

function displayTodos(todos) {
    showBanner();
    
    if (todos.length === 0) {
        console.log('┌─────────────────────────────────────────────┐');
        console.log('│                                             │');
        console.log('│  \x1b[36m📝 No todos found!\x1b[0m                      │');
        console.log('│                                             │');
        console.log('│  \x1b[2mGet started with:\x1b[0m                       │');
        console.log('│  \x1b[33mtodo add "Your first task"\x1b[0m              │');
        console.log('│                                             │');
        console.log('└─────────────────────────────────────────────┘\n');
        return;
    }

    // Header
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│                                             │');
    console.log('│  \x1b[1m\x1b[36m📝 Your Todo List\x1b[0m                          │');
    console.log('│                                             │');
    console.log('└─────────────────────────────────────────────┘');

    // Statistics
    const completed = todos.filter(t => t.completed).length;
    const pending = todos.length - completed;
    console.log(`\x1b[2m  📊 Total: ${todos.length} | ✅ Done: ${completed} | ⏳ Pending: ${pending}\x1b[0m`);
    console.log('');

    // Todo items
    todos.forEach((todo, index) => {
        const num = `${index + 1}`.padStart(2, ' ');
        const timeAgo = formatDate(todo.createdAt);
        
        if (todo.completed) {
            // Completed todo - green checkmark, strikethrough text
            console.log(`  \x1b[32m✓\x1b[0m \x1b[2m${num}.\x1b[0m \x1b[9m\x1b[90m${todo.text}\x1b[0m`);
            console.log(`     \x1b[90m\x1b[2m📅 Created ${timeAgo}${todo.completedAt ? ` • ✅ Completed ${formatDate(todo.completedAt)}` : ''}\x1b[0m`);
        } else {
            // Pending todo - yellow circle, normal text
            console.log(`  \x1b[33m○\x1b[0m \x1b[1m${num}.\x1b[0m ${todo.text}`);
            console.log(`     \x1b[90m\x1b[2m📅 Created ${timeAgo}\x1b[0m`);
        }
        console.log(''); // Add spacing between todos
    });
    
    console.log('\x1b[2m  💡 Use "todo check <number>" to toggle completion\x1b[0m');
    console.log('\x1b[2m  💡 Use "todo help" for more commands\x1b[0m\n');
}

function addTodo(text) {
    const todos = loadTodos();
    const now = new Date().toISOString();
    todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: now
    });
    saveTodos(todos);
    
    console.log('\n┌─────────────────────────────────────────────┐');
    console.log('│  \x1b[32m✨ Todo Added Successfully!\x1b[0m             │');
    console.log('│                                             │');
    console.log(`│  \x1b[1m"${text}"\x1b[0m${' '.repeat(Math.max(0, 41 - text.length))}│`);
    console.log(`│  \x1b[2m📅 ${new Date().toLocaleString()}\x1b[0m${' '.repeat(Math.max(0, 41 - new Date().toLocaleString().length))}│`);
    console.log('│                                             │');
    console.log('└─────────────────────────────────────────────┘\n');
}

function toggleTodo(index) {
    const todos = loadTodos();
    const todoIndex = parseInt(index) - 1;
    
    if (todoIndex < 0 || todoIndex >= todos.length) {
        console.log('\n\x1b[31m❌ Invalid todo number\x1b[0m');
        console.log('\x1b[2m   Use "todo" to see your list\x1b[0m\n');
        return;
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    
    // Add completion timestamp
    if (todos[todoIndex].completed) {
        todos[todoIndex].completedAt = new Date().toISOString();
    } else {
        delete todos[todoIndex].completedAt;
    }
    
    saveTodos(todos);
    
    if (todos[todoIndex].completed) {
        console.log('\n┌─────────────────────────────────────────────┐');
        console.log('│  \x1b[32m🎉 Todo Completed!\x1b[0m                     │');
        console.log('│                                             │');
        console.log(`│  \x1b[9m\x1b[90m"${todos[todoIndex].text}"\x1b[0m${' '.repeat(Math.max(0, 41 - todos[todoIndex].text.length))}│`);
        console.log(`│  \x1b[2m✅ ${new Date().toLocaleString()}\x1b[0m${' '.repeat(Math.max(0, 41 - new Date().toLocaleString().length))}│`);
        console.log('│                                             │');
        console.log('└─────────────────────────────────────────────┘\n');
    } else {
        console.log('\n┌─────────────────────────────────────────────┐');
        console.log('│  \x1b[33m🔄 Todo Reopened\x1b[0m                       │');
        console.log('│                                             │');
        console.log(`│  \x1b[1m"${todos[todoIndex].text}"\x1b[0m${' '.repeat(Math.max(0, 41 - todos[todoIndex].text.length))}│`);
        console.log(`│  \x1b[2m🔄 ${new Date().toLocaleString()}\x1b[0m${' '.repeat(Math.max(0, 41 - new Date().toLocaleString().length))}│`);
        console.log('│                                             │');
        console.log('└─────────────────────────────────────────────┘\n');
    }
}

function removeTodo(index) {
    const todos = loadTodos();
    const todoIndex = parseInt(index) - 1;
    
    if (todoIndex < 0 || todoIndex >= todos.length) {
        console.log('\n\x1b[31m❌ Invalid todo number\x1b[0m');
        console.log('\x1b[2m   Use "todo" to see your list\x1b[0m\n');
        return;
    }

    const removed = todos.splice(todoIndex, 1)[0];
    saveTodos(todos);
    
    console.log('\n┌─────────────────────────────────────────────┐');
    console.log('│  \x1b[31m🗑️  Todo Removed\x1b[0m                        │');
    console.log('│                                             │');
    console.log(`│  \x1b[9m"${removed.text}"\x1b[0m${' '.repeat(Math.max(0, 41 - removed.text.length))}│`);
    console.log(`│  \x1b[2m📅 Created ${formatDate(removed.createdAt)}\x1b[0m${' '.repeat(Math.max(0, 41 - `Created ${formatDate(removed.createdAt)}`.length))}│`);
    console.log('│                                             │');
    console.log('└─────────────────────────────────────────────┘\n');
}

function clearCompleted() {
    const todos = loadTodos();
    const remaining = todos.filter(todo => !todo.completed);
    const removed = todos.length - remaining.length;
    
    if (removed === 0) {
        console.log('\n\x1b[33m💭 No completed todos to clear\x1b[0m\n');
        return;
    }
    
    saveTodos(remaining);
    
    console.log('\n┌─────────────────────────────────────────────┐');
    console.log('│  \x1b[32m🧹 Cleanup Complete!\x1b[0m                   │');
    console.log('│                                             │');
    console.log(`│  \x1b[1mCleared ${removed} completed todo${removed === 1 ? '' : 's'}\x1b[0m${' '.repeat(Math.max(0, 30 - removed.toString().length))}│`);
    console.log(`│  \x1b[2m🗑️  ${new Date().toLocaleString()}\x1b[0m${' '.repeat(Math.max(0, 41 - new Date().toLocaleString().length))}│`);
    console.log('│                                             │');
    console.log('└─────────────────────────────────────────────┘\n');
}

function showHelp() {
    showBanner();
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  \x1b[1m\x1b[36m📝 Todo CLI - Command Reference\x1b[0m                    ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  \x1b[1mCOMMANDS:\x1b[0m                                           ║
║                                                       ║
║  \x1b[33mtodo\x1b[0m                     Show all todos            ║
║  \x1b[33mtodo add "task"\x1b[0m          Add a new todo            ║
║  \x1b[33mtodo check <number>\x1b[0m      Toggle todo completion    ║
║  \x1b[33mtodo remove <number>\x1b[0m     Remove a todo             ║
║  \x1b[33mtodo clear\x1b[0m               Clear completed todos     ║
║  \x1b[33mtodo help\x1b[0m                Show this help            ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  \x1b[1mEXAMPLES:\x1b[0m                                          ║
║                                                       ║
║  \x1b[32m$\x1b[0m todo add "Buy groceries"                       ║
║  \x1b[32m$\x1b[0m todo add "Finish the report"                   ║
║  \x1b[32m$\x1b[0m todo check 1                                   ║
║  \x1b[32m$\x1b[0m todo remove 2                                  ║
║  \x1b[32m$\x1b[0m todo clear                                     ║
║                                                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  \x1b[1mFEATURES:\x1b[0m                                         ║
║                                                       ║
║  📅 Timestamps for creation and completion            ║
║  🕒 Smart relative time display (2h ago, 3d ago)     ║
║  📊 Statistics and progress tracking                  ║
║  🎨 Beautiful CLI interface with colors               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`);
}

// Main CLI logic
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            if (args.length < 2) {
                console.log('\n\x1b[31m❌ Missing todo text\x1b[0m');
                console.log('\x1b[2m   Usage: todo add "Your task"\x1b[0m\n');
                return;
            }
            const todoText = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
            addTodo(todoText);
            break;

        case 'check':
        case 'toggle':
            if (args.length < 2) {
                console.log('\n\x1b[31m❌ Missing todo number\x1b[0m');
                console.log('\x1b[2m   Usage: todo check <number>\x1b[0m\n');
                return;
            }
            toggleTodo(args[1]);
            break;

        case 'remove':
        case 'delete':
        case 'rm':
            if (args.length < 2) {
                console.log('\n\x1b[31m❌ Missing todo number\x1b[0m');
                console.log('\x1b[2m   Usage: todo remove <number>\x1b[0m\n');
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
            console.log(`\n\x1b[31m❌ Unknown command: \x1b[1m${command}\x1b[0m`);
            console.log('\x1b[2m   Run "todo help" for available commands\x1b[0m\n');
    }
}

// Run the CLI
main();