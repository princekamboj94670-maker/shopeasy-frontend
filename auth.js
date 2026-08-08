// ---------- SIGNUP ----------

let signupForm = document.getElementById("signupForm");

if (signupForm) {

signupForm.addEventListener("submit", function(e) {

e.preventDefault();

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let user = {
name,
email,
password
};

localStorage.setItem("user", JSON.stringify(user));

alert("Signup Successful!");

window.location.href = "login.html";

});

}

// ---------- LOGIN ----------

let loginForm = document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener("submit", function(e) {

e.preventDefault();

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

let user = JSON.parse(localStorage.getItem("user"));

if (!user) {

alert("Please Signup First!");

window.location.href = "signup.html";

return;

}

if (email === user.email && password === user.password) {

localStorage.setItem("loggedIn", "true");

alert("Login Successful!");

window.location.href = "index.html";

} else {

alert("Invalid Email or Password!");

}

});

}
