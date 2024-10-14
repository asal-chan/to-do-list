
const BASEURL = "https://urchin-app-3n4ql.ondigitalocean.app";

$(document).ready(async function () {
    const TOKEN=window.localStorage.getItem("token");
    // Define elements
    var taskForm = $("#taskForm");
    var taskList = $("#taskList");
    var filterButtons = $('.nav-link');

    // Define tasks array
    //let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let tasks = await getToDos();


    // Add task event
    taskForm.on('submit', async function (event) {
        // 1. prevent form submission
        event.preventDefault();
        // 2. get task text
        var taskText = $('#addTaskInput').val();
        // 3. if task text is not empty
        if (taskText) {
            // 4. create tasks and push it to tasks array
            var task = { title: taskText, completed: false };
            //var taskArray = tasks.push(task);
            await postTodo(task);

            // 5. clear input field 
            $('#addTaskInput').val('');
            //6. rendering the tasks
            var activeFilter = $('.nav-link.active').data('filter');
            renderTasks(activeFilter);
        }


    });

    // Toggle task checkbox
    $('#taskList').on('click', 'input[type="checkbox"]',async function (event) {
        console.log("render");
        // 1. if clicked element is checkbox
        if ($(this).attr('type') === 'checkbox') {
            // 2. get task id
            var taskId = $(this).data('id');
            /**
             * 3. toggle task complete
             */
            var task = tasks.find((task) =>task.id === taskId);
            await toggleTodoCom(task);
           
            // 4. render tasks
            var activeFilter = $('.nav-link.active').data('filter');
            renderTasks(activeFilter);

        }


    });


    //delete task
    $('#taskList').on('click', '.button',async function (event) {
        // 1. if clicked element is button
        if ($(this).attr('type') === 'button') {
            // 2. get task id
            var taskId = $(this).data('id');
            // 3. delete task
            tasks = tasks.filter((task) => task.id !== taskId);
            await delTodo(taskId);
            // 4. render tasks
            var activeFilter = $('.nav-link.active').data('filter');
            renderTasks(activeFilter);
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
    async function renderTasks(activeFilter = 'all') {
        //0. get tasks from api
        tasks = await getToDos();
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
    <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.title}</span>
  `);
            $('#taskList').append(li);
        });
    }

    // Initial render
    renderTasks();

    function getToDos() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: BASEURL + "/todos",
                type: "GET",
                headers: {
                    Authorization: TOKEN
                },
                success: (res) => {
                    resolve(res);
                },
                error: (error) => {
                    reject(error);
                }

            })
        })

    }

    function postTodo(task) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: BASEURL + "/todos",
                type: "POST",
                headers: {
                    Authorization: TOKEN
                },
                data: JSON.stringify(task),
                success: (res) => {
                    resolve(res);
                },
                error: (error) => {
                    reject(error);
                },
            })
        })
    }

    function toggleTodoCom(task) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: BASEURL + "/todos/"+task.id,
                type: "PUT",
                headers: {
                    Authorization: TOKEN
                },
                data: JSON.stringify({
                    title:task.title,
                    completed:!task.completed
                }),
                success: (res) => {
                    resolve(res);
                },
                error: (error) => {
                    reject(error);
                },
            })
        })
    }
    function delTodo(taskId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: BASEURL + "/todos/"+taskId,
                type: "DELETE",
                headers: {
                    Authorization: TOKEN
                },
                success: (res) => {
                    resolve(res);
                },
                error: (error) => {
                    reject(error);
                },
            })
        })
    }
    //logout
    $("#logout").on('click' , event =>{
        window.localStorage.removeItem("token");
        window.location.href="login.html";
    })
})
//localStorage.clear();

