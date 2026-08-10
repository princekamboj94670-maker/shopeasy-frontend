Import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// Profile
auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (snap.exists()) {

            const data = snap.data();

            document.getElementById("name").value =
                data.name || "";

            document.getElementById("phone").value =
                data.phone || "";

            document.getElementById("address").value =
                data.address || "";
        }

    } catch (error) {

        console.error("Profile Error:", error);

    }

});


// Checkout
const form = document.getElementById("checkoutForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const address =
            document.getElementById("address").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const pincode =
            document.getElementById("pincode").value.trim();

        const payment =
            document.getElementById("payment").value;


        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !pincode ||
            !payment
        ) {

            alert("Please fill all details.");
            return;

        }


        const cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (cart.length === 0) {

            alert("Your cart is empty.");
            return;

        }


        let totalAmount = 0;

        cart.forEach(item => {

            totalAmount +=
                Number(item.price || 0) *
                Number(item.quantity || 1);

        });


        const order = {

            name: name,
            phone: phone,
            address: address,
            city: city,
            pincode: pincode,
            payment: payment,
            cart: cart,

            totalItems: cart.reduce(
                (sum, item) =>
                    sum + Number(item.quantity || 1),
                0
            ),

            totalAmount: totalAmount,

            status: "Pending",

            date: new Date().toLocaleString()

        };


        try {

            const docRef =
                await addDoc(
                    collection(db, "orders"),
                    order
                );


            localStorage.setItem(
                "lastOrderId",
                docRef.id
            );

            localStorage.removeItem("cart");


            alert(
                "✅ Order Placed Successfully!\n\n" +
                "Order ID: " +
                docRef.id
            );


            window.location.href =
                "success.html";


        } catch (error) {

            console.error(error);

            alert(
                "❌ Order Error:\n" +
                error.message
            );

        }

    });

}


console.log("✅ Checkout loaded");
alert("CHECKOUT JS LOADED ✅");
