Hi. This is a todo app for you, if you are a terminal guy.
</br>Be happy cause you don't need to go out of terminal and write down your todo list in any other apps. 

**Now you can use it with:**

# Show all todos
```code
todo
```

# Add a new todo
```code
todo add "Buy groceries"
```
</br>

```code
todo add "Finish project"
```

# Check/uncheck a todo (toggle)
```code
todo check 1
```

# Remove a todo
```code
todo remove 2
```

# Clear all completed todos
```code
todo clear
```

# Show help
```code 
todo help
```


# For installing the app 

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