const queryString = window.location.search;
if(queryString)
    alert("Username or password is incorrect.");

function validateLogin() {

    console.log("validate login...")

    const username = document.forms.loginform.username.value;
    const password = document.forms.loginform.password.value;

    if (!username || !password) {
        alert("Username or password should not be empty.");
        return false;
    } else if (password.length < 8) {
        alert("Password should be more than 8 characters.");
        return false;
    } else {
        return true;
    }

}