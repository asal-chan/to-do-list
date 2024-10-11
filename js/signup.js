$(document).ready(function () {
    const token = window.localStorage.getItem("token");
    if (token)
        window.location.href = "todo-list.html";
    const url = "https://urchin-app-3n4ql.ondigitalocean.app";

    $("#registerForm").on('submit', event => {
        event.preventDefault();
        const email = $("#email").val();
        const name = $("#name").val();
        const password = $("#pass").val();

        fetch(url + "/user/register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                name: name,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("message").innerHTML = "okay! now you can log in!"

            })
            .catch(error => {
                console.error(error);
            })
    })

    $("#loginForm").on('submit', event => {
        event.preventDefault()
        const emailL = $("#emailLogin").val();
        const passwordL = $("#passLogin").val();

        fetch(url + "/user/login", {
            method: "POST",
            body: JSON.stringify({
                email: emailL,
                password: passwordL
            })
        })
            .then(response => response.json())
            .then(data => {
                window.localStorage.setItem("token", data.token);
                window.location.href = "todo-list.html";
            });


    })

})