if($('#loggedInUser').text()){
    $("#signupButton").hide();
    $("#loginButton").hide();
}else{
    $("#logoutButton").hide();
    $("#loggedInUser").hide();
}