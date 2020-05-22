
const User = require('../../models/User.js');
async function validateUser() {


    console.log("validate user...")

    const username = document.forms.signupform.username.value;
    const password = document.forms.signupform.password.value;
    const passwordRepeat = document.forms.signupform.passwordRepeat.value;

    console.log("user ", username, password, passwordRepeat)
    //const userFound = await User.query().select().where({ 'username': username }).limit(1);
    // if (userFound.length > 0) {
    //     alert("Username is already taken.");
    //     validate = false;
    // } 

    if (password.length < 8) {
        alert("Password should be more than 8 characters.");
        return false;
    }

    if (password !== passwordRepeat) {
        alert("Password is incorrect.");
        return false;
    }

}
