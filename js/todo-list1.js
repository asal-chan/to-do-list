$(document).ready(function () {
    //localstorageadapter with the key 'todoTasks'
    const adapter = new LocalStorageAdapter('todoTasks');
    // this gets all filter buttons
    var filterButtons = $('.nav-link');
    // this gets the currently active filter
    var activeFilter = $('.nav-link.active').data('filter');

    // rendering tasks
    async function renderTasks(activeFilter = 'all') {
        // this gets tasks from local storage
        const tasks = adapter.getTasks();

        $('#taskList').empty();

        // this part filters tasks
        var filteredTasks = tasks.filter((task) => {
            if (activeFilter === 'active') return !task.completed;
            else if (activeFilter === 'completed') return task.completed;
            else return true;
        });

        // rendering tasks each filtered task as a list 
        filteredTasks.forEach((task) => {
            const li = $('<li></li>').addClass('list-group-item');
            li.html(`
                <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
                <button class="btn-delete" data-id="${task.id}">delete</button>
                <input type="checkbox" class="form-check-input" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
            `);
            $('#taskList').append(li);
        });
    }

    // adding a new task
    $('#taskForm').on('submit', function (event) {
        event.preventDefault();
        const taskText = $('#addTaskInput').val();
        if (taskText) {
            // creating a new task object
            var newTask = { id: Date.now(), text: taskText, completed: false };           
            adapter.addTask(newTask);           
            $('#addTaskInput').val('');
            renderTasks();
        }
    });

    // handle the toggle of task completion by checkbox
    $('#taskList').on('click', 'input[type="checkbox"]', async function (event) {
        // Check if the clicked element is a checkbox
        if ($(this).attr('type') === 'checkbox') {
            // getting the task ID from the checkbox
            var taskId = $(this).data('id');
            // getting the task from local storage
            const tasks = adapter.getTasks();
            var task = tasks.find((task) => task.id === taskId);
            // toggling the task's completion status
            await toggleTodoCom(task);
            // rendering tasks based on the active filter
            var activeFilter = $('.nav-link.active').data('filter');
            renderTasks(activeFilter);
        }
    });

    // toggling the completion status of a task (updating a task)
    function toggleTodoCom(task) {
        return new Promise((resolve, reject) => {
            try {
                // getting all tasks from local storage
                const tasks = adapter.getTasks();
                // finding the task to update
                const taskIndex = tasks.findIndex(t => t.id === task.id);
                if (taskIndex !== -1) {
                    // toggling the completion
                    tasks[taskIndex].completed = !tasks[taskIndex].completed;
                    // save the updated task
                    adapter.saveTasks(tasks);
                    // succession!!!
                    resolve(tasks[taskIndex]);
                } else {
                    //if the task is not found
                    reject(new Error("Task not found"));
                }
            } catch (error) {
                //if an error occurs
                reject(error);
            }
        });
    }

    
    filterButtons.each(function () {
        $(this).on('click', function (event) {
            $('.nav-link.active').removeClass('active');
            $(event.target).addClass('active');
            const activeFilter = $(event.target).attr('data-filter');
            renderTasks(activeFilter);
        });
    });

    
    // Use event delegation for dynamically created elements
    $('#taskList').on('click', '.btn-delete', function() {
        const tasks = adapter.getTasks();
        const taskId = $(this).attr('data-id');
        // Remove the task from local storage
        adapter.deleteTask(taskId);
        // Remove the task from the DOM
        $(this).closest('li').remove();
        //testing
        console.log(tasks);
    });



   

    // rendering tasks based on the filters 
    renderTasks(activeFilter);

    
    //localStorage.clear();
});

