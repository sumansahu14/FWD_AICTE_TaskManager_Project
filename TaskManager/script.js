document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Load tasks from local storage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- Helper Functions ---

    /** Renders the entire task list to the DOM. */
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear the current list

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = task.completed ? 'completed' : '';
            listItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" data-index="${index}">
                        ${task.completed ? '↩️' : '✅'}
                    </button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });

        updateProgress();
        saveTasks();
    };

    /** Updates the progress bar and text. */
    const updateProgress = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;

        let percentage = 0;
        if (totalTasks > 0) {
            percentage = Math.round((completedTasks / totalTasks) * 100);
        }

        // Update the visual bar
        progressBar.style.width = `${percentage}%`;

        // Update the text
        progressText.textContent = `${percentage}% Complete (${completedTasks}/${totalTasks} tasks)`;
    };

    /** Saves the current tasks array to local storage. */
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // --- Event Handlers ---

    /** Adds a new task to the list. */
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const newTask = {
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            taskInput.value = ''; // Clear input
            renderTasks();
        }
    };

    /** Handles clicks for completing or deleting a task. */
    const handleTaskAction = (event) => {
        const target = event.target;
        const index = parseInt(target.getAttribute('data-index'));

        if (target.classList.contains('complete-btn')) {
            // Toggle completion status
            tasks[index].completed = !tasks[index].completed;
        } else if (target.classList.contains('delete-btn')) {
            // Remove the task from the array
            tasks.splice(index, 1);
        }
        
        renderTasks(); // Re-render the list after change
    };

    // --- Attach Listeners ---

    // Add task on button click
    addTaskBtn.addEventListener('click', addTask);

    // Add task on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Delegate task action (complete/delete) clicks to the task list
    taskList.addEventListener('click', handleTaskAction);

    // Initial render when the page loads
    renderTasks();
});