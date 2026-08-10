Import { db } from "./firebase.js";

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

const API_URL =
    "https://shopeasy-backend-2o2i.onrender.com";


// ===============================
// LOAD PROFILE
// ===============================

async function loadProfile() {

    const user = auth.currentUser;

    if (!user) return;

    try {

        const snap =
            await getDoc(
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

        console.log("Profile Error:", error);

    }
}


auth.onAuthStateChanged(() => {
    loadProfile();
});


// ===============================
// CHECKOUT
// ===============================

document
.getElementById("checkoutForm")
.addEventListener("submit", async function (e) {

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


    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    // ===============================
    // CALCULATE TOTAL
    // ===============================

    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price || 0) *
            Number(item.quantity || 1);

    });


    // ===============================
    // CASH ON DELIVERY
    // ===============================

    if (payment === "Cash on Delivery") {

        await placeOrder(
            name,
            phone,
            address,
            city,
            pincode,
            payment,
            cart,
            total
        );

        return;
    }


    // ===============================
    // ONLINE PAYMENT
    // ===============================

    if (payment === "UPI") {

        await startRazorpayPayment(
            name,
            phone,
            address,
            city,
            pincode,
            cart,
            total
        );

    }

});


// ===============================
// RAZORPAY PAYMENT
// ===============================

async function startRazorpayPayment(
    name,
    phone,
    address,
    city,
    pincode,
    cart,
    total
) {

    try {

        // Create Razorpay order through backend

        const response =
            await fetch(
                API_URL +
                "/api/payment/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        amount: total
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                "❌ Unable to start payment."
            );

            return;
        }


        // Razorpay Checkout

        const options = {

            key:
                "rzp_test_REPLACE_WITH_YOUR_KEY_ID",

            amount:
                data.amount,

            currency:
                data.currency,

            name:
                "ShopEasy",

            description:
                "ShopEasy Order",

            order_id:
                data.orderId,


            handler:
                async function (paymentResponse) {

                    await verifyPayment(
                        paymentResponse,
                        name,
                        phone,
                        address,
                        city,
                        pincode,
                        cart,
                        total
                    );

                },


            prefill: {

                name: name,

                contact: phone

            },


            theme: {

                color: "#3399cc"

            }

        };


        const razorpay =
            new Razorpay(options);


        razorpay.on(
            "payment.failed",
            function (response) {

                alert(
                    "❌ Payment Failed\n" +
                    response.error.description
                );

            }
        );


        razorpay.open();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Payment Error: " +
            error.message
        );

    }

}


// ===============================
// VERIFY PAYMENT
// ===============================

async function verifyPayment(
    paymentResponse,
    name,
    phone,
    address,
    city,
    pincode,
    cart,
    total
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/api/payment/verify",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        paymentResponse
                    )
                }
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                "❌ Payment verification failed."
            );

            return;
        }


        // Payment verified
        // Now save order in Firebase

        await placeOrder(
            name,
            phone,
            address,
            city,
            pincode,
            "UPI",
            cart,
            total,
            paymentResponse.razorpay_payment_id
        );


    } catch (error) {

        console.error(error);

        alert(
            "❌ Verification Error: " +
            error.message
        );

    }

}


// ===============================
// SAVE ORDER TO FIREBASE
// ===============================

async function placeOrder(
    name,
    phone,
    address,
    city,
    pincode,
    payment,
    cart,
    total,
    paymentId = ""
) {

    try {

        const order = {

            name: name,

            phone: phone,

            address: address,

            city: city,

            pincode: pincode,

            payment: payment,

            paymentId: paymentId,

            cart: cart,

            totalItems: cart.length,

            totalAmount: total,

            status: "Pending",

            date:
                new Date()
                .toLocaleString()

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


        localStorage.removeItem(
            "cart"
        );


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
            "❌ Order Error: " +
            error.message
        );

    }

}
