import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyClNlPV9avthcPgSbC7daYJ0Y51tUznqc4",
  authDomain: "shopeasy-b59d1.firebaseapp.com",
  projectId: "shopeasy-b59d1",
  storageBucket: "shopeasy-b59d1.firebasestorage.app",
  messagingSenderId: "1057945325787",
  appId: "1:1057945325787:web:7dcd4ce00f2cb89d217cfe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm =
document.getElementById("loginForm");

loginForm.addEventListener(
"submit",
async function(e){

e.preventDefault();

const email =
document.getElementById("email").value.trim();

const password =
document.getElementById("password").value.trim();

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

alert("✅ Login Successful");

window.location.href =
"index.html";

}catch(error){

alert(error.message);

}

});
