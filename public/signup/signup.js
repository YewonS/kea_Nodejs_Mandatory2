function validateUser() {

    console.log("validate user...")

    const username = document.forms.signupform.username.value;
    const email = document.forms.signupform.email.value;
    const password = document.forms.signupform.password.value;
    const passwordRepeat = document.forms.signupform.passwordRepeat.value;
 
    // email validation
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())) {
        alert("Email is not valid.");
        return false;
    }

    if (password.length < 8) {
        alert("Password should be more than 8 characters.");
        return false;
    }

    if (password !== passwordRepeat) {
        alert("Password is incorrect.");
        return false;
    }

}
