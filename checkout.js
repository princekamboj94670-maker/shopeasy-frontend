Import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// LOAD USER PROFILE
// ===============================

auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    try {

        const snap = await getDoc(
            doc(db, "users", user.uid)
        );

        if (snap.exists()) {

            const data = snap.data();

            const nameInput =
                document.getElementById("name");

            const phoneInput =
                document.getElementById("phone");

            const addressInput =
                document.getElementById("address");


            if (nameInput)
                nameInput.value = data.name || "";

            if (phoneInput)
                phoneInput.value = data.phone || "";

            if (addressInput)
                addressInput.value = data.address || "";

        }

    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

    }

});


// ===============================
// CHECKOUT FORM
// ===============================

const checkoutForm =
    document.getElementById("checkoutForm");


if (!checkoutForm) {

    console.error(
        "❌ checkoutForm not found"
    );

} else {


    checkoutForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ===============================
            // GET FORM DATA
            // ===============================

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();

            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();

            const pincode =
                document
                    .getElementById("pincode")
                    .value
                    .trim();

            const payment =
                document
                    .getElementById("payment")
                    .value;


            // ===============================
            // VALIDATION
            // ===============================

            if (
                !name ||
                !phone ||
                !address ||
                !city ||
                !pincode ||
                !payment
            ) {

                alert(
                    "Please fill all details."
                );

                return;
            }


            // ===============================
            // GET CART
            // ===============================

            const cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            // ===============================
            // TOTAL
            // ===============================

            let totalAmount = 0;


            cart.forEach(item => {

                totalAmount +=
                    Number(item.price || 0) *
                    Number(item.quantity || 1);

            });


            // ===============================
            // CREATE ORDER
            // ===============================

            const order = {

                name: name,

                phone: phone,

                address: address,

                city: city,

                pincode: pincode,

                payment: payment,

                cart: cart,

                totalItems: cart.reduce(
                    (total, item) =>
                        total +
                        Number(item.quantity || 1),
                    0
                ),

                totalAmount: totalAmount,

                status: "Pending",

                date:
                    new Date()
                    .toLocaleString()

            };


            // ===============================
            // SAVE TO FIREBASE
            // ===============================

            try {

                const docRef =
                    await addDoc(
                        collection(db, "orders"),
                        order
                    );


                // Save Order ID

                localStorage.setItem(
                    "lastOrderId",
                    docRef.id
                );


                // Clear Cart

                localStorage.removeItem(
                    "cart"
                );


                // Success

                alert(
                    "✅ Order Placed Successfully!\n\n" +
                    "Order ID: " +
                    docRef.id
                );


                // Success Page

                window.location.href =
                    "success.html";


            } catch (error) {

                console.error(
                    "Firebase Order Error:",
                    error
                );


                alert(
                    "❌ Order Failed\n\n" +
                    error.message
                );

            }

        }
    );

}


// ===============================
// DEBUG
// ===============================

console.log(
    "✅ checkout.js loaded successfully"
);
