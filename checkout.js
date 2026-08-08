import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth();

async function loadProfile() {

    const user = auth.currentUser;

    if (!user) return;

    try {

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {

            const data = snap.data();

            document.getElementById("name").value = data.name || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("address").value = data.address || "";

        }

    } catch (error) {
        console.log(error);
    }

}

auth.onAuthStateChanged(() => {
    loadProfile();
});

document.getElementById("checkoutForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let city = document.getElementById("city").value.trim();
    let pincode = document.getElementById("pincode").value.trim();
    let payment = document.getElementById("payment").value;

    if (
        name === "" ||
        phone === "" ||
        address === "" ||
        city === "" ||
        pincode === "" ||
        payment === ""
    ) {
        alert("Please fill all details.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let order = {
        name: name,
        phone: phone,
        address: address,
        city: city,
        pincode: pincode,
        payment: payment,
        cart: cart,
        totalItems: cart.length,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    try {

        const docRef = await addDoc(collection(db, "orders"), order);

        localStorage.setItem("lastOrderId", docRef.id);

        localStorage.removeItem("cart");

        alert("✅ Order Placed Successfully!\n\nOrder ID: " + docRef.id);

        window.location.href = "success.html";

    } catch (error) {

        alert("❌ Error: " + error.message);

        console.log(error);

    }

});
