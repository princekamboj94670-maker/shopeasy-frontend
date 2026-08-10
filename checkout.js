Import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const form = document.getElementById("checkoutForm");


form.addEventListener("submit", async function (e) {

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


    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price || 0) *
            Number(item.quantity || 1);

    });


    try {

        const order = {

            name,
            phone,
            address,
            city,
            pincode,
            payment,
            cart,
            totalItems: cart.length,
            totalAmount: total,
            status: "Pending",
            date: new Date().toLocaleString()

        };


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
