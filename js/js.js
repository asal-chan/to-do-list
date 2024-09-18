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
            var task = { text: taskText, id: Date.now(), completed: false };
            var taskArray = tasks.push(task);
            console.log(taskArray);
            // 5. clear input field 
            $('#addTaskInput').val('');
            //6.saving and rendering the tasks
            saveAndRenderTasks();
        }

        // Save to localStorage and render tasks
        function saveAndRenderTasks() {
            // 1. write tasks to localStorage with `tasks` key
            localStorage.setItem('tasks', JSON.stringify(tasks));
            // 2. render tasks
            var activeNavLink = $('.nav-link.active');
            var activeFilter = $('activeNavLink').data('filter');
            renderTasks(activeFilter);
        }

        function renderTasks(activeFilter = 'all') {
            // 1. clear taskList content
            taskList.innerHTML = '';
            // 2. filter tasks that match the active filter
            var filteredTasks = tasks.filter((task) => {
                if (activeFilter === 'active') return !task.completed;
                else if (activeFilter === 'complete') return task.completed;
                else return true;
            });
            // 3. create `li` element for each task and append it to taskList
            $.each(filteredTasks, function (index, task) {
                console.log(task.text); // Example action: logging the task text
                 $('#taskList').append(
                '<li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">' +
              '<input class="form-check-input me-2 myCheckbox" type="checkbox" value="" aria-label="..." />' +
              task.text +
              '</li>'
            );

            });







        }

    });
})
localStorage.clear();
