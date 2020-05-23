function validateLogin() {

    console.log("validate login...")

    const password = document.forms.loginform.password.value;

    if (password.length < 8) {
        alert("Password should be more than 8 characters.");
        return false;
    }

}