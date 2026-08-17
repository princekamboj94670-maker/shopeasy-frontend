import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const API_URL =
"https://shopeasy-backend-2o2i.onrender.com";

const RAZORPAY_KEY_ID =
    "rzp_test_TO17Wsc6SU5sye";


// =====================================
// LOAD PROFILE
// =====================================

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


// =====================================
// CHECKOUT
// =====================================

const form =
    document.getElementById("checkoutForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();
        alert("BUTTON WORKING ✅");

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


        // =================================
        // COD
        // =================================

        if (payment === "Cash on Delivery") {

            await placeOrder(
                name,
                phone,
                address,
                city,
                pincode,
                "Cash on Delivery",
                cart,
                totalAmount,
                ""
            );

            return;
        }


        // =================================
        // UPI
        // =================================

        if (payment === "UPI") {

            await startRazorpayPayment(
                name,
                phone,
                address,
                city,
                pincode,
                cart,
                totalAmount
            );

        }

    });

}


// =====================================
// RAZORPAY
// =====================================

async function startRazorpayPayment(
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
            API_URL +
            "/api/payment/create-order",
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


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                "❌ Unable to create payment order."
            );

            console.error(data);
            return;
        }


        const options = {

            key:
                RAZORPAY_KEY_ID,

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

            prefill: {

                name:
                    name,

                contact:
                    phone

            },

            theme: {

                color:
                    "#3399cc"

            },

            handler:
                async function (
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

                }

        };


        const razorpay =
            new Razorpay(options);


        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Payment Failed:",
                    response
                );

                alert(
                    "❌ Payment Failed\n" +
                    (
                        response.error?.description ||
                        "Please try again."
                    )
                );

            }
        );


        razorpay.open();


    } catch (error) {

        console.error(
            "Razorpay Error:",
            error
        );

        alert(
            "❌ Payment Error:\n" +
            error.message
        );

    }

}


// =====================================
// VERIFY PAYMENT
// =====================================

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

                    body:
                        JSON.stringify(
                            paymentResponse
                        )
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            alert(
                "❌ Payment verification failed."
            );

            console.error(result);
            return;
        }


        await placeOrder(
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

        console.error(
            "Verification Error:",
            error
        );

        alert(
            "❌ Verification Error:\n" +
            error.message
        );

    }

}


// =====================================
// SAVE ORDER
// =====================================

async function placeOrder(
    name,
    phone,
    address,
    city,
    pincode,
    payment,
    cart,
    totalAmount,
    paymentId
) {

    try {

        const order = {

            name: name,
            phone: phone,
            address: address,
            city: city,
            pincode: pincode,

            payment:
                payment,

            paymentId:
                paymentId || "",

            cart:
                cart,

            totalItems:
                cart.reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.quantity || 1
                        ),
                    0
                ),

            totalAmount:
                totalAmount,

            status:
                "Pending",

            date:
                new Date()
                    .toLocaleString()

        };


        const docRef =
            await addDoc(
                collection(
                    db,
                    "orders"
                ),
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

        console.error(
            "Firebase Order Error:",
            error
        );

        alert(
            "❌ Order Error:\n" +
            error.message
        );

    }

}
