Import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const API_URL = "https://shopeasy-backend-2o2i.onrender.com";

// 👇 YAHAN APNI RAZORPAY TEST KEY ID LAGAO
const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID";


// ===============================
// LOAD PROFILE
// ===============================

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


// ===============================
// CHECKOUT
// ===============================

const checkoutForm =
    document.getElementById("checkoutForm");


checkoutForm.addEventListener(
    "submit",
    async function (e) {

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


        // ===============================
        // COD
        // ===============================

        if (payment === "Cash on Delivery") {

            await saveOrder(
                name,
                phone,
                address,
                city,
                pincode,
                payment,
                cart,
                totalAmount
            );

            return;

        }


        // ===============================
        // UPI / RAZORPAY
        // ===============================

        if (payment === "UPI") {

            await startPayment(
                name,
                phone,
                address,
                city,
                pincode,
                cart,
                totalAmount
            );

        }

    }
);


// ===============================
// RAZORPAY
// ===============================

async function startPayment(
    name,
    phone,
    address,
    city,
    pincode,
    cart,
    totalAmount
) {

    try {

        const response = await fetch(
            API_URL + "/api/payment/create-order",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    amount: totalAmount
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                "❌ Unable to create payment order."
            );

            return;

        }


        const options = {

            key: "rzp_test_TO17Wsc6SU5sye";

            amount: data.amount,

            currency: data.currency,

            name: "ShopEasy",

            description: "ShopEasy Order",

            order_id: data.orderId,


            handler: async function (
                paymentResponse
            ) {

                await verifyPayment(
                    paymentResponse,
                    name,
                    phone,
                    address,
                    city,
                    pincode,
                    cart,
                    totalAmount
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
    totalAmount
) {

    try {

        const response = await fetch(
            API_URL + "/api/payment/verify",
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


        if (!response.ok || !result.success) {

            alert(
                "❌ Payment verification failed."
            );

            return;

        }


        await saveOrder(
            name,
            phone,
            address,
            city,
            pincode,
            "UPI",
            cart,
            totalAmount,
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
// SAVE ORDER
// ===============================

async function saveOrder(
    name,
    phone,
    address,
    city,
    pincode,
    payment,
    cart,
    totalAmount,
    paymentId = ""
) {

    try {

        const order = {

            name,
            phone,
            address,
            city,
            pincode,
            payment,
            paymentId,
            cart,

            totalItems: cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.quantity || 1),
                0
            ),

            totalAmount,

            status: "Pending",

            date:
                new Date().toLocaleString()

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

            }
