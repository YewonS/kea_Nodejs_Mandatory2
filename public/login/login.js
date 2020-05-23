function validateLogin() {

    console.log("validate login...")

    const username = document.forms.loginform.username.value;
    const password = document.forms.loginform.password.value;

    if (username && password) {
        return true;
        // TODO: 이건 아니지.. 둘만 있으면 넘어가잖아. 얘때문에 안되는 거네. 비번이 8글자도 아닌데 그냥 넘기자나 ㅅㅂ
    } else if (password.length < 8) {
        alert("Password should be more than 8 characters.");
        return false;
    } else {
        alert("Username or password should not be empty.")
        return false;
    }

}