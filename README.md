Welcome to **Terminal Todo App** — your simple, fast, and efficient todo list manager right in your terminal!  
No need to switch apps or open browsers. Manage your tasks directly from the command line and boost your productivity instantly.

---

## Features

- Add, view, check/uncheck, and remove todos effortlessly  
- Clear all completed tasks with a single command  
- Minimal setup and easy to use  
- Works entirely within your terminal  

---

**Now you can use it with:**

### Show all todos
```code
todo
```

### Add a new todo
```code
todo add "Buy groceries"
```
</br>

```code
todo add "Finish project"
```

### Check/uncheck a todo (toggle)
```code
todo check 1
```

### Remove a todo
```code
todo remove 2
```

### Clear all completed todos
```code
todo clear
```

### Show help
```code 
todo help
```


# Installation
Follow these simple steps to get started:

```bash

# Create a package.json
npm init -y

# Add bin field to package.json:
{
  "bin": {
    "todo": "./todo.js"
  },
}

# Install globally
npm install -g .
```


## Usage Tips

- Use `todo` to quickly list all your tasks.  
- Use task IDs (shown in the list) to toggle or remove specific todos.  
- Keep your task list clean by clearing completed todos regularly with `todo clear`.  

---

## Contributing

Feel free to contribute! Open issues or submit pull requests to improve the app.

---

Stay productive and happy coding! 🚀  
If you have any questions or suggestions, don’t hesitate to reach out.