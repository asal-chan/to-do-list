$(document).ready(function(){
    const url="https://urchin-app-3n4ql.ondigitalocean.app";

    $("#registerForm").on('submit',event => {
       event.preventDefault();
       const email=$("#email").val();
       const name=$("#name").val();
       const password=$("#pass").val();

       fetch(url+"/user/register",{
        method:"POST",
        body:JSON.stringify({
            email:email,
            name:name,
            password:password
        })
       })
       .then(response => response.json())
       .then(data =>{
       document.getElementById("message").innerHTML= "okay! now you can log in!"

       })
       .catch(error =>{
        console.error(error);
       })
    })

})