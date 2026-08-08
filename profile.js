import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Load Profile
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("email").innerText = "📧 " + user.email;

  try {

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {

      const data = snap.data();

      document.getElementById("name").value = data.name || "";
      document.getElementById("phone").value = data.phone || "";
      document.getElementById("address").value = data.address || "";
      document.getElementById("city").value = data.city || "";
      document.getElementById("pincode").value = data.pincode || "";

    }

  } catch (error) {
    console.log(error);
  }

});

// Save Profile
window.saveProfile = async function () {

  const user = auth.currentUser;

  if (!user) return;

  try {

    await setDoc(doc(db, "users", user.uid), {

      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      pincode: document.getElementById("pincode").value,
      email: user.email

    });

    alert("✅ Profile Saved Successfully");

  } catch (error) {

    alert(error.message);

  }

};

// Logout
window.logout = async function () {

  await signOut(auth);

  alert("Logout Successful");

  window.location.href = "login.html";

};
