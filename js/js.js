$(document).ready(function () {
    // Define elements
    var taskForm = $("#taskForm");
    var taskList = $("#taskList");
    var filterButtons = $('.nav-link');

    // Define tasks array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


    // Add task event
    taskForm.on('submit', function (event) {
        // 1. prevent form submission
        event.preventDefault();
        // 2. get task text
        var taskText = $('#addTaskInput').val();
        // 3. if task text is not empty
        if (taskText) {
            // 4. create tasks and push it to tasks array
            var task = { text: taskText, id: Date.now(), completed: false, delete:false };
            var taskArray = tasks.push(task);
            console.log(taskArray);
            // 5. clear input field 
            $('#addTaskInput').val('');
            //6.saving and rendering the tasks
            saveAndRenderTasks();
        }
   

    });

    // Toggle task checkbox
    $('#taskList').on('click', 'input[type="checkbox"]', function (event) { 
        console.log("render");
        // 1. if clicked element is checkbox
        if ($(this).attr('type') === 'checkbox') {
            // 2. get task id
            var taskId = $(this).data('id');
            /**
             * 3. toggle task completed in tasks array
             */
            tasks = tasks.map((task) =>
                task.id == taskId ? { ...task, completed: !task.completed } : task
            );
            // 4. save and render tasks
            saveAndRenderTasks();
        }

        
    });


    //delete task
    $('#taskList').on('click', '.button', function (event) { 
        console.log("delete");
        // 1. if clicked element is button
        if ($(this).attr('type') === 'button') {
            // 2. get task id
            var taskId = $(this).data('id');
            console.log("taskid delete is:" + taskId);
            // 3. delete task
            tasks = tasks.filter((task) => task.id !== taskId);
            // 4. save and render tasks
            saveAndRenderTasks();
        }
    });
    

     // Filter active or completed tasks
     filterButtons.each(function () {
        // 1. add click event to each tab of different filterButtons
        $(this).on('click', function (event) {
            // 2. remove active class from each tab that has it
            $('.nav-link.active').removeClass('active');
            // 3. add active class to clicked tab
            $(event.target).addClass('active');
            // 4. render only tasks that match the filter ('all', 'active', 'completed')
            const activeFilter = $(event.target).attr('data-filter');
            renderTasks(activeFilter);
        });
    });


     // Save to localStorage and render tasks
     function saveAndRenderTasks() {
        // 1. write tasks to localStorage with `tasks` key
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // 2. render tasks
        var activeFilter = $('.nav-link.active').data('filter');
        renderTasks(activeFilter);
    }

      // Main function to render tasks array
      function renderTasks(activeFilter = 'all') {
        // 1. clear taskList content
        $('#taskList').html('');
        // 2. filter tasks that match the active filter
        var filteredTasks = tasks.filter((task) => {
            if (activeFilter === 'active') return !task.completed;
            else if (activeFilter === 'completed') return task.completed;
            else return true;
        });

        // 3. create `li` element for each task and append it to taskList
        filteredTasks.forEach((task) => {
            const li = $('<li></li>').addClass('list-group-item');
            li.html(`
    <input type="checkbox" class="form-check-input" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
    <button type="button" class="btn btn-danger btn-sm button" data-id="${task.id}" data-delete="no">Delete</button>
    <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
  `);
            $('#taskList').append(li);
        });
    }
    
     // Initial render
     renderTasks();


 

})
//localStorage.clear();

