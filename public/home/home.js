$(document).ready(function() {

    console.log("hello");

    let signup = $('.signup')
    signup.attr("href") = ""
    signup.removeClass("signup")
    signup.innerHTML = ""

    let login = $('.login')
    login.addClass("logout")
    login.attr("href") = "/logout"
    login.innerHTML = "logout"
    login.removeClass("login")


})

TODO: This